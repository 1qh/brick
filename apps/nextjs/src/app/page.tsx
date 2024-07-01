import { FcGoogle } from 'react-icons/fc'

import { auth, signIn } from '@a/auth'
import { Button } from '@a/ui/button'

import MyTable from './table'

export const maxDuration = 300

export default async function Page() {
  const user = (await auth())?.user
  return user ? (
    <MyTable user={user} />
  ) : (
    <div className='flex h-screen'>
      <div className='m-auto flex items-center gap-5'>
        <form
          action={async () => {
            'use server'
            await signIn('google')
          }}>
          <Button
            variant='outline'
            size='lg'
            className='h-12 gap-2 text-base drop-shadow-md transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-lg'>
            <FcGoogle className='size-7' />
            Log in with Google
          </Button>
        </form>
      </div>
    </div>
  )
}
