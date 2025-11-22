// Styled-components version of AboutSection
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import AnimatedSection from './AnimatedSection'
import Typewriter from '../Typewriter'

import homeArrow from '@/assets/images/home_icon_arrow.png'
import lineIcon from '@/assets/images/home_icon_line.png'
import WhatsIcon from '@/assets/images/home_img_whats.png'
import vaikynorIcon from '@/assets/images/home_img_vaikynor2.png'

export default function AboutSection() {
  const { t } = useTranslation()

  return (
    <AnimatedSection id="about">
      <Wrapper>
        <Grid>
          <CodeBox>
            <IconCircle initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} src={vaikynorIcon} alt="" />
            {/* <Typewriter
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

            <LeftWhatsIcon src={WhatsIcon} /> */}
          </CodeBox>

          <AboutRight initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Title>{t('whatIsValkynor')}</Title>
            <Paragraph>
              {t('valkynorNotAnotherBot')} <br />
              {t('valkynorDescription1')}
            </Paragraph>
            <InfoRowBox>
              <InfoRow whileHover={{ x: 5 }}>
                <h3>{t('valkynorDescription2')}</h3>
                <h3>{t('valkynorDescription3')}</h3>
                <h3>{t('valkynorDescription4')}</h3>
              </InfoRow>
              <RightLine src={lineIcon} />
            </InfoRowBox>

            <Paragraph>{t('valkynorDescription5')}</Paragraph>
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
  width: 76px;

  @media (max-width: 768px) {
    width: 50px;
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
  padding: 56px 40px 64px;
  border-radius: 24px;
  background: #ffffff;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 18px;
  }
`

const Title = styled.h2`
  position: relative;
  z-index: 1;
  width: fit-content;
  margin-bottom: 40px;
  font-size: 3rem;
  font-weight: bold;
  color: var(--brand-black);

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    left: 0;
    bottom: 4px;
    width: 100%;
    height: 32px;
    background: #cafe36;
  }

  @media (max-width: 768px) {
    font-size: 2.1rem;
    margin: 24px 0 12px;
    text-align: center;
  }
`

const Paragraph = styled.p`
  font-size: 1rem;
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

const InfoRowBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 24px;
`

const InfoRow = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 1rem 0;
  font-size: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
    font-size: 0.8rem;
  }
`

const IconCircle = styled(motion.img)`
  width: 420px;
  height: 320px;
`

const CodeBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
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
