import { PieChartIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { Employee } from 'types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function Employees({ id }: { id: string }) {
  const { data, error, isLoading } = useSWR('/employee/' + id, fetcher)
  if (error) {
    return error.toString()
  }
  if (isLoading) return <PieChartIcon className='m-auto size-10 animate-spin duration-500' />
  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(12em,1fr))]'>
      {(data as Employee[]).map((employee, i) => (
        <Link
          target='_blank'
          href={'https://linkedin.com/in/' + employee.id}
          key={i}
          className='group mx-auto flex w-40 flex-col items-center transition-all duration-200 hover:scale-105'>
          <Image
            className='mt-3 rounded-full transition-all duration-200 group-hover:drop-shadow-xl'
            src={employee.ava}
            width={70}
            height={70}
            alt={employee.name}
          />
          <p className='line-clamp-1 font-bold'>{employee.name}</p>
          <p className='line-clamp-2 text-pretty text-center text-sm'>{employee.title}</p>
        </Link>
      ))}
    </div>
  )
}
