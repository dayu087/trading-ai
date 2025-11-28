import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { BookOpen } from 'lucide-react'

export default function GuideModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()

  return (
    <GuideOverlay onClick={onClose}>
      <GuideContainer onClick={(e) => e.stopPropagation()}>
        <GuideHeader>
          <GuideTitle>
            <BookOpen className="w-6 h-6" style={{ color: '#F0B90B' }} />
            {t('binanceSetupGuide')}
          </GuideTitle>

          <GuideCloseButton onClick={onClose}>{t('closeGuide')}</GuideCloseButton>
        </GuideHeader>

        <GuideContent>
          <GuideImage src="/images/guide.png" alt={t('binanceSetupGuide')} />
        </GuideContent>
      </GuideContainer>
    </GuideOverlay>
  )
}

export const GuideOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`

export const GuideContainer = styled.div`
  background: #1e2329;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 64rem; /* max-w-4xl */
  position: relative;
`

export const GuideHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`

export const GuideTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem; /* text-xl */
  font-weight: 700;
  color: #eaecef;
`

export const GuideCloseButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  background: #2b3139;
  color: #848e9c;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.05);
  }
`

export const GuideContent = styled.div`
  overflow-y: auto;
  max-height: 80vh;
`

export const GuideImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 0.375rem;
`
