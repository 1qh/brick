import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon } from '@radix-ui/react-icons'

import { cn } from '@a/ui'
import { Button } from '@a/ui/button'

import type { TableColumnHeaderProps } from '~/table/interfaces'

const TableColumnHeader = <TData, TValue>({
  children,
  column,
  className
}: TableColumnHeaderProps<TData, TValue>) =>
  column.getCanSort() ? (
    <Button
      variant='ghost'
      className={cn(
        'group m-0 h-0 w-full p-0 capitalize text-muted-foreground *:duration-100',
        className
      )}
      onClick={() => column.toggleSorting()}>
      {children}
      {column.getIsSorted() === 'desc' ? (
        <ArrowDownIcon className='z-10 group-hover:scale-125' />
      ) : column.getIsSorted() === 'asc' ? (
        <ArrowUpIcon className='z-10 group-hover:scale-125' />
      ) : (
        <CaretSortIcon className='z-10 group-hover:scale-125' />
      )}
    </Button>
  ) : (
    <p className={className}>{children}</p>
  )

export default TableColumnHeader
