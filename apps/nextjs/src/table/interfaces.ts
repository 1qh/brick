import type { Column, Table } from '@tanstack/react-table'

interface TableColumnHeaderProps<TData, TValue> {
  children: React.ReactNode
  column: Column<TData, TValue>
  className?: string
}

interface TableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: string[]
}

interface TableViewOptionsProps<TData> {
  table: Table<TData>
  className?: string
}

interface TablePaginationProps<TData> {
  table: Table<TData>
  rowSingular: string
  className?: string
}

export type {
  TableColumnHeaderProps,
  TableFacetedFilterProps,
  TablePaginationProps,
  TableViewOptionsProps
}
