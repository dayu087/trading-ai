import { useState } from 'react'
import { styled } from 'styled-components'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import useSWR from 'swr'
import { api } from '../lib/api'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../i18n/translations'
import { AlertTriangle, BarChart3, DollarSign, Percent, TrendingUp as ArrowUp, TrendingDown as ArrowDown } from 'lucide-react'

interface EquityPoint {
  timestamp: string
  total_equity: number
  pnl: number
  pnl_pct: number
  cycle_number: number
}

interface EquityChartProps {
  traderId?: string
}

export function EquityChart({ traderId }: EquityChartProps) {
  const { language } = useLanguage()
  const [displayMode, setDisplayMode] = useState<'dollar' | 'percent'>('dollar')

  const { data: history, error } = useSWR<EquityPoint[]>(traderId ? `equity-history-${traderId}` : 'equity-history', () => api.getEquityHistory(traderId), {
    refreshInterval: 30000, // 30秒刷新（历史数据更新频率较低）
    revalidateOnFocus: false,
    dedupingInterval: 20000,
  })

  const { data: account } = useSWR(traderId ? `account-${traderId}` : 'account', () => api.getAccount(traderId), {
    refreshInterval: 15000, // 15秒刷新（配合后端缓存）
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  if (error) {
    return (
      <div className="binance-card p-6">
        <div
          className="flex items-center gap-3 p-4 rounded"
          style={{
            background: 'rgba(246, 70, 93, 0.1)',
            border: '1px solid rgba(246, 70, 93, 0.2)',
          }}
        >
          <AlertTriangle className="w-6 h-6" style={{ color: '#F6465D' }} />
          <div>
            <div className="font-semibold" style={{ color: '#F6465D' }}>
              {t('loadingError', language)}
            </div>
            <div className="text-sm" style={{ color: '#848E9C' }}>
              {error.message}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 过滤掉无效数据：total_equity为0或小于1的数据点（API失败导致）
  const validHistory = history?.filter((point) => point.total_equity > 1) || []

  if (!validHistory || validHistory.length === 0) {
    return (
      <div className="binance-card p-6">
        <h3 className="text-lg font-semibold mb-6" style={{ color: '#EAECEF' }}>
          {t('accountEquityCurve', language)}
        </h3>
        <div className="text-center py-16" style={{ color: '#848E9C' }}>
          <div className="mb-4 flex justify-center opacity-50">
            <BarChart3 className="w-16 h-16" />
          </div>
          <div className="text-lg font-semibold mb-2">{t('noHistoricalData', language)}</div>
          <div className="text-sm">{t('dataWillAppear', language)}</div>
        </div>
      </div>
    )
  }

  // 限制显示最近的数据点（性能优化）
  // 如果数据超过2000个点，只显示最近2000个
  const MAX_DISPLAY_POINTS = 2000
  const displayHistory = validHistory.length > MAX_DISPLAY_POINTS ? validHistory.slice(-MAX_DISPLAY_POINTS) : validHistory

  // 计算初始余额（优先从 account 获取配置的初始余额，备选从历史数据反推）
  const initialBalance =
    account?.initial_balance || // 从交易员配置读取真实初始余额
    (validHistory[0] ? validHistory[0].total_equity - validHistory[0].pnl : undefined) || // 备选：淨值 - 盈亏
    1000 // 默认值（与创建交易员时的默认配置一致）

  // 转换数据格式
  const chartData = displayHistory.map((point) => {
    const pnl = point.total_equity - initialBalance
    const pnlPct = ((pnl / initialBalance) * 100).toFixed(2)
    return {
      time: new Date(point.timestamp).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      value: displayMode === 'dollar' ? point.total_equity : parseFloat(pnlPct),
      cycle: point.cycle_number,
      raw_equity: point.total_equity,
      raw_pnl: pnl,
      raw_pnl_pct: parseFloat(pnlPct),
    }
  })

  const pageWidth = window.innerWidth
  const currentValue = chartData[chartData.length - 1]
  const isProfit = currentValue.raw_pnl >= 0
  const strokeColor = isProfit ? 'var(--up_color)' : 'var(--down_color)'

  // 计算Y轴范围
  const calculateYDomain = () => {
    if (displayMode === 'percent') {
      // 百分比模式：找到最大最小值，留20%余量
      const values = chartData.map((d) => d.value)
      const minVal = Math.min(...values)
      const maxVal = Math.max(...values)
      const range = Math.max(Math.abs(maxVal), Math.abs(minVal))
      const padding = Math.max(range * 0.2, 1) // 至少留1%余量
      return [Math.floor(minVal - padding), Math.ceil(maxVal + padding)]
    } else {
      // 美元模式：以初始余额为基准，上下留10%余量
      const values = chartData.map((d) => d.value)
      const minVal = Math.min(...values, initialBalance)
      const maxVal = Math.max(...values, initialBalance)
      const range = maxVal - minVal
      const padding = Math.max(range * 0.15, initialBalance * 0.01) // 至少留1%余量
      return [Math.floor(minVal - padding), Math.ceil(maxVal + padding)]
    }
  }

  // 自定义Tooltip - Binance Style
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded p-3 shadow-xl" style={{ background: '#1E2329', border: '1px solid #2B3139' }}>
          <div className="text-xs mb-1" style={{ color: '#848E9C' }}>
            Cycle #{data.cycle}
          </div>
          <div className="font-bold mono" style={{ color: '#EAECEF' }}>
            {data.raw_equity.toFixed(2)} USDT
          </div>
          <div className="text-sm mono font-bold" style={{ color: data.raw_pnl >= 0 ? 'var(--up_color)' : 'var(--down_color)' }}>
            {data.raw_pnl >= 0 ? '+' : ''}
            {data.raw_pnl.toFixed(2)} USDT ({data.raw_pnl_pct >= 0 ? '+' : ''}
            {data.raw_pnl_pct}%)
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <CardWrapper>
      {/* Header */}
      <Header>
        <div className="left">
          <Title>{t('accountEquityCurve', language)}</Title>
          <div className="row">
            <EquityValue>
              {account?.total_equity.toFixed(2) || '0.00'}
              <UnitLabel>USDT</UnitLabel>
            </EquityValue>

            <ProfitRow>
              <ProfitTag $isProfit={isProfit}>
                {isProfit ? <ArrowUp className="icon" /> : <ArrowDown className="icon" />}
                {isProfit ? '+' : ''}
                {currentValue.raw_pnl_pct}%
              </ProfitTag>
              <ProfitAmount>
                ({isProfit ? '+' : ''}
                {currentValue.raw_pnl.toFixed(2)} USDT)
              </ProfitAmount>
            </ProfitRow>
          </div>
        </div>

        {/* ---- Display Toggle ---- */}
        <ToggleWrapper>
          <ToggleButton $active={displayMode === 'dollar'} onClick={() => setDisplayMode('dollar')}>
            <DollarSign className="icon" /> USDT
          </ToggleButton>
          <ToggleButton $active={displayMode === 'percent'} onClick={() => setDisplayMode('percent')}>
            <Percent className="icon" />
          </ToggleButton>
        </ToggleWrapper>
      </Header>

      {/* ---- Chart ---- */}
      <ChartContainer>
        <Watermark>Valkynor</Watermark>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 10, right: 5, left: 5, bottom: 24 }}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F0B90B" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FCD535" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} horizontal={true} stroke="#ccc" strokeDasharray="0" strokeWidth={1} />

            <XAxis
              dataKey="time"
              stroke="#191A23"
              tick={{ fill: '#191A23', fontSize: 12, dy: 6 }}
              tickLine={{ stroke: '#F3F3F3' }}
              interval={Math.floor(chartData.length / (pageWidth > 768 ? 10 : 5))}
              // angle={-15}
              textAnchor="middle"
              height={20}
            />

            <YAxis
              stroke="#F3F3F3"
              tick={{ fill: '#191A23', fontSize: 12 }}
              tickLine={{ stroke: '#F3F3F3' }}
              domain={calculateYDomain()}
              tickFormatter={(value) => (displayMode === 'dollar' ? `$${value.toFixed(0)}` : `${value}%`)}
            />

            <Tooltip content={<CustomTooltip />} />

            <ReferenceLine
              y={displayMode === 'dollar' ? initialBalance : 0}
              stroke="#474D57"
              strokeDasharray="3 3"
              label={{
                value: displayMode === 'dollar' ? t('initialBalance', language).split(' ')[0] : '0%',
                fill: '#848E9C',
                fontSize: 12,
              }}
            />

            <Line
              type="natural"
              dataKey="value"
              stroke={strokeColor} // 根据盈亏动态变色
              strokeWidth={3}
              dot={chartData.length > 50 ? false : { fill: strokeColor, r: 3 }}
              activeDot={{
                r: 6,
                fill: strokeColor,
                stroke: strokeColor + 'CC',
                strokeWidth: 2,
              }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* ---- Footer ---- */}
      <FooterGrid>
        <FooterItem>
          <FooterLabel>{t('initialBalance', language)}</FooterLabel>
          <FooterValue>{initialBalance.toFixed(2)} USDT</FooterValue>
        </FooterItem>

        <FooterItem>
          <FooterLabel>{t('currentEquity', language)}</FooterLabel>
          <FooterValue>{currentValue.raw_equity.toFixed(2)} USDT</FooterValue>
        </FooterItem>

        <FooterItem>
          <FooterLabel>{t('historicalCycles', language)}</FooterLabel>
          <FooterValue>
            {validHistory.length} {t('cycles', language)}
          </FooterValue>
        </FooterItem>

        <FooterItem>
          <FooterLabel>{t('displayRange', language)}</FooterLabel>
          <FooterValue>{validHistory.length > MAX_DISPLAY_POINTS ? `${t('recent', language)} ${MAX_DISPLAY_POINTS}` : t('allData', language)}</FooterValue>
        </FooterItem>
      </FooterGrid>
    </CardWrapper>
  )
}

const CardWrapper = styled.div`
  padding: 20px;
  border-radius: 24px;
  animation: fadeIn 0.3s ease;

  @media (max-width: 768px) {
    padding: 12px;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    align-items: flex-end;
  }

  .row {
    display: flex;
    align-items: baseline;
    gap: 16px;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 4px;
    }
  }
`

const Title = styled.h3`
  width: fit-content;
  padding: 4px 12px;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 4px;
  background: #cafe36;
  border-radius: 8px;

  @media (max-width: 768px) {
    font-size: 16px;
    white-space: nowrap;
  }
`

const EquityValue = styled.span`
  font-size: 2.5rem;
  font-weight: bold;
  /* font-family: monospace; */

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

const UnitLabel = styled.span`
  margin-left: 6px;
  font-size: 1rem;
  @media (max-width: 768px) {
    font-size: 14px;
    margin-left: 4px;
  }
`

const ProfitRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`
const ProfitAmount = styled.span`
  font-size: 12px;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`

const ProfitTag = styled.span<{ $isProfit: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-family: monospace;
  font-size: 14px;
  font-weight: bold;
  border-radius: 6px;
  color: ${({ $isProfit }) => ($isProfit ? 'var(--up_color)' : 'var(--down_color)')};
  background: ${({ $isProfit }) => ($isProfit ? 'var(--up_bg)' : 'var(--down_bg)')};
  border: 1px solid ${({ $isProfit }) => ($isProfit ? 'rgba(14,203,129,0.2)' : 'rgba(246,70,93,0.2)')};

  .icon {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    padding: 2px 4px;
    font-size: 12px;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  border: 1px solid #0d4751;
  padding: 2px;
  border-radius: 24px;
`

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 2px 6px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  background: ${({ $active }) => ($active ? '#0D4751' : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : '#0D4751')};
  box-shadow: ${({ $active }) => ($active ? '0 2px 8px rgba(240,185,11,0.4)' : 'none')};

  .icon {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const ChartContainer = styled.div`
  margin: 8px 0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`

const Watermark = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 20px;
  font-weight: bold;
  color: rgba(240, 185, 11, 0.15);
  z-index: 10;
  pointer-events: none;
  font-family: monospace;
`

const FooterGrid = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 12px;
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`

const FooterItem = styled.div`
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f3f3f3;
  transition: 0.2s ease;

  &:hover {
    background: rgba(240, 185, 11, 0.1);
  }

  @media (max-width: 768px) {
    flex: 1 1 48%;
    padding: 6px 8px;
    border-radius: 4px;
  }
`

const FooterLabel = styled.div`
  font-size: 12px;
  margin-bottom: 4px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`

const FooterValue = styled.div`
  font-weight: bold;
  font-family: monospace;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`
