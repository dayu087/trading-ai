import styled from 'styled-components'
import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import { t, Language } from '../../i18n/translations'

/* ------------------------------ StepCard 组件 ------------------------------ */

function StepCard({ number, title, description, delay }: any) {
  return (
    <StepWrapper
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ x: 10 }}
    >
      <NumberCircle
        whileHover={{ scale: 1.2, rotate: 360 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        0{number}
      </NumberCircle>

      <StepContent>
        <StepTitle>{title}</StepTitle>
        <StepDescription>{description}</StepDescription>
      </StepContent>
    </StepWrapper>
  )
}

/* ------------------------------ Main Component ------------------------------ */

interface HowItWorksSectionProps {
  language: Language
}

export default function HowItWorksSection({ language }: HowItWorksSectionProps) {
  return (
    <AnimatedSection id="how-it-works" backgroundColor="rgba(25,26,35,0.04)" borderRadius="48px">
      <Container>
        <TitleBlock initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionTitle>{t('howToStart', language)}</SectionTitle>
          <SectionSubtitle>{t('fourSimpleSteps', language)}</SectionSubtitle>
        </TitleBlock>

        <StepsWrapper>
          {[
            {
              number: 1,
              title: t('step1Title', language),
              description: t('step1Desc', language),
            },
            {
              number: 2,
              title: t('step2Title', language),
              description: t('step2Desc', language),
            },
            {
              number: 3,
              title: t('step3Title', language),
              description: t('step3Desc', language),
            },
            {
              number: 4,
              title: t('step4Title', language),
              description: t('step4Desc', language),
            },
          ].map((step, index) => (
            <StepCard key={step.number} {...step} delay={index * 0.1} />
          ))}
        </StepsWrapper>

        {/* Warning Box */}
        <WarningBox
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
        >
          <WarningIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
          </WarningIcon>

          <div>
            <WarningTitle>{t('importantRiskWarning', language)}</WarningTitle>
            <WarningText>{t('riskWarningText', language)}</WarningText>
          </div>
        </WarningBox>
      </Container>
    </AnimatedSection>
  )
}

/* ------------------------------ Styled Components ------------------------------ */
const Container = styled.div`
  max-width: 76.5rem;
  margin: 0 auto;
  color: var(--brand-black);
`

const TitleBlock = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`

const SectionSubtitle = styled.p`
  font-size: 1rem;
`

const StepsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const StepWrapper = styled(motion.div)`
  display: flex;
  padding: 1rem;
  gap: 1rem;
  align-items: center;
  border-radius: 16px;
  border: 1px solid #191a23;
`

const NumberCircle = styled(motion.div)`
  flex-shrink: 0;
  /* width: 3.5rem;
  height: 3.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center; */
  font-weight: bold;
  font-size: 3rem;
  /* background: var(--binance-yellow); */
`

const StepContent = styled.div``

const StepTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--brand-black);
`

const StepDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: var(--brand-black);
`

/* ---- Warning Box ---- */
const WarningBox = styled(motion.div)`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(246, 70, 93, 0.1);
  border: 1px solid rgba(246, 70, 93, 0.3);
  box-shadow: 4px 4px 0px 0px #191a23;
  border: 1px solid #000000;
`

const WarningIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
  background: rgba(246, 70, 93, 0.2);
  color: #f6465d;
`

const WarningTitle = styled.div`
  font-size: 0.875rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: #f6465d;
`

const WarningText = styled.p`
  font-size: 0.875rem;
`
