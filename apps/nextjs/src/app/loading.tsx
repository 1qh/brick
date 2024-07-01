'use client'

import Image from 'next/image'

import Loop from '~/components/loop'

export default function Page() {
  const texts = [
    '🌐 Getting ready',
    '🚀 Almost there',
    '🕒 Just a moment',
    '🛑 Hold on',
    '🔄 Loading',
    '⏳ Just a sec'
  ]
  const size = 300
  return (
    <div className='flex h-screen'>
      <div className='m-auto'>
        <Image src='/globe.gif' alt='' width={size} height={size} unoptimized />
        <Loop texts={texts} className='flex select-none justify-center gap-1.5 text-3xl'>
          <p className='animate-bounce rounded-full [animation-delay:-0.3s]'>.</p>
          <p className='animate-bounce rounded-full [animation-delay:-0.15s]'>.</p>
          <p className='animate-bounce rounded-full'>.</p>
        </Loop>
      </div>
    </div>
  )
}
