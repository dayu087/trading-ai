import { motion } from 'framer-motion'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'

import AnimatedSection from './AnimatedSection'
import homeDashboardIcon1 from '@/assets/images/home_img_dashboard1.png'
import homeDashboardIcon2 from '@/assets/images/home_img_dashboard2.png'

export default function CommunitySection() {
  const { t } = useTranslation()
  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  }

  return (
    <AnimatedSection>
      <PreviewContainer>
        <TitleBlock initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionTitle>{t('dashboardPreview')}</SectionTitle>
          <SectionSubTitle>{t('dashboardPreviewDescription')}</SectionSubTitle>
        </TitleBlock>

        <PreviewImageBox initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <PreviewImage src={homeDashboardIcon1} alt="Dashboard Preview" />
          <PreviewImage src={homeDashboardIcon2} alt="Dashboard Preview" />
        </PreviewImageBox>
      </PreviewContainer>
    </AnimatedSection>
  )
}

const PreviewContainer = styled.div`
  max-width: 76.5rem;
  margin: 0 auto;
`

const TitleBlock = styled(motion.div)`
  text-align: center;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 28px;
  }
`

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  color: var(--brand-black);

  @media (max-width: 768px) {
    margin-bottom: 0.25rem;
    font-size: 1.5rem;
  }
`

const SectionSubTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 3rem;
  color: var(--brand-black);

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    font-size: 0.75rem;
  }
`

const PreviewImageBox = styled(motion.div)`
  display: flex;
  width: 100%;
  gap: 24px;
  @media (max-width: 768px) {
    flex-direction: column;
    max-height: fit-content;
    gap: 12px;
  }
`

const PreviewImage = styled.img`
  flex: 1 1 50%;
  max-width: 600px;
  height: auto;
  border-radius: 16px;
  @media (max-width: 768px) {
    flex: 1 1 100%;
  }
`
