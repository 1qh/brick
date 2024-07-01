import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@a/ui'

import type { Employee } from '~/types'
import Blink from '~/components/blink'

interface AvatarProps {
  employee: Employee
  clamp?: boolean
  className?: string
}

const Avatar = ({ employee, clamp = false, className }: AvatarProps) => (
  <Link
    target='_blank'
    href={'https://linkedin.com/in/' + employee.linkedin}
    className={cn(
      'group relative mx-auto my-2 flex w-40 flex-col items-center *:transition-all *:duration-300',
      className
    )}>
    {employee.ava ? (
      <Image
        onError={e => (e.currentTarget.srcset = '/ava.png')}
        className='mb-2 rounded-full group-hover:translate-y-0.5 group-hover:scale-110 group-hover:drop-shadow-xl'
        src={employee.ava}
        width={70}
        height={70}
        alt=''
      />
    ) : (
      <Image
        className='mb-2 rounded-full group-hover:translate-y-0.5 group-hover:scale-110 group-hover:drop-shadow-xl'
        src='/ava.png'
        width={70}
        height={70}
        alt=''
      />
    )}
    {employee.star && (
      <div className='absolute -top-2 left-9 group-hover:-translate-x-1 group-hover:-translate-y-1'>
        <Blink />
      </div>
    )}
    <p
      className={cn(
        'font-semibold group-hover:font-bold group-hover:tracking-tight',
        clamp && 'line-clamp-1'
      )}>
      {employee.name}
    </p>
    <p className={cn('text-pretty text-center text-sm', clamp && 'line-clamp-2')}>
      {employee.title || ''}
    </p>
  </Link>
)

export default Avatar
