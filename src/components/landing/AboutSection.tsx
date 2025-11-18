// Styled-components version of AboutSection
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Shield, Target } from 'lucide-react'
import AnimatedSection from './AnimatedSection'
import Typewriter from '../Typewriter'
import { t, Language } from '../../i18n/translations'

interface AboutSectionProps {
  language: Language
}

export default function AboutSection({ language }: AboutSectionProps) {
  return (
    <AnimatedSection id="about" backgroundColor="#ffffff" padding="100px 0 98px 0 ">
      <Wrapper>
        <Grid>
          <CodeBox>
            <Typewriter
              lines={[
                '$ git clone https://github.com/tinkle-community/nofx.git',
                '$ cd nofx',
                '$ chmod +x start.sh',
                '$ ./start.sh start --build',
                t('startupMessages1', language),
                t('startupMessages2', language),
                t('startupMessages3', language),
              ]}
              typingSpeed={70}
              lineDelay={900}
              style={{
                color: '#0D4751',
                textShadow: '0 0 8px rgba(0,255,136,0.4)',
              }}
            />
          </CodeBox>

          <AboutRight
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Tag whileHover={{ scale: 1.05 }}>
              <Target className="w-4 h-4" style={{ color: 'var(--up_color)' }} />
              <span>{t('aboutNofx', language)}</span>
            </Tag>

            <Title>{t('whatIsNofx', language)}</Title>

            <Paragraph>
              {t('nofxNotAnotherBot', language)} {t('nofxDescription1', language)} {t('nofxDescription2', language)}
            </Paragraph>

            <Paragraph>
              {t('nofxDescription3', language)} {t('nofxDescription4', language)} {t('nofxDescription5', language)}
            </Paragraph>

            <InfoRow whileHover={{ x: 5 }}>
              <IconCircle>
                <Shield className="w-6 h-6" style={{ color: 'var(--up_color)' }} />
              </IconCircle>
              <div>
                <h3>{t('youFullControl', language)}</h3>
                <p>{t('fullControlDesc', language)}</p>
              </div>
            </InfoRow>
          </AboutRight>
        </Grid>
      </Wrapper>
    </AnimatedSection>
  )
}

const Wrapper = styled.div`
  max-width: 76.5rem;
  margin: 0 auto;
  border-radius: 24px;
  border: 2px solid #191a23;
  box-shadow: 4px 4px 0px 0px #191a23;
  background: #f3f3f3;
`

const Grid = styled.div`
  display: flex;
  gap: 3rem;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`

const AboutRight = styled(motion.div)`
  flex: 1 1 50%;
  padding: 24px;
  border-radius: 24px;
  background: #ffffff;
`

const Tag = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.325rem 1rem;
  border-radius: 9999px;
  background: #fff;
  font-size: 0.875rem;
  font-weight: bold;
  color: #191a23;
`

const Title = styled.h2`
  margin: 32px 0 16px 0;
  font-size: 3rem;
  font-weight: bold;
  color: var(--brand-black);
`

const Paragraph = styled.p`
  font-size: 1rem;
  line-height: 1.5rem;
  color: var(--brand-black);

  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`

const InfoRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  font-size: 0.875rem;

  h3 {
    font-weight: bold;
  }
`

const IconCircle = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
`

const CodeBox = styled.div`
  position: relative;
  flex: 1 1 50%;
  padding: 7rem 2rem 2rem;
  border-radius: 1rem;
`
