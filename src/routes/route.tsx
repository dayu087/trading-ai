import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import useSWR from 'swr'
import { api } from '../lib/api'
import { AITradersPage } from '../components/AITradersPage'
import { LoginPage } from '../components/LoginPage'
import { RegisterPage } from '../components/RegisterPage'
import { ResetPasswordPage } from '../components/ResetPasswordPage'
import { CompetitionPage } from '../components/CompetitionPage'
import { LandingPage } from '../pages/LandingPage'
import { FAQPage } from '../pages/FAQPage'
import TraderDetails from '../pages/TraderPage'
import { useAuth } from '../contexts/AuthContext'
import type { TraderInfo } from '../types'

export default function RouteView() {
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const [selectedTraderId, setSelectedTraderId] = useState<string>()

  const { data: traders, error: tradersError } = useSWR<TraderInfo[]>(
    user && token ? 'traders' : null,
    api.getTraders,
    {
      refreshInterval: 10000,
      shouldRetryOnError: false,
    }
  )

  useEffect(() => {
    if (traders?.length && !selectedTraderId) {
      setSelectedTraderId(traders[0].trader_id)
    }
  }, [traders, selectedTraderId])

  const selectedTrader = traders?.find((t) => t.trader_id === selectedTraderId)

  const handleTraderSelect = useCallback(
    (traderId: string) => {
      setSelectedTraderId(traderId)
      navigate('/dashboard')
    },
    [navigate]
  )

  const handleNavigateToTraders = useCallback(() => {
    navigate('/traders')
  }, [navigate])

  return (
    <Routes>
      {/* 公共页面 */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/competition" element={<CompetitionPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* 登录后可访问的页面 */}
      <Route path="/traders" element={<AITradersPage onTraderSelect={handleTraderSelect} />} />
      <Route
        path="/dashboard"
        element={
          <TraderDetails
            selectedTrader={selectedTrader}
            traders={traders}
            tradersError={tradersError}
            selectedTraderId={selectedTraderId}
            onTraderSelect={setSelectedTraderId}
            onNavigateToTraders={handleNavigateToTraders}
          />
        }
      />

      {/* 未匹配路由时重定向到首页 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
