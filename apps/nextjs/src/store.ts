import { atomWithStorage } from 'jotai/utils'

import type { Company, Employee, Source } from '~/types'

const companiesAtom = atomWithStorage<Company[]>('company', [])
const employeesAtom = atomWithStorage<Record<string, Employee[]>>('employees', {})
const focusAtom = atomWithStorage<Company | null>('focus', null)
const queryAtom = atomWithStorage<string>('query', '')
const sourceAtom = atomWithStorage<Source>('source', 'linkedin')

export { queryAtom, employeesAtom, sourceAtom, companiesAtom, focusAtom }
