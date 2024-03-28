'use client'

import { useFormStatus } from 'react-dom'
import { MagnifyingGlassIcon, PaperPlaneIcon, UpdateIcon } from '@radix-ui/react-icons'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Setting } from 'types'
import { cn } from 'utils'
import { z } from 'zod'

import { Input } from '@/components/input'
import { Button } from '@/components/moving-border'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

import { useFormAction } from './use-form-action'

const FormSchema = z.object({
  query: z.string().min(4, { message: 'Query must be at least 4 characters.' })
})

const Wait = () => useFormStatus().pending

function StateIcon({ className }: { className?: string }) {
  return Wait() ? (
    <UpdateIcon
      className={cn(className, 'ml-px mt-0.5 size-5 animate-spin opacity-70 duration-700')}
    />
  ) : (
    <MagnifyingGlassIcon className={cn(className, 'size-6 opacity-30')} />
  )
}

export function Search({ action, className }: { action: (form: any) => void; className?: string }) {
  const { data: session } = useSession()

  let setting: string = '{}'
  if (typeof window !== 'undefined') {
    setting = localStorage.getItem('setting') as string
  }

  const st: Setting = JSON.parse(setting)
  const estimate = st?.alpha * (st?.beta + 1)

  const form = useFormAction({ schema: FormSchema })
  return (
    <Form {...form}>
      <form
        id='query'
        action={() => {
          form.handleAction(async (form: any) => {
            toast.loading(`Searching will take about ${estimate} seconds...`, {
              description: `Fetching companies with query: ${form.query}`
            })
            form.setting = setting
            form.user = session?.user?.email
            action(form)
          })
        }}
        className={className}>
        <FormField
          control={form.control}
          name='query'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative flex gap-2'>
                  <div className='group w-full transition-all duration-200 hover:scale-105 hover:drop-shadow-lg'>
                    <div className='group absolute left-2 mt-1.5 items-center transition-all duration-200 group-hover:scale-125'>
                      <StateIcon className='-ml-px mt-px' />
                    </div>
                    <Input
                      className='pl-9 focus-visible:ring-orange-300 dark:focus-visible:ring-orange-600'
                      placeholder='Search anything ...'
                      {...field}
                      disabled={Wait()}
                    />
                  </div>
                  <Button
                    disabled={Wait()}
                    type='submit'
                    containerClassName={cn(
                      'group transition-all duration-200 hover:scale-110',
                      Wait() && 'cursor-not-allowed opacity-50'
                    )}
                    borderClassName='bg-[radial-gradient(var(--green-300)_40%,transparent_60%)]'>
                    <PaperPlaneIcon className='mb-1 ml-2 mr-1 size-7 -rotate-45 opacity-80 transition-all duration-200 group-hover:scale-110' />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
