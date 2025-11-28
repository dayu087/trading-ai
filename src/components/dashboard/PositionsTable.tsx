import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import type { Position } from '@/types'

export default function PositionsTable({ positions }: { positions: Position[] | undefined }) {
  const { t } = useTranslation()

  return !positions || positions.length == 0 ? (
    <NoPositions>
      <Emoji>📊</Emoji>
      <NoPositionsTitle>{t('noPositions')}</NoPositionsTitle>
      <NoPositionsDesc>{t('noActivePositions')}</NoPositionsDesc>
    </NoPositions>
  ) : (
    <PositionsTableWrap>
      <StyledTable>
        <thead>
          <tr>
            <Th>{t('symbol')}</Th>
            <Th>{t('side')}</Th>
            <Th>{t('entryPrice')}</Th>
            <Th>{t('markPrice')}</Th>
            <Th>{t('quantity')}</Th>
            <Th>{t('positionValue')}</Th>
            <Th>{t('leverage')}</Th>
            <Th>{t('unrealizedPnL')}</Th>
            <Th>{t('liqPrice')}</Th>
          </tr>
        </thead>

        <tbody>
          {positions.map((pos, i) => (
            <Tr key={i}>
              <TdMono>{pos.symbol}</TdMono>
              <td>
                <SideBadge side={pos.side === 'long' ? 'long' : 'short'}>{t(pos.side === 'long' ? 'long' : 'short')}</SideBadge>
              </td>
              <TdMono>{pos.entry_price.toFixed(4)}</TdMono>
              <TdMono>{pos.mark_price.toFixed(4)}</TdMono>
              <TdMono>{pos.quantity.toFixed(4)}</TdMono>

              <TdMonoBold>{(pos.quantity * pos.mark_price).toFixed(2)} USDT</TdMonoBold>

              <TdMonoLeverage>{pos.leverage}x</TdMonoLeverage>

              <td>
                <PnLText positive={pos.unrealized_pnl >= 0}>
                  {pos.unrealized_pnl >= 0 ? '+' : ''}
                  {pos.unrealized_pnl.toFixed(2)} ({pos.unrealized_pnl_pct.toFixed(2)}%)
                </PnLText>
              </td>

              <TdMonoLiq>{pos.liquidation_price.toFixed(4)}</TdMonoLiq>
            </Tr>
          ))}
        </tbody>
      </StyledTable>
    </PositionsTableWrap>
  )
}

const PositionsTableWrap = styled.div`
  overflow-x: auto;
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`

const Th = styled.th`
  text-align: left;
  padding: 0.5rem 0;
  border-bottom: 1px solid #111;
`

const Tr = styled.tr`
  border-bottom: 1px solid #2b3139;
`

const TdBase = styled.td`
  padding: 0.6rem 0;
`

const TdMono = styled(TdBase)`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace;
`

const TdMonoBold = styled(TdMono)`
  font-weight: 700;
`

const TdMonoLeverage = styled(TdMono)`
  color: #f0b90b;
`

const TdMonoLiq = styled(TdMono)`
  color: #848e9c;
`

// —————— No Positions ——————

const NoPositions = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: #848e9c;
`

const Emoji = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.6;
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

// —————— Badges & PnL ——————

const SideBadge = styled.span<{ side: 'long' | 'short' }>`
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8rem;

  color: ${({ side }) => (side === 'long' ? '#0ECB81' : '#F6465D')};
  background: ${({ side }) => (side === 'long' ? 'rgba(14,203,129,0.1)' : 'rgba(246,70,93,0.1)')};
`

const PnLText = styled.span<{ positive: boolean }>`
  font-weight: 700;
  color: ${({ positive }) => (positive ? '#0ECB81' : '#F6465D')};
`
