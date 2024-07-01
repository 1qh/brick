'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon } from '@radix-ui/react-icons'

import { cn } from '@a/ui'
import { buttonVariants } from '@a/ui/button'

import Tutip from '~/components/tutip'

interface IconProps extends React.SVGAttributes<SVGElement> {
  children?: never
  color?: string
}

interface NavProps {
  title: string
  href: string
  icon: React.FC<IconProps>
}

const links: NavProps[] = [
  {
    title: 'Home',
    href: '/',
    icon: HomeIcon
  }
]

export default function Nav() {
  const pathname: string = usePathname()
  return links.map((link, i) => (
    <Tutip key={i} content={link.title} side='right'>
      <Link
        href={link.href}
        className={cn(
          buttonVariants({
            variant: pathname === link.href ? 'default' : 'ghost',
            size: 'icon'
          }),
          'group size-9 transition-all duration-300 hover:scale-110 hover:drop-shadow-lg',
          pathname === link.href
            ? 'dark:bg-muted dark:text-foreground'
            : 'dark:text-muted-foreground'
        )}>
        <link.icon className='size-5 p-px transition-all duration-300 group-hover:size-6' />
      </Link>
    </Tutip>
  ))
}
