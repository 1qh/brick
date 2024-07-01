import { motion } from 'framer-motion'

const Hover = ({ className }: { className?: string }) =>
  motion.div && (
    <motion.div
      className={className}
      layoutId='hoverBackground'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.15 } }}
      exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
    />
  )

export default Hover
