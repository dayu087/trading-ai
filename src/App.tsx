import { BrowserRouter, useLocation } from 'react-router-dom'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ScrollProvider } from './contexts/ScrollProvider'
import { useSystemConfig } from './hooks/useSystemConfig'
import { ConfirmDialogProvider } from './components/ConfirmDialog'
import HeaderBar from '@/components/HeaderBar'

import RouteView from './routes/route'

function AppContent() {
  const { isLoading } = useAuth()
  const { loading } = useSystemConfig()
  const location = useLocation()
  const { t } = useTranslation()

  // 加载中
  if (isLoading || loading) {
    return (
      <LoadingScreen>
        {/* <img src="/icons/nofx.svg" alt="NoFx Logo" className="w-16 h-16 mx-auto mb-4 animate-pulse" /> */}
        <p>{t('loading')}</p>
      </LoadingScreen>
    )
  }

  return (
    <PageWrapper>
      {location.pathname !== '/reset-password' && <HeaderBar />}
      <ScrollProvider>
        <RouteView />
      </ScrollProvider>
    </PageWrapper>
  )
}

export default function AppWithProviders() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfirmDialogProvider>
          <AppContent />
        </ConfirmDialogProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100dvh;
`

const LoadingScreen = styled.div`
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
