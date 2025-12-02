import { styled } from 'styled-components'
import statIcon1 from '@/assets/images/dashboard_img_4.png'
import statIcon2 from '@/assets/images/dashboard_img_3.png'
import statIcon3 from '@/assets/images/dashboard_img_2.png'
import statIcon4 from '@/assets/images/dashboard_img_1.png'

interface StatCardProps {
  index: number
  bg?: string
  title: string
  value: string
  change?: number
  positive?: boolean
  subtitle?: string
  isChange?: boolean
}

export default function StatCard({ index, title, value, change, positive, subtitle, isChange, bg }: StatCardProps) {
  return (
    <StatCardBox $bg={bg}>
      {index === 1 && <StatCardBg src={statIcon1} alt="" />}
      {index === 2 && <StatCardBg src={statIcon2} alt="" />}
      {index === 3 && <StatCardBg src={statIcon3} alt="" />}
      {index === 4 && <StatCardBg src={statIcon4} alt="" />}
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
  position: relative;
  flex: 1 1 24%;
  padding: 1rem;
  border-radius: 24px;
  border: 1px solid #191a23;
  color: ${({ $bg }) => ($bg == '#191A23' ? '#fff' : '#191a23')};
  box-shadow: 4px 4px 0px 0px #191a23;
  background: ${({ $bg }) => $bg || '#f3f3f3'};

  @media (max-width: 1220px) {
    flex: 1 1 48%;
    border-radius: 16px;
  }
`

const StatCardBg = styled.img`
  position: absolute;
  right: 0;
  bottom: 8px;
  max-width: 70px;
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

  @media (max-width: 768px) {
    margin: 6px 0 4px 0;
  }
`

const StatValueCount = styled.div<{ $bg?: string }>`
  width: fit-content;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 2rem;
  color: var(--brand-black);
  background: ${({ $bg }) => ($bg ? ' #FFFFFF' : 'var(--brand-green)')};

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

const StatChange = styled.div<{ $positive?: boolean }>`
  color: ${({ $positive }) => ($positive ? '#2B6D18' : '#A54162')};
  font-weight: 700;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`
const StatSubtitle = styled.div`
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`
