import { BrowserRouter, useLocation } from 'react-router-dom'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ScrollProvider } from './contexts/ScrollProvider'
import { useSystemConfig } from './hooks/useSystemConfig'
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
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

const PageWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`

const LoadingScreen = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
