import { motion } from 'framer-motion'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'

import AnimatedSection from './AnimatedSection'

interface CardProps {
  quote: string
  authorName: string
  handle: string
  avatarUrl: string
  tweetUrl: string
  delay: number
}

function TestimonialCard({ quote, authorName, delay }: CardProps) {
  return (
    <CommunityItem
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, backgroundColor: '#cafe36' }}
    >
      <p>"{quote}"</p>
      <CommunityAuthor>
        <img src="" alt="" />
        <span>{authorName}</span>
      </CommunityAuthor>
    </CommunityItem>
  )
}

export default function CommunitySection() {
  const { t } = useTranslation()
  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  }

  // 推特内容整合（保持原三列布局，超出自动换行）
  const items: CardProps[] = [
    {
      quote: 'I finally stopped watching charts all day.Valkynor handles everything for me.',
      authorName: 'Michael Williams',
      handle: '@MichaelWil93725',
      avatarUrl: 'https://pbs.twimg.com/profile_images/1767615411594694659/Mj8Fdt6o_400x400.jpg',
      tweetUrl: 'https://twitter.com/MichaelWil93725/status/1984980920395604008',
      delay: 0,
    },
    {
      quote: 'Simple setup, and trades run even while I sleep.',
      authorName: 'DIŸgöd',
      handle: '@DIYgod',
      avatarUrl: 'https://pbs.twimg.com/profile_images/1628393369029181440/r23HDDJk_400x400.jpg',
      tweetUrl: 'https://twitter.com/DIYgod/status/1984442354515017923',
      delay: 0.1,
    },
    {
      quote: 'A great tool for people who want automation without complexity.',
      authorName: 'Kai',
      handle: '@hqmank',
      avatarUrl: 'https://pbs.twimg.com/profile_images/1905441261911506945/4YhLIqUm_400x400.jpg',
      tweetUrl: 'https://twitter.com/hqmank/status/1984227431994290340',
      delay: 0.15,
    },
  ]

  return (
    <AnimatedSection>
      <CommunityContainer>
        <TitleBlock initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionTitle>{t('userTestimonials')}</SectionTitle>
        </TitleBlock>
        <CommunityList variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
          {items.map((item, idx) => (
            <TestimonialCard key={idx} {...item} />
          ))}
        </CommunityList>
      </CommunityContainer>
    </AnimatedSection>
  )
}

const CommunityContainer = styled.div`
  max-width: 76.5rem;
  margin: 0 auto;
`

const TitleBlock = styled(motion.div)`
  text-align: center;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 28px;
  }
`

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--brand-black);

  @media (max-width: 768px) {
    font-size: 2.25rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`

const CommunityList = styled(motion.div)`
  display: flex;
  gap: 1rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const CommunityItem = styled(motion.div)`
  flex: 1 1 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  padding: 24px;
  background: #ffffff;
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 24px;
  border: 1px solid #191a23;
  cursor: pointer;

  p {
    font-size: 1rem;
    line-height: 1.5;
  }
`

const CommunityAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: yellow;
  }

  span {
    font-size: 1rem;
  }
`
