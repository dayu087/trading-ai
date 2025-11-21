import { useRef } from 'react'
import { styled } from 'styled-components'
import { motion, useInView } from 'framer-motion'

export default function AnimatedSection({
  children,
  id,
  borderRadius = '0px',
  padding = '0px',
}: {
  children: React.ReactNode
  id?: string
  borderRadius?: string
  padding?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <AnimatedBox
      id={id}
      ref={ref}
      $padding={padding}
      style={{ borderRadius: borderRadius }}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </AnimatedBox>
  )
}

const AnimatedBox = styled(motion.div)<{ $padding: string }>`
  background: #fff;
  padding: ${({ $padding }) => $padding};
  @media (max-width: 768px) {
    padding: 0 1rem !important;
  }
`
