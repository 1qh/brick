import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon } from '@radix-ui/react-icons'
import { cn } from 'utils'

import { Button } from '@/components/ui/button'
import { DataTableColumnHeaderProps } from '@/table/interfaces'

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }
  return (
    <Button
      variant='link'
      className='group w-full justify-start gap-1 p-0 opacity-70 transition-all hover:no-underline'
      onClick={() => column.toggleSorting()}>
      <p>{title}</p>
      {column.getIsSorted() === 'desc' ? (
        <ArrowDownIcon className='mt-px duration-300 group-hover:scale-125' />
      ) : column.getIsSorted() === 'asc' ? (
        <ArrowUpIcon className='mt-px duration-300 group-hover:scale-125' />
      ) : (
        <CaretSortIcon className='mt-px duration-300 group-hover:scale-125' />
      )}
    </Button>
  )
}
