import Image from 'next/image'

import { auth } from '@a/auth'

import { api } from '~/trpc/server'
import Gen from './gen'
import Update from './update'

const Page = async () => {
  const { id, image } = (await auth())?.user ?? {}
  return (
    <div className='mx-5 mt-5'>
      <div className='flex items-center justify-between'>
        {image && (
          <Image
            className='mb-2 rounded-full transition-all duration-500 hover:shadow-xl hover:drop-shadow-xl'
            src={image}
            width={96}
            height={96}
            alt=''
          />
        )}
        <Gen />
      </div>
      {id && <Update id={id} user={api.user.byId(id)} />}
    </div>
  )
}
export default Page
