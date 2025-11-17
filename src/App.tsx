import { BrowserRouter, useLocation } from 'react-router-dom'
import { styled } from 'styled-components'
import RouteView from './routes/route'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ScrollProvider } from './contexts/ScrollProvider'
import { useSystemConfig } from './hooks/useSystemConfig'
import { t } from './i18n/translations'
import HeaderBar from './components/landing/HeaderBar'
import { Header } from './components/Header'

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
      <ScrollProvider>
        <RouteView />
      </ScrollProvider>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 40px;
  max-height: calc(100vh - 64px);
  overflow-y: scroll;
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
