import styled, { keyframes } from 'styled-components'
import { Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function NoDataSection() {
  const { t } = useTranslation()
  return (
    <NoDataContainer>
      {/* Header */}
      <HeaderWrapper>
        <HeaderLeft>
          <IconWrapper>
            <Trophy className="trophy" style={{ width: '28px', height: '28px', color: '#000' }} />
          </IconWrapper>
          <TitleWrapper>
            <Title>
              {t('aiCompetition')}
              <Tag>0 {t('traders')}</Tag>
            </Title>

            <Subtitle>{t('liveBattle')}</Subtitle>
          </TitleWrapper>
        </HeaderLeft>
      </HeaderWrapper>

      {/* Empty State */}
      <EmptyCard>
        <Trophy
          className="empty-icon"
          style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 16px',
            opacity: 0.4,
            color: '#848E9C',
          }}
        />

        <EmptyTitle>{t('noTraders')}</EmptyTitle>
        <EmptyText>{t('createFirstTrader')}</EmptyText>
      </EmptyCard>
    </NoDataContainer>
  )
}

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn 0.4s ease forwards;
  width: 100%;
  max-width: 1220px;
`

// Header Wrapper (flex between)
const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0;
  }
`

// 左侧（Icon + Title）
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`

// 图标背景
const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f0b90b 0%, #fcd535 100%);
  box-shadow: 0 4px 14px rgba(240, 185, 11, 0.4);

  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
  }
`

// 标题
const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 20px;

  @media (min-width: 768px) {
    font-size: 24px;
  }
`

const Tag = styled.span`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 6px;
  background: #f3f3f3;
`

const Subtitle = styled.p`
  font-size: 12px;
  color: #848e9c;
`

// =======================
// Empty State Card
// =======================
const EmptyCard = styled.div`
  padding: 32px;
  text-align: center;
  border-radius: 16px;
  border: 1px solid #000;
`

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`

const EmptyText = styled.p`
  font-size: 14px;
`
