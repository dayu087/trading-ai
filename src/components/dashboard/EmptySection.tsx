import { styled } from 'styled-components'
import { t, type Language } from '../../i18n/translations'

export default function EmptySection({ language, toTraders }: { language: Language; toTraders: () => void }) {
  return (
    <EmptyContainer>
      <EmptyInner>
        <IconCircle role="img" aria-hidden>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3" />
            <path d="M3 13h18" />
            <path d="M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </IconCircle>
        <EmptyTitle>{t('dashboardEmptyTitle', language)}</EmptyTitle>
        <EmptyDesc>{t('dashboardEmptyDescription', language)}</EmptyDesc>

        <CTAButton onClick={toTraders}>{t('goToTradersPage', language)}</CTAButton>
      </EmptyInner>
    </EmptyContainer>
  )
}

/* Empty states */
const EmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`
const EmptyInner = styled.div`
  text-align: center;
  max-width: 28rem;
  padding: 1.5rem;
`
const IconCircle = styled.div`
  width: 96px;
  height: 96px;
  margin: 0 auto 1.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(240, 185, 11, 0.1);
  border: 2px solid rgba(240, 185, 11, 0.3);
  color: #f0b90b;
`
const EmptyTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #eaecef;
`
const EmptyDesc = styled.p`
  color: #848e9c;
  margin-bottom: 1rem;
`
const CTAButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #f0b90b 0%, #fcd535 100%);
  color: #0b0e11;
  box-shadow: 0 4px 12px rgba(240, 185, 11, 0.3);
  transition: transform 0.12s;
  &:active {
    transform: scale(0.98);
  }
  &:hover {
    transform: scale(1.05);
  }
`
