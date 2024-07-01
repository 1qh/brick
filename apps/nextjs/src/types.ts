type Source = 'kompass' | 'linkedin' | 'europages'

interface BaseInfo {
  id: string
  name: string
  ava?: string
}
interface Contact {
  location: string
  industry: string
  mail: string
  phone: string
  work: boolean
  verified: boolean
}
type Employee = BaseInfo &
  Partial<Contact> & {
    title: string
    linkedin: string
    company: string
    star?: boolean
  }
type Company = BaseInfo & {
  address?: string
  country?: string
  description?: string
  phone?: string
  url?: string
  searchQueries?: string[]
  industry?: string
  employeeCount?: number
  unlocked?: boolean
}
interface Mail {
  user: string
  mails: string[]
  subject: string
  message: string
}
interface ProfileSuggest {
  company: string[]
  product: string[]
  description: string[]
  sellingPoint: string[]
}

export type { Company, Contact, Employee, Source, Mail, ProfileSuggest }
