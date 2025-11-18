import { styled } from 'styled-components'

export default function SkeletonLoad() {
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
