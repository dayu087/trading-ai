import { motion, useScroll, useTransform, useAnimation } from 'framer-motion'
import styled from 'styled-components'
import { Sparkles } from 'lucide-react'
import { t, Language } from '../../i18n/translations'
import { useGitHubStats } from '../../hooks/useGitHubStats'
import { useCounterAnimation } from '../../hooks/useCounterAnimation'
import { useScrollContext } from '../../contexts/ScrollProvider'

interface HeroSectionProps {
  language: Language
}

export default function HeroSection({ language }: HeroSectionProps) {
  const { scrollRef } = useScrollContext()
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
  const handControls = useAnimation()

  const { stars, daysOld, isLoading } = useGitHubStats('NoFxAiOS', 'nofx')
  const animatedStars = useCounterAnimation({
    start: 0,
    end: stars,
    duration: 2000,
  })

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
            <motion.div variants={fadeInUp}>
              <Badge
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 20px rgba(240, 185, 11, 0.2)',
                }}
              >
                <Sparkles className="w-4 h-4" style={{ color: 'var(--brand-yellow)' }} />
                <span>
                  {isLoading ? (
                    t('githubStarsInDays', language)
                  ) : language === 'zh' ? (
                    <>
                      {daysOld} 天内{' '}
                      <span className="inline-block tabular-nums">{(animatedStars / 1000).toFixed(1)}</span>
                      K+ GitHub Stars
                    </>
                  ) : (
                    <>
                      <span className="inline-block tabular-nums">{(animatedStars / 1000).toFixed(1)}</span>
                      K+ GitHub Stars in {daysOld} days
                    </>
                  )}
                </span>
              </Badge>
            </motion.div>

            <Title>
              {t('heroTitle1', language)}
              <br />
              <Highlight>{t('heroTitle2', language)}</Highlight>
            </Title>

            <Description variants={fadeInUp}>{t('heroDescription', language)}</Description>

            <ButtonsRow>
              <motion.a
                href="https://github.com/tinkle-community/nofx"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <img
                  src="https://img.shields.io/github/stars/tinkle-community/nofx?style=for-the-badge&logo=github&logoColor=white&color=F0B90B&labelColor=0A0A0A"
                  className="h-7"
                />
              </motion.a>
              <motion.a
                href="https://github.com/tinkle-community/nofx/network/members"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <img
                  src="https://img.shields.io/github/forks/tinkle-community/nofx?style=for-the-badge&logo=github&logoColor=white&color=F0B90B&labelColor=0A0A0A"
                  className="h-7"
                />
              </motion.a>

              <motion.a
                href="https://github.com/tinkle-community/nofx/graphs/contributors"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <img
                  src="https://img.shields.io/github/contributors/tinkle-community/nofx?style=for-the-badge&logo=github&logoColor=white&color=F0B90B&labelColor=0A0A0A"
                  className="h-7"
                />
              </motion.a>
            </ButtonsRow>

            <SmallNote variants={fadeInUp}>{t('poweredBy', language)}</SmallNote>
          </LeftWrapper>

          {/* Right */}
          <RightWrapper
            onMouseEnter={() => {
              handControls.start({
                y: [-8, 8, -8],
                rotate: [-3, 3, -3],
                x: [-2, 2, -2],
                transition: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  times: [0, 0.5, 1],
                },
              })
            }}
            onMouseLeave={() => {
              handControls.start({
                y: 0,
                rotate: 0,
                x: 0,
                transition: { duration: 0.6, ease: 'easeOut' },
              })
            }}
          >
            <BgImage
              src="/images/hand-bg.png"
              alt="NOFX Platform Background"
              style={{ opacity, scale }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />

            <HandImage
              src="/images/hand.png"
              animate={handControls}
              initial={{ y: 0, rotate: 0, x: 0 }}
              whileHover={{
                scale: 1.05,
                transition: { type: 'spring', stiffness: 400 },
              }}
            />
          </RightWrapper>
        </Grid>
      </HeroContainer>
    </HeroBox>
  )
}

const HeroBox = styled.section`
  position: relative;
  padding-top: 8rem; /* pt-32 */
  padding-bottom: 5rem; /* pb-20 */
  padding-left: 1rem; /* px-4 */
  padding-right: 1rem;
`

const HeroContainer = styled.div`
  max-width: 76.5rem; /* max-w-7xl */
  margin: 0 auto;
`

const Grid = styled.div`
  display: grid;
  gap: 3rem; /* gap-12 */
  align-items: center;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const LeftWrapper = styled(motion.div)`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem; /* px-4 py-2 */
  border-radius: 9999px;
  margin-bottom: 1.5rem;
  background: #f3f3f3;
  font-size: 0.875rem;
  font-weight: bold;
  color: #191a23;
`

const Title = styled.h1`
  font-size: 3rem; /* text-5xl */
  font-weight: bold;
  line-height: 1.15;
  color: var(--brand-black);

  @media (min-width: 1024px) {
    font-size: 4.5rem; /* text-7xl */
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
`

const Description = styled(motion.p)`
  font-size: 1rem;
  line-height: 1.5;
  color: var(--brand-black);
`

const ButtonsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 0.75rem;
`

const SmallNote = styled(motion.p)`
  font-size: 0.75rem;
  padding-top: 0.75rem;
  color: var(--brand-black);
`

const RightWrapper = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;
`

const BgImage = styled(motion.img)`
  width: 100%;
  opacity: 0.9;
`

const HandImage = styled(motion.img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`
