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
          <SectionAiTitle>{t('aIReasoning')}</SectionAiTitle>
        </TitleBlock>

        <PreviewImageBox initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <PreviewImageItem>
            <PreviewImage src={homeDashboardIcon1} alt="Dashboard Preview" />
          </PreviewImageItem>
          <PreviewImageItem>
            <PreviewImage src={homeDashboardIcon2} alt="Dashboard Preview" />
          </PreviewImageItem>
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
  margin-bottom: 48px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
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
  margin-bottom: 1rem;
  color: var(--brand-black);

  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
  }
`

const SectionAiTitle = styled.h3`
  width: fit-content;
  margin: 0 auto;
  padding: 8px 24px;
  font-size: 1.5rem;
  border-radius: 48px;
  border: 1px solid #191a23;
  @media (max-width: 768px) {
    padding: 4px 12px;
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

const PreviewImageItem = styled.div`
  flex: 1 1 50%;
  height: auto;
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 24px;
  border: 1px solid #000000;
  overflow: hidden;
  @media (max-width: 768px) {
    flex: 1 1 100%;
  }
`

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
`
