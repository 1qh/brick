import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Send,
  ShoppingCart,
  Trash2,
  Users2
} from 'lucide-react'

import { NavProps } from './nav'
export const links: NavProps['links'] = [
  {
    title: 'Inbox',
    href: '/',
    icon: Inbox
  },
  {
    title: 'Drafts',
    href: '/0',
    icon: File
  },
  {
    title: 'Sent',
    href: '/1',
    icon: Send
  },
  {
    title: 'Junk',
    href: '/2',
    icon: ArchiveX
  },
  {
    title: 'Trash',
    href: '/3',
    icon: Trash2
  },
  {
    title: 'Archive',
    href: '/4',
    icon: Archive
  },
  {
    title: 'Social',
    href: '/5',
    icon: Users2
  },
  {
    title: 'Updates',
    href: '/6',
    icon: AlertCircle
  },
  {
    title: 'Forums',
    href: '/7',
    icon: MessagesSquare
  },
  {
    title: 'Shopping',
    href: '/8',
    icon: ShoppingCart
  },
  {
    title: 'Promotions',
    href: '/9',
    icon: Archive
  }
]
