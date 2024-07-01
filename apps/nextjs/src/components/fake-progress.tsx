import { useEffect, useState } from 'react'

import { Progress } from '@a/ui/progress'

export default function FakeProgress({ estimate }: { estimate: number }) {
  const [fakeProgress, setFakeProgress] = useState(0)

  useEffect(() => {
    setInterval(() => setFakeProgress(p => Math.min(99, p + (p < 80 ? 9 / estimate : 0.1))), 100)
  }, [estimate])

  return (
    <div className='mx-2 -mt-3 flex items-center'>
      <Progress value={fakeProgress} />
      <p className='ml-1 w-6 text-left text-sm'>{Math.round(fakeProgress) + '%'}</p>
    </div>
  )
}
