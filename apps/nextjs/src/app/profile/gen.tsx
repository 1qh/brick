'use client'

import { useActionState } from 'react'

import { cn } from '@a/ui'
import { Button } from '@a/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@a/ui/popover'
import { ScrollArea } from '@a/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@a/ui/tabs'

import type { ProfileSuggest } from '~/types'
import { file2profile, url2profile } from '~/actions'
import FillInput from '~/components/fill-input'
import Upload from '~/components/upload-form'
import UrlForm from '~/components/url-form'

const SuggestFill = ({ suggest }: { suggest: ProfileSuggest }) => (
  <>
    {suggest.company.length ? <p className='m-2 text-lg font-semibold'>Company</p> : null}
    <FillInput list={suggest.company} inputId='company-input' />
    {suggest.product.length ? <p className='m-2 text-lg font-semibold'>Product</p> : null}
    <FillInput list={suggest.product} inputId='product-input' />
    {suggest.description.length ? <p className='m-2 text-lg font-semibold'>Description</p> : null}
    <FillInput list={suggest.description} inputId='description-input' />
    {suggest.sellingPoint.length ? (
      <p className='m-2 text-lg font-semibold'>Selling point</p>
    ) : null}
    <FillInput list={suggest.sellingPoint} inputId='selling-point-input' />
  </>
)

export default function Gen() {
  const [fromWebsite, fromWebsiteAction, url2profilePending] = useActionState(
    url2profile as (state: ProfileSuggest, payload: unknown) => Promise<ProfileSuggest>,
    { company: [], product: [], description: [], sellingPoint: [] } as ProfileSuggest
  )
  const [fromFile, fromFileAction, file2profilePending] = useActionState(
    file2profile as (state: ProfileSuggest, payload: unknown) => Promise<ProfileSuggest>,
    { company: [], product: [], description: [], sellingPoint: [] } as ProfileSuggest
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline'>Generate Profile with AI ✨</Button>
      </PopoverTrigger>
      <PopoverContent className='m-1 w-[400px] rounded-xl p-3 drop-shadow-lg transition-all duration-300 hover:shadow-xl hover:drop-shadow-2xl'>
        <Tabs defaultValue='files'>
          <TabsList className='mb-1 w-full'>
            <TabsTrigger className='w-full' value='files'>
              Files
            </TabsTrigger>
            <TabsTrigger className='notranslate w-full' value='website'>
              Website
            </TabsTrigger>
          </TabsList>
          <TabsContent value='files'>
            <Upload action={fromFileAction} />
            <Button
              type='submit'
              form='upload'
              className='mt-3 w-full'
              disabled={file2profilePending}>
              Generate
              <p
                className={cn(
                  'ml-2 size-0 animate-spin rounded-full border-background border-t-transparent transition-all duration-500',
                  file2profilePending && 'size-5 border'
                )}
              />
            </Button>
            <ScrollArea className='mt-2 flex max-h-[calc(100vh-31rem)] flex-col'>
              <SuggestFill suggest={fromFile} />
            </ScrollArea>
          </TabsContent>
          <TabsContent value='website'>
            <UrlForm action={fromWebsiteAction} />
            <Button
              type='submit'
              form='url-form'
              className='mt-3.5 w-full'
              disabled={url2profilePending}>
              Generate
              <p
                className={cn(
                  'ml-2 size-0 animate-spin rounded-full border-background border-t-transparent transition-all duration-500',
                  url2profilePending && 'size-5 border'
                )}
              />
            </Button>
            <ScrollArea className='mt-2 flex max-h-[calc(100vh-17rem)] flex-col'>
              <SuggestFill suggest={fromWebsite} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
