import { styled, keyframes } from 'styled-components'

export default function SkeletonBox() {
  return (
    <Wrapper>
      <BinanceCard padding={32} pulse>
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
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`

/* ---------- Containers ---------- */

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px; /* space-y-6 */
`

export const BinanceCard = styled.div<{ pulse?: boolean; padding?: number }>`
  background: #111318;
  border-radius: 16px;
  padding: ${({ padding = 24 }) => padding}px; /* p-6 或 p-8 */
`

/* Tailwind animate-pulse 等效 */
const pulseAnimation = keyframes`
  0%,100% { opacity: 1; }
  50% { opacity: .5; }
`

/* ---------- Skeleton ---------- */

export const Skeleton = styled.div<{ h?: number; w?: string }>`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  height: ${({ h }) => h || 16}px;
  width: ${({ w }) => w || '100%'};
`

/* ---------- Layout helpers ---------- */

export const FlexBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px; /* mb-6 */
`

export const SpaceY3 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px; /* space-y-3 */
`

export const SpaceY = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px; /* space-y-6 */
`
