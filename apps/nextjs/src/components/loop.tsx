import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface LoopProps {
  children?: React.ReactNode
  texts: string[]
  className?: string
}

export default function Loop({ children, texts, className }: LoopProps) {
  const [i, setI] = useState(0)

  useEffect(() => {
    setInterval(() => {
      setI(p => (p < texts.length - 1 ? p + 1 : 0))
    }, 1500)
  }, [])

  return (
    motion.p && (
      <AnimatePresence mode='wait'>
        <motion.p
          key={i}
          className={className}
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -15, opacity: 0 }}
          transition={{ duration: 0.3 }}>
          {texts[i]}
          {children}
        </motion.p>
      </AnimatePresence>
    )
  )
}
