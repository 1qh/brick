'use client'

import * as React from 'react'

import { cn } from '@a/ui'
import { ScrollBar } from '@a/ui/scroll-area'

import { ScrollArea } from './scroll-area'

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <ScrollArea>
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </ScrollArea>
  )
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('sticky top-0 z-10 bg-background', className)} {...props} />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => (
  <tbody ref={ref} className={className} {...props}>
    {children}
    <tr>
      <td>
        <ScrollBar className='pb-1.5 pt-9' />
      </td>
    </tr>
  </tbody>
))
TableBody.displayName = 'TableBody'

export { Table, TableBody, TableHeader }
