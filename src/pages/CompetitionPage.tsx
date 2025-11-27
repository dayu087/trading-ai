import { useState } from 'react'
import { Trophy, Medal } from 'lucide-react'
import styled, { keyframes, css } from 'styled-components'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import { api } from '../lib/api'
import type { CompetitionData } from '../types'
import { ComparisonChart } from '@/components/ComparisonChart'
import { TraderConfigViewModal } from '@/components/TraderConfigViewModal'
import { getTraderColor } from '../utils/traderColors'
import NoDataSection from '@/components/competition/NoData'
import SkeletonBox from '@/components/competition/SkeletonBox'

import liveLogo from '@/assets/images/live_logo_ai.png'
import botIcon from '@/assets/images/config_logo_bot.png'

export function CompetitionPage() {
  const [selectedTrader, setSelectedTrader] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t } = useTranslation()

  const { data: competition } = useSWR<CompetitionData>('competition', api.getCompetition, {
    refreshInterval: 15000, // 15秒刷新（竞赛数据不需要太频繁更新）
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  const handleTraderClick = async (traderId: string) => {
    try {
      const traderConfig = await api.getTraderConfig(traderId)
      setSelectedTrader(traderConfig)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Failed to fetch trader config:', error)
      // 对于未登录用户，不显示详细配置，这是正常行为
      // 竞赛页面主要用于查看排行榜和基本信息
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTrader(null)
  }

  if (!competition) {
    return <SkeletonBox />
  }

  // 如果有数据返回但没有交易员，显示空状态
  if (!competition.traders || competition.traders.length === 0) {
    return <NoDataSection />
  }
  console.log(competition, 'competition')

  // 按收益率排序
  const sortedTraders = [...competition.traders].sort((a, b) => b.total_pnl_pct - a.total_pnl_pct)

  // 找出领先者
  const leader = sortedTraders[0]

  return (
    <CompetitionWrapper>
      {/* Competition Header - 精简版 */}
      <Header>
        <LeftHeader>
          <IconCircle src={liveLogo} alt="live logo" />
          <TitleBlock>
            <TitleRow>
              <TitleText>{t('aiCompetition')}</TitleText>
              <CountBadge>
                {competition.count} {t('traders')}
              </CountBadge>
            </TitleRow>
            <Subtitle>{t('liveBattle')}</Subtitle>
          </TitleBlock>
        </LeftHeader>

        <LeaderSection>
          <LeaderLabel>{t('leader')}</LeaderLabel>
          <LeaderName>{leader?.trader_name}</LeaderName>
          <LeaderPnl positive={(leader?.total_pnl ?? 0) >= 0}>
            {(leader?.total_pnl ?? 0) >= 0 ? '+' : ''}
            {leader?.total_pnl_pct?.toFixed(2) || '0.00'}%
          </LeaderPnl>
        </LeaderSection>
      </Header>

      <SplitGrid>
        <Card delayMs={100}>
          <CardHeader>
            <CardTitle>{t('performanceComparison')}</CardTitle>
            <CardMeta>{t('realTimePnL')}</CardMeta>
          </CardHeader>

          <ComparisonChart traders={sortedTraders.slice(0, 5)} />
        </Card>

        <Card delayMs={100}>
          <CardHeader>
            <CardTitle>{t('leaderboard')}</CardTitle>
            <LiveTag>{t('live')}</LiveTag>
          </CardHeader>

          <LeaderboardList>
            {sortedTraders.map((trader, index) => {
              const isLeader = index === 0
              const traderColor = getTraderColor(sortedTraders, trader.trader_id)
              return (
                <TraderRow key={trader.trader_id} isLeader={isLeader} onClick={() => handleTraderClick(trader.trader_id)}>
                  <TraderRowInner>
                    {/* Rank & Name */}
                    <RankName>
                      <RankIcon>
                        <img src={botIcon} alt="bot" />
                      </RankIcon>

                      <NameBlock>
                        <TraderName>{trader.trader_name}</TraderName>
                        <TraderMeta color={traderColor}>
                          {trader.ai_model.toUpperCase()} + {trader.exchange.toUpperCase()}
                        </TraderMeta>
                      </NameBlock>
                    </RankName>

                    {/* Stats */}
                    <StatsGroup>
                      {/* Total Equity */}
                      <StatBlock>
                        <StatLabel>{t('equity')}</StatLabel>
                        <StatValue>{(trader.total_equity ?? 0).toFixed(2)}</StatValue>
                      </StatBlock>

                      {/* P&L */}
                      <StatBlock>
                        <StatLabel>{t('pnl')}</StatLabel>
                        <StatValue colorOverride={(trader.total_pnl ?? 0) >= 0 ? '#0ECB81' : '#F6465D'} prominent>
                          {(trader.total_pnl ?? 0) >= 0 ? '+' : ''}
                          {trader.total_pnl_pct?.toFixed(2) || '0.00'}%
                        </StatValue>
                        <SmallMono>
                          {(trader.total_pnl ?? 0) >= 0 ? '+' : ''}
                          {trader.total_pnl?.toFixed(2) || '0.00'}
                        </SmallMono>
                      </StatBlock>

                      {/* Positions */}
                      <StatBlock>
                        <StatLabel>{t('pos')}</StatLabel>
                        <StatValue>{trader.position_count ?? 0}</StatValue>
                        <SmallMono>{(trader.margin_used_pct ?? 0).toFixed(1)}%</SmallMono>
                      </StatBlock>

                      {/* Status */}
                      <StatusBadgeBox>
                        <StatusBadge running={!!trader.is_running}>{trader.is_running ? '●' : '○'}</StatusBadge>
                      </StatusBadgeBox>
                    </StatsGroup>
                  </TraderRowInner>
                </TraderRow>
              )
            })}
          </LeaderboardList>
        </Card>
      </SplitGrid>

      {competition.traders.length === 2 && (
        <HeadToHeadCard delayMs={300}>
          <H2>{t('headToHead')}</H2>
          <H2Grid>
            {sortedTraders.map((trader, index) => {
              const isWinning = index === 0
              const opponent = sortedTraders[1 - index]
              const hasValidData = trader.total_pnl_pct != null && opponent.total_pnl_pct != null && !isNaN(trader.total_pnl_pct) && !isNaN(opponent.total_pnl_pct)
              const gap = hasValidData ? trader.total_pnl_pct - opponent.total_pnl_pct : NaN
              return (
                <H2Column key={trader.trader_id} winning={isWinning}>
                  <div>
                    <H2Name color={getTraderColor(sortedTraders, trader.trader_id)}>{trader.trader_name}</H2Name>

                    <H2Pct positive={(trader.total_pnl ?? 0) >= 0}>
                      {trader.total_pnl_pct != null && !isNaN(trader.total_pnl_pct) ? `${trader.total_pnl_pct >= 0 ? '+' : ''}${trader.total_pnl_pct.toFixed(2)}%` : '—'}
                    </H2Pct>

                    {/* {hasValidData && isWinning && gap > 0 && <H2Note positive>{t('leadingBy', { gap: gap.toFixed(2) })}</H2Note>} */}
                    {/* {hasValidData && !isWinning && gap < 0 && <H2Note>{t('behindBy', { gap: Math.abs(gap).toFixed(2) })}</H2Note>} */}

                    {!hasValidData && <Dash>—</Dash>}
                  </div>
                </H2Column>
              )
            })}
          </H2Grid>
        </HeadToHeadCard>
      )}

      <TraderConfigViewModal isOpen={isModalOpen} onClose={closeModal} traderData={selectedTrader} />
    </CompetitionWrapper>
  )
}

const CompetitionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  max-width: 1220px;
  animation: fadeIn 0.25s ease;

  width: 100%;
`

/* Header */
const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0;
  }
`

const LeftHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (min-width: 768px) {
    gap: 1rem;
  }
`

const IconCircle = styled.img`
  width: 60px;
  height: 60px;

  @media (max-width: 768px) {
    width: 3rem;
    height: 3rem;
  }
`

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`

const TitleText = styled.h1`
  padding: 4px 12px;
  font-size: 20px;
  font-weight: 700;
  background: #cafe36;
  border-radius: 8px;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

const CountBadge = styled.span`
  font-size: 14px;
  font-weight: 400;
  padding: 8px 12px;
  border-radius: 4px;
  background: #f3f3f3;
`

const Subtitle = styled.p`
  font-size: 14px;
`

/* Leader section (right header) */
const LeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const LeaderLabel = styled.div`
  font-size: 14px;
`

const LeaderName = styled.div`
  font-size: 1rem;
  font-weight: 700;
`

const LeaderPnl = styled.div<{ positive?: boolean }>`
  font-size: 14px;
  font-weight: 700;
  color: ${(p) => (p.positive ? 'var(--up_color)' : 'var(--down_color)')};
`

/* Grid for main content */
const SplitGrid = styled.div`
  display: flex;
  gap: 32px;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`

const Card = styled.div<{ delayMs?: number }>`
  flex: 1 1 50%;
  animation: slideIn 360ms ease both;
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 24px;
  border: 1px solid #000;
  ${(p) =>
    p.delayMs &&
    css`
      animation-delay: ${p.delayMs}ms;
    `}
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
`

const CardTitle = styled.h2`
  padding: 4px 12px;
  font-size: 20px;
  font-weight: 700;
  border-radius: 8px;
  background: #cafe36;
`

const LiveTag = styled.span`
  padding: 4px 12px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 24px;
  border: 1px solid #000;
`

const CardMeta = styled.div`
  font-size: 14px;
`

/* Leaderboard list */
const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const TraderRow = styled.div<{ isLeader?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 0.5rem;
  transition: all 300ms ease;
  cursor: pointer;
  border-top: 1px solid #f3f3f3;
  /* ${(p) =>
    p.isLeader
      ? css`
          background: linear-gradient(135deg, rgba(240, 185, 11, 0.08) 0%, #0b0e11 100%);
          border: 1px solid rgba(240, 185, 11, 0.4);
          box-shadow:
            0 3px 15px rgba(240, 185, 11, 0.12),
            0 0 0 1px rgba(240, 185, 11, 0.15);
        `
      : css`
          background: #0b0e11;
          border: 1px solid #2b3139;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        `} */

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
`

const TraderRowInner = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`

/* Rank & Name */
const RankName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const RankIcon = styled.div`
  padding: 8px;
  border-radius: 50%;
  border: 1px solid #000;

  img {
    width: 48px;
    height: 48px;
  }
`

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
`

const TraderName = styled.div`
  font-weight: 700;
  font-size: 16px;
`

const TraderMeta = styled.div<{ color?: string }>`
  font-size: 14px;
  font-weight: 400;
  /* font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Segoe UI Mono', monospace; */
  /* color: ${(p) => p.color || '#848E9C'}; */
`

/* Stats group */
const StatsGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  justify-content: space-around;
`

const StatBlock = styled.div`
  text-align: left;
  min-width: 70px;
`

const StatLabel = styled.div`
  font-size: 14px;
`

const StatValue = styled.div<{ prominent?: boolean; colorOverride?: string }>`
  font-size: 14px;
  font-weight: 700;
  color: ${(p) => p.colorOverride || '#000'};
`

const SmallMono = styled.div`
  font-size: 14px;
`

const StatusBadgeBox = styled.div`
  margin-top: 20px;
`

/* Status badge */
const StatusBadge = styled.div<{ running?: boolean }>`
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  ${(p) =>
    p.running
      ? css`
          background: var(--up_bg);
          color: var(--up_color);
        `
      : css`
          background: var(--down_bg);
          color: var(--down_color);
        `}
`

/* Head-to-head */
const HeadToHeadCard = styled(Card)`
  animation-delay: 300ms;
`

const H2 = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #eaecef;
  margin-bottom: 1rem;
`

const H2Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const H2Column = styled.div<{ winning?: boolean }>`
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  ${(p) =>
    p.winning
      ? css`
          background: linear-gradient(135deg, rgba(14, 203, 129, 0.08) 0%, rgba(14, 203, 129, 0.02) 100%);
          border: 2px solid rgba(14, 203, 129, 0.3);
          box-shadow: 0 3px 15px rgba(14, 203, 129, 0.12);
        `
      : css`
          background: #0b0e11;
          border: 1px solid #2b3139;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        `}
`

const H2Name = styled.div<{ color?: string }>`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${(p) => p.color || '#EAECEF'};
  margin-bottom: 0.5rem;
`

const H2Pct = styled.div<{ positive?: boolean }>`
  font-size: 1.125rem;
  font-weight: 700;
  font-family: 'IBM Plex Mono', monospace;
  color: ${(p) => (p.positive ? '#0ECB81' : '#F6465D')};
  margin-bottom: 0.25rem;
`

const H2Note = styled.div<{ positive?: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(p) => (p.positive ? '#0ECB81' : '#F6465D')};
`

/* Utility: mono small dashed emulation for missing data */
const Dash = styled.div`
  font-size: 0.75rem;
  color: #848e9c;
  font-weight: 600;
`
