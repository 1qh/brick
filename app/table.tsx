'use client'

import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { Cross2Icon } from '@radix-ui/react-icons'
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import pluralize from 'pluralize'
import { toast } from 'sonner'
import { Company } from 'types'
import useSound from 'use-sound'
import { capitalize, cn } from 'utils'

import { getCompanies } from '@/app/actions'
import { Slider as Slider2 } from '@/components/slider'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { DataTableFacetedFilter } from '@/table/faceted-filter'
import { DataTableFacetedFilterContainArray } from '@/table/faceted-filter-array'
import { DataTablePagination } from '@/table/pagination'
import { DataTableViewOptions } from '@/table/view-options'

import { columns } from './columns'
import { Profile } from './profile'
import { Search } from './search'

export default function MyTable() {
  function getUniqueFromColumn(column: string) {
    return Array.from(table.getColumn(column)?.getFacetedUniqueValues()?.entries() || [])
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => key)
      .flat()
      .filter((v, i, a) => a.indexOf(v) === i)
      .filter(Boolean)
  }

  const [data, setData] = useState<Company[]>([])
  const [newData, formAction] = useFormState(getCompanies, [])

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    url: false
  })
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageSize: 10, pageIndex: 1 })
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })
  const isFiltered = table.getState().columnFilters.length > 0

  const [company, setCompany] = useState<Company | null>(null)

  const [play] = useSound('ding.mp3')
  const rowString: string = 'company'

  const filterText: string[] = ['description']
  const filterExact: string[] = ['industry', 'country']
  const filterArrayContain: string[] = ['searchQueries']

  const employeeCol = 'employeeCount'
  const employee = table.getColumn(employeeCol)
  const realMax = Math.max(...getUniqueFromColumn(employeeCol))
  const [min, max] = [0, 1100]
  const [minMax, setMinMax] = useState([min, max])

  const handleSlide = ([newMin, newMax]: number[]) => {
    if (newMax === max) {
      newMax = realMax
    }
    employee?.setFilterValue([newMin, newMax])
    if (newMin === min && newMax === realMax) {
      employee?.setFilterValue(undefined)
    }
    setMinMax([newMin, newMax])
  }
  let [currentMin, currentMax] = minMax

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const _data = localStorage.getItem(rowString)
      if (_data) {
        setData(JSON.parse(_data))
      }
    }
    const newTotal = newData.length
    if (newTotal > 0) {
      play()
      localStorage.setItem(rowString, JSON.stringify(newData))
      toast.success('Fetch successfully', {
        description: `Found ${newTotal} ${pluralize(rowString, newTotal)}`
      })
      toast.dismiss()
      setData(newData)
    }
  }, [play, newData])

  if (!data.length) {
    return (
      <div className='flex h-screen'>
        <Search action={formAction} className='m-auto' />
      </div>
    )
  }
  return (
    <ResizablePanelGroup direction='horizontal'>
      <ResizablePanel defaultSize={15} minSize={5} maxSize={15} className='flex flex-col gap-2 p-2'>
        <Search action={formAction} />
        <div className='relative mt-6 inline-flex'>
          <hr className='mx-auto my-3 w-11/12' />
          <Button
            size='sm'
            className={cn(
              'absolute left-1/2 h-6 -translate-x-1/2 pl-2 pr-1 text-sm font-normal transition-all duration-300',
              isFiltered ? 'scale-100' : 'scale-0 opacity-0'
            )}
            variant='outline'
            onClick={() => {
              table.resetColumnFilters()
              setMinMax([min, max])
            }}>
            Reset
            <Cross2Icon className='ml-1 mt-px size-3' />
          </Button>
          <p
            className={cn(
              'absolute left-1/2 -translate-x-1/2 bg-white px-2 transition-all duration-300 dark:bg-stone-950',
              isFiltered ? 'scale-0 opacity-0' : 'scale-100'
            )}>
            Filter
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='justify-start px-3 font-normal'>
              {company ? <p className='notranslate truncate'>{company.name}</p> : <p>Company</p>}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='p-0 transition-all duration-300 hover:drop-shadow-xl'
            align='start'>
            <Command>
              <CommandInput placeholder='Company name' />
              <CommandEmpty>No companies found.</CommandEmpty>
              <CommandList className='m-1'>
                {data
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((company, i) => (
                    <CommandItem
                      key={i}
                      className='notranslate'
                      onSelect={() => {
                        setCompany(company)
                        table.getColumn('name')?.setFilterValue(company.name)
                        setColumnVisibility({
                          ...columnVisibility,
                          description: false
                        })
                      }}>
                      {company.name}
                    </CommandItem>
                  ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {filterExact.map((c, i) => (
          <DataTableFacetedFilter
            key={i}
            column={table.getColumn(c)}
            title={capitalize(c)}
            options={getUniqueFromColumn(c)}
          />
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='justify-start px-3 font-normal'>
              Employee Range
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='p-0 transition-all duration-300 hover:drop-shadow-xl'
            align='start'>
            <div className='mx-3 mt-2 flex justify-between px-px'>
              <p>{currentMin < 100 ? 'Under 100' : currentMin}</p>
              <p>{currentMax > 1000 ? '1000+' : currentMax}</p>
            </div>
            <div className='m-3'>
              <Slider2
                min={min}
                max={max}
                step={100}
                value={minMax}
                onValueChange={handleSlide}
                minStepsBetweenThumbs={0}
              />
            </div>
            <div
              className={cn(
                'm-1 transition-all duration-300',
                isFiltered ? '' : '-my-4 scale-0 opacity-0'
              )}>
              <Button
                variant='ghost'
                onClick={() => {
                  setMinMax([min, max])
                  employee?.setFilterValue(undefined)
                }}
                className='h-9 w-full text-sm font-normal'>
                Clear range
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        {filterArrayContain.map((c, i) => (
          <DataTableFacetedFilterContainArray
            key={i}
            column={table.getColumn(c)}
            title={capitalize(c)}
            options={getUniqueFromColumn(c)}
          />
        ))}
        {filterText.map((c, i) => (
          <Input
            key={i}
            placeholder={'✍️   ' + capitalize(c) + ' . . .'}
            value={table.getColumn(c)?.getFilterValue() as string}
            onChange={event => table.getColumn(c)?.setFilterValue(event.target.value)}
          />
        ))}
        <p className='ml-auto mt-auto opacity-0'>
          <DataTableViewOptions table={table} />
        </p>
      </ResizablePanel>
      <ResizableHandle className='opacity-0' />
      <ResizablePanel minSize={5} defaultSize={50} className='relative flex h-screen'>
        <DataTablePagination
          table={table}
          rowString={rowString}
          className='absolute z-10 w-full backdrop-blur'
        />
        <Table className='mt-9'>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => {
                    const id = row.getValue('id')
                    const open: boolean = company && company.id === id ? true : false
                    setCompany(open ? null : (data.find((c: Company) => c.id === id) as Company))
                    setColumnVisibility({
                      ...columnVisibility,
                      description: open
                    })
                  }}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.id === 'name' ? 'notranslate' : ''}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ResizablePanel>
      <ResizableHandle />
      {company && (
        <ResizablePanel
          minSize={25}
          defaultSize={30}
          maxSize={45}
          className='flex h-screen flex-col'>
          <div className='absolute right-0 z-10'>
            <Button
              className='group m-2 size-8 p-0 transition-all duration-200 hover:scale-110'
              variant='outline'
              onClick={() => {
                setCompany(null)
                setColumnVisibility({ ...columnVisibility, description: true })
              }}>
              <Cross2Icon className='size-4 transition-all duration-200 group-hover:scale-125' />
            </Button>
          </div>
          <ScrollArea>
            <Profile company={company} />
          </ScrollArea>
        </ResizablePanel>
      )}
    </ResizablePanelGroup>
  )
}
