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
import { log } from 'console'

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

  console.log(competition, 'competition')

  if (!competition) {
    return <SkeletonBox />
  }

  // 如果有数据返回但没有交易员，显示空状态
  if (!competition.traders || competition.traders.length === 0) {
    return <NoDataSection />
  }

  // 按收益率排序
  const sortedTraders = [...competition.traders].sort((a, b) => b.total_pnl_pct - a.total_pnl_pct)

  // 找出领先者
  const leader = sortedTraders[0]

  return (
    <Wrapper>
      {/* Competition Header - 精简版 */}
      <Header>
        <LeftHeader>
          <IconCircle>
            <Trophy className="w-6 h-6 md:w-7 md:h-7" style={{ color: '#000' }} />
          </IconCircle>

          <TitleBlock>
            <TitleRow>
              <TitleText>
                {t('aiCompetition')}
                <CountBadge>
                  {competition.count} {t('traders')}
                </CountBadge>
              </TitleText>
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

      {/* Left/Right Split: Performance Chart + Leaderboard */}
      <SplitGrid>
        {/* Left: Performance Comparison Chart */}
        <Card delayMs={100}>
          <CardHeader>
            <CardTitle>{t('performanceComparison')}</CardTitle>
            <CardMeta>{t('realTimePnL')}</CardMeta>
          </CardHeader>

          {/* Keep the original Chart component and pass top 5 */}
          <ComparisonChart traders={sortedTraders.slice(0, 5)} />
        </Card>

        {/* Right: Leaderboard */}
        <Card delayMs={100}>
          <CardHeader>
            <CardTitle>{t('leaderboard')}</CardTitle>
            <div
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.375rem',
                background: 'rgba(240, 185, 11, 0.1)',
                color: '#F0B90B',
                border: '1px solid rgba(240, 185, 11, 0.2)',
                fontWeight: 700,
              }}
            >
              {t('live')}
            </div>
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
                        <Medal
                          className="w-5 h-5"
                          style={{
                            color: index === 0 ? '#F0B90B' : index === 1 ? '#C0C0C0' : '#CD7F32',
                          }}
                        />
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
                      <StatBlock style={{ minWidth: 90 }}>
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
                      <div>
                        <StatusBadge running={!!trader.is_running}>{trader.is_running ? '●' : '○'}</StatusBadge>
                      </div>
                    </StatsGroup>
                  </TraderRowInner>
                </TraderRow>
              )
            })}
          </LeaderboardList>
        </Card>
      </SplitGrid>

      {/* Head-to-Head Stats */}
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

      {/* Trader Config View Modal */}
      <TraderConfigViewModal isOpen={isModalOpen} onClose={closeModal} traderData={selectedTrader} />
    </Wrapper>
  )
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(8px); }
  to { opacity: 1; transform: translateX(0); }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* space-y-5 */
  width: 100%;
  animation: ${fadeIn} 360ms ease both;
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

const IconCircle = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0b90b 0%, #fcd535 100%);
  box-shadow: 0 4px 14px rgba(240, 185, 11, 0.4);

  @media (min-width: 768px) {
    width: 3rem;
    height: 3rem;
  }
`

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: 768px) {
    gap: 0.5rem;
  }
`

const TitleText = styled.h1`
  font-weight: 700;
  font-size: 1.125rem; /* text-xl */
  color: #eaecef;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: 768px) {
    font-size: 1.25rem; /* md:text-2xl */
  }
`

const CountBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  background: rgba(240, 185, 11, 0.15);
  color: #f0b90b;
`

const Subtitle = styled.p`
  font-size: 0.75rem;
  color: #848e9c;
`

/* Leader section (right header) */
const LeaderSection = styled.div`
  text-align: left;
  width: 100%;

  @media (min-width: 768px) {
    text-align: right;
    width: auto;
  }
`

const LeaderLabel = styled.div`
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  color: #848e9c;
`

const LeaderName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #f0b90b;

  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`

const LeaderPnl = styled.div<{ positive?: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(p) => (p.positive ? '#0ECB81' : '#F6465D')};
`

/* Grid for main content */
const SplitGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`

const Card = styled.div<{ delayMs?: number }>`
  background: #0b0e11;
  border-radius: 0.75rem;
  padding: 1.25rem;
  animation: ${slideIn} 360ms ease both;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
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
  margin-bottom: 1rem;
`

const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #eaecef;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const CardMeta = styled.div`
  font-size: 0.75rem;
  color: #848e9c;
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
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: all 300ms ease;
  cursor: pointer;
  ${(p) =>
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
        `}

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
  width: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
`

const TraderName = styled.div`
  font-weight: 700;
  font-size: 0.875rem;
  color: #eaecef;
`

const TraderMeta = styled.div<{ color?: string }>`
  font-size: 0.75rem;
  font-weight: 600;
  font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Segoe UI Mono', monospace;
  color: ${(p) => p.color || '#848E9C'};
`

/* Stats group */
const StatsGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`

const StatBlock = styled.div`
  text-align: right;
  min-width: 70px;
`

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #848e9c;
`

const StatValue = styled.div<{ prominent?: boolean; colorOverride?: string }>`
  font-size: 1rem;
  font-weight: 700;
  font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  color: ${(p) => p.colorOverride || '#EAECEF'};
`

const SmallMono = styled.div`
  font-size: 0.75rem;
  font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  color: #848e9c;
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
          background: rgba(14, 203, 129, 0.1);
          color: #0ecb81;
        `
      : css`
          background: rgba(246, 70, 93, 0.1);
          color: #f6465d;
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
