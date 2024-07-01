import { CheckIcon } from '@radix-ui/react-icons'

import { cn } from '@a/ui'
import { Button } from '@a/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@a/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@a/ui/popover'

import type { TableFacetedFilterProps } from '~/table/interfaces'

const TableFacetedFilter = <TData, TValue>({
  column,
  title,
  options
}: TableFacetedFilterProps<TData, TValue>) => {
  const facets = column?.getFacetedUniqueValues()
  const selected = new Set(column?.getFilterValue() as string[])
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='w-full justify-start gap-1.5 px-3 font-normal capitalize'>
          {title}
          <p className='w-5 rounded-full bg-muted font-medium'>
            {selected.size ? selected.size : ''}
          </p>
        </Button>
      </PopoverTrigger>
      {Array.from(selected).map(o => (
        <p key={o} className='h-4 rounded-full bg-muted px-1.5 text-xs'>
          {o}
        </p>
      ))}
      <PopoverContent
        className='w-fit p-0 transition-all duration-300 hover:drop-shadow-xl'
        side='right'>
        <Command>
          <CommandInput placeholder={title} className='placeholder:capitalize' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => {
                const isSelected = selected.has(option)
                return (
                  <CommandItem
                    className='gap-2'
                    key={option}
                    onSelect={() => {
                      if (isSelected) {
                        selected.delete(option)
                      } else {
                        selected.add(option)
                      }
                      const filterValues = Array.from(selected)
                      column?.setFilterValue(filterValues.length ? filterValues : undefined)
                    }}>
                    <div
                      className={cn(
                        'flex size-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}>
                      <CheckIcon className='size-4' />
                    </div>
                    <span className='mr-1'>{option}</span>
                    {facets?.get(option) && (
                      <span className='ml-auto flex size-4 items-center justify-center'>
                        {facets.get(option)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selected.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className='justify-center text-center'>
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default TableFacetedFilter
