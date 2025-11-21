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
    <AnimatedSection id="about" padding="100px 1rem 98px">
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

  @media (max-width: 768px) {
    border-width: 1.5px;
    box-shadow: 3px 3px 0 0 #191a23;
    border-radius: 20px;
    padding: 1rem;
  }
`

const RightLine = styled.img`
  position: absolute;
  top: 24px;
  right: 26px;
  width: 76px;

  @media (max-width: 768px) {
    width: 50px;
    top: 12px;
    right: 12px;
  }
`

const LeftWhatsIcon = styled.img`
  position: absolute;
  bottom: 0;
  left: 20px;
  max-width: 80%;

  @media (max-width: 768px) {
    left: 10px;
    max-width: 60%;
    bottom: -6px; /* 避免压到内容 */
  }
`

const Grid = styled.div`
  display: flex;
  gap: 3rem;

  @media (max-width: 1024px) {
    flex-direction: column;
  }

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`

const AboutRight = styled(motion.div)`
  position: relative;
  flex: 1 1 50%;
  padding: 24px;
  border-radius: 24px;
  background: #ffffff;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 18px;
  }
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

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.25rem 0.8rem;

    img {
      width: 20px;
      height: 20px;
    }
  }
`

const Title = styled.h2`
  margin: 32px 0 16px 0;
  font-size: 3rem;
  font-weight: bold;
  color: var(--brand-black);

  @media (max-width: 768px) {
    font-size: 2.1rem;
    margin: 24px 0 12px;
    text-align: center;
  }
`

const Paragraph = styled.p`
  font-size: 1rem;
  line-height: 1.5rem;
  color: var(--brand-black);

  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    line-height: 1.4rem;
    text-align: center;
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

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
    font-size: 0.8rem;
  }
`

const IconCircle = styled.img`
  width: 2.5rem;
  height: 2.5rem;

  @media (max-width: 768px) {
    width: 2rem;
    height: 2rem;
  }
`

const CodeBox = styled.div`
  position: relative;
  flex: 1 1 50%;
  padding: 7rem 2rem 2rem;
  border-radius: 1rem;

  @media (max-width: 768px) {
    padding: 3rem 1rem 1rem;
    border-radius: 0.75rem;
    width: 100%;
    height: auto;
  }
`
