import { Column, ColumnDef, Table } from '@tanstack/react-table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  Toolbar: React.FC<{ table: any }>
  rowString: string
}

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: string[]
}

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  rowString: string
  className?: string
}

export type {
  DataTableColumnHeaderProps,
  DataTableFacetedFilterProps,
  DataTablePaginationProps,
  DataTableProps,
  DataTableViewOptionsProps
}
