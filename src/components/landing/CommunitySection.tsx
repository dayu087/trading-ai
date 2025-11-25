import { motion } from 'framer-motion'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'

import AnimatedSection from './AnimatedSection'
import avatar1 from '@/assets/images/home_avatar_1.png'
import avatar2 from '@/assets/images/home_avatar_2.png'
import avatar3 from '@/assets/images/home_avatar_3.png'

interface CardProps {
  quote: string
  authorName: string
  handle: string
  avatarUrl: string
  tweetUrl: string
  delay: number
}

function TestimonialCard({ quote, authorName, delay, avatarUrl }: CardProps) {
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
        <img src={avatarUrl} alt="" />
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
      avatarUrl: avatar1,
      tweetUrl: 'https://twitter.com/MichaelWil93725/status/1984980920395604008',
      delay: 0,
    },
    {
      quote: 'Simple setup, and trades run even while I sleep.',
      authorName: 'DIŸgöd',
      handle: '@DIYgod',
      avatarUrl: avatar2,
      tweetUrl: 'https://twitter.com/DIYgod/status/1984442354515017923',
      delay: 0.1,
    },
    {
      quote: 'A great tool for people who want automation without complexity.',
      authorName: 'Kai',
      handle: '@hqmank',
      avatarUrl: avatar3,
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
    margin-bottom: 16px;
  }
`

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  color: var(--brand-black);

  @media (max-width: 768px) {
    font-size: 1.5rem;
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
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.5rem;

    p {
      font-size: 0.75rem;
    }
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

  @media (max-width: 768px) {
    span {
      font-size: 0.75rem;
    }
  }
`
