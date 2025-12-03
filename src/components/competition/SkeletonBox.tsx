import { styled, keyframes } from 'styled-components'

export default function SkeletonBox() {
  return (
    <Wrapper>
      <BinanceCard padding={32}>
        <FlexBetween>
          <SpaceY3 style={{ flex: 1 }}>
            <Skeleton h={32} w="256px" />
            <Skeleton h={16} w="192px" />
          </SpaceY3>
          <Skeleton h={48} w="128px" />
        </FlexBetween>
      </BinanceCard>

      <BinanceCard padding={24}>
        <Skeleton h={24} w="160px" style={{ marginBottom: 16 }} />
        <SpaceY3>
          <Skeleton h={80} />
          <Skeleton h={80} />
        </SpaceY3>
      </BinanceCard>
    </Wrapper>
  )
}

const pulse = keyframes`
  0%, 100% { opacity: .6; }
  50% { opacity: 1; }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1220px;
`

const BinanceCard = styled.div<{ padding?: number }>`
  background: rgba(17, 19, 24, 0.5);
  border-radius: 16px;
  padding: ${({ padding = 24 }) => padding}px;
  animation: ${pulse} 1.5s infinite;
`

const Skeleton = styled.div<{ h?: number; w?: string }>`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  height: ${({ h }) => h || 16}px;
  width: ${({ w }) => w || '100%'};
`

const FlexBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

const SpaceY3 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const SpaceY = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`
