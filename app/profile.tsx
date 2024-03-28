import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Company } from 'types'
import { cn } from 'utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { Employees } from './employees'

export function Profile({ company }: { company: Company }) {
  const ref = useRef<HTMLDivElement>(null)
  const [clamped, setClamped] = useState(false)
  const [expand, setExpand] = useState(false)

  function checkClamp() {
    if (ref && ref.current) {
      setClamped(ref.current.scrollHeight > ref.current.clientHeight)
    }
  }
  useEffect(() => {
    setExpand(false)
    const timeout = setTimeout(checkClamp, 0)
    return () => clearTimeout(timeout)
  }, [company.description])

  return (
    <>
      <Image
        src={company.ava}
        alt='cover'
        width={200}
        height={200}
        className='-my-16 h-48 w-full scale-110 blur-lg'
      />
      <div className='relative flex justify-between'>
        <Image
          src={company.ava}
          alt='ava'
          width={200}
          height={200}
          className='mx-8 mb-5 size-32 rounded-full border-2 shadow-lg transition-all duration-200 hover:drop-shadow-xl'
        />
        <Badge variant='outline' className='my-auto mr-3'>
          {company.country}
        </Badge>
      </div>
      <Link
        className='notranslate mx-6 flex flex-wrap text-2xl font-bold transition-all duration-200 hover:scale-105'
        href={company.url}>
        {company.name}
      </Link>
      <p ref={ref} className={cn('mx-3 mt-2 px-2', expand ? '' : 'line-clamp-5')}>
        {company.description}
      </p>
      {clamped && (
        <Button
          variant='link'
          className='mx-1 -mt-2 text-base font-normal opacity-35 hover:no-underline'
          onClick={() => setExpand(!expand)}>
          Show {expand ? 'less' : 'more'}
        </Button>
      )}
      <Employees id={company.id} />
    </>
  )
}
