import Image from 'next/image'
import { EnvelopeClosedIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { useSession } from 'next-auth/react'
import pluralize from 'pluralize'
import { toast } from 'sonner'
import { z } from 'zod'

import { Badge } from '@a/ui/badge'
import { Button } from '@a/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@a/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@a/ui/form'
import { Input } from '@a/ui/input'

import type { Employee, Mail } from '~/types'
import { Textarea } from '~/components/textarea'
import { useForm } from '~/hook/use-form'

const FormSchema = z.object({
  user: z.string(),
  mails: z.array(z.string()),
  subject: z.string().min(1, { message: 'Required' }),
  message: z.string().min(1, { message: 'Required' })
})

interface MailProps {
  children: React.ReactNode
  action: (data: Mail) => void
  employees: Employee[]
}

export default function SendMail({ children, action, employees }: MailProps) {
  const { data: session } = useSession()
  const missing = employees.filter(e => !e.mail).length
  const mails = employees.map(e => e.mail)
  const form = useForm({
    schema: FormSchema,
    defaultValues: {
      user: session?.user.email ?? '',
      mails,
      subject: '',
      message: ''
    }
  })
  return (
    <Dialog>
      {employees.length ? <DialogTrigger className='z-10'>{children}</DialogTrigger> : children}
      <DialogContent className='gap-1 p-2'>
        {missing ? (
          <p className='py-1 text-center'>
            Missing {missing} {pluralize('email', missing)}
          </p>
        ) : (
          <>
            <p className='mb-1 ml-2 text-lg font-medium'>New Email</p>
            <div className='ml-2 flex flex-wrap items-center gap-1 text-sm'>
              To
              {employees.map(e => (
                <Badge variant='secondary' className='rounded-full px-0.5 font-normal' key={e.id}>
                  {e.ava ? (
                    <Image
                      onError={e => (e.currentTarget.srcset = '/ava.png')}
                      className='my-px rounded-full'
                      src={e.ava}
                      width={18}
                      height={18}
                      alt=''
                    />
                  ) : (
                    <Image
                      onError={e => (e.currentTarget.srcset = '/ava.png')}
                      className='my-px rounded-full'
                      src='/ava.png'
                      width={18}
                      height={18}
                      alt=''
                    />
                  )}
                  {e.mail && <p className='px-1'>{e.mail}</p>}
                </Badge>
              ))}
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(data => {
                  toast('Sending email...', {
                    description: `Recipients: ${mails.join(', ')}`
                  })
                  action(data as Mail)
                })}>
                <FormField
                  control={form.control}
                  name='subject'
                  render={({ field }) => (
                    <FormItem className='mr-3 flex'>
                      <FormControl>
                        <Input
                          className='rounded-none border-0 p-2 shadow-none placeholder:opacity-70 focus-visible:ring-0 focus-visible:placeholder:opacity-35'
                          placeholder='Subject'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='message'
                  render={({ field }) => (
                    <FormItem className='mr-3 flex'>
                      <FormControl>
                        <Textarea
                          className='rounded-none border-0 border-t p-2 shadow-none placeholder:opacity-70 focus-visible:ring-0 focus-visible:placeholder:opacity-35'
                          placeholder='Enter your message'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex justify-end'>
                  <Button
                    type='submit'
                    className='group relative px-3 *:transition-all *:duration-300'>
                    <p className='mr-2.5'>Send</p>
                    <EnvelopeClosedIcon className='size-4 group-hover:size-0' />
                    <PaperPlaneIcon className='size-0 -translate-y-px -rotate-45 group-hover:size-4' />
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
