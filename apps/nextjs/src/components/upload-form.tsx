'use client'

import { useSession } from 'next-auth/react'
import { z } from 'zod'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@a/ui/form'

import { FileUploader } from '~/components/upload'
import { useForm } from '~/hook/use-form'

export default function UploadForm({ action }: { action: (data: FormData) => void }) {
  const user = useSession().data?.user.email ?? ''
  const form = useForm({
    schema: z.object({
      files: z.array(z.instanceof(File)).min(1),
      user: z.string()
    }),
    defaultValues: { files: [], user }
  })
  return (
    <Form {...form}>
      <form
        id='upload'
        onSubmit={form.handleSubmit(data => {
          const formData = new FormData()
          data.files.forEach(f => formData.append('files', f))
          formData.append('user', user)
          action(formData)
        })}>
        <FormField
          control={form.control}
          name='files'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileUploader
                  value={field.value}
                  onValueChange={field.onChange}
                  maxFiles={1}
                  maxSize={4.5 * 1024 * 1024}
                  accept={{
                    'image/*': [],
                    'application/pdf': [],
                    'application/msword': [],
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
                    'application/vnd.ms-excel': [],
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
                    'application/vnd.ms-powerpoint': [],
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation': []
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
