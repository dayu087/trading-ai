import { BrowserRouter, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useSystemConfig } from './hooks/useSystemConfig'
import { t } from './i18n/translations'
import HeaderBar from './components/landing/HeaderBar'
import { Header } from './components/Header'
import RouteView from './routes/route'

/* ------------------------- 页面主体 ------------------------- */
function AppContent() {
  const { language } = useLanguage()
  const { isLoading } = useAuth()
  const { loading: configLoading } = useSystemConfig()
  const location = useLocation()

  const currentPath = location.pathname
  const currentPage = currentPath.replace('/', '') || ''

  // 加载中
  if (isLoading || configLoading) {
    return (
      <LoadingScreen>
        <img src="/icons/nofx.svg" alt="NoFx Logo" className="w-16 h-16 mx-auto mb-4 animate-pulse" />
        <p>{t('loading', language)}</p>
      </LoadingScreen>
    )
  }

  return (
    <PageWrapper>
      {currentPage === 'reset-password' ? <Header simple /> : <HeaderBar />}
      <MainWrapper>
        <RouteView />
      </MainWrapper>
    </PageWrapper>
  )
}

/* ------------------------- Provider 封装 ------------------------- */
export default function AppWithProviders() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}

/* ------------------------- 样式 ------------------------- */
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const MainWrapper = styled.main`
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  padding: 6rem 1.5rem 1.5rem;
`

const LoadingScreen = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0b0e11;
  color: #eaecef;
`
