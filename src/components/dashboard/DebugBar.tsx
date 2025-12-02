import refishIcon from '@/assets/images/Dashboard_icon_update.png'
import styled, { keyframes } from 'styled-components'
import type { AccountInfo } from '@/types' // <- 根据你项目调整路径

export default function DebugBar({ lastUpdate, account }: { lastUpdate: string; account?: AccountInfo }) {
  return (
    <DebugBox>
      <img src={refishIcon} alt="" />
      Last Update: {lastUpdate} | Total Equity: {account?.total_equity?.toFixed(2) || '0.00'} | Available: {account?.available_balance?.toFixed(2) || '0.00'} | P&L:{' '}
      {account?.total_pnl?.toFixed(2) || '0.00'} ({account?.total_pnl_pct?.toFixed(2) || '0.00'}%)
    </DebugBox>
  )
}

/* Debug bar */
const DebugBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-bottom: 2.5rem;
  padding: 12px 24px;
  font-size: 1rem;
  background: #f3f3f3;
  border-radius: 32px;
  img {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 14px;
  }
`
