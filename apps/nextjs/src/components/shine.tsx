import { motion } from 'framer-motion'

import { cn } from '@a/ui'

interface ShineProps {
  repeatDelay: number
  children: React.ReactNode
  className?: string
}

const Shine = ({ repeatDelay, children, className }: ShineProps) =>
  motion.div && (
    <motion.div
      initial={
        { '--x': '100%', scale: 1 } as {
          '--x': string
          scale: number
        }
      }
      animate={
        { '--x': '-100%' } as {
          '--x': string
          scale: number
        }
      }
      transition={{
        repeat: Infinity,
        repeatDelay,
        type: 'spring',
        stiffness: 10
      }}
      className={cn('radial-gradient linear-mask', className)}>
      {children}
    </motion.div>
  )

export default Shine
