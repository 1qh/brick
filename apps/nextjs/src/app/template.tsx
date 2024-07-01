'use client'

import { motion } from 'framer-motion'

const Template = ({ children }: { children: React.ReactNode }) =>
  motion.div && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.5 }}>
      {children}
    </motion.div>
  )

export default Template
