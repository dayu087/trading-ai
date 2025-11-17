import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function AnimatedSection({
  children,
  id,
  backgroundColor = 'var(--brand-black)',
  borderRadius = '0px',
}: {
  children: React.ReactNode
  id?: string
  backgroundColor?: string
  borderRadius?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.section
      id={id}
      ref={ref}
      className="py-20 px-4"
      style={{ background: backgroundColor, borderRadius: borderRadius }}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.section>
  )
}
