'use client'

import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import Link from 'next/link'

import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DataTableColumnHeader } from '@/table/col-header'

export const columns: ColumnDef<unknown, any>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='mx-2 my-3 transition-all duration-300 hover:scale-110'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='mx-2 transition-all duration-300 hover:scale-110'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'ava',
    header: () => <></>,
    cell: ({ row }) => (
      <div className='size-9'>
        <Image className='rounded-full' src={row.getValue('ava')} alt='' width={200} height={200} />
      </div>
    ),
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Company' />,
    cell: ({ row }) => (
      <Link
        className='font-medium underline duration-300 hover:text-blue-700 dark:hover:text-blue-300'
        target='_blank'
        href={row.getValue('url')}>
        {row.getValue('name')}
      </Link>
    ),
    enableHiding: false
  },
  {
    accessorKey: 'industry',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Industry' />,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'country',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Country' />,
    cell: ({ row }) => <p className='text-center'>{row.getValue('country')}</p>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'employeeCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Employee' />,
    cell: ({ row }) => <p className='text-center'>{row.getValue('employeeCount')}</p>
  },
  {
    accessorKey: 'searchQueries',
    header: 'Search',
    cell: ({ row }) => (
      <ScrollArea className='h-24 min-w-64'>
        {(row.getValue('searchQueries') as string[]).map((query: string, index: number) => (
          <li className='list-decimal' key={index}>
            {query}
          </li>
        ))}
      </ScrollArea>
    ),
    filterFn: (row, id, value) =>
      (row.getValue(id) as string[]).some((query: string) => value.includes(query))
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <ScrollArea className='h-24 max-w-sm'>{row.getValue('description')}</ScrollArea>
    )
  },
  {
    accessorKey: 'id',
    enableHiding: false
  },
  {
    accessorKey: 'url',
    enableHiding: false
  }
]
