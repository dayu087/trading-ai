// Styled-components version of AboutSection
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import AnimatedSection from './AnimatedSection'
import Typewriter from '../Typewriter'

import homeArrow from '@/assets/images/home_icon_arrow.png'
import lineIcon from '@/assets/images/home_icon_line.png'
import WhatsIcon from '@/assets/images/home_img_whats.png'

export default function AboutSection() {
  const { t } = useTranslation()

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
                t('startupMessages1'),
                t('startupMessages2'),
                t('startupMessages3'),
              ]}
              typingSpeed={70}
              lineDelay={900}
              style={{
                color: '#0D4751',
                textShadow: '0 0 8px rgba(0,255,136,0.4)',
              }}
            />

            <LeftWhatsIcon src={WhatsIcon} />
          </CodeBox>

          <AboutRight initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <RightLine src={lineIcon} />

            <Tag whileHover={{ scale: 1.05 }}>
              <img src={homeArrow} alt="" />
              <span>{t('aboutNofx')}</span>
            </Tag>

            <Title>{t('whatIsNofx')}</Title>

            <Paragraph>
              {t('nofxNotAnotherBot')} {t('nofxDescription1')} {t('nofxDescription2')}
            </Paragraph>

            <Paragraph>
              {t('nofxDescription3')} {t('nofxDescription4')} {t('nofxDescription5')}
            </Paragraph>

            <InfoRow whileHover={{ x: 5 }}>
              <IconCircle src={homeArrow} />
              <div>
                <h3>{t('youFullControl')}</h3>
                <p>{t('fullControlDesc')}</p>
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

const RightLine = styled.img`
  position: absolute;
  top: 24px;
  right: 26px;
  width: 76px;
`

const LeftWhatsIcon = styled.img`
  position: absolute;
  bottom: 0;
  left: 20px;
  max-width: 80%;
`

const Grid = styled.div`
  display: flex;
  gap: 3rem;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`

const AboutRight = styled(motion.div)`
  position: relative;
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

  img {
    width: 24px;
    height: 24px;
  }
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

const IconCircle = styled.img`
  width: 2.5rem;
  height: 2.5rem;
`

const CodeBox = styled.div`
  position: relative;
  flex: 1 1 50%;
  padding: 7rem 2rem 2rem;
  border-radius: 1rem;
`
