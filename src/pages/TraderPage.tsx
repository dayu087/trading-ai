import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import { api } from '../lib/api'
import styled, { keyframes } from 'styled-components'
import { AlertTriangle } from 'lucide-react'
import { t, type Language } from '../i18n/translations'
import { EquityChart } from '../components/EquityChart'
import AILearning from '../components/AILearning'
import { useLanguage } from '../contexts/LanguageContext'
import type { TraderInfo, SystemStatus, AccountInfo, Position, DecisionRecord, Statistics } from '../types' // <- 根据你项目调整路径
import FooterView from '../components/FooterView'

interface TraderDetailsProps {
  selectedTrader?: TraderInfo
  traders?: TraderInfo[]
  tradersError?: Error
  selectedTraderId?: string
  onTraderSelect: (traderId: string) => void
  onNavigateToTraders: () => void
}

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

export default function TraderDetails({
  selectedTrader,
  traders,
  tradersError,
  selectedTraderId,
  onTraderSelect,
  onNavigateToTraders,
}: TraderDetailsProps) {
  const [lastUpdate, setLastUpdate] = useState<string>('--:--:--')
  const { language } = useLanguage()

  console.log(selectedTraderId, traders, 'traders')

  // 如果在trader页面，获取该trader的数据
  const { data: status } = useSWR<SystemStatus>(
    selectedTraderId ? `status-${selectedTraderId}` : null,
    () => api.getStatus(selectedTraderId),
    {
      refreshInterval: 15000, // 15秒刷新（配合后端15秒缓存）
      revalidateOnFocus: false, // 禁用聚焦时重新验证，减少请求
      dedupingInterval: 10000, // 10秒去重，防止短时间内重复请求
    }
  )

  const { data: account } = useSWR<AccountInfo>(
    selectedTraderId ? `account-${selectedTraderId}` : null,
    () => api.getAccount(selectedTraderId),
    {
      refreshInterval: 15000, // 15秒刷新（配合后端15秒缓存）
      revalidateOnFocus: false, // 禁用聚焦时重新验证，减少请求
      dedupingInterval: 10000, // 10秒去重，防止短时间内重复请求
    }
  )

  const { data: positions } = useSWR<Position[]>(
    selectedTraderId ? `positions-${selectedTraderId}` : null,
    () => api.getPositions(selectedTraderId),
    {
      refreshInterval: 15000, // 15秒刷新（配合后端15秒缓存）
      revalidateOnFocus: false, // 禁用聚焦时重新验证，减少请求
      dedupingInterval: 10000, // 10秒去重，防止短时间内重复请求
    }
  )

  const { data: decisions } = useSWR<DecisionRecord[]>(
    selectedTraderId ? `decisions/latest-${selectedTraderId}` : null,
    () => api.getLatestDecisions(selectedTraderId),
    {
      refreshInterval: 30000, // 30秒刷新（决策更新频率较低）
      revalidateOnFocus: false,
      dedupingInterval: 20000,
    }
  )

  const { data: stats } = useSWR<Statistics>(
    selectedTraderId ? `statistics-${selectedTraderId}` : null,
    () => api.getStatistics(selectedTraderId),
    {
      refreshInterval: 30000, // 30秒刷新（统计数据更新频率较低）
      revalidateOnFocus: false,
      dedupingInterval: 20000,
    }
  )

  useEffect(() => {
    if (account) {
      const now = new Date().toLocaleTimeString()
      setLastUpdate(now)
    }
  }, [account])

  if (tradersError) {
    return (
      <EmptyContainer>
        <EmptyInner>
          <IconCircle role="img" aria-hidden>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3" />
              <path d="M3 13h18" />
              <path d="M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </IconCircle>
          <EmptyTitle>{t('dashboardEmptyTitle', language)}</EmptyTitle>
          <EmptyDesc>{t('dashboardEmptyDescription', language)}</EmptyDesc>

          <CTAButton onClick={onNavigateToTraders}>{t('goToTradersPage', language)}</CTAButton>
        </EmptyInner>
      </EmptyContainer>
    )
  }

  // If traders is loaded and empty, show empty state
  if (traders && traders.length === 0) {
    return (
      <EmptyContainer>
        <EmptyInner>
          <IconCircle role="img" aria-hidden>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3" />
              <path d="M3 13h18" />
              <path d="M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </IconCircle>

          <EmptyTitle>{t('dashboardEmptyTitle', language)}</EmptyTitle>
          <EmptyDesc>{t('dashboardEmptyDescription', language)}</EmptyDesc>

          <CTAButton onClick={onNavigateToTraders}>{t('goToTradersPage', language)}</CTAButton>
        </EmptyInner>
      </EmptyContainer>
    )
  }

  // If traders is still loading or selectedTrader is not ready, show skeleton
  if (!selectedTrader) {
    return (
      <SkeletonWrapper>
        <CardSkeleton>
          <SkeletonBar style={{ width: '12rem', height: '2rem' }} />
          <SkeletonRow>
            <SkeletonBar style={{ width: '8rem', height: '1rem' }} />
            <SkeletonBar style={{ width: '6rem', height: '1rem' }} />
            <SkeletonBar style={{ width: '7rem', height: '1rem' }} />
          </SkeletonRow>
        </CardSkeleton>

        <GridSkeleton>
          {[1, 2, 3, 4].map((i) => (
            <SmallCardSkeleton key={i}>
              <SkeletonBar style={{ width: '6rem', height: '1rem' }} />
              <SkeletonBar style={{ width: '8rem', height: '2rem' }} />
            </SmallCardSkeleton>
          ))}
        </GridSkeleton>

        <CardSkeleton>
          <SkeletonBar style={{ width: '10rem', height: '1.5rem' }} />
          <LargeSkeleton style={{ height: '16rem' }} />
        </CardSkeleton>
      </SkeletonWrapper>
    )
  }

  return (
    <Root>
      <HeaderCard>
        <HeaderTop>
          <h2>
            <AvatarBadge>🤖</AvatarBadge>
            <TraderTitle>{selectedTrader.trader_name}</TraderTitle>
          </h2>

          {/* Trader Selector */}
          {traders && traders.length > 0 && (
            <SelectorRow>
              <SelectorLabel>{t('switchTrader', language)}:</SelectorLabel>
              <Select value={selectedTraderId} onChange={(e) => onTraderSelect(e.target.value)}>
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
            <ModelBadge $isQwen={selectedTrader.ai_model.includes('qwen')}>
              {getModelDisplayName(selectedTrader.ai_model.split('_').pop() || selectedTrader.ai_model)}
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
      </HeaderCard>

      {/* Debug Info */}
      {account && (
        <DebugBar>
          🔄 Last Update: {lastUpdate} | Total Equity: {account?.total_equity?.toFixed(2) || '0.00'} | Available:{' '}
          {account?.available_balance?.toFixed(2) || '0.00'} | P&L: {account?.total_pnl?.toFixed(2) || '0.00'} (
          {account?.total_pnl_pct?.toFixed(2) || '0.00'}%)
        </DebugBar>
      )}

      {/* Account Overview */}
      <StatsGrid>
        <StatCard
          title={t('totalEquity', language)}
          value={`${account?.total_equity?.toFixed(2) || '0.00'}`}
          change={account?.total_pnl_pct || 0}
          positive={(account?.total_pnl ?? 0) > 0}
        />
        <StatCard
          title={t('availableBalance', language)}
          value={`${account?.available_balance?.toFixed(2) || '0.00'}`}
          subtitle={`${
            account?.available_balance && account?.total_equity
              ? ((account.available_balance / account.total_equity) * 100).toFixed(1)
              : '0.0'
          }% ${t('free', language)}`}
          bg="#CAFE36"
        />
        <StatCard
          title={t('totalPnL', language)}
          value={`${
            account?.total_pnl !== undefined && account.total_pnl >= 0 ? '+' : ''
          }${account?.total_pnl?.toFixed(2) || '0.00'}`}
          change={account?.total_pnl_pct || 0}
          positive={(account?.total_pnl ?? 0) >= 0}
        />
        <StatCard
          isChange={true}
          title={t('positions', language)}
          value={`${account?.position_count || 0}`}
          subtitle={`${t('margin', language)}: ${account?.margin_used_pct?.toFixed(1) || '0.0'}%`}
          bg="#0D4751"
        />
      </StatsGrid>

      {/* Main two-column layout */}
      <TwoCol>
        {/* Left column: chart + positions */}
        <LeftCol>
          <ChartWrap>
            <EquityChart traderId={selectedTrader.trader_id}></EquityChart>
          </ChartWrap>

          {/* Current Positions */}
          <PositionsCard>
            <PositionsHeader>
              <PositionsTitle>📈 {t('currentPositions', language)}</PositionsTitle>
              {positions && positions.length > 0 && (
                <PositionsCount>
                  {positions.length} {t('active', language)}
                </PositionsCount>
              )}
            </PositionsHeader>

            {positions && positions.length > 0 ? (
              <PositionsTableWrap>
                <table>
                  <thead>
                    <tr>
                      <th>{t('symbol', language)}</th>
                      <th>{t('side', language)}</th>
                      <th>{t('entryPrice', language)}</th>
                      <th>{t('markPrice', language)}</th>
                      <th>{t('quantity', language)}</th>
                      <th>{t('positionValue', language)}</th>
                      <th>{t('leverage', language)}</th>
                      <th>{t('unrealizedPnL', language)}</th>
                      <th>{t('liqPrice', language)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((pos, i) => (
                      <tr key={i}>
                        <td className="mono">{pos.symbol}</td>
                        <td>
                          <SideBadge side={pos.side === 'long' ? 'long' : 'short'}>
                            {t(pos.side === 'long' ? 'long' : 'short', language)}
                          </SideBadge>
                        </td>
                        <td className="mono">{pos.entry_price.toFixed(4)}</td>
                        <td className="mono">{pos.mark_price.toFixed(4)}</td>
                        <td className="mono">{pos.quantity.toFixed(4)}</td>
                        <td className="mono bold">{(pos.quantity * pos.mark_price).toFixed(2)} USDT</td>
                        <td className="mono leverage">{pos.leverage}x</td>
                        <td className="mono">
                          <PnLText positive={pos.unrealized_pnl >= 0}>
                            {pos.unrealized_pnl >= 0 ? '+' : ''}
                            {pos.unrealized_pnl.toFixed(2)} ({pos.unrealized_pnl_pct.toFixed(2)}%)
                          </PnLText>
                        </td>
                        <td className="mono liq">{pos.liquidation_price.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </PositionsTableWrap>
            ) : (
              <NoPositions>
                <div className="emoji">📊</div>
                <NoPositionsTitle>{t('noPositions', language)}</NoPositionsTitle>
                <NoPositionsDesc>{t('noActivePositions', language)}</NoPositionsDesc>
              </NoPositions>
            )}
          </PositionsCard>
        </LeftCol>

        {/* Right column: recent decisions */}
        <RightCol>
          <DecisionsCard>
            <DecisionsHeader>
              <DecisionsIcon>🧠</DecisionsIcon>
              <div>
                <DecisionsTitle>{t('recentDecisions', language)}</DecisionsTitle>
                {decisions && decisions.length > 0 && (
                  <DecisionsSub>{t('lastCycles', language, { count: decisions.length })}</DecisionsSub>
                )}
              </div>
            </DecisionsHeader>

            <DecisionsList>
              {decisions && decisions.length > 0 ? (
                decisions.map((decision, i) => <DecisionCard key={i} decision={decision} language={language} />)
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
      <AILearningWrap>
        <AILearning traderId={selectedTrader.trader_id} />
      </AILearningWrap>

      <FooterView />
    </Root>
  )
}

/* ------------------ Internal StatCard (keeps original logic) ------------------ */
function StatCard({
  title,
  value,
  change,
  positive,
  subtitle,
  isChange,
  bg,
}: {
  bg?: string
  title: string
  value: string
  change?: number
  positive?: boolean
  subtitle?: string
  isChange?: boolean
}) {
  return (
    <StatCardBox $bg={bg}>
      <StatTitle>{title}</StatTitle>
      <StatValue>
        <strong> {value}</strong>
        {isChange ? <span> </span> : <span> USDT</span>}
      </StatValue>
      {change !== undefined && (
        <StatChange $positive={positive}>
          {positive ? '▲' : '▼'} {positive ? '+' : ''}
          {change.toFixed(2)}%
        </StatChange>
      )}
      {subtitle && <StatSubtitle>{subtitle}</StatSubtitle>}
    </StatCardBox>
  )
}

/* ------------------ Internal DecisionCard (keeps original logic) ------------------ */
function DecisionCard({ decision, language }: { decision: DecisionRecord; language: Language }) {
  const [showInputPrompt, setShowInputPrompt] = useState(false)
  const [showCoT, setShowCoT] = useState(false)

  return (
    <DecisionBox>
      {/* Header */}
      <DecisionHeader>
        <DecisionInfo>
          <DecisionCycle>
            {t('cycle', language)} #{decision.cycle_number}
          </DecisionCycle>
          <DecisionStatus $success={decision.success}>
            {t(decision.success ? 'success' : 'failed', language)}
          </DecisionStatus>
        </DecisionInfo>
        <DecisionTime>{new Date(decision.timestamp).toLocaleString()}</DecisionTime>
      </DecisionHeader>

      {/* Input Prompt */}
      {decision.input_prompt && (
        <div>
          <ToggleRow>
            <ToggleButton color="#60a5fa" onClick={() => setShowInputPrompt(!showInputPrompt)}>
              <strong>📥 {t('inputPrompt', language)}</strong>
              <span>{showInputPrompt ? t('collapse', language) : t('expand', language)}</span>
            </ToggleButton>
          </ToggleRow>
          {showInputPrompt && <CodeBlock>{decision.input_prompt}</CodeBlock>}
        </div>
      )}

      {/* CoT */}
      {decision.cot_trace && (
        <div>
          <ToggleRow>
            <ToggleButton color="#F0B90B" onClick={() => setShowCoT(!showCoT)}>
              <strong>📤 {t('aiThinking', language)}</strong>
              <span>{showCoT ? t('collapse', language) : t('expand', language)}</span>
            </ToggleButton>
          </ToggleRow>
          {showCoT && <CodeBlock>{decision.cot_trace}</CodeBlock>}
        </div>
      )}

      {/* Decisions Actions */}
      {decision.decisions && decision.decisions.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {decision.decisions.map((action, j) => (
            <ActionItem key={j}>
              <ActionSymbol>{action.symbol}</ActionSymbol>
              <ActionBadge $isOpen={action.action.includes('open')}>{action.action}</ActionBadge>
              {action.leverage > 0 && <ActionText color="#F0B90B">{action.leverage}x</ActionText>}
              {action.price > 0 && (
                <ActionText className="mono" color="#848E9C">
                  @{action.price.toFixed(4)}
                </ActionText>
              )}
              <ActionText color={action.success ? '#0ECB81' : '#F6465D'}>{action.success ? '✓' : '✗'}</ActionText>
              {action.error && <ActionText color="#F6465D">{action.error}</ActionText>}
            </ActionItem>
          ))}
        </div>
      )}

      {/* Account State Summary */}
      {decision.account_state && (
        <AccountState>
          <span>净值: {decision.account_state.total_balance.toFixed(2)} USDT</span>
          <span>可用: {decision.account_state.available_balance.toFixed(2)} USDT</span>
          <span>保证金率: {decision.account_state.margin_used_pct.toFixed(1)}%</span>
          <span>持仓: {decision.account_state.position_count}</span>
          <span
            style={{
              color: decision.candidate_coins && decision.candidate_coins.length === 0 ? '#F6465D' : '#848E9C',
            }}
          >
            {t('candidateCoins', language)}: {decision.candidate_coins?.length || 0}
          </span>
        </AccountState>
      )}

      {/* Candidate Coins Warning */}
      {decision.candidate_coins && decision.candidate_coins.length === 0 && (
        <WarningRow>
          <AlertTriangle size={16} />
          <WarningContent>
            <div style={{ fontWeight: 700 }}>⚠️ {t('candidateCoinsZeroWarning', language)}</div>
            <div style={{ color: '#848E9C', fontSize: 12 }}>
              <div>{t('possibleReasons', language)}</div>
              <ul style={{ marginLeft: 16 }}>
                <li>{t('coinPoolApiNotConfigured', language)}</li>
                <li>{t('apiConnectionTimeout', language)}</li>
                <li>{t('noCustomCoinsAndApiFailed', language)}</li>
              </ul>
              <div style={{ marginTop: 6, fontWeight: 700 }}>{t('solutions', language)}</div>
              <ul style={{ marginLeft: 16 }}>
                <li>{t('setCustomCoinsInConfig', language)}</li>
                <li>{t('orConfigureCorrectApiUrl', language)}</li>
                <li>{t('orDisableCoinPoolOptions', language)}</li>
              </ul>
            </div>
          </WarningContent>
        </WarningRow>
      )}

      {/* Execution Logs */}
      {decision.execution_log && decision.execution_log.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {decision.execution_log.map((log, k) => (
            <LogLine key={k} $success={log.includes('✓') || log.includes('成功')}>
              {log}
            </LogLine>
          ))}
        </div>
      )}

      {/* Error Message */}
      {decision.error_message && <ErrorBox>❌ {decision.error_message}</ErrorBox>}
    </DecisionBox>
  )
}

/* -------------------- styled components -------------------- */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`

const Root = styled.div`
  animation: ${fadeIn} 0.25s ease;
`

/* Empty states */
const EmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`
const EmptyInner = styled.div`
  text-align: center;
  max-width: 28rem;
  padding: 1.5rem;
`
const IconCircle = styled.div`
  width: 96px;
  height: 96px;
  margin: 0 auto 1.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(240, 185, 11, 0.1);
  border: 2px solid rgba(240, 185, 11, 0.3);
  color: #f0b90b;
`
const EmptyTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #eaecef;
`
const EmptyDesc = styled.p`
  color: #848e9c;
  margin-bottom: 1rem;
`
const CTAButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #f0b90b 0%, #fcd535 100%);
  color: #0b0e11;
  box-shadow: 0 4px 12px rgba(240, 185, 11, 0.3);
  transition: transform 0.12s;
  &:active {
    transform: scale(0.98);
  }
  &:hover {
    transform: scale(1.05);
  }
`

/* Skeletons */
const SkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const CardSkeleton = styled.div`
  background: #1e2329;
  border: 1px solid #2b3139;
  border-radius: 12px;
  padding: 1.25rem;
  animation: pulse 1.2s infinite ease-in-out;
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
`
const SkeletonBar = styled.div`
  background: #0b0e11;
  border-radius: 6px;
  margin-bottom: 0.5rem;
`
const SkeletonRow = styled.div`
  display: flex;
  gap: 12px;
`
const GridSkeleton = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`
const SmallCardSkeleton = styled.div`
  background: #1e2329;
  border: 1px solid #2b3139;
  border-radius: 12px;
  padding: 1rem;
  animation: pulse 1.2s infinite ease-in-out;
`
const LargeSkeleton = styled.div`
  background: #0b0e11;
  border-radius: 8px;
`

/* Header card */
const HeaderCard = styled.div`
  padding: 2.5rem 1.5rem 2rem 4rem;
  background: #cafe36;
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 24px 24px 24px 24px;
  border: 1px solid #191a23;
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
const ModelBadge = styled.span<{ $isQwen: boolean }>`
  font-weight: 600;
  color: ${({ $isQwen }) => ($isQwen ? '#c084fc' : '#60a5fa')};
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

/* Debug bar */
const DebugBar = styled.div`
  margin: 2.5rem 0;
  padding: 12px 24px;
  font-size: 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Helvetica Neue', monospace;
  color: #000000;
  background: #f3f3f3;
  border-radius: 16px 16px 16px 16px;
`

/* Stats grid */
const StatsGrid = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 1.5rem;
`
const StatCardBox = styled.div<{ $bg?: string }>`
  flex: 1 1 25%;
  padding: 1rem;
  border-radius: 24px;
  border: 1px solid #191a23;
  background: ${({ $bg }) => $bg || '#f3f3f3'};
`
const StatTitle = styled.div`
  font-size: 0.875rem;
  color: #191a23;
  margin-bottom: 0.25rem;
  /* text-transform: uppercase; */
`
const StatValue = styled.div`
  font-weight: bold;
  strong {
    font-size: 2rem;
    color: #191a23;
    margin-bottom: 0.25rem;
  }

  span {
    font-size: 14px;
    color: #191a23;
  }
`
const StatChange = styled.div<{ $positive?: boolean }>`
  color: ${({ $positive }) => ($positive ? '#2B6D18' : '#A54162')};
  font-weight: 700;
  font-size: 1rem;
`
const StatSubtitle = styled.div`
  color: #191a23;
  font-size: 1rem;
`

/* Two columns layout */
const TwoCol = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 2.5rem;

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
  background: #f3f3f3;
  border-radius: 16px;
  overflow: hidden;
  /* padding: 24px; */
`

const EquityChartPlaceholder = styled.div``

/* Positions card */
const PositionsCard = styled.div`
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
    color: #eaecef;
    font-size: 0.9rem;
  }
  thead {
    border-bottom: 1px solid #111;
    th {
      text-align: left;
      padding: 0.5rem 0;
      color: #848e9c;
      font-weight: 700;
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
      color: #eaecef;
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
const DecisionsIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  font-size: 1.125rem;
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

/* Decision internal */
const DecisionBox = styled.div`
  padding: 1rem;
  background: #ffffff;
  border-radius: 16px;
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-2px);
  }
`
const DecisionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const DecisionInfo = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`

const DecisionCycle = styled.div`
  padding: 4px 12px;
  color: #cafe36;
  font-weight: bold;
  background: #0d4751;
  border-radius: 8px;
`
const DecisionTime = styled.div`
  padding-bottom: 16px;
  margin-bottom: 16px;
  font-size: 0.75rem;
  color: #191a23;
  border-bottom: 1px solid #f3f3f3;
`
const DecisionStatus = styled.div<{ $success: boolean }>`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${({ $success }) => ($success ? '#0ECB81' : '#F6465D')};
  background: ${({ $success }) => ($success ? 'rgba(14,203,129,0.1)' : 'rgba(246,70,93,0.1)')};
`
const ToggleRow = styled.div`
  margin-bottom: 8px;
`
const ToggleButton = styled.button<{ color?: string }>`
  background: none;
  border: none;
  color: ${({ color }) => color || '#60a5fa'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;

  strong {
    color: #191a23;
  }
`
const CodeBlock = styled.pre`
  max-width: 320px;
  border: 1px solid #2b3139;
  border-radius: 8px;
  padding: 0.75rem;
  color: #191a23;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace;
  white-space: pre-wrap;
  max-height: 24rem;
  overflow-y: auto;
  margin-top: 8px;
  background: rgba(243, 243, 243, 0.7);
`
const ActionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: rgba(243, 243, 243, 0.7);
  border-radius: 4px;
  margin-bottom: 12px;
`
const ActionSymbol = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace;
  font-size: 14px;
  color: #191a23;
`
const ActionBadge = styled.span<{ $isOpen: boolean }>`
  margin-left: auto;
  border-radius: 4px;
  font-size: 14px;
  color: ${({ $isOpen }) => ($isOpen ? '#60a5fa' : '#F0B90B')};
`
const ActionText = styled.span<{ color?: string }>`
  color: ${({ color }) => color || '#848E9C'};
  font-size: 0.85rem;
`

const AccountState = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 24px;
  background: rgba(243, 243, 243, 0.7);
  border-radius: 4px;
  color: #191a23;
  margin-top: 8px;
  font-size: 0.875rem;
`

const WarningRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  background: rgba(246, 70, 93, 0.1);
  border: 1px solid rgba(246, 70, 93, 0.3);
  padding: 8px;
  border-radius: 6px;
  color: #f6465d;
  margin-top: 8px;
`
const WarningContent = styled.div`
  flex: 1;
`

const LogLine = styled.div<{ $success?: boolean }>`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace;
  color: ${({ $success }) => ($success ? '#0ECB81' : '#F6465D')};
  font-size: 0.875rem;
  margin-top: 4px;
`

const ErrorBox = styled.div`
  background: rgba(246, 70, 93, 0.1);
  color: #f6465d;
  padding: 8px;
  border-radius: 6px;
  margin-top: 8px;
`

/* AILearning placeholder wrapper */
const AILearningWrap = styled.div``
