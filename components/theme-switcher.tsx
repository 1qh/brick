'use client'

import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { cn } from 'utils'

import { Tutip } from '@/components/tutip'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export function ThemeSwitcher({ className }: { className?: string }) {
  const { setTheme } = useTheme()
  return (
    <DropdownMenu>
      <Tutip content='Theme'>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className={cn(
              className,
              'group size-9 transition-all duration-200 hover:scale-110 hover:drop-shadow-lg'
            )}>
            <SunIcon className='size-6 rotate-0 scale-100 transition-all group-hover:rotate-90 dark:-rotate-90 dark:scale-0' />
            <MoonIcon className='absolute size-6 rotate-90 scale-0 transition-all group-hover:rotate-90 dark:rotate-0 dark:scale-100' />
          </Button>
        </DropdownMenuTrigger>
      </Tutip>
      <DropdownMenuContent
        onCloseAutoFocus={e => e.preventDefault()}
        className='mx-2 my-1 transition-all duration-300 hover:drop-shadow-xl'>
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
