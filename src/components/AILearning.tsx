import useSWR from 'swr'
import { styled } from 'styled-components'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../i18n/translations'
import { api } from '../lib/api'
import {
  Brain,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Coins,
  Trophy,
  ScrollText,
  Lightbulb,
} from 'lucide-react'

interface TradeOutcome {
  symbol: string
  side: string
  quantity: number
  leverage: number
  open_price: number
  close_price: number
  position_value: number
  margin_used: number
  pn_l: number
  pn_l_pct: number
  duration: string
  open_time: string
  close_time: string
  was_stop_loss: boolean
}

interface SymbolPerformance {
  symbol: string
  total_trades: number
  winning_trades: number
  losing_trades: number
  win_rate: number
  total_pn_l: number
  avg_pn_l: number
}

interface PerformanceAnalysis {
  total_trades: number
  winning_trades: number
  losing_trades: number
  win_rate: number
  avg_win: number
  avg_loss: number
  profit_factor: number
  sharpe_ratio: number
  recent_trades: TradeOutcome[]
  symbol_stats: { [key: string]: SymbolPerformance }
  best_symbol: string
  worst_symbol: string
}

interface AILearningProps {
  traderId: string
}

export default function AILearning({ traderId }: AILearningProps) {
  const { language } = useLanguage()
  const { data: performance, error } = useSWR<PerformanceAnalysis>(
    traderId ? `performance-${traderId}` : 'performance',
    () => api.getPerformance(traderId),
    {
      refreshInterval: 30000, // 30秒刷新（AI学习分析数据更新频率较低）
      revalidateOnFocus: false,
      dedupingInterval: 20000,
    }
  )

  if (error) {
    return (
      <div className="rounded p-6" style={{ background: '#1E2329', border: '1px solid #2B3139' }}>
        <div style={{ color: '#F6465D' }}>{t('loadingError', language)}</div>
      </div>
    )
  }

  if (!performance) {
    return (
      <div className="rounded p-6" style={{ background: '#1E2329', border: '1px solid #2B3139' }}>
        <div className="flex items-center gap-2" style={{ color: '#848E9C' }}>
          <BarChart3 className="w-4 h-4" /> {t('loading', language)}
        </div>
      </div>
    )
  }

  if (!performance || performance.total_trades === 0) {
    return (
      <div className="rounded p-6" style={{ background: '#1E2329', border: '1px solid #2B3139' }}>
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5" style={{ color: '#8B5CF6' }} />
          <h2 className="text-lg font-bold" style={{ color: '#EAECEF' }}>
            {t('aiLearning', language)}
          </h2>
        </div>
        <div style={{ color: '#848E9C' }}>{t('noCompleteData', language)}</div>
      </div>
    )
  }

  const symbolStats = performance.symbol_stats || {}
  const symbolStatsList = Object.values(symbolStats)
    .filter((stat) => stat != null)
    .sort((a, b) => (b.total_pn_l || 0) - (a.total_pn_l || 0))

  return (
    <AILearningWrapper>
      {/* 标题卡片 */}
      <TitleCard>
        <Brain size={40} color="#191A23" />
        <TitleText>
          <TitleMain>{t('aiLearning', language)}</TitleMain>
          <TitleSub>{t('tradesAnalyzed', language, { count: performance.total_trades })}</TitleSub>
        </TitleText>
      </TitleCard>

      {/* 指标卡片区域 */}
      <MetricsGrid>
        {/* 总交易数（白色卡片） */}
        <MetricCard $bg="#FFFFFF">
          <MetricLabel>{t('totalTrades', language)}</MetricLabel>
          <MetricValue>
            <HighlightNumber>{performance.total_trades}</HighlightNumber>
          </MetricValue>
          <MetricUnit>Trades</MetricUnit>
        </MetricCard>

        {/* 胜率（亮绿卡片） */}
        <MetricCard $bg="#CAFE36">
          <MetricLabel>{t('winRate', language)}</MetricLabel>
          <MetricValue>
            <HighlightNumber>{(performance.win_rate || 0).toFixed(1)}%</HighlightNumber>
          </MetricValue>
          <MetricUnit>
            {performance.winning_trades}W / {performance.losing_trades}L
          </MetricUnit>
        </MetricCard>

        {/* 平均盈利（深蓝卡片） */}
        <MetricCard $bg="#0F2C3F">
          <MetricLabel style={{ color: '#CAFE36' }}>{t('avgWin', language)}</MetricLabel>
          <MetricValue style={{ color: '#CAFE36' }}>
            <HighlightNumber>+{(performance.avg_win || 0).toFixed(2)}</HighlightNumber>
          </MetricValue>
          <MetricUnit style={{ color: '#A5D8FF' }}>USDT Average</MetricUnit>
        </MetricCard>

        {/* 平均亏损（白色卡片） */}
        <MetricCard $bg="#FFFFFF">
          <MetricLabel>{t('avgLoss', language)}</MetricLabel>
          <MetricValue>
            <HighlightNumber>{(performance.avg_loss || 0).toFixed(2)}</HighlightNumber>
          </MetricValue>
          <MetricUnit>USDT Average</MetricUnit>
        </MetricCard>
      </MetricsGrid>

      {/* 夏普比率 + 盈亏比 */}
      <StatsGrid>
        <Card>
          <CardHeader>
            <CardIcon>
              <Sparkles className="w-6 h-6" style={{ color: '#A78BFA' }} />
            </CardIcon>
            <div>
              <CardTitle>夏普比率</CardTitle>
              <CardSubTitle>风险调整后收益</CardSubTitle>
            </div>
          </CardHeader>
          {/* Value */}
          <CardValueBox>
            <ValueText $value={performance.sharpe_ratio || 0}>
              {performance.sharpe_ratio ? performance.sharpe_ratio.toFixed(2) : 'N/A'}
            </ValueText>
            {performance.sharpe_ratio !== undefined && (
              <Badge $value={performance.sharpe_ratio || 0}>
                {performance.sharpe_ratio >= 2
                  ? '🟢 卓越表现'
                  : performance.sharpe_ratio >= 1
                    ? '🟢 良好表现'
                    : performance.sharpe_ratio >= 0
                      ? '🟡 波动较大'
                      : '🔴 需要调整'}
              </Badge>
            )}
          </CardValueBox>

          {/* Info */}
          {performance.sharpe_ratio !== undefined && (
            <InfoBox>
              {performance.sharpe_ratio >= 2 && '✨ AI策略非常有效！风险调整后收益优异，可适度扩大仓位但保持纪律。'}
              {performance.sharpe_ratio >= 1 &&
                performance.sharpe_ratio < 2 &&
                '✅ 策略表现稳健，风险收益平衡良好，继续保持当前策略。'}
              {performance.sharpe_ratio >= 0 &&
                performance.sharpe_ratio < 1 &&
                '⚠️ 收益为正但波动较大，AI正在优化策略，降低风险。'}
              {performance.sharpe_ratio < 0 && '🚨 当前策略需要调整！AI已自动进入保守模式，减少仓位和交易频率。'}
            </InfoBox>
          )}
        </Card>

        <Card
          $bg="linear-gradient(135deg, rgba(240, 185, 11, 0.25) 0%, rgba(252, 213, 53, 0.15) 50%, rgba(30, 35, 41, 0.9) 100%)"
          $border="2px solid rgba(240, 185, 11, 0.5)"
          $shadow="0 12px 40px rgba(240, 185, 11, 0.3)"
        >
          <CardHeader>
            <CardIcon>
              <Coins className="w-6 h-6" style={{ color: '#FCD34D' }} />
            </CardIcon>
            <div>
              <CardTitle>{t('profitFactor', language)}</CardTitle>
              <CardSubTitle> {t('avgWinDivLoss', language)}</CardSubTitle>
            </div>
          </CardHeader>

          <CardValueBox>
            <ValueText $value={performance.profit_factor || 0}>
              {(performance.profit_factor || 0) > 0 ? (performance.profit_factor || 0).toFixed(2) : 'N/A'}
            </ValueText>

            <Badge $value={performance.profit_factor || 0}>
              {(performance.profit_factor || 0) >= 2 && t('excellent', language)}
              {(performance.profit_factor || 0) >= 1.5 && (performance.profit_factor || 0) < 2 && t('good', language)}
              {(performance.profit_factor || 0) >= 1 && (performance.profit_factor || 0) < 1.5 && t('fair', language)}
              {(performance.profit_factor || 0) > 0 && (performance.profit_factor || 0) < 1 && t('poor', language)}
            </Badge>
          </CardValueBox>

          <InfoBox>
            {(performance.profit_factor || 0) >= 2 &&
              `🔥 盈利能力出色！每亏1元能赚${(performance.profit_factor || 0).toFixed(1)}元，AI策略表现优异。`}

            {(performance.profit_factor || 0) >= 1.5 &&
              (performance.profit_factor || 0) < 2 &&
              '✓ 策略稳定盈利，盈亏比健康，继续保持纪律性交易。'}

            {(performance.profit_factor || 0) >= 1 &&
              (performance.profit_factor || 0) < 1.5 &&
              '⚠️ 策略略有盈利但需优化，AI正在调整仓位和止损策略。'}

            {(performance.profit_factor || 0) > 0 &&
              (performance.profit_factor || 0) < 1 &&
              '❌ 平均亏损大于盈利，需要调整策略或降低交易频率。'}
          </InfoBox>
        </Card>
      </StatsGrid>

      {/* ================= 最佳 / 最差 币种 ================= */}
      {(performance.best_symbol || performance.worst_symbol) && (
        <StatsGrid>
          {/* Best */}
          {performance.best_symbol && (
            <SymbolCard>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-6 h-6" style={{ color: '#10B981' }} />
                <span className="text-sm font-semibold" style={{ color: '#6EE7B7' }}>
                  {t('bestPerformer', language)}
                </span>
              </div>
              <div className="text-3xl font-bold mono mb-1" style={{ color: '#10B981' }}>
                {performance.best_symbol}
              </div>
              {symbolStats[performance.best_symbol] && (
                <div className="text-lg font-semibold" style={{ color: '#6EE7B7' }}>
                  {symbolStats[performance.best_symbol].total_pn_l > 0 ? '+' : ''}
                  {symbolStats[performance.best_symbol].total_pn_l.toFixed(2)} USDT {t('pnl', language)}
                </div>
              )}
            </SymbolCard>
          )}

          {/* Worst */}
          {performance.worst_symbol && (
            <SymbolCard>
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-6 h-6" style={{ color: '#F87171' }} />
                <span className="text-sm font-semibold" style={{ color: '#FCA5A5' }}>
                  {t('worstPerformer', language)}
                </span>
              </div>
              <div className="text-3xl font-bold mono mb-1" style={{ color: '#F87171' }}>
                {performance.worst_symbol}
              </div>
              {symbolStats[performance.worst_symbol] && (
                <div className="text-lg font-semibold" style={{ color: '#FCA5A5' }}>
                  {symbolStats[performance.worst_symbol].total_pn_l > 0 ? '+' : ''}
                  {symbolStats[performance.worst_symbol].total_pn_l.toFixed(2)} USDT {t('pnl', language)}
                </div>
              )}
            </SymbolCard>
          )}
        </StatsGrid>
      )}

      {/* 币种表现 & 历史成交 - 左右分屏 2列布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：币种表现统计表格 */}
        {symbolStatsList.length > 0 && (
          <Panel $isTable={true}>
            <HeaderTitle>{t('symbolPerformance', language)}</HeaderTitle>
            <StyledTable>
              <thead>
                <tr>
                  <Th>Symbol</Th>
                  <Th>Trades</Th>
                  <Th>Win Rate</Th>
                  <Th>Total P&L (USDT)</Th>
                  <Th>Avg P&L (USDT)</Th>
                </tr>
              </thead>

              <tbody>
                {symbolStatsList.map((stat, idx) => (
                  <TableRow key={stat.symbol} $border={idx > 0}>
                    <Td>
                      <SymbolText>{stat.symbol}</SymbolText>
                    </Td>
                    <Td>{stat.total_trades}</Td>
                    <Td $value={stat.win_rate}>{(stat.win_rate || 0).toFixed(1)}%</Td>
                    <Td $value={stat.total_pn_l}>
                      {(stat.total_pn_l || 0) > 0 ? '+' : ''}
                      {(stat.total_pn_l || 0).toFixed(2)}
                    </Td>
                    <Td $value={stat.avg_pn_l}>
                      {(stat.avg_pn_l || 0) > 0 ? '+' : ''}
                      {(stat.avg_pn_l || 0).toFixed(2)}
                    </Td>
                  </TableRow>
                ))}
              </tbody>
            </StyledTable>
          </Panel>
        )}

        {/* 右侧：历史成交记录 */}
        <Panel>
          <TradeHistoryHeader>
            <HeaderTitle>{t('tradeHistory', language)}</HeaderTitle>
            <HeaderDesc>
              {performance?.recent_trades && performance.recent_trades.length > 0
                ? t('completedTrades', language, {
                    count: performance.recent_trades.length,
                  })
                : t('completedTradesWillAppear', language)}
            </HeaderDesc>
          </TradeHistoryHeader>

          <TradeList>
            {performance?.recent_trades && performance.recent_trades.length > 0 ? (
              performance.recent_trades.map((trade, idx) => {
                const isProfitable = trade.pn_l >= 0
                const isRecent = idx === 0
                return (
                  <TradeItem key={idx}>
                    <RowBetween>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Symbol>{trade.symbol}</Symbol>
                        <SideTag $long={trade.side === 'long'}>{trade.side.toUpperCase()}</SideTag>
                        {isRecent && <LatestTag>{t('latest', language)}</LatestTag>}
                      </div>

                      <ProfitText $profit={isProfitable}>
                        {isProfitable ? '+' : ''}
                        {trade.pn_l_pct.toFixed(2)}%
                      </ProfitText>
                    </RowBetween>

                    <Grid2>
                      <div>
                        <Label>{t('entry', language)}</Label>
                        <Value>{trade.open_price.toFixed(4)}</Value>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Label>{t('exit', language)}</Label>
                        <Value>{trade.close_price.toFixed(4)}</Value>
                      </div>
                    </Grid2>

                    <Grid2>
                      <div>
                        <Label>Quantity</Label>
                        <Value>{trade.quantity ? trade.quantity.toFixed(4) : '-'}</Value>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Label>Leverage</Label>
                        <ValueYellow>{trade.leverage ? `${trade.leverage}x` : '-'}</ValueYellow>
                      </div>
                    </Grid2>
                    <Grid2>
                      <div>
                        <Label>Position Value</Label>
                        <Value>{trade.position_value ? `$${trade.position_value.toFixed(2)}` : '-'}</Value>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Label>Margin Used</Label>
                        <ValuePurple>{trade.margin_used ? `$${trade.margin_used.toFixed(2)}` : '-'}</ValuePurple>
                      </div>
                    </Grid2>

                    <PnLBox $profit={isProfitable}>
                      <Label>P&L</Label>
                      <PnLText $profit={isProfitable}>
                        {isProfitable ? '+' : ''}
                        {trade.pn_l.toFixed(2)} USDT
                      </PnLText>
                    </PnLBox>

                    <DateBox>
                      <span>⏱️ {formatDuration(trade.duration)}</span>
                      {trade.was_stop_loss && <StopLossTag>{t('stopLoss', language)}</StopLossTag>}
                    </DateBox>

                    <FooterMeta>
                      {new Date(trade.close_time).toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </FooterMeta>
                  </TradeItem>
                )
              })
            ) : (
              <EmptyBox>
                <div style={{ marginBottom: 8, opacity: 0.5 }}>
                  <ScrollText className="w-10 h-10" style={{ color: '#94A3B8' }} />
                </div>
                {t('noCompletedTrades', language)}
              </EmptyBox>
            )}
          </TradeList>
        </Panel>
      </div>

      {/* AI学习说明 - 现代化设计 */}

      <InfoCard>
        <Row>
          <IconWrapper>
            <Lightbulb className="w-5 h-5" style={{ color: '#FCD34D' }} />
          </IconWrapper>

          <div>
            <Title>{t('howAILearns', language)}</Title>
            <PointsGrid>
              <PointRow>
                <Bullet>•</Bullet>
                <PointText>{t('aiLearningPoint1', language)}</PointText>
              </PointRow>

              <PointRow>
                <Bullet>•</Bullet>
                <PointText>{t('aiLearningPoint2', language)}</PointText>
              </PointRow>

              <PointRow>
                <Bullet>•</Bullet>
                <PointText>{t('aiLearningPoint3', language)}</PointText>
              </PointRow>

              <PointRow>
                <Bullet>•</Bullet>
                <PointText>{t('aiLearningPoint4', language)}</PointText>
              </PointRow>
            </PointsGrid>
          </div>
        </Row>
      </InfoCard>
    </AILearningWrapper>
  )
}

// 格式化持仓时长
function formatDuration(duration: string | undefined): string {
  if (!duration) return '-'

  const match = duration.match(/(\d+h)?(\d+m)?(\d+\.?\d*s)?/)
  if (!match) return duration

  const hours = match[1] || ''
  const minutes = match[2] || ''
  const seconds = match[3] || ''

  let result = ''
  if (hours) result += hours.replace('h', '小时')
  if (minutes) result += minutes.replace('m', '分')
  if (!hours && seconds) result += seconds.replace(/(\d+)\.?\d*s/, '$1秒')

  return result || duration
}

// ====== Title Card ======

const AILearningWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: -52px;
  padding-bottom: 80px;
  max-width: 1220px;
`

const TitleCard = styled.div`
  width: 100%;
  background: #cafe36;
  border-radius: 24px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 4px 4px 0px 0px #191a23;
`

const TitleText = styled.div`
  display: flex;
  flex-direction: column;
`

const TitleMain = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: #191a23;
`

const TitleSub = styled.p`
  font-size: 14px;
  margin: 4px 0 0;
  color: #3a3c42;
`

const MetricsGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`

// ====== Metric Card（白、深蓝、亮绿 3种背景可切换） ======
const MetricCard = styled.div<{ $bg: string }>`
  background: ${(props) => props.$bg || '#FFFFFF'};
  border-radius: 24px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 4px 0px #191a23;
  border: 2px solid #191a23;
`

const MetricLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #191a23;
  margin-bottom: 8px;
`

const MetricValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #191a23;
`

const MetricUnit = styled.div`
  font-size: 12px;
  color: #3a3c42;
`

const HighlightNumber = styled.span`
  background: #cafe36;
  color: #191a23;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: bold;
`

const StatsGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`

const Card = styled.div<{ $bg?: string; $border?: string; $shadow?: string }>`
  flex: 1 1 50%;
  padding: 24px;
  overflow: hidden;
  background: #ffffff;
  border-radius: 24px;
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const CardIcon = styled.div`
  width: 60px;
  height: 60px;
  background: #f3f3f3;
  border-radius: 8px;
  img {
    width: 100%;
    height: 100%;
  }
`

const CardTitle = styled.div`
  padding: 4px 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  font-size: 1.25rem;
  color: #191a23;
  font-weight: bold;
  background: #cafe36;
`

const CardSubTitle = styled.div`
  font-size: 0.875rem;
  color: #191a23;
`

const CardValueBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0;
`

const ValueText = styled.div<{ $value: number }>`
  font-size: 2.5rem;
  font-weight: bold;
  font-family: monospace;
  color: ${({ $value }) => ($value > 0 ? 'var(--up_color)' : 'var(--down_color)')};
`

const Badge = styled.div<{ $value: number }>`
  font-size: 1;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  color: ${({ $value }) => ($value > 0 ? 'var(--up_color)' : 'var(--down_color)')};
  background: ${({ $value }) => ($value > 0 ? 'var(--up_bg)' : 'var(--down_bg)')};
`

const InfoBox = styled.div`
  font-size: 0.875rem;
  color: #000000;
`

const SymbolCard = styled.div`
  flex: 1 1 50%;
  border-radius: 1.5rem;
  padding: 1.5rem;
  background: #fff;
`

const Panel = styled.div<{ $isTable?: boolean }>`
  max-height: calc(100vh - 200px);
  padding: ${({ $isTable }) => ($isTable ? '24px' : '24px 0')};
  border-radius: 1rem;
  background: #f3f3f3;
  border: 1px solid #191a23;
  overflow: hidden;
`

const HeaderTitle = styled.h3`
  width: fit-content;
  padding: 8px 12px;
  font-size: 1.25rem;
  font-weight: bold;
  color: #191a23;
  background: #ffffff;
  border-radius: 8px;
`

// ===== 表格 =====
const StyledTable = styled.table`
  width: 100%;
  margin-top: 16px;
  background: #ffffff;
  border-radius: 8px;

  thead {
    border-bottom: 1px solid #f3f3f3;
  }

  tbody {
    overflow-y: auto;
    max-height: 347px;
  }
`

const Th = styled.th`
  text-align: left;
  padding: 16px;
  font-size: 0.75rem;
  color: #000000;
`

const Td = styled.td<{ $value?: number }>`
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-family: monospace;
  color: ${({ $value }) => ($value ? ($value > 0 ? 'var(--up_color)' : 'var(--down_color)') : '#000')};
`

const TableRow = styled.tr<{ $border?: boolean }>`
  transition: background 0.2s;
  border-top: ${({ $border }) => ($border ? '1px solid rgba(99,102,241,0.1)' : 'none')};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`

const SymbolText = styled.span`
  font-weight: bold;
  font-family: monospace;
`

// Container
const TradeHistoryContainer = styled.div`
  border-radius: 16px;
  overflow: hidden;
  background: rgba(30, 35, 41, 0.4);
  border: 1px solid rgba(240, 185, 11, 0.2);
  max-height: calc(100vh - 200px);
`

// Header
const TradeHistoryHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 24px;
`

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const HeaderDesc = styled.p`
  font-size: 0.75rem;
  color: #94a3b8;
`

// List Wrapper
const TradeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 378px;
  margin-top: 16px;
  padding: 0 24px;
  overflow-y: auto;
`

// Trade Item
const TradeItem = styled.div`
  padding: 16px;
  transition: all 0.2s;
  transform-origin: center;
  background: #ffffff;
  border-radius: 8px;
`

const RowBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f3f3f3;
`

const Symbol = styled.span`
  font-size: 1rem;
  font-weight: bold;
  font-family: monospace;
  color: #191a23;
`

const SideTag = styled.span<{ $long: boolean }>`
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  background: ${({ $long }) => ($long ? 'var(--up_bg)' : 'var(--down_bg)')};
  color: ${({ $long }) => ($long ? 'var(--up_color)' : 'var(--down_color)')};
`

const LatestTag = styled.span`
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  background: #f3f3f3;
  color: #191a23;
`

const ProfitText = styled.div<{ $profit: boolean }>`
  font-size: 1.125rem;
  font-weight: bold;
  font-family: monospace;
  color: ${({ $profit }) => ($profit ? 'var(--up_color)' : 'var(--down_color)')};
`

const Grid2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 0.875rem;
  color: #000000;
`

const Label = styled.div`
  margin-bottom: 4px;
`

const Value = styled.div`
  font-family: monospace;
  font-weight: bold;
`

const ValueYellow = styled(Value)`
  color: #fcd34d;
`

const ValuePurple = styled(Value)`
  color: #a78bfa;
`

// PNL Box
const PnLBox = styled.div<{ $profit: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  padding: 4px 8px;
  margin-bottom: 12px;
  background: #f3f3f3;
  font-size: 0.875rem;
  color: ${({ $profit }) => ($profit ? 'var(--up_color)' : 'var(--down_color)')};
`

const PnLText = styled.span<{ $profit: boolean }>`
  font-weight: bold;
  font-family: monospace;
`

const DateBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #000000;
  margin-bottom: 12px;
`

// Footer meta
const FooterMeta = styled.div`
  font-size: 0.875rem;
  padding-top: 12px;
  border-top: 1px solid #f3f3f3;
  color: #000000;
`

const StopLossTag = styled.span`
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  background: rgba(248, 113, 113, 0.2);
  color: #fca5a5;
`

// Empty
const EmptyBox = styled.div`
  padding: 24px;
  text-align: center;
  color: #94a3b8;
  opacity: 0.8;
`

const InfoCard = styled.div`
  padding: 24px;
  background: #f3f3f3;
  border-radius: 24px;
  border: 1px solid #191a23;
`

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(240, 185, 11, 0.2);
  border: 1px solid rgba(240, 185, 11, 0.3);
`

const Title = styled.h3`
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 1.25rem;
  color: #191a23;
`

const PointsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;

  gap: 16px;
  font-size: 0.875rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const PointRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`

const Bullet = styled.span`
  color: #191a23;
`

const PointText = styled.span`
  color: #191a23;
`
