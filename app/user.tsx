import { EnterIcon, PersonIcon } from '@radix-ui/react-icons'
import { auth } from 'auth'
import { signIn, signOut } from 'auth'

import { Tutip } from '@/components/tutip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        'use server'
        await signIn(provider)
      }}>
      <Tutip content='Sign In'>
        <Button
          variant='ghost'
          size='icon'
          className='group size-9 transition-all duration-200 hover:scale-110 hover:drop-shadow-lg'
          {...props}>
          <PersonIcon className='size-6 transition-all duration-300 group-hover:scale-0' />
          <EnterIcon className='absolute size-6 scale-0 transition-all duration-300 group-hover:scale-100' />
        </Button>
      </Tutip>
    </form>
  )
}

export default async function UserButton() {
  const session = await auth()
  if (!session?.user) return <SignIn />
  return (
    <Popover>
      <Tutip content={session.user.email as string}>
        <PopoverTrigger asChild>
          <Avatar className='mx-auto mb-1 size-7 transition-all duration-300 hover:scale-125'>
            {session.user.image && (
              <AvatarImage src={session.user.image} alt={session.user.name ?? ''} />
            )}
            <AvatarFallback>{session.user.email}</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
      </Tutip>
      <PopoverContent
        side='top'
        className='notranslate group mx-2 my-1 w-fit p-0 transition-all duration-300 hover:drop-shadow-xl'>
        <form
          action={async () => {
            'use server'
            await signOut()
          }}>
          <Button variant='destructive'>Sign Out</Button>
        </form>{' '}
      </PopoverContent>
    </Popover>
  )
}
