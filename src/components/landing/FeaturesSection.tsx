import { motion } from 'framer-motion'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'
import AnimatedSection from './AnimatedSection'
import { CryptoFeatureCard } from '../CryptoFeatureCard'

import homeArrow from '@/assets/images/home_icon_arrow.png'
import cryptoIcon from '@/assets/images/home_whats_icon1.png'
import cryptoIcon2 from '@/assets/images/home_whats_icon2.png'
import cryptoIcon3 from '@/assets/images/home_whats_icon3.png'

export default function FeaturesSection() {
  const { t } = useTranslation()

  return (
    <AnimatedSection id="features">
      <Container>
        <HeaderWrapper initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Tag whileHover={{ scale: 1.05 }}>
            <img src={homeArrow} alt="" />
            <span>{t('coreFeatures')}</span>
          </Tag>
          <Title>{t('whyChooseNofx')}</Title>
          <Subtitle>{t('openCommunityDriven')}</Subtitle>
        </HeaderWrapper>

        <CardGrid>
          <CryptoFeatureCard
            icon={<CryptoImage src={cryptoIcon} />}
            title={t('openSourceSelfHosted')}
            description={t('openSourceDesc')}
            features={[t('openSourceFeatures1'), t('openSourceFeatures2'), t('openSourceFeatures3'), t('openSourceFeatures4')]}
            delay={0}
          />

          <CryptoFeatureCard
            icon={<CryptoImage src={cryptoIcon2} />}
            title={t('multiAgentCompetition')}
            description={t('multiAgentDesc')}
            features={[t('multiAgentFeatures1'), t('multiAgentFeatures2'), t('multiAgentFeatures3'), t('multiAgentFeatures4')]}
            delay={0.1}
          />

          <CryptoFeatureCard
            icon={<CryptoImage src={cryptoIcon3} />}
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

const Container = styled.div`
  max-width: 76.5rem;
  margin: 0 auto;
`

const HeaderWrapper = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    margin-bottom: 2.5rem;
  }
`

const Tag = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.325rem 1rem;
  border-radius: 9999px;
  margin-bottom: 0.5rem;
  background: #f3f3f3;

  span {
    font-size: 0.875rem;
    font-weight: bold;
    color: var(--brand-black);
  }

  img {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    padding: 0.25rem 0.8rem;

    span {
      font-size: 0.75rem;
    }

    img {
      width: 20px;
      height: 20px;
    }
  }
`

const CryptoImage = styled.img`
  width: 60px;
  height: 60px;

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
`

const Title = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--brand-black);

  @media (max-width: 768px) {
    font-size: 2.1rem;
    margin-bottom: 6px;
  }
`

const Subtitle = styled.p`
  font-size: 1rem;
  color: var(--brand-black);

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0 1rem;
  }
`

const CardGrid = styled.div`
  display: flex;
  gap: 2rem;
  max-width: 80rem;
  margin: 0 auto;

  @media (max-width: 1024px) {
    flex-wrap: wrap;
    justify-content: center;
  }

  @media (max-width: 768px) {
    gap: 1.25rem;
  }
`
