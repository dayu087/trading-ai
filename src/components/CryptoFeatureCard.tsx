import * as React from 'react'
import { motion } from 'framer-motion'
import styled, { keyframes } from 'styled-components'
import { Check } from 'lucide-react'

interface CryptoFeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
  className?: string
  delay?: number
}

export const CryptoFeatureCard = React.forwardRef<HTMLDivElement, CryptoFeatureCardProps>(({ icon, title, description, features, className, delay = 0 }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <CardWrapper
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <CardContainer $isHovered={isHovered}>
        {/* Glow border shimmer */}
        <GlowOverlay animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.3 }}>
          <GlowShimmer />
        </GlowOverlay>

        {/* patterned bg */}
        <BackgroundPattern />

        {/* Main content */}
        <Content>
          <IconBox
            $isHovered={isHovered}
            animate={{
              scale: isHovered ? 1.1 : 1,
              boxShadow: isHovered ? '0 0 20px rgba(240,185,11,0.4)' : '0 0 0 rgba(240,185,11,0)',
            }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ color: 'var(--brand-yellow)' }}>{icon}</div>
          </IconBox>

          <Title>{title}</Title>
          <Description>{description}</Description>

          <FeatureList>
            {features.map((feature, index) => (
              <FeatureItem key={index} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: delay + index * 0.1 }}>
                <CheckCircle>
                  <Check className="w-3 h-3" style={{ color: 'var(--brand-yellow)' }} />
                </CheckCircle>
                <FeatureText>{feature}</FeatureText>
              </FeatureItem>
            ))}
          </FeatureList>
        </Content>
      </CardContainer>
    </CardWrapper>
  )
})

CryptoFeatureCard.displayName = 'CryptoFeatureCard'

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`

const CardWrapper = styled(motion.div)`
  flex: 1 1 30%;
  position: relative;
`

const CardContainer = styled.div<{ $isHovered: boolean }>`
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #191a23;
  transition:
    border 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 4px 4px 0px 0px #191a23;

  ${({ $isHovered }) =>
    $isHovered &&
    `
    box-shadow: 4px 4px 0px 0px #191A23;
  `}
`

const GlowOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  pointer-events: none;
`

const GlowShimmer = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, transparent, #cafe36, transparent);
  animation: ${shimmer} 2s infinite;
`

const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.05;
  background-image: radial-gradient(circle at 2px 2px, #cafe36 1px, transparent 0);
  background-size: 32px 32px;
`

const Content = styled.div`
  position: relative;
  z-index: 10;
  padding: 32px;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const IconBox = styled(motion.div)<{ $isHovered: boolean }>`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d4751;
  border: 1px solid rgba(240, 185, 11, 0.3);
  box-shadow: ${({ $isHovered }) => ($isHovered ? '0 0 20px rgba(240,185,11,0.4)' : '0 0 0 rgba(240,185,11,0)')};

  svg {
    color: #cafe36;
  }
`

const Title = styled.h3`
  padding: 8px 12px;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 12px;
  color: var(--brand-black);
  border-radius: 8px;
  background: #cafe36;
`

const Description = styled.p`
  margin-bottom: 24px;
  font-size: 1rem;
  color: var(--brand-black);
  line-height: 1.5;
`

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
`

const CheckCircle = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: rgba(240, 185, 11, 0.2); */
  background: #000;
  flex-shrink: 0;
`

const FeatureText = styled.span`
  font-size: 0.875rem;
  color: var(--brand-black);
`
