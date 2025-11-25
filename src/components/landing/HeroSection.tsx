import { motion, useScroll, useTransform, useAnimation } from 'framer-motion'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGitHubStats } from '../../hooks/useGitHubStats'
import { useCounterAnimation } from '../../hooks/useCounterAnimation'
import { useScrollContext } from '../../contexts/ScrollProvider'

import homeVaikynorIcon from '@/assets/images/home_img_vaikynor1.png'
import homeArrowIcon from '@/assets/images/home_arrow_incline.png'

export default function HeroSection({ setShowLoginModal }: { setShowLoginModal: (value: boolean) => void }) {
  const { scrollRef } = useScrollContext()
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
  const { t } = useTranslation()

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
  }
  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  }

  return (
    <HeroBox>
      <HeroContainer>
        <Grid>
          {/* Left */}
          <LeftWrapper style={{ opacity, scale }} initial="initial" animate="animate" variants={staggerContainer}>
            <Title>
              {t('heroTitle1')}
              <br />
              <Highlight>{t('heroTitle2')}</Highlight>
            </Title>

            <Description variants={fadeInUp}>{t('heroDescription')}</Description>

            <ButtonRow>
              <PrimaryButton onClick={() => setShowLoginModal(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {t('getStartedNow')}
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowIcon src={homeArrowIcon} alt="" />
                </motion.div>
              </PrimaryButton>
              <LoginButton onClick={() => setShowLoginModal(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {t('connectExchange')}
              </LoginButton>
            </ButtonRow>
          </LeftWrapper>

          {/* Right */}
          <RightWrapper style={{ opacity, scale }} whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
            <BgImage initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} src={homeVaikynorIcon} alt=" Platform Background" style={{ opacity, scale }} />
          </RightWrapper>
        </Grid>
      </HeroContainer>
    </HeroBox>
  )
}

const HeroBox = styled.section`
  position: relative;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`

const HeroContainer = styled.div`
  max-width: 76.5rem;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`

const Grid = styled.div`
  display: flex;
  gap: 70px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  /* Mobile: 改为垂直布局、减小间距 */
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 40px;
  }
`

const LeftWrapper = styled(motion.div)`
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
    max-width: 100%;
    text-align: center;
    align-items: center;
    gap: 1rem;
  }
`

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  margin-bottom: 10px;
  border-radius: 9999px;
  background: #f3f3f3;
  font-size: 0.875rem;
  font-weight: bold;
  color: #191a23;

  img {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    img {
      width: 20px;
      height: 20px;
    }
  }
`

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.5;
  color: var(--brand-black);
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 2rem;
    line-height: 1.2;
  }
`

const Highlight = styled.span`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    bottom: -4px;
    z-index: -1;
    width: 100%;
    height: 40px;
    background: #cafe36;
  }

  @media (max-width: 768px) {
    &::before {
      height: 24px;
      bottom: -2px;
    }
  }
`

const Description = styled(motion.p)`
  font-size: 1rem;
  line-height: 1.5;
  color: var(--brand-black);

  @media (max-width: 768px) {
    font-size: 0.75rem;
    max-width: 90%;
  }
`

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`

const ArrowIcon = styled.img`
  width: 20px;
  height: 20px;
`

const PrimaryButton = styled(motion.button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  max-width: 288px;
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

const RightWrapper = styled(motion.div)`
  position: relative;
  cursor: pointer;
  width: 496px;
  height: 362px;
  background: #ffffff;
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 24px;
  border: 1px solid #191a23;
  overflow: hidden;

  /* Mobile: 缩小比例并保持不变形 */
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    aspect-ratio: 496 / 362;
  }
`

const BgImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  border: none;
`
