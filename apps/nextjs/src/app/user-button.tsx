import type { User } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { EnterIcon, PersonIcon } from '@radix-ui/react-icons'

import { signIn, signOut } from '@a/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@a/ui/avatar'
import { Button } from '@a/ui/button'
import { Dialog, DialogClose, DialogTrigger } from '@a/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@a/ui/dropdown-menu'

import { DialogContent } from '~/components/dialog'
import Tutip from '~/components/tutip'

const UserButton = ({ user }: { user: User | undefined }) =>
  user ? (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger className='focus:outline-none'>
          <Avatar className='mx-auto size-8 transition-all duration-300 hover:scale-110 hover:drop-shadow-sm'>
            {user.image && <AvatarImage src={user.image} />}
            <AvatarFallback>{user.email}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='m-1.5 *:justify-between *:gap-3'>
          <DropdownMenuItem>
            <form
              action={async () => {
                'use server'
                await signIn('google', undefined, {
                  scope: 'openid https://www.googleapis.com/auth/gmail.send'
                })
              }}>
              <button>Grant send email permission</button>
            </form>
            <Image src='/gmail.ico' alt='Gmail' width={20} height={20} />
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              Log out
              <EnterIcon className='size-5' />
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem asChild>
            <Link href='/profile'>
              Profile
              <PersonIcon className='size-5' />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className='w-fit p-4'>
        {'Are you sure you want to log out of ' + user.email + '?'}
        <div className='flex justify-end gap-3'>
          <DialogClose>
            <Button variant='secondary'>Cancel</Button>
          </DialogClose>
          <form
            action={async () => {
              'use server'
              await signOut()
            }}>
            <Button variant='destructive'>Sign Out</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <form
      action={async () => {
        'use server'
        await signIn('google')
      }}>
      <Tutip content='Log in with Google' side='right'>
        <Button
          variant='ghost'
          size='icon'
          className='group size-9 transition-all duration-300 *:transition-all *:duration-300 hover:scale-110 hover:drop-shadow-lg'>
          <PersonIcon className='size-6 group-hover:size-0' />
          <EnterIcon className='size-0 group-hover:size-6' />
        </Button>
      </Tutip>
    </form>
  )

export default UserButton
