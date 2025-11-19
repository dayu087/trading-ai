import { styled } from 'styled-components'

interface StatCardProps {
  bg?: string
  title: string
  value: string
  change?: number
  positive?: boolean
  subtitle?: string
  isChange?: boolean
}

export default function StatCard({ title, value, change, positive, subtitle, isChange, bg }: StatCardProps) {
  return (
    <StatCardBox $bg={bg}>
      <StatTitle>{title}</StatTitle>
      <StatValue>
        <StatValueCount $bg={bg}> {value}</StatValueCount>
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

const StatCardBox = styled.div<{ $bg?: string }>`
  flex: 1 1 25%;
  padding: 1rem;
  border-radius: 24px;
  border: 1px solid #191a23;
  color: ${({ $bg }) => ($bg == '#191A23' ? '#fff' : '#191a23')};
  box-shadow: 4px 4px 0px 0px #191a23;
  background: ${({ $bg }) => $bg || '#f3f3f3'};
`
const StatTitle = styled.div`
  font-size: 0.875rem;
  /* text-transform: uppercase; */
`
const StatValue = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
  font-weight: bold;
  margin: 10px 0 6px 0;

  span {
    font-size: 14px;
  }
`

const StatValueCount = styled.div<{ $bg?: string }>`
  width: fit-content;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 2rem;
  color: var(--brand-black);
  background: ${({ $bg }) => ($bg ? ' #FFFFFF' : 'var(--brand-green)')};
`

const StatChange = styled.div<{ $positive?: boolean }>`
  color: ${({ $positive }) => ($positive ? '#2B6D18' : '#A54162')};
  font-weight: 700;
  font-size: 1rem;
`
const StatSubtitle = styled.div`
  font-size: 1rem;
`
