'use client'

import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'
import type { DefaultSession } from 'next-auth'
import { useActionState, useCallback, useEffect, useMemo, useState } from 'react'
import {
  CardStackIcon,
  CardStackPlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cross2Icon,
  DownloadIcon,
  LinkedInLogoIcon,
  MagnifyingGlassIcon,
  PaperPlaneIcon,
  Pencil1Icon,
  PersonIcon,
  TrashIcon
} from '@radix-ui/react-icons'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { format, formatDistance } from 'date-fns'
import { saveAs } from 'file-saver'
import { AnimatePresence } from 'framer-motion'
import { useAtom } from 'jotai'
import pluralize from 'pluralize'
import { useInView } from 'react-intersection-observer'
import { jsonToCSV } from 'react-papaparse'
import { toast } from 'sonner'
import useSound from 'use-sound'
import { z } from 'zod'

import { cn } from '@a/ui'
import { Button } from '@a/ui/button'
import { Checkbox } from '@a/ui/checkbox'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@a/ui/command'
import { Dialog, DialogClose, DialogTrigger } from '@a/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger
} from '@a/ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@a/ui/form'
import { Input } from '@a/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@a/ui/popover'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@a/ui/resizable'
import { ScrollArea } from '@a/ui/scroll-area'
import { Skeleton } from '@a/ui/skeleton'
import { TableCell, TableHead, TableRow } from '@a/ui/table'

import type { Company, Employee, Source } from '~/types'
import { getCompanies, getEmployees, getHistory } from '~/actions'
import columns from '~/column/company'
import { DialogContent } from '~/components/dialog'
import { DropdownMenuRadioItem as DropdownMenuRadioItemCheck } from '~/components/dropdown-menu'
import FakeProgress from '~/components/fake-progress'
import Hover from '~/components/hover'
import { Input as NiceInput } from '~/components/input'
import Loop from '~/components/loop'
import { Slider as Slider2 } from '~/components/slider'
import { Table, TableBody, TableHeader } from '~/components/table'
import Tutip from '~/components/tutip'
import { useServerAction } from '~/hook/server-action'
import { useForm } from '~/hook/use-form'
import { companiesAtom, employeesAtom, focusAtom, queryAtom, sourceAtom } from '~/store'
import FacetedFilter from '~/table/faceted-filter'
import FacetedFilterArray from '~/table/faceted-filter-array'
import Pagination from '~/table/pagination'
import ViewOptions from '~/table/view-options'
import { api } from '~/trpc/react'
import example from './example'
import Gen from './gen'
import Logo from './logo'
import Profile from './profile'

const descriptions: Record<Source, string> = {
  linkedin: 'A social network for businesses to connect.',
  kompass: 'A global business directory for B2B companies.',
  europages: 'A B2B platform for suppliers and manufacturers.'
}
const rowSingular = 'company'

const filterText: string[] = ['description']
const filterExact: string[] = ['industry', 'country']
const filterArrayContain: string[] = ['searchQueries']

const employeeColName = 'employeeCount'

const step = 100
const threshold: number = step * 10
const clipped: number = threshold + step

const limit = 5

interface MyTableProps {
  user: { id: string } & DefaultSession['user']
}

export default function MyTable({ user }: MyTableProps) {
  function Search() {
    const searchForm = useForm({
      schema: z.object({
        query: z.string().min(4, { message: 'Query must be at least 4 characters.' }),
        source: z.enum(['linkedin', 'kompass', 'europages']),
        user: z.string()
      }),
      defaultValues: { query: '', source, user: user.email }
    })
    return (
      <>
        {!searchForm.getValues().query && (
          <Loop
            texts={examples}
            className='notranslate pointer-events-none absolute left-8 top-2 w-[calc(100%-2rem)] truncate pr-px text-sm text-muted-foreground'
          />
        )}
        <Form {...searchForm}>
          <form
            id='search'
            onSubmit={searchForm.handleSubmit(data => {
              searchAction(data)
              setQuery(data.query)
              toast.loading('Fetching companies with query: ' + data.query)
            })}>
            <FormField
              control={searchForm.control}
              name='query'
              render={({ field }) => (
                <FormItem
                  className={cn(
                    'notranslate transition-all duration-300',
                    !searchPending && searchForm.getValues().query && 'mr-10'
                  )}>
                  <FormControl>
                    <NiceInput
                      id='search-input'
                      className='h-8 pl-8 pr-px focus-visible:ring-orange-300 dark:focus-visible:ring-orange-600'
                      {...field}
                      disabled={searchPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Button
          disabled={searchPending}
          type='submit'
          form='search'
          variant='outline'
          size='icon'
          className={cn(
            'group absolute right-0 top-0 z-10 size-[2.12rem] overflow-hidden transition-all duration-300 hover:scale-110',
            (!searchForm.getValues().query || searchPending) && '-right-7 scale-0'
          )}>
          <span className='absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,#fedcba_50%,#ffffff_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#654321_50%,#000000_100%)]' />
          <PaperPlaneIcon className='mb-1 ml-2 mr-1 size-5 -rotate-45 opacity-80 transition-all duration-300 group-hover:scale-110' />
        </Button>
      </>
    )
  }
  const apiUtils = api.useUtils()
  const createHistory = api.history.create.useMutation({
    onSuccess: async () => await apiUtils.history.invalidate()
  })
  const deleteHistory = api.history.delete.useMutation({
    onSuccess: async () => {
      await apiUtils.history.invalidate()
      document.getElementById('close-delete')?.click()
      setSelection([])
      setSelectMode(false)
    }
  })

  const [data, setData] = useAtom(companiesAtom)
  const [employees, setEmployees] = useAtom(employeesAtom)
  const [focus, setFocus] = useAtom(focusAtom)
  const [query, setQuery] = useAtom(queryAtom)
  const [source, setSource] = useAtom(sourceAtom)

  const examples = example.map(e => e.query)
  examples.unshift('Enter keywords ...')

  const [play] = useSound('ding.mp3')

  const [runGetEmployees, employeesPending] = useServerAction(getEmployees)
  const [runGetHistory, historyPending] = useServerAction(getHistory)

  const [{ id: historyId, data: newData }, searchAction, searchPending] = useActionState(
    getCompanies as (
      state: {
        id: string
        data: Company[]
      },
      payload: unknown
    ) => Promise<{
      id: string
      data: Company[]
    }>,
    { id: '', data: [] }
  )

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    searchQueries: false
  })
  const [pagination, setPagination] = useState({ pageSize: 20, pageIndex: 0 })
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    meta: query,
    state: { columnFilters, columnVisibility, pagination, rowSelection, sorting },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: data.length ? getSortedRowModel() : undefined,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })
  const isFiltered: boolean = table.getState().columnFilters.length > 0

  const getUniqueFromColumn = (column: string) =>
    Array.from((table.getColumn(column)?.getFacetedUniqueValues() as Map<string, number>).entries())
      .sort((a, b) => b[1] - a[1])
      .map(([key, _]) => key)
      .flat()
      .filter((v, i, a) => a.indexOf(v) === i)
      .filter(Boolean)

  const employeeCol = table.getColumn(employeeColName)

  const [realMax, setRealMax] = useState<number>(0)
  const [[currentMin, currentMax], setMinMax] = useState<[number, number]>([0, 0])

  function handleSlide([newMin, newMax]: [number, number]) {
    newMax = newMax === clipped ? realMax : newMax
    employeeCol?.setFilterValue([newMin, newMax])
    if (newMin === 0 && newMax === realMax) {
      employeeCol?.setFilterValue(undefined)
    }
    setMinMax([newMin, newMax])
  }

  const [exampleOpen, setExampleOpen] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)

  const [selectMode, setSelectMode] = useState(false)
  const [selection, setSelection] = useState<string[]>([])

  const [hover, setHover] = useState<number | null>(null)

  const updateFilter = useCallback(
    (data: Company[]) => {
      setColumnVisibility({
        ...columnVisibility,
        industry: !!data[0]?.industry,
        employeeCount: data.every((c: Company) => c.employeeCount)
      })
      const realMax = Math.max(...data.map((c: Company) => c.employeeCount ?? 0))
      setRealMax(realMax)
      setMinMax([0, realMax < clipped ? realMax : clipped])
    },
    [columnVisibility]
  )

  const { ref, inView } = useInView()
  const {
    data: historyPages,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = api.history.infinite.useInfiniteQuery(
    { user: user.id, limit },
    { getNextPageParam: p => p.next }
  )

  const history = useMemo(() => historyPages?.pages.map(p => p.items).flat(), [historyPages])

  useEffect(() => {
    if (inView) {
      void fetchNextPage()
    }
  }, [inView, fetchNextPage])

  useEffect(
    () =>
      setData(data =>
        data.map(c => ({
          ...c,
          unlocked: Object.keys(employees).includes(c.id) ? true : undefined
        }))
      ),
    [employees]
  )

  useEffect(() => {
    if (newData.length > 0) {
      createHistory.mutate({ id: historyId, user: user.id, query, source })
      setData(newData)
      updateFilter(newData)
      play()
      toast.success('Fetch successfully', {
        description: `Found ${newData.length} ${pluralize(rowSingular, newData.length)}`
      })
      toast.dismiss()
    } else {
      updateFilter(data)
    }
  }, [newData, play])

  return (
    <ResizablePanelGroup direction='horizontal'>
      <ResizablePanel
        defaultSize={14}
        minSize={5}
        maxSize={14}
        className='relative flex h-screen select-none flex-col'>
        <DropdownMenu>
          <DropdownMenuTrigger className='notranslate mx-auto mb-0.5 mt-1 flex items-center gap-2 rounded-full px-4 py-1.5 capitalize transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted hover:drop-shadow-md focus:outline-none'>
            <Logo source={source} size={20} />
            {source}
            <ChevronDownIcon className='-ml-0.5 mb-px size-4' />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='notranslate m-1.5 rounded-2xl transition-all duration-300 hover:drop-shadow-xl'>
            <DropdownMenuRadioGroup
              value={source}
              onValueChange={value => setSource(value as Source)}>
              {Object.keys(descriptions).map((source, i) => (
                <DropdownMenuRadioItemCheck
                  value={source}
                  key={source}
                  className='w-96 gap-2 pr-5'
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}>
                  <AnimatePresence>
                    {hover === i && (
                      <Hover className='absolute -z-10 size-full rounded-2xl bg-muted' />
                    )}
                  </AnimatePresence>
                  <div
                    className={cn(
                      'flex items-center gap-6 py-3 pl-6',
                      source === source ? 'pr-6' : 'pr-12'
                    )}>
                    <Logo source={source as Source} size={32} />
                    <div className='flex flex-col gap-0.5'>
                      <p className='text-xl font-medium capitalize tracking-tight'>{source}</p>
                      <p className='text-pretty leading-5 text-muted-foreground'>
                        {descriptions[source as Source]}
                      </p>
                    </div>
                  </div>
                </DropdownMenuRadioItemCheck>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {searchPending && <FakeProgress estimate={100} />}
        <div className='group relative mx-1.5 transition-all duration-300 hover:drop-shadow-lg'>
          <p
            className={cn(
              'absolute z-10 m-[5px] size-0 animate-spin rounded-full border-foreground border-t-transparent transition-all duration-500',
              searchPending && 'size-6 border-2'
            )}
          />
          <MagnifyingGlassIcon
            className={cn(
              'absolute m-[5px] size-6 text-muted-foreground transition-all duration-500 group-hover:scale-125 group-hover:text-foreground',
              searchPending && 'm-0 size-0'
            )}
          />
          <Search />
          <Gen />
        </div>
        <div className={data.length ? 'flex flex-col px-px' : 'hidden'}>
          <div
            className={cn(
              'notranslate relative flex items-center transition-all duration-700 *:transition-all *:duration-300',
              !filterOpen && 'mb-1 mt-2 hover:-translate-y-0.5 hover:drop-shadow-md'
            )}>
            <Button
              variant={filterOpen ? 'ghost' : 'outline'}
              className={cn(
                'group mx-1.5 h-8 grow p-0 hover:opacity-100',
                !filterOpen && 'opacity-70'
              )}
              onClick={() => {
                setFilterOpen(!filterOpen)
                setExampleOpen(false)
              }}>
              <p className='transition-all duration-300 group-hover:text-base'>Filter</p>
            </Button>
            <Button
              size='sm'
              className={cn(
                'mr-1.5 h-6 w-16 border-red-400 pl-2 pr-1 text-red-500 drop-shadow-md hover:bg-red-400 hover:text-background',
                !isFiltered && 'm-0 size-0 border-none p-0 text-[0]'
              )}
              variant='outline'
              onClick={() => {
                table.resetColumnFilters()
                setMinMax([0, realMax < clipped ? realMax : clipped])
              }}>
              Reset
              <Cross2Icon className='ml-1 size-3' />
            </Button>
          </div>
          <div
            className={cn(
              'mx-1 flex flex-wrap gap-1.5 transition-all duration-500 [&>*]:transition-all [&>*]:duration-500',
              !filterOpen &&
                'gap-0 *:border-none *:*:bg-background [&>*]:m-0 [&>*]:h-0 [&>*]:p-0 [&>*]:text-[0]'
            )}>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline' className='w-full justify-start px-3 font-normal'>
                  {focus ? <p className='notranslate truncate'>{focus.name}</p> : 'Company'}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='p-0 transition-all duration-300 hover:drop-shadow-xl'
                side='right'>
                <Command>
                  <CommandInput placeholder='company name' className='placeholder:capitalize' />
                  <CommandEmpty>No companies found.</CommandEmpty>
                  <CommandList className='m-1'>
                    {[...data]
                      .sort((a, b) => (a.name > b.name ? 1 : -1))
                      .map((company, i) => (
                        <CommandItem
                          key={i}
                          className='notranslate'
                          onSelect={() => {
                            setFocus(company)
                            table.getColumn('name')?.setFilterValue(company.name)
                            setColumnVisibility({ ...columnVisibility, description: false })
                          }}>
                          {company.name}
                        </CommandItem>
                      ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {filterExact.map((c, i) => (
              <FacetedFilter
                key={i}
                column={table.getColumn(c)}
                title={c}
                options={getUniqueFromColumn(c)}
              />
            ))}
            {realMax ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='w-full justify-start gap-1.5 px-3 font-normal'>
                    Employee Range
                    {currentMin < step &&
                    (currentMax === realMax || currentMax > threshold) ? null : (
                      <p className='rounded-full bg-muted px-1.5 font-medium'>
                        {(currentMin < step
                          ? 'Under ' + step
                          : currentMin <= threshold && currentMin) +
                          ' to ' +
                          (currentMax > threshold
                            ? threshold + '+'
                            : currentMax >= step && currentMax)}
                      </p>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='p-0 transition-all duration-300 hover:drop-shadow-xl'
                  side='right'>
                  <div className='mx-3 mt-2 flex justify-between px-px'>
                    <p>
                      {currentMin < step ? 'Under ' + step : currentMin <= threshold && currentMin}
                    </p>
                    <p>
                      {currentMax > threshold ? threshold + '+' : currentMax >= step && currentMax}
                    </p>
                  </div>
                  <Slider2
                    className='mx-auto my-3 w-11/12'
                    min={0}
                    max={realMax < clipped ? realMax : clipped}
                    step={step}
                    value={[currentMin, currentMax]}
                    onValueChange={handleSlide}
                    minStepsBetweenThumbs={0}
                  />
                  <div
                    className={cn(
                      'm-1 transition-all duration-300',
                      currentMin < step &&
                        (currentMax === realMax || currentMax > threshold) &&
                        '-my-3.5 scale-0 opacity-0'
                    )}>
                    <Button
                      variant='ghost'
                      onClick={() => {
                        setMinMax([0, realMax < clipped ? realMax : clipped])
                        employeeCol?.setFilterValue(undefined)
                      }}
                      className='h-9 w-full text-sm font-normal'>
                      Clear range
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : null}
            {filterArrayContain.map((c, i) => (
              <FacetedFilterArray
                key={i}
                column={table.getColumn(c)}
                title={c}
                options={getUniqueFromColumn(c)}
              />
            ))}
            {filterText.map((c, i) => (
              <Input
                key={i}
                className='placeholder:capitalize'
                placeholder={c}
                value={table.getColumn(c)?.getFilterValue() as string}
                onChange={event => table.getColumn(c)?.setFilterValue(event.target.value)}
              />
            ))}
            <ViewOptions table={table} className='hidden' />
          </div>
        </div>
        {history && (
          <>
            <div className='mx-1.5 mb-1 flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                <Checkbox
                  checked={selection.length === history.length}
                  onCheckedChange={checked =>
                    checked ? setSelection(history.map(q => q.id)) : setSelection([])
                  }
                  className={cn('opacity-0', selectMode ? 'opacity-100' : 'cursor-default')}
                />
                {selection.length > 0 && (
                  <p className='ml-px size-5 rounded bg-muted px-0.5 text-center text-sm'>
                    {selection.length}
                  </p>
                )}
              </div>
              <p>History</p>
              <div className='flex items-center gap-1'>
                <Dialog>
                  <Tutip content='Delete' side='top'>
                    <DialogTrigger asChild>
                      <Button
                        variant='outline'
                        size='icon'
                        className={
                          selection.length
                            ? 'size-5 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-800 dark:hover:text-red-100'
                            : 'hidden'
                        }>
                        <TrashIcon className='size-4' />
                      </Button>
                    </DialogTrigger>
                  </Tutip>
                  <DialogContent className='w-fit p-4'>
                    {'Are you sure you want to delete ' +
                      selection.length +
                      ' ' +
                      pluralize('query', selection.length) +
                      '?'}
                    <div className='flex justify-end gap-3'>
                      <DialogClose asChild>
                        <Button variant='secondary' id='close-delete'>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button variant='destructive' onClick={() => deleteHistory.mutate(selection)}>
                        <p
                          className={
                            deleteHistory.isPending
                              ? 'mr-1 size-4 animate-spin rounded-full border border-foreground border-t-transparent transition-all duration-500'
                              : 'size-0'
                          }
                        />
                        Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Tutip content='Select' side='top'>
                  <Button
                    variant={selectMode ? 'default' : 'outline'}
                    size='icon'
                    className='size-5 shadow-none transition-all duration-500'
                    onClick={() => {
                      setSelection([])
                      setSelectMode(!selectMode)
                    }}>
                    <Pencil1Icon className='size-4' />
                  </Button>
                </Tutip>
              </div>
            </div>
            <ScrollArea className='grow'>
              {history.map((query, i) => (
                <Button
                  key={i}
                  variant='ghost'
                  className='group relative -my-0.5 w-full font-normal'
                  onClick={async () => {
                    if (selectMode) {
                      setSelection(
                        selection.includes(query.id)
                          ? selection.filter(s => s !== query.id)
                          : [...selection, query.id]
                      )
                    } else {
                      const data = (await runGetHistory(user.id, query.id)) as Company[]
                      setData(data)
                      updateFilter(data)
                      setQuery(query.query)
                      play()
                      toast.success(
                        <p>
                          Fetch {data.length} {pluralize(rowSingular, data.length)} from{' '}
                          <span className='notranslate font-semibold'>{query.query}</span>
                        </p>
                      )
                      toast.dismiss()
                    }
                  }}>
                  <div className='notranslate absolute left-1.5 flex items-center gap-1.5'>
                    {selectMode ? (
                      <Checkbox checked={selection.includes(query.id)} />
                    ) : (
                      <Logo source={query.source as Source} size={16} />
                    )}
                    {query.query}
                  </div>
                  <div className={selectMode ? 'hidden' : 'absolute right-0 flex'}>
                    <p className='w-8 bg-gradient-to-l from-background group-hover:from-accent' />
                    <div className='bg-background pl-1 pr-2.5 group-hover:bg-accent'>
                      <div className='opacity-35'>
                        <p className='group-hover:hidden'>{format(query.date, 'd/L')}</p>
                        <p className='hidden group-hover:block'>
                          {formatDistance(query.date, new Date(), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
              {isFetchingNextPage ? (
                <p className='mx-auto size-5 animate-spin rounded-full border-2 border-foreground border-t-transparent' />
              ) : hasNextPage ? (
                <p className='h-5' ref={ref} />
              ) : null}
            </ScrollArea>
          </>
        )}
        {!selectMode && (
          <div className='flex flex-col'>
            <Button
              variant='ghost'
              className='mx-auto flex h-6 items-center gap-1 rounded-full px-3'
              onClick={() => {
                setExampleOpen(!exampleOpen)
                setFilterOpen(false)
              }}>
              Example
              <ChevronUpIcon
                className={cn('transition-all duration-500', exampleOpen && 'rotate-180')}
              />
            </Button>
            {example.map((ex, i) => (
              <Button
                key={i}
                variant='ghost'
                className={cn(
                  'notranslate relative -my-0.5 w-full justify-start gap-1 px-1.5 font-normal transition-all duration-500',
                  !exampleOpen && 'm-0 h-0 p-0 text-[0]'
                )}
                onClick={() => {
                  setData(ex.data)
                  updateFilter(ex.data)
                  setQuery(ex.query)
                  play()
                  toast.success(
                    <p>
                      Fetch {data.length} {pluralize(rowSingular, data.length)} from{' '}
                      <span className='notranslate font-semibold'>{ex.query}</span>
                    </p>
                  )
                  toast.dismiss()
                }}>
                <Logo
                  className={cn('transition-all duration-500', exampleOpen ? 'size-4' : 'size-0')}
                  source={ex.source}
                  size={16}
                />
                {ex.query}
              </Button>
            ))}
          </div>
        )}
      </ResizablePanel>

      <ResizableHandle className='mt-[62px] opacity-60' />

      <ResizablePanel minSize={5} defaultSize={50} className='flex h-screen flex-col justify-start'>
        {historyPending || searchPending ? (
          <div className='mx-1.5 mt-9 space-y-2.5 overflow-hidden'>
            {[...Array<number>(pagination.pageSize)].map((_, i) => (
              <Skeleton key={i} className='p-6' />
            ))}
          </div>
        ) : data.length ? (
          <>
            <div className='flex justify-evenly pt-0.5 *:h-7 *:rounded-full *:text-sm *:font-normal'>
              <Button
                className='group'
                variant='ghost'
                size='sm'
                disabled={!table.getIsSomeRowsSelected()}>
                <CardStackIcon className='mr-1 block group-hover:hidden' />
                <CardStackPlusIcon className='mr-1 hidden group-hover:block' />
                Add to Collections
              </Button>
              <Button
                onClick={async () => {
                  const ids = table
                    .getFilteredSelectedRowModel()
                    .rows.map(c => (c.original as Company).id)

                  const employeeData = await runGetEmployees(
                    user.email ?? '',
                    encodeURIComponent(ids.join(','))
                  )
                  if (employeeData) {
                    setEmployees({ ...employees, ...employeeData } as Record<string, Employee[]>)
                    toast.success(
                      `Employees at ${Object.keys(employeeData).length} companies unlocked successfully`
                    )
                  }
                  toast.dismiss()
                }}
                disabled={
                  !table.getIsSomeRowsSelected() ||
                  table
                    .getFilteredSelectedRowModel()
                    .rows.some(c => (c.original as Company).unlocked)
                }
                className='*:transition-all *:duration-500'
                variant='ghost'
                size='sm'>
                <PersonIcon className={employeesPending ? 'size-0' : 'mr-1 size-4'} />
                <p
                  className={
                    employeesPending
                      ? 'mr-1 size-4 animate-spin rounded-full border border-foreground border-t-transparent'
                      : 'size-0'
                  }
                />
                Unlock Employees
              </Button>
              <Button
                className='group'
                variant='ghost'
                size='sm'
                disabled={!table.getIsSomeRowsSelected()}>
                <LinkedInLogoIcon className='mr-1 transition-all duration-300 group-hover:text-[#0077BB]' />
                Prospect on LinkedIn
              </Button>
              <Button
                onClick={() =>
                  saveAs(new Blob([jsonToCSV(data)]), query.replaceAll(' ', '-') + '.csv')
                }
                variant='ghost'
                size='sm'>
                <DownloadIcon className='mr-1' />
                Export CSV
              </Button>
            </div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead
                        className='h-0 select-none p-0'
                        key={header.id}
                        colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map(row => (
                    <Tutip
                      key={row.id}
                      content={(row.original as Company).unlocked ? 'employee unlocked' : undefined}
                      side='left'>
                      <TableRow
                        className={cn(
                          'group cursor-pointer transition-all duration-300 hover:bg-background hover:shadow-2xl hover:shadow-y-1.5 dark:hover:shadow-stone-500',
                          (row.original as Company).id === focus?.id &&
                            'bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600'
                        )}
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map(cell => (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              'px-0 py-1 transition-all duration-300',
                              cell.column.id === 'name' && 'notranslate',
                              cell.column.id !== 'select' && 'group-hover:-translate-x-1'
                            )}
                            onClick={() => {
                              if (cell.column.id === 'select') {
                                return
                              }
                              const { id } = row.original as Company
                              const open = !!(focus && focus.id === id)
                              setFocus(
                                open
                                  ? null
                                  : data.find((c: Company) => c.id === id) ?? ({} as Company)
                              )
                              setColumnVisibility({ ...columnVisibility, description: open })
                            }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    </Tutip>
                  ))
                ) : (
                  <TableCell
                    colSpan={columns.length}
                    className='h-[calc(100vh-4.1rem)] text-center'>
                    No results.
                  </TableCell>
                )}
              </TableBody>
            </Table>
          </>
        ) : null}
        <Pagination table={table} rowSingular={rowSingular} />
      </ResizablePanel>
      <ResizableHandle className='mt-[62px] opacity-60' />
      <ResizablePanel
        minSize={25}
        defaultSize={30}
        maxSize={45}
        className={focus ? 'flex h-screen flex-col' : 'hidden'}>
        <div className='absolute right-0 z-10'>
          <Button
            className='group m-1 size-8 p-0 transition-all duration-200 hover:scale-110'
            variant='outline'
            onClick={() => {
              setFocus(null)
              setColumnVisibility({ ...columnVisibility, description: true })
            }}>
            <Cross2Icon className='size-4 transition-all duration-200 group-hover:scale-125' />
          </Button>
        </div>
        <Profile company={focus ?? ({} as Company)} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
