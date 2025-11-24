import { styled } from 'styled-components'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import AnimatedSection from './AnimatedSection'
import { ArrowRight } from 'lucide-react'

export default function ReadySection({ setShowLoginModal }: { setShowLoginModal: (value: boolean) => void }) {
  const { t } = useTranslation()

  return (
    <AnimatedSection>
      <Container>
        <Title initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {t('readyToDefine')}
        </Title>

        <Subtitle initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          {t('startWithCrypto')}
        </Subtitle>

        <ButtonRow>
          <PrimaryButton onClick={() => setShowLoginModal(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {t('getStartedNow')}
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </PrimaryButton>
          <LoginButton onClick={() => setShowLoginModal(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {t('connectExchange')}
          </LoginButton>
        </ButtonRow>
      </Container>
    </AnimatedSection>
  )
}

const Container = styled.div`
  max-width: 64rem; /* max-w-4xl */
  margin: 0 auto;
  text-align: center;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`

const Title = styled(motion.h2)`
  font-size: 3rem; /* text-5xl */
  font-weight: bold;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

const Subtitle = styled(motion.p)`
  font-size: 1rem;
  margin-bottom: 2.5rem;
  margin-top: 1rem 0 2.5rem 0;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    margin: 0.25rem 0 1rem 0;
  }
`

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`

const PrimaryButton = styled(motion.button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background: #191a23;
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 16px;
  border: 1px solid #ffffff;
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 0.75rem 0;
    font-size: 0.75rem;
  }
`

const LoginButton = styled(PrimaryButton)`
  color: var(--brand-black);
  background: #fff;
  border: 1px solid #000;
`
