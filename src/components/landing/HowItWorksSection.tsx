import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import alarmIcon from '@/assets/images/dashboard_icon_alarm.png'

function StepCard({ title, description, delay, index, color }: any) {
  return (
    <StepWrapperBox initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay }} whileHover={{ x: 10 }}>
      <StepWrapper $index={index}>
        <NumberCircle whileHover={{ scale: 1.2, rotate: 360 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
          0{index + 1}
        </NumberCircle>

        <StepContent>
          <StepTitle>{title}</StepTitle>
          <StepDescription>{description}</StepDescription>
        </StepContent>
      </StepWrapper>
      <StepIcon $color={color} $index={index}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="80" height="80" transform="matrix(0 1 -1 0 80 0)" fill="white" />
          <rect x="64.1406" y="44.2842" width="33.3333" height="6.66667" transform="rotate(135 64.1406 44.2842)" fill="currentColor" />
          <rect x="64.1406" y="20.7141" width="33.3333" height="6.66667" transform="rotate(135 64.1406 20.7141)" fill="currentColor" />
          <rect x="21.7144" y="39.5703" width="33.3333" height="6.66667" transform="rotate(45 21.7144 39.5703)" fill="currentColor" />
          <rect x="21.7144" y="16" width="23.3333" height="6.66667" transform="rotate(45 21.7144 16)" fill="currentColor" />
        </svg>
      </StepIcon>
    </StepWrapperBox>
  )
}

/* ------------------------------ Main Component ------------------------------ */

export default function HowItWorksSection() {
  const { t } = useTranslation()
  const stepDataList = [
    { color: '#FF8F00', title: t('step1Title'), description: t('step1Desc') },
    { color: '#FF5A94', title: t('step2Title'), description: t('step2Desc') },
    { color: '#5D75FF', title: t('step3Title'), description: t('step3Desc') },
    { color: '#55D3FF', title: t('step4Title'), description: t('step4Desc') },
  ]

  return (
    <AnimatedSection id="how-it-works" borderRadius="48px">
      <Container>
        <TitleBlock initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionTitle>{t('howItWorks')}</SectionTitle>
        </TitleBlock>

        <StepsWrapper>
          {stepDataList.map((step, index) => (
            <StepCard key={index} index={index} {...step} delay={index * 0.1} />
          ))}
        </StepsWrapper>

        {/* Warning Box */}
        <WarningBox initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} whileHover={{ scale: 1.02 }}>
          <WarningIcon src={alarmIcon} alt="" />
          <div>
            <WarningTitle>{t('importantRiskWarning')}</WarningTitle>
            <WarningText>{t('riskWarningText')}</WarningText>
          </div>
        </WarningBox>
      </Container>
    </AnimatedSection>
  )
}

const Container = styled.div`
  max-width: 76.5rem;
  padding: 88px 0;
  margin: 0 auto;
  color: var(--brand-black);

  @media (max-width: 768px) {
    padding: 0;
  }
`

const TitleBlock = styled(motion.div)`
  text-align: center;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  color: var(--brand-black);

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

const SectionSubtitle = styled.p`
  font-size: 1rem;
  color: var(--brand-black);

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`

/* Steps */
const StepsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    gap: 1rem;
  }
`

const StepWrapperBox = styled(motion.div)`
  display: flex;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const StepWrapper = styled.div<{ $index: number }>`
  flex: 1;
  display: flex;
  padding: 1rem;
  margin: 0 -1px -1px 0;
  gap: 1rem;
  align-items: center;
  border-radius: 16px;
  border: 1px solid #191a23;
  box-shadow: ${({ $index }) => ($index == 3 ? '0px 4px 0px 0px #191a23' : '')};

  @media (max-width: 768px) {
    gap: 0rem;
    flex-direction: column;
    text-align: center;
    padding: 1rem;
    box-shadow: 4px 4px 0px 0px #191a23;
  }
`

const StepIcon = styled.div<{ $color: string; $index: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 19px 64px;
  margin-bottom: -1px;

  border-radius: 16px;
  border: 1px solid #191a23;
  box-shadow: ${({ $index }) => ($index == 3 ? '4px 4px 0px 0px #191a23' : '4px 0px 0px 0px #191a23')};

  svg {
    color: ${({ $color }) => $color};
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const NumberCircle = styled(motion.div)`
  flex-shrink: 0;
  font-size: 3rem;
  font-weight: 400;
  color: var(--brand-black);

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

const StepContent = styled.div``

const StepTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--brand-black);

  @media (max-width: 768px) {
    margin-bottom: 0;
    font-size: 1rem;
  }
`

const StepDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: var(--brand-black);

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`

/* Warning Box */
const WarningBox = styled(motion.div)`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: #cafe36;
  border: 1px solid #000;
  box-shadow: 4px 4px 0px #191a23;

  @media (max-width: 768px) {
    margin-top: 1rem;
    padding: 1rem;
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`

const WarningIcon = styled.img`
  width: 2.75rem;
  height: 2.75rem;
  background-color: #fff;
  border-radius: 8px;

  @media (max-width: 768px) {
    width: 2.2rem;
    height: 2.2rem;
  }
`

const WarningTitle = styled.div`
  font-size: 0.875rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: var(--brand-black);

  @media (max-width: 768px) {
    margin-bottom: 0;
    font-size: 0.75rem;
  }
`

const WarningText = styled.p`
  font-size: 0.875rem;
  color: var(--brand-black);

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`
