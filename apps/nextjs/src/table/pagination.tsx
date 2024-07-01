import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons'
import pluralize from 'pluralize'

import { Button } from '@a/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@a/ui/select'

import type { TablePaginationProps } from '~/table/interfaces'

const TablePagination = <TData,>({ table, rowSingular }: TablePaginationProps<TData>) => (
  <div
    className={
      table.getFilteredRowModel().rows.length
        ? 'flex select-none items-center justify-between px-1.5 pb-1.5 pt-1'
        : 'hidden'
    }>
    <div className='flex items-center space-x-1'>
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={value => table.setPageSize(Number(value))}>
        <SelectTrigger className='notranslate h-7 w-fit py-0 pl-1 pr-0'>
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
      <p className='text-sm opacity-60'>{pluralize(rowSingular) + '/page'}</p>
    </div>
    <div className={table.getIsSomeRowsSelected() || table.getIsAllRowsSelected() ? '' : 'hidden'}>
      <span className='notranslate'>
        {table.getFilteredSelectedRowModel().rows.length +
          '/' +
          table.getFilteredRowModel().rows.length +
          ' '}
      </span>
      {pluralize(rowSingular, table.getFilteredSelectedRowModel().rows.length) + ' selected'}
    </div>
    <p className={table.getIsSomeRowsSelected() || table.getIsAllRowsSelected() ? 'hidden' : ''}>
      {table.getFilteredRowModel().rows.length + ' ' + pluralize(rowSingular)}
    </p>
    <div className='flex items-center space-x-1.5 *:transition-all *:duration-300'>
      <p className='text-sm opacity-60'>
        Page
        <span className='notranslate'>
          {' ' + (table.getState().pagination.pageIndex + 1) + '/' + table.getPageCount()}
        </span>
      </p>
      <Button
        variant='outline'
        className='group hidden size-7 p-0 hover:scale-110 hover:drop-shadow-lg lg:flex'
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}>
        <span className='sr-only'>Go to first page</span>
        <DoubleArrowLeftIcon className='size-4 transition-all duration-300 group-hover:size-5' />
      </Button>
      <Button
        variant='outline'
        className='group size-7 p-0 hover:scale-110 hover:drop-shadow-lg'
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}>
        <span className='sr-only'>Go to previous page</span>
        <ChevronLeftIcon className='size-4 transition-all duration-300 group-hover:size-5' />
      </Button>
      <Button
        variant='outline'
        className='group size-7 p-0 hover:scale-110 hover:drop-shadow-lg'
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}>
        <span className='sr-only'>Go to next page</span>
        <ChevronRightIcon className='size-4 transition-all duration-300 group-hover:size-5' />
      </Button>
      <Button
        variant='outline'
        className='group hidden size-7 p-0 hover:scale-110 hover:drop-shadow-lg lg:flex'
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}>
        <span className='sr-only'>Go to last page</span>
        <DoubleArrowRightIcon className='size-4 transition-all duration-300 group-hover:size-5' />
      </Button>
    </div>
  </div>
)

export default TablePagination
