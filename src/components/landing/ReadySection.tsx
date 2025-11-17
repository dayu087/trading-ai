import { motion } from 'framer-motion'
import styled from 'styled-components'
import AnimatedSection from './AnimatedSection'
import { ArrowRight } from 'lucide-react'
import { t, Language } from '../../i18n/translations'

interface ReadySectionProps {
  language: Language
  setShowLoginModal: (v: boolean) => void
}

export default function ReadySection({ language, setShowLoginModal }: ReadySectionProps) {
  return (
    <AnimatedSection backgroundColor="#ffffff">
      <Container>
        <Title initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {t('readyToDefine', language)}
        </Title>

        <Subtitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {t('startWithCrypto', language)}
        </Subtitle>

        <ButtonRow>
          <PrimaryButton
            onClick={() => setShowLoginModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('getStartedNow', language)}
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </PrimaryButton>

          <SecondaryButton
            href="https://github.com/tinkle-community/nofx/tree/dev"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              scale: 1.05,
              backgroundColor: 'rgba(240, 185, 11, 0.1)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            {t('viewSourceCode', language)}
          </SecondaryButton>
        </ButtonRow>
      </Container>
    </AnimatedSection>
  )
}

const Container = styled.div`
  max-width: 64rem; /* max-w-4xl */
  margin: 0 auto;
  text-align: center;
`

const Title = styled(motion.h2)`
  font-size: 3rem; /* text-5xl */
  font-weight: bold;
  margin-bottom: 1rem;
`

const Subtitle = styled(motion.p)`
  font-size: 1rem; /* text-xl */
  margin-bottom: 2.5rem;
`

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
`

const PrimaryButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2.5rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 1rem;
  background: var(--brand-green);
  box-shadow: 4px 4px 0px 0px #191a23;
  border: 1px solid #000000;
  cursor: pointer;
`

const SecondaryButton = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2.5rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 1rem;
  box-shadow: 4px 4px 0px 0px #191a23;
  border: 1px solid #000000;
  cursor: pointer;
  text-decoration: none;
`
