import type { SortingState } from '@tanstack/react-table'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import TrafficLight from '@arvinxu/macos-traffic-light'
import {
  CircleBackslashIcon,
  DashboardIcon,
  DrawingPinIcon,
  EnterIcon,
  EnvelopeClosedIcon,
  ExclamationTriangleIcon,
  ListBulletIcon,
  LockClosedIcon,
  LockOpen1Icon,
  PersonIcon
} from '@radix-ui/react-icons'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import type { UpdateUser } from '@a/db/schema'
import { cn } from '@a/ui'
import { Badge } from '@a/ui/badge'
import { Button } from '@a/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@a/ui/popover'
import { ScrollArea } from '@a/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@a/ui/sheet'
import { Skeleton } from '@a/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@a/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@a/ui/tabs'

import type { Company, Employee } from '~/types'
import { genMail, getContact, getEmployees } from '~/actions'
import columns from '~/column/employee'
import { Textarea } from '~/components/textarea'
import Tutip from '~/components/tutip'
import { useServerAction } from '~/hook/server-action'
import { employeesAtom } from '~/store'
import Pagination from '~/table/pagination'
import { nameToIso } from '~/utils'
import Avatar from './avatar'
import Contact from './contact'

import '../../../../node_modules/flag-icons/css/flag-icons.min.css'

const needed = ['location', 'industry', 'mail', 'phone', 'work', 'verified']

export default function Profile({ company }: { company: Company }) {
  const [focusEmployee, setFocusEmployee] = useState<Employee | null>(null)
  const [notes, setNotes] = useState('')
  const [mail, setMail] = useState('')
  const {
    id: employeeId,
    name: employee,
    title: employeeJob
  } = focusEmployee ?? { employeeId: '', name: '', title: '' }
  const {
    id,
    ava,
    name: companyName,
    address,
    country,
    description: companyDescription,
    industry,
    url
  } = company
  const user = useSession().data?.user as UpdateUser
  const { name, job, email, company: userCompany, product, description, sellingPoint } = user

  const info = {
    name,
    job,
    email,
    company: userCompany,
    product,
    description,
    sellingPoint,
    companyId: id,
    employee,
    employeeId,
    employeeJob,
    industry,
    notes
  }

  const [employees, setEmployees] = useAtom(employeesAtom)

  const [runGenMail, genMailPending] = useServerAction(genMail)
  const [runGetEmployees, employeesPending] = useServerAction(getEmployees)
  const [runGetContact, contactPending] = useServerAction(getContact)
  const iso = country ? nameToIso(country) : null

  const ref = useRef<HTMLDivElement>(null)
  const [clamped, setClamped] = useState(false)
  const [expand, setExpand] = useState(false)
  const [open, setOpen] = useState(false)
  const [maximized, setMaximized] = useState(false)

  function checkClamp() {
    if (ref.current) {
      setClamped(ref.current.scrollHeight > ref.current.clientHeight)
    }
  }
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageSize: 20, pageIndex: 0 })
  const table = useReactTable({
    data: employees[id] ?? [],
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  useEffect(() => {
    setExpand(false)
    const timeout = setTimeout(checkClamp, 0)
    return () => clearTimeout(timeout)
  }, [companyDescription])

  return (
    <ScrollArea className='h-screen'>
      <Popover open={open}>
        <PopoverTrigger className='fixed left-0 top-0' />
        <PopoverContent
          side='right'
          className={cn(
            'notranslate relative pb-0 pl-2.5 pr-px pt-2.5 transition-all duration-500',
            maximized
              ? 'ml-12 h-screen w-[calc(100vw-3rem)] rounded-none border-none shadow-none'
              : 'ml-20 mt-6 h-[800px] max-h-[calc(100vh-1rem)] w-96 rounded-lg hover:shadow-xl hover:drop-shadow-xl'
          )}>
          <TrafficLight
            onClose={() => setOpen(false)}
            onMinimize={() => setOpen(false)}
            onMaximize={() => setMaximized(!maximized)}
          />
          <p className='absolute left-1/2 top-1 -translate-x-1/2 font-medium'>Write with AI</p>
          <ScrollArea
            className={cn(
              'mt-2 rounded-lg pr-2.5',
              maximized ? 'h-[calc(100vh-2.5rem)]' : 'h-[758px] max-h-[calc(100vh-3.6rem)]'
            )}>
            <div className='mt-2 flex flex-col px-px'>
              <p className='mx-auto my-1'>From</p>
              <div className='flex flex-col rounded-xl bg-muted p-3 *:flex *:justify-between'>
                <div>
                  <p className='font-semibold'>{name}</p>
                  <p>{userCompany}</p>
                </div>
                <div className='text-sm'>
                  <p className='italic'>{email}</p>
                  <p>{job}</p>
                </div>
              </div>
              <p className='mx-auto my-1'>To</p>
              <div className='flex flex-col rounded-xl bg-muted p-3 *:flex *:justify-between'>
                <div>
                  <p className='font-semibold'>{employee}</p>
                  <p>{companyName}</p>
                </div>
                <div className='text-sm'>
                  <p>{employeeJob}</p>
                  <p>{industry}</p>
                </div>
              </div>
              <p className='mx-auto my-1'>Product</p>
              <div className='rounded-xl bg-muted p-3'>
                <p>{product}</p>
                <p className='text-xs'>{sellingPoint}</p>
              </div>
              <Textarea
                className='my-3'
                placeholder='Notes'
                onChangeCapture={e => setNotes(e.currentTarget.value)}
              />
              <Button
                onClick={async () => {
                  const mail = await runGenMail(info as Record<string, string>)
                  if (mail) {
                    setMail(mail.content)
                    toast.success('Mail generated successfully')
                  } else {
                    toast.error('Mail generation failed')
                  }
                  toast.dismiss()
                }}>
                Generate Email
                <p
                  className={cn(
                    'ml-2 size-0 animate-spin rounded-full border-background border-t-transparent transition-all duration-500',
                    genMailPending && 'size-5 border'
                  )}
                />
              </Button>
              {mail && (
                <Textarea value={mail} className='mt-3' onChange={e => setMail(e.target.value)} />
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      {ava ? (
        <Image
          onError={e => (e.currentTarget.srcset = '/company.png')}
          className='-my-20 h-44 w-full scale-110 blur-lg'
          src={ava}
          alt=''
          width={300}
          height={300}
        />
      ) : (
        <Image
          className='-my-20 h-44 w-full scale-110 blur-lg'
          src='/company.png'
          alt=''
          width={300}
          height={300}
        />
      )}
      <div className='relative flex justify-between *:transition-all *:duration-300'>
        {ava ? (
          <Image
            onError={e => (e.currentTarget.srcset = '/company.png')}
            className='mb-1 ml-3 size-32 rounded-full border-2 shadow-lg hover:drop-shadow-xl'
            src={ava}
            alt=''
            width={300}
            height={300}
          />
        ) : (
          <Image
            className='mb-1 ml-3 size-32 rounded-full border-2 shadow-lg hover:drop-shadow-xl'
            src='/company.png'
            alt=''
            width={300}
            height={300}
          />
        )}
        {iso && (
          <Badge
            variant='secondary'
            className='group my-auto mr-3 flex-col pl-2.5 pr-2 font-normal *:transition-all *:duration-500 hover:rounded-2xl hover:py-1'>
            <div className='flex w-full justify-between gap-2 *:transition-all *:duration-500 group-hover:gap-4'>
              <p className='tracking-tight group-hover:text-lg group-hover:tracking-tighter'>
                {country}
              </p>
              <p className={cn('fi mr-1.5 group-hover:scale-150', 'fi-' + iso.toLowerCase())} />
            </div>
            {address && (
              <div className='notranslate flex h-0 w-full items-center justify-between gap-2 text-[0] group-hover:h-6 group-hover:text-xs'>
                {address}
                <DrawingPinIcon className='size-0 rounded-full border bg-background transition-all duration-500 group-hover:size-5 group-hover:p-0.5' />
              </div>
            )}
          </Badge>
        )}
      </div>
      {url ? (
        <Link
          className='notranslate mb-1 ml-3 flex flex-wrap text-pretty text-2xl font-semibold tracking-normal decoration-1 transition-all duration-300 hover:text-3xl hover:font-bold hover:tracking-tight hover:text-blue-900 hover:underline hover:drop-shadow-lg dark:hover:text-blue-300'
          target='_blank'
          href={url}>
          {companyName}
        </Link>
      ) : (
        <p className='notranslate mb-1 ml-3 flex flex-wrap text-pretty text-2xl font-semibold tracking-normal transition-all duration-300 hover:text-3xl hover:font-bold hover:tracking-tight hover:drop-shadow-lg'>
          {companyName}
        </p>
      )}
      <p
        ref={ref}
        className={cn(
          '-mb-1 text-pretty px-3 leading-5 [overflow-wrap:anywhere]',
          !expand && 'line-clamp-5'
        )}>
        {companyDescription}
      </p>
      {clamped && (
        <button
          className='w-full px-3 text-left text-sm opacity-30'
          onClick={() => setExpand(!expand)}>
          {'Show ' + (expand ? 'less' : 'more')}
        </button>
      )}
      <div className={employeesPending ? 'space-y-1.5 pl-2 pr-3.5' : 'hidden'}>
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} className='py-5' />
        ))}
      </div>
      <Button
        onClick={async () => {
          const employeeData = await runGetEmployees(user.email ?? '', encodeURIComponent(id))
          if (employeeData) {
            setEmployees({ ...employees, ...employeeData } as Record<string, Employee[]>)
            toast.success(`Employees at ${companyName} unlocked successfully`)
          } else {
            toast.error(`Employees not available at ${companyName}`)
          }
          toast.dismiss()
        }}
        className={
          employees[id] ?? employeesPending
            ? 'hidden'
            : 'group mx-auto mt-3 flex size-36 flex-col gap-1 rounded-2xl font-normal transition-all duration-300 hover:-translate-y-2 hover:font-semibold hover:drop-shadow-xl'
        }
        variant='secondary'>
        <LockClosedIcon className='size-16 group-hover:hidden' />
        <LockOpen1Icon className='hidden size-16 group-hover:block' />
        Unlock Employees
      </Button>
      {employees[id] && (
        <Tabs defaultValue='table'>
          <TabsList className='absolute right-3 z-10 h-7 px-0.5'>
            <TabsTrigger value='table' className='px-1'>
              <Tutip content='Table view' side='top'>
                <ListBulletIcon />
              </Tutip>
            </TabsTrigger>
            <TabsTrigger value='grid' className='px-1'>
              <Tutip content='Grid view' side='top'>
                <DashboardIcon />
              </Tutip>
            </TabsTrigger>
          </TabsList>
          <TabsContent value='table' className='m-0'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead key={header.id} colSpan={header.colSpan} className='h-8 py-0 pr-0'>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map(row => {
                  const employee = row.original as Employee
                  const ok: boolean = needed.every(k => k in employee)
                  return (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map(cell => (
                        <>
                          <TableCell key={cell.id} className='py-0 pr-0'>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                          {cell.column.id === 'title' && (
                            <div className='mr-2 flex select-none items-center justify-end'>
                              <Sheet>
                                <SheetTrigger>
                                  <Tutip
                                    content={ok ? 'Contact available' : 'Contact need requested'}
                                    side='left'>
                                    <Button
                                      variant='ghost'
                                      className={cn(
                                        'group relative z-10 my-px size-8 p-0 transition-all duration-300 *:transition-all *:duration-300 hover:scale-125 hover:bg-blue-100 hover:drop-shadow-lg dark:hover:bg-blue-900',
                                        !ok && 'hover:bg-yellow-100 dark:hover:bg-yellow-600'
                                      )}>
                                      <PersonIcon className='size-4 group-hover:size-0' />
                                      {ok ? (
                                        <EnterIcon className='size-0 rotate-180 group-hover:size-4' />
                                      ) : (
                                        <>
                                          <ExclamationTriangleIcon className='absolute z-10 ml-3.5 mt-3 size-2 bg-background text-yellow-500 group-hover:size-0' />
                                          <LockOpen1Icon className='size-0 group-hover:size-4' />
                                        </>
                                      )}
                                    </Button>
                                  </Tutip>
                                </SheetTrigger>
                                <SheetContent className='flex flex-col p-0'>
                                  <Avatar employee={employee} className='mb-3 mt-5' />
                                  <Contact
                                    employee={employee}
                                    className={ok ? 'relative' : 'hidden'}
                                  />
                                  <Button
                                    onClick={async () => {
                                      const contact = await runGetContact(
                                        user.email ?? '',
                                        employee.id
                                      )
                                      if (contact) {
                                        setEmployees({
                                          ...employees,
                                          [id]: (employees[id] ?? []).map(e =>
                                            e.id === employee.id ? { ...employee, ...contact } : e
                                          )
                                        })
                                        toast.success('Contact unlocked successfully')
                                      } else {
                                        toast.error('Contact unlock failed')
                                      }
                                      toast.dismiss()
                                    }}
                                    className={
                                      ok
                                        ? 'hidden'
                                        : 'group relative m-auto size-36 flex-col gap-1 rounded-2xl font-normal transition-all duration-300 hover:-translate-y-2 hover:font-semibold hover:drop-shadow-xl'
                                    }
                                    variant='secondary'>
                                    <LockClosedIcon className='size-16 group-hover:hidden' />
                                    <LockOpen1Icon className='hidden size-16 group-hover:block' />
                                    <p className='flex items-center'>
                                      <p
                                        className={cn(
                                          'mr-1 size-0 animate-spin rounded-full border-foreground border-t-transparent transition-all duration-500',
                                          contactPending && 'size-4 border'
                                        )}
                                      />
                                      Unlock Contact
                                    </p>
                                  </Button>
                                </SheetContent>
                              </Sheet>

                              <Tutip
                                content={ok ? 'Send email' : 'Email not available 🚫'}
                                side='left'>
                                <Button
                                  onClick={() => {
                                    if (ok) {
                                      setOpen(true)
                                      setFocusEmployee(employee)
                                    }
                                  }}
                                  variant='ghost'
                                  className={cn(
                                    'group relative z-10 size-8 p-0 transition-all duration-300 *:transition-all *:duration-300 hover:scale-125 hover:bg-green-100 hover:drop-shadow-lg dark:hover:bg-green-900',
                                    !ok && 'hover:bg-red-100 dark:hover:bg-red-900'
                                  )}>
                                  <EnvelopeClosedIcon
                                    className={cn(
                                      'size-4 group-hover:size-5',
                                      !ok && 'group-hover:size-0'
                                    )}
                                  />
                                  {!ok && (
                                    <>
                                      <CircleBackslashIcon className='absolute z-10 ml-3.5 mt-2.5 size-2.5 rounded-full bg-background text-red-500 group-hover:size-0' />
                                      <LockClosedIcon className='size-0 group-hover:size-4' />
                                    </>
                                  )}
                                </Button>
                              </Tutip>
                            </div>
                          )}
                        </>
                      ))}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <Pagination table={table} rowSingular='employee' />
          </TabsContent>
          <TabsContent
            value='grid'
            className='m-0 grid grid-cols-[repeat(auto-fill,minmax(12em,1fr))]'>
            {(employees[id] ?? []).map((employee, i) => (
              <Avatar key={i} employee={employee} clamp />
            ))}
          </TabsContent>
        </Tabs>
      )}
    </ScrollArea>
  )
}
