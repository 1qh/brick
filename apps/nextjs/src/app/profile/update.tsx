'use client'

import { use } from 'react'
import { isMatch } from 'lodash'
import { toast } from 'sonner'

import type { RouterOutputs } from '@a/api'
import type { UpdateUser } from '@a/db/schema'
import { UpdateUserSchema } from '@a/db/schema'
import { cn } from '@a/ui'
import { Button } from '@a/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@a/ui/form'
import { Input } from '@a/ui/input'

import { Textarea } from '~/components/textarea'
import { useForm } from '~/hook/use-form'
import { api } from '~/trpc/react'

interface UpdateProps {
  id: string
  user: Promise<RouterOutputs['user']['byId']>
}

export default function Update(props: UpdateProps) {
  const initialData = use(props.user)
  const { data: user } = api.user.byId.useQuery(props.id, { initialData })

  const form = useForm({ schema: UpdateUserSchema, defaultValues: user as UpdateUser })
  const utils = api.useUtils()
  const updateUser = api.user.update.useMutation({
    onSuccess: async () => {
      await utils.user.byId.invalidate()
      toast.success('User information updated')
    },
    onError: err => toast.error(JSON.stringify(err.data))
  })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(data => updateUser.mutate(data))}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Your name' {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='job'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job title</FormLabel>
              <FormControl>
                <Input placeholder='Your job' {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input placeholder='Your email' {...field} />
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='company'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input id='company-input' placeholder='Your company' {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='product'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <FormControl>
                <Input id='product-input' placeholder='Your product' {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company description</FormLabel>
              <FormControl>
                <Textarea
                  id='description-input'
                  placeholder='Your company description'
                  {...field}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='sellingPoint'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selling point</FormLabel>
              <FormControl>
                <Textarea
                  id='selling-point-input'
                  placeholder='Your product selling point'
                  {...field}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className={cn(
            'mt-2 transition-all duration-500',
            user && isMatch(user, form.getValues()) && 'h-0 p-0 text-[0]'
          )}
          type='submit'>
          Save information
          <p
            className={cn(
              'ml-2 size-0 animate-spin rounded-full border-background border-t-transparent transition-all duration-500',
              updateUser.isPending && 'size-5 border'
            )}
          />
        </Button>
      </form>
    </Form>
  )
}
