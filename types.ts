type Employee = {
  id: string
  name: string
  title: string
  ava: string
}
type Company = {
  id: string
  name: string
  industry: string
  country: string
  employeeCount: number
  description: string
  ava: string
  url: string
  searchQueries: string[]
}
type Setting = {
  model: string
  alpha: number
  beta: number
}
export type { Company, Employee, Setting }
