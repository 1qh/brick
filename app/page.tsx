import { auth, signIn } from 'auth'

import { Button } from '@/components/ui/button'

import MyTable from './table'

export default async function Page() {
  const session = await auth()
  if (!session) {
    return (
      <div className='flex h-screen'>
        <div className='m-auto flex flex-row items-center gap-5'>
          <form
            action={async () => {
              'use server'
              await signIn()
            }}>
            <Button className='drop-shadow-md transition-all duration-300 hover:bg-background hover:text-accent-foreground'>
              Sign in
            </Button>
          </form>
          to continue
        </div>
      </div>
    )
  }
  return <MyTable />
}
