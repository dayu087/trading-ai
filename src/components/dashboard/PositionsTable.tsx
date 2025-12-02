import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import type { Position } from '@/types'
import { toNumberFormat } from '@/lib/utils'

export default function PositionsTable({ positions }: { positions: Position[] | undefined }) {
  const { t } = useTranslation()

  return !positions || positions.length == 0 ? (
    <NoPositions>
      <Emoji>📊</Emoji>
      <NoPositionsTitle>{t('noPositions')}</NoPositionsTitle>
      <NoPositionsDesc>{t('noActivePositions')}</NoPositionsDesc>
    </NoPositions>
  ) : (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <th>{t('symbol')}</th>
            <th>{t('side')}</th>
            <th>{t('entryMarkPrice')}</th>
            {/* <th>{t('entryPrice')}</th>
            <th>{t('markPrice')}</th> */}
            <th>{t('quantity')}</th>
            <th>{t('positionValue')}</th>
            <th>{t('leverage')}</th>
            <th>{t('unrealizedPnL')}</th>
            <th>{t('liqPrice')}</th>
          </tr>
        </thead>

        <tbody>
          {positions.map((pos, i) => (
            <tr key={i}>
              <td>{pos.symbol}</td>
              <td>
                <SideBadge side={pos.side === 'long' ? 'long' : 'short'}>{t(pos.side === 'long' ? 'long' : 'short')}</SideBadge>
              </td>
              <td className="bold">
                {toNumberFormat(pos.entry_price)}
                <br />
                {toNumberFormat(pos.mark_price)}
              </td>
              <td>{toNumberFormat(pos.quantity)}</td>
              <td>
                {toNumberFormat(pos.quantity * pos.mark_price)}
                <br /> USDT
              </td>
              <td>{pos.leverage}x</td>
              <td>
                <PnLText positive={pos.unrealized_pnl >= 0}>
                  {pos.unrealized_pnl >= 0 ? '+' : ''}
                  {toNumberFormat(pos.unrealized_pnl)}
                  <br />({pos.unrealized_pnl_pct.toFixed(2)}%)
                </PnLText>
              </td>
              <td>{toNumberFormat(pos.liquidation_price)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  )
}

// 外层包裹用于纵向 & 横向滚动，并限制高度
const TableWrapper = styled.div`
  width: 100%;
  max-height: 280px;
  padding: 0 12px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    padding: 0;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  --col1-width: 100px;
  --col2-width: 80px;

  thead th {
    position: sticky;
    top: -1px;
    z-index: 5;
    padding: 8px 12px;
    font-size: 12px;
    text-align: left;
    white-space: nowrap;
    background: #fff;
  }

  tbody td {
    padding: 8px 12px;
    font-size: 14px;
    white-space: nowrap;
    background: #fff;
  }

  th:nth-child(1),
  td:nth-child(1) {
    position: sticky;
    left: 0;
    min-width: var(--col1-width);
    max-width: var(--col1-width);
    box-sizing: border-box;
    z-index: 4;
  }

  th:nth-child(2),
  td:nth-child(2) {
    position: sticky;
    left: calc(var(--col1-width));
    min-width: var(--col2-width);
    max-width: var(--col2-width);
    box-sizing: border-box;
    z-index: 4;
  }

  th:nth-child(1),
  th:nth-child(2) {
    z-index: 6;
  }

  /* 其余列允许换行或不换行，按需求 */
  th,
  td {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bold {
    font-weight: 700;
  }

  @media (max-width: 768px) {
    width: max-content;
    table-layout: fixed;
  }
`

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

  color: ${({ side }) => (side === 'long' ? 'var(--up_color)' : 'var(--down_color)')};
  background: ${({ side }) => (side === 'long' ? 'var(--up_bg)' : 'var(--down_bg)')};
`

const PnLText = styled.span<{ positive: boolean }>`
  font-weight: 700;
  color: ${({ positive }) => (positive ? '#0ECB81' : '#F6465D')};
`
