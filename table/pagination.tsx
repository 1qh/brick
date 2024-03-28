import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons'
import pluralize from 'pluralize'
import { cn } from 'utils'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { DataTablePaginationProps } from '@/table/interfaces'

export function DataTablePagination<TData>({
  table,
  rowString,
  className
}: DataTablePaginationProps<TData>) {
  return (
    <div className={cn('flex items-center justify-between px-2 pt-2', className)}>
      <div className='flex items-center space-x-1'>
        <p className='text-sm font-medium opacity-60'>
          {rowString.charAt(0).toUpperCase() + pluralize(rowString).slice(1)} / page
        </p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={value => {
            table.setPageSize(Number(value))
          }}>
          <SelectTrigger className='h-8 w-fit'>
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side='top'>
            {[10, 20, 30, 40, 50].map(pageSize => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
          <div className='text-sm text-muted-foreground'>
            {table.getFilteredSelectedRowModel().rows.length}{' '}
            {pluralize(rowString, table.getFilteredSelectedRowModel().rows.length)} selected.
          </div>
        )}
      </div>
      {table.getFilteredRowModel().rows.length} {pluralize(rowString)}
      <div className='flex items-center space-x-2'>
        <p className='text-sm font-medium opacity-60'>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <Button
          variant='outline'
          className='group hidden size-8 p-0 transition-all duration-200 hover:scale-110 hover:drop-shadow-lg lg:flex'
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}>
          <span className='sr-only'>Go to first page</span>
          <DoubleArrowLeftIcon className='size-4 transition-all duration-200 group-hover:scale-125' />
        </Button>
        <Button
          variant='outline'
          className='group size-8 p-0 transition-all duration-200 hover:scale-110 hover:drop-shadow-lg'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          <span className='sr-only'>Go to previous page</span>
          <ChevronLeftIcon className='size-4 transition-all duration-200 group-hover:scale-125' />
        </Button>
        <Button
          variant='outline'
          className='group size-8 p-0 transition-all duration-200 hover:scale-110 hover:drop-shadow-lg'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          <span className='sr-only'>Go to next page</span>
          <ChevronRightIcon className='size-4 transition-all duration-200 group-hover:scale-125' />
        </Button>
        <Button
          variant='outline'
          className='group hidden size-8 p-0 transition-all duration-200 hover:scale-110 hover:drop-shadow-lg lg:flex'
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}>
          <span className='sr-only'>Go to last page</span>
          <DoubleArrowRightIcon className='size-4 transition-all duration-200 group-hover:scale-125' />
        </Button>
      </div>
    </div>
  )
}
