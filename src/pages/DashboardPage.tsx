import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { api } from '../lib/api'
import styled, { keyframes } from 'styled-components'
import { t } from '../i18n/translations'
import { EquityChart } from '../components/EquityChart'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import type { SystemStatus, AccountInfo, Position, DecisionRecord, Statistics } from '../types' // <- 根据你项目调整路径
import AILearning from '../components/AILearning'
import FooterView from '../components/FooterView'
import SkeletonLoad from '../components/dashboard/SkeletonLoad'
import EmptySection from '../components/dashboard/EmptySection'
import StatCard from '../components/dashboard/StatCard'
import DecisionCard from '../components/dashboard/DecisionCard'
import DebugBar from '../components/dashboard/DebugBar'
import PositionsTable from '../components/dashboard/PositionsTable'

import headLineIcon from '@/assets/images/home_icon_line.png'

function getModelDisplayName(modelId: string): string {
  switch (modelId.toLowerCase()) {
    case 'deepseek':
      return 'DeepSeek'
    case 'qwen':
      return 'Qwen'
    case 'claude':
      return 'Claude'
    default:
      return modelId.toUpperCase()
  }
}

export default function TraderDetails() {
  const [lastUpdate, setLastUpdate] = useState<string>('--:--:--')
  const { language } = useLanguage()
  const navigate = useNavigate()
  const { selectedTraderData, traders, tradersError, selectedTraderId, setSelectedTraderId } = useAuth()

  // 如果在trader页面，获取该trader的数据
  const { data: status } = useSWR<SystemStatus>(selectedTraderId ? `status-${selectedTraderId}` : null, () => api.getStatus(selectedTraderId), {
    refreshInterval: 15000, // 15秒刷新（配合后端15秒缓存）
    revalidateOnFocus: false, // 禁用聚焦时重新验证，减少请求
    dedupingInterval: 10000, // 10秒去重，防止短时间内重复请求
  })

  const { data: account } = useSWR<AccountInfo>(selectedTraderId ? `account-${selectedTraderId}` : null, () => api.getAccount(selectedTraderId), {
    refreshInterval: 15000, // 15秒刷新（配合后端15秒缓存）
    revalidateOnFocus: false, // 禁用聚焦时重新验证，减少请求
    dedupingInterval: 10000, // 10秒去重，防止短时间内重复请求
  })

  const { data: positions } = useSWR<Position[]>(selectedTraderId ? `positions-${selectedTraderId}` : null, () => api.getPositions(selectedTraderId), {
    refreshInterval: 15000, // 15秒刷新（配合后端15秒缓存）
    revalidateOnFocus: false, // 禁用聚焦时重新验证，减少请求
    dedupingInterval: 10000, // 10秒去重，防止短时间内重复请求
  })

  const { data: decisions } = useSWR<DecisionRecord[]>(selectedTraderId ? `decisions/latest-${selectedTraderId}` : null, () => api.getLatestDecisions(selectedTraderId), {
    refreshInterval: 30000, // 30秒刷新（决策更新频率较低）
    revalidateOnFocus: false,
    dedupingInterval: 20000,
  })

  const { data: stats } = useSWR<Statistics>(selectedTraderId ? `statistics-${selectedTraderId}` : null, () => api.getStatistics(selectedTraderId), {
    refreshInterval: 30000, // 30秒刷新（统计数据更新频率较低）
    revalidateOnFocus: false,
    dedupingInterval: 20000,
  })

  useEffect(() => {
    if (account) {
      const now = new Date().toLocaleTimeString()
      setLastUpdate(now)
    }
  }, [account])

  if (tradersError) return <EmptySection language={language} toTraders={() => navigate('/traders')} />
  if (traders && !traders?.length) return <EmptySection language={language} toTraders={() => navigate('/traders')} />

  // If traders is still loading or selectedTrader is not ready, show skeleton
  if (!selectedTraderData) return <SkeletonLoad />
  return (
    <TraderContainer>
      <HeaderCard>
        <HeaderTop>
          <h2>
            <AvatarBadge>🤖</AvatarBadge>
            <TraderTitle>{selectedTraderData.trader_name}</TraderTitle>
          </h2>

          {/* Trader Selector */}
          {traders && traders.length > 0 && (
            <SelectorRow>
              <SelectorLabel>{t('switchTrader', language)}</SelectorLabel>
              <Select value={selectedTraderId} onChange={(e) => setSelectedTraderId(e.target.value)}>
                {traders.map((trader) => (
                  <option key={trader.trader_id} value={trader.trader_id}>
                    {trader.trader_name}
                  </option>
                ))}
              </Select>
            </SelectorRow>
          )}
        </HeaderTop>

        <HeaderBottom>
          <ModelText>
            AI Model:{' '}
            <ModelBadge $isQwen={selectedTraderData.ai_model.includes('qwen')}>
              {getModelDisplayName(selectedTraderData.ai_model.split('_').pop() || selectedTraderData.ai_model)}
            </ModelBadge>
          </ModelText>

          {status && (
            <StatusRow>
              <Dot>•</Dot>
              <StatusText>Cycles: {status.call_count}</StatusText>
              <Dot>•</Dot>
              <StatusText>Runtime: {status.runtime_minutes} min</StatusText>
            </StatusRow>
          )}
        </HeaderBottom>

        <HeaderLineBg src={headLineIcon} alt="" />
      </HeaderCard>

      {/* Debug Info */}
      {account && <DebugBar account={account} lastUpdate={lastUpdate} />}

      {/* Account Overview */}
      <StatsGrid>
        <StatCard
          index={1}
          title={t('totalEquity', language)}
          value={`${account?.total_equity?.toFixed(2) || '0.00'}`}
          change={account?.total_pnl_pct || 0}
          positive={(account?.total_pnl ?? 0) > 0}
        />
        <StatCard
          index={2}
          title={t('availableBalance', language)}
          value={`${account?.available_balance?.toFixed(2) || '0.00'}`}
          subtitle={`${
            account?.available_balance && account?.total_equity ? ((account.available_balance / account.total_equity) * 100).toFixed(1) : '0.0'
          }% ${t('free', language)}`}
          bg="#CAFE36"
        />
        <StatCard
          index={3}
          title={t('totalPnL', language)}
          value={`${account?.total_pnl !== undefined && account.total_pnl >= 0 ? '+' : ''}${account?.total_pnl?.toFixed(2) || '0.00'}`}
          change={account?.total_pnl_pct || 0}
          positive={(account?.total_pnl ?? 0) >= 0}
        />
        <StatCard
          index={4}
          isChange={true}
          title={t('positions', language)}
          value={`${account?.position_count || 0}`}
          subtitle={`${t('margin', language)}: ${account?.margin_used_pct?.toFixed(1) || '0.0'}%`}
          bg="#191A23"
        />
      </StatsGrid>

      <TwoCol>
        {/* Left column: chart + positions */}
        <LeftCol>
          <ChartWrap>
            <EquityChart traderId={selectedTraderData.trader_id}></EquityChart>
          </ChartWrap>

          {/* Current Positions */}
          <PositionsCard>
            <PositionsHeader>
              <PositionsTitle>{t('currentPositions', language)}</PositionsTitle>
              {positions && positions.length > 0 && (
                <PositionsCount>
                  {positions.length} {t('active', language)}
                </PositionsCount>
              )}
            </PositionsHeader>
            <PositionsTable positions={positions} />
          </PositionsCard>
        </LeftCol>

        {/* Right column: recent decisions */}
        <RightCol>
          <DecisionsCard>
            <DecisionsHeader>
              <div>
                <DecisionsTitle>{t('recentDecisions', language)}</DecisionsTitle>
                {decisions && decisions.length > 0 && <DecisionsSub>{t('lastCycles', language, { count: decisions.length })}</DecisionsSub>}
              </div>
            </DecisionsHeader>

            <DecisionsList>
              {decisions && decisions.length > 0 ? (
                decisions.map((decision, i) => <DecisionCard key={i} decision={decision} />)
              ) : (
                <EmptyDecisions>
                  <div className="emoji">🧠</div>
                  <EmptyDecisionsTitle>{t('noDecisionsYet', language)}</EmptyDecisionsTitle>
                  <EmptyDecisionsDesc>{t('aiDecisionsWillAppear', language)}</EmptyDecisionsDesc>
                </EmptyDecisions>
              )}
            </DecisionsList>
          </DecisionsCard>
        </RightCol>
      </TwoCol>

      {/* AI Learning & Performance Analysis */}
      <AILearning traderId={selectedTraderData.trader_id} />
      <FooterView />
    </TraderContainer>
  )
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`

const TraderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1220px;
  animation: ${fadeIn} 0.25s ease;
`

/* Header card */
const HeaderCard = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 2.5rem;
  padding: 2.5rem 1.5rem 2rem 4rem;
  background: #cafe36;
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 24px 24px 24px 24px;
  border: 1px solid #191a23;
`

const HeaderLineBg = styled.img`
  position: absolute;
  right: 24px;
  bottom: 32px;
  max-width: 76px;
`

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;

  h2 {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`

const AvatarBadge = styled.span`
  display: inline-flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-size: 1.125rem;
  margin-right: 0.5rem;
  background: linear-gradient(135deg, #f0b90b 0%, #fcd535 100%);
`
const TraderTitle = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #191a23;
  padding: 4px 16px;
  background: #ffffff;
  border-radius: 8px;
`
const SelectorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`
const SelectorLabel = styled.span`
  font-size: 1rem;
  color: #191a23;
`
const Select = styled.select`
  background: #cafe36;
  border: 1px solid #191a23;
  color: #191a23;
  padding: 0.25rem 0.6rem;
  border-radius: 40px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
`
const HeaderBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #848e9c;
`
const ModelText = styled.div`
  font-size: 1rem;
  color: #191a23;
`
const ModelBadge = styled.span<{ $isQwen?: boolean }>`
  font-weight: 600;
  /* color: ${({ $isQwen }) => ($isQwen ? '#c084fc' : '#60a5fa')}; */
`
const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #191a23;
`
const Dot = styled.span`
  color: #191a23;
`
const StatusText = styled.span`
  color: #191a23;
`

/* Stats grid */
const StatsGrid = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;
  margin-bottom: 1.5rem;
`

/* Two columns layout */
const TwoCol = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;
  margin-bottom: 78px;
  @media (min-width: 1024px) {
  }
`
const LeftCol = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`
const RightCol = styled.div`
  min-width: 392px;
  padding: 24px 16px;
  background: #f3f3f3;
  border-radius: 16px;
  overflow: hidden;
`

/* Chart placeholder */
const ChartWrap = styled.div`
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid #0d4751;
  /* padding: 24px; */
`

/* Positions card */
const PositionsCard = styled.div`
  flex: 1;
  padding: 1.25rem;
  background: #f3f3f3;
  border-radius: 16px;
`
const PositionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`
const PositionsTitle = styled.h3`
  padding: 4px 12px;
  font-size: 1.25rem;
  color: #191a23;
  font-weight: bold;
  background: #cafe36;
  border-radius: 8px;
`
const PositionsCount = styled.div`
  font-size: 0.875rem;
  padding: 4px 12px;
  border-radius: 16px;
  color: #191a23;
  border: 1px solid #000000;
`
const PositionsTableWrap = styled.div`
  overflow-x: auto;
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }
  thead {
    border-bottom: 1px solid #111;
    th {
      text-align: left;
      padding: 0.5rem 0;
    }
  }
  tbody tr {
    border-bottom: 1px solid #2b3139;
    td {
      padding: 0.6rem 0;
    }
    .mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace;
    }
    .bold {
      font-weight: 700;
    }
    .leverage {
      color: #f0b90b;
    }
    .liq {
      color: #848e9c;
    }
  }
`
const SideBadge = styled.span<{ side: 'long' | 'short' }>`
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8rem;
  color: ${({ side }) => (side === 'long' ? '#0ECB81' : '#F6465D')};
  background: ${({ side }) => (side === 'long' ? 'rgba(14,203,129,0.1)' : 'rgba(246,70,93,0.1)')};
`
const NoPositions = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: #848e9c;
  .emoji {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    opacity: 0.6;
  }
`
const NoPositionsTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #191a23;
`
const NoPositionsDesc = styled.div`
  color: #191a23;
`

const PnLText = styled.span<{ positive: boolean }>`
  color: ${({ positive }) => (positive ? '#0ECB81' : '#F6465D')};
  font-weight: 700;
`

/* Decisions card */
const DecisionsCard = styled.div`
  border-radius: 12px;
`
const DecisionsHeader = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

const DecisionsTitle = styled.h4`
  padding: 4px 12px;
  margin-bottom: 4px;
  font-size: 1.25rem;
  color: #191a23;
  font-weight: bold;
  border-radius: 8px;
  background: #cafe36;
`
const DecisionsSub = styled.div`
  font-size: 0.875rem;
  color: #191a23;
`
const DecisionsList = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: calc(100vh - 158px);
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`
const EmptyDecisions = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #848e9c;
  .emoji {
    font-size: 2.5rem;
    opacity: 0.3;
    margin-bottom: 0.5rem;
  }
`
const EmptyDecisionsTitle = styled.div`
  color: #eaecef;
  font-weight: 700;
  margin-bottom: 0.5rem;
`
const EmptyDecisionsDesc = styled.div``
