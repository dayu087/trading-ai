import { Routes, Route, Navigate } from 'react-router-dom'
import { AITradersPage } from '../pages/AITradersPage'
import { LoginPage } from '../components/LoginPage'
import { RegisterPage } from '../components/RegisterPage'
import { ResetPasswordPage } from '../components/ResetPasswordPage'
import { CompetitionPage } from '../pages/CompetitionPage'
import { LandingPage } from '../pages/LandingPage'
import { FAQPage } from '../pages/FAQPage'
import DashboardPage from '../pages/DashboardPage'

export default function RouteView() {
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
      <Route path="/traders" element={<AITradersPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      {/* 未匹配路由时重定向到首页 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
