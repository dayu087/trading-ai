import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'

import alarmIcon from '@/assets/images/dashboard_icon_alarm.png'

/* ------------------------------ StepCard 组件 ------------------------------ */

function StepCard({ number, title, description, delay }: any) {
  return (
    <StepWrapperBox initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay }} whileHover={{ x: 10 }}>
      <StepWrapper>
        <NumberCircle whileHover={{ scale: 1.2, rotate: 360 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
          0{number}
        </NumberCircle>

        <StepContent>
          <StepTitle>{title}</StepTitle>
          <StepDescription>{description}</StepDescription>
        </StepContent>
      </StepWrapper>
      {/* <StepIcon>
        <img src="" alt="" />
      </StepIcon> */}
    </StepWrapperBox>
  )
}

/* ------------------------------ Main Component ------------------------------ */

export default function HowItWorksSection() {
  const { t } = useTranslation()

  const stepDataList = [
    {
      number: 1,
      title: t('step1Title'),
      description: t('step1Desc'),
    },
    {
      number: 2,
      title: t('step2Title'),
      description: t('step2Desc'),
    },
    {
      number: 3,
      title: t('step3Title'),
      description: t('step3Desc'),
    },
    {
      number: 4,
      title: t('step4Title'),
      description: t('step4Desc'),
    },
  ]

  return (
    <AnimatedSection id="how-it-works" backgroundColor="rgba(25,26,35,0.04)" borderRadius="48px">
      <Container>
        <TitleBlock initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionTitle>{t('howToStart')}</SectionTitle>
          <SectionSubtitle>{t('fourSimpleSteps')}</SectionSubtitle>
        </TitleBlock>

        <StepsWrapper>
          {stepDataList.map((step, index) => (
            <StepCard key={step.number} {...step} delay={index * 0.1} />
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

/* ------------------------------ Styled Components ------------------------------ */
const Container = styled.div`
  max-width: 76.5rem;
  padding: 88px 0;
  margin: 0 auto;
  color: var(--brand-black);
`

const TitleBlock = styled(motion.div)`
  text-align: center;
  margin-bottom: 40px;
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
  /* gap: 1rem; */
`

const StepWrapperBox = styled(motion.div)`
  display: flex;
`

const StepWrapper = styled.div`
  flex: 1;
  display: flex;
  padding: 1rem;
  gap: 1rem;
  margin-top: -1px;
  align-items: center;
  border-radius: 16px;
  border: 1px solid #191a23;
`

const StepIcon = styled.div`
  padding: 19px 64px;
  border-radius: 16px;
  border: 1px solid #191a23;
  img {
    width: 5rem;
    height: 5rem;
  }
`

const NumberCircle = styled(motion.div)`
  flex-shrink: 0;
  /* width: 3.5rem;
  height: 3.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center; */
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
  background: #cafe36;
  border: 1px solid rgba(246, 70, 93, 0.3);
  box-shadow: 4px 4px 0px 0px #191a23;
  border: 1px solid #000000;
`

const WarningIcon = styled.img`
  width: 2.75rem;
  height: 2.75rem;
`

const WarningTitle = styled.div`
  font-size: 0.875rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`

const WarningText = styled.p`
  font-size: 0.875rem;
`
