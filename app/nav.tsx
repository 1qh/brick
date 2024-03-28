'use client'

import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from 'utils'

import { Tutip } from '@/components/tutip'
import { buttonVariants } from '@/components/ui/button'

import { links } from './navlinks'

export interface NavProps {
  links: {
    title: string
    href: string
    icon: LucideIcon
  }[]
}

export function Nav() {
  const pathname: string = usePathname()
  return links.map((link, index) => (
    <Tutip key={index} content={link.title}>
      <Link
        href={link.href}
        className={cn(
          buttonVariants({
            variant: pathname === link.href ? 'default' : 'ghost',
            size: 'icon'
          }),
          'size-9 transition-all duration-200 hover:scale-110 hover:drop-shadow-lg',
          pathname === link.href &&
            'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
        )}>
        <link.icon className='size-5 p-px' />
      </Link>
    </Tutip>
  ))
}
