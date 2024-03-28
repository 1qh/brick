import { CheckIcon } from '@radix-ui/react-icons'
import { cn } from 'utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { DataTableFacetedFilterProps } from '@/table/interfaces'

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='justify-start px-3 font-normal'>
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation='vertical' className='mx-3 h-4' />
              <div>
                {selectedValues.size > 0 && (
                  <Badge variant='secondary' className='mb-[2px] rounded-sm px-1 font-normal'>
                    {selectedValues.size} selected
                  </Badge>
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      {selectedValues?.size > 0 && (
        <div className='flex w-full flex-wrap'>
          {options
            .filter(option => selectedValues.has(option))
            .map(option => (
              <Badge
                variant='secondary'
                key={option}
                className='m-[2px] rounded-sm px-1 font-normal'>
                {option}
              </Badge>
            ))}
        </div>
      )}
      <PopoverContent
        className='w-fit p-0 transition-all duration-300 hover:drop-shadow-xl'
        align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => {
                const isSelected = selectedValues.has(option)
                return (
                  <CommandItem
                    className='gap-2'
                    key={option}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option)
                      } else {
                        selectedValues.add(option)
                      }
                      const filterValues = Array.from(selectedValues)
                      column?.setFilterValue(filterValues.length ? filterValues : undefined)
                    }}>
                    <div
                      className={cn(
                        'flex size-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}>
                      <CheckIcon className={cn('size-4')} />
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
            {selectedValues.size > 0 && (
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
