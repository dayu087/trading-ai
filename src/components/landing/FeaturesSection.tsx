import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import AnimatedSection from './AnimatedSection'
import { CryptoFeatureCard } from '../CryptoFeatureCard'
import { Code, Cpu, Lock, Rocket } from 'lucide-react'
import styled from 'styled-components'

export default function FeaturesSection() {
  const { t } = useTranslation()

  return (
    <AnimatedSection id="features" backgroundColor="#ffffff">
      <Container>
        <HeaderWrapper initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Tag whileHover={{ scale: 1.05 }}>
            <Rocket className="icon" />
            <span>{t('coreFeatures')}</span>
          </Tag>

          <Title>{t('whyChooseNofx')}</Title>
          <Subtitle>{t('openCommunityDriven')}</Subtitle>
        </HeaderWrapper>

        <CardGrid>
          <CryptoFeatureCard
            icon={<Code className="w-8 h-8" />}
            title={t('openSourceSelfHosted')}
            description={t('openSourceDesc')}
            features={[t('openSourceFeatures1'), t('openSourceFeatures2'), t('openSourceFeatures3'), t('openSourceFeatures4')]}
            delay={0}
          />

          <CryptoFeatureCard
            icon={<Cpu className="w-8 h-8" />}
            title={t('multiAgentCompetition')}
            description={t('multiAgentDesc')}
            features={[t('multiAgentFeatures1'), t('multiAgentFeatures2'), t('multiAgentFeatures3'), t('multiAgentFeatures4')]}
            delay={0.1}
          />

          <CryptoFeatureCard
            icon={<Lock className="w-8 h-8" />}
            title={t('secureReliableTrading')}
            description={t('secureDesc')}
            features={[t('secureFeatures1'), t('secureFeatures2'), t('secureFeatures3'), t('secureFeatures4')]}
            delay={0.2}
          />
        </CardGrid>
      </Container>
    </AnimatedSection>
  )
}

/* ---------------- Styled Components ---------------- */
const Container = styled.div`
  max-width: 76.5rem;
  margin: 0 auto;
`

const HeaderWrapper = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`

const Tag = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.325rem 1rem;
  border-radius: 9999px;
  margin-bottom: 0%.5;
  background: #f3f3f3;

  span {
    font-size: 0.875rem;
    font-weight: bold;
    color: var(--brand-black);
  }

  .icon {
    width: 1rem;
    height: 1rem;
  }
`

const Title = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--brand-black);
`

const Subtitle = styled.p`
  font-size: 1rem;
  color: var(--brand-black);
`

const CardGrid = styled.div`
  display: flex;
  gap: 2rem;
  max-width: 80rem;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`
