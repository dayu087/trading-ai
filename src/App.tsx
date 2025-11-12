import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { api } from './lib/api'
import { AITradersPage } from './components/AITradersPage'
import { LoginPage } from './components/LoginPage'
import { RegisterPage } from './components/RegisterPage'
import { ResetPasswordPage } from './components/ResetPasswordPage'
import { CompetitionPage } from './components/CompetitionPage'
import { LandingPage } from './pages/LandingPage'
import { FAQPage } from './pages/FAQPage'
import TraderDetails from './components/TraderDetails'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { t } from './i18n/translations'
import { useSystemConfig } from './hooks/useSystemConfig'
import HeaderBar from './components/landing/HeaderBar'
import { Header } from './components/Header'
import type { TraderInfo } from './types'
import styled from 'styled-components'

type CurentType = 'competition' | 'traders' | 'trader' | 'faq' | 'login' | 'register' | 'reset-password' | ''

function App() {
  const { language } = useLanguage()
  const { user, token, isLoading } = useAuth()
  const { loading: configLoading } = useSystemConfig()
  const [route, setRoute] = useState(window.location.pathname)
  const [currentPage, setCurrentPage] = useState<CurentType>('')
  const [selectedTraderId, setSelectedTraderId] = useState<string | undefined>()

  const MainActivePage = useMemo(() => {
    if (route === '/login') return <LoginPage />
    if (route === '/register') return <RegisterPage />
    if (route === '/faq') return <FAQPage />
    if (route === '/reset-password') return <ResetPasswordPage />
    if (route === '/competition') return <CompetitionPage />
    if (route === '/' || route === '' || !user || !token) return <LandingPage />
    if (route === 'traders') return <AITradersPage onTraderSelect={hanldeTraderSelect} />
    return (
      <TraderDetails
        selectedTrader={selectedTrader}
        traders={traders}
        tradersError={tradersError}
        selectedTraderId={selectedTraderId}
        onTraderSelect={setSelectedTraderId}
        onNavigateToTraders={handleNavigateToTraders}
      />
    )
  }, [route])

  useEffect(() => {
    const handlePopState = () => setRoute(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (route == 'dashboard') {
      setCurrentPage('trader')
    } else {
      const newPage = route.slice(1)
      setCurrentPage(newPage as CurentType)
    }
  }, [route])

  const hanldeTraderSelect = (traderId: string) => {
    setSelectedTraderId(traderId)
    window.history.pushState({}, '', '/dashboard')
    setRoute('/dashboard')
    setCurrentPage('trader')
  }

  const handleNavigateToTraders = () => {
    window.history.pushState({}, '', '/traders')
    setRoute('/traders')
    setCurrentPage('traders')
  }

  // 获取trader列表（仅在用户登录时）
  const { data: traders, error: tradersError } = useSWR<TraderInfo[]>(
    user && token ? 'traders' : null,
    api.getTraders,
    {
      refreshInterval: 10000,
      shouldRetryOnError: false, // 避免在后端未运行时无限重试
    }
  )

  // 当获取到traders后，设置默认选中第一个
  useEffect(() => {
    if (traders && traders.length > 0 && !selectedTraderId) {
      setSelectedTraderId(traders[0].trader_id)
    }
  }, [traders, selectedTraderId])

  const selectedTrader = traders?.find((t) => t.trader_id === selectedTraderId)

  // Show loading spinner while checking auth or config
  if (isLoading || configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0E11' }}>
        <div className="text-center">
          <img src="/icons/nofx.svg" alt="NoFx Logo" className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p style={{ color: '#EAECEF' }}>{t('loading', language)}</p>
        </div>
      </div>
    )
  }
  return (
    <PageWrapper>
      {currentPage == 'reset-password' ? (
        <Header simple />
      ) : (
        <HeaderBar
          isLoggedIn={!!user}
          isHomePage={route == '/' || route == ''}
          currentPage={currentPage}
          handleRoute={(route: string) => setRoute(route)}
        />
      )}
      <MainWrapper>{MainActivePage}</MainWrapper>
    </PageWrapper>
  )
}

// Wrap App with providers
export default function AppWithProviders() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LanguageProvider>
  )
}

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const MainWrapper = styled.div`
  width: 100%;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 6rem;
  padding-bottom: 1.5rem;
`
