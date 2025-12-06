import React, { useState, useMemo } from 'react'
import { styled } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft } from 'lucide-react'
import Input from '@/components/ui/InputBox'

import vaikynorIcon from '@/assets/images/log_img_bg.png'

export function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const strong = validatePassword(newPassword, confirmPassword)
    if (typeof strong === 'string') {
      setError(strong)
      return
    }

    setLoading(true)
    const result = await resetPassword(email, newPassword, otpCode)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } else {
      setError(result.message || t('resetPasswordFailed'))
    }

    setLoading(false)
  }

  const validatePassword = (password: string, confirmPassword: string) => {
    const rules = [
      { pass: password.length >= 8, message: t('passwordRuleMinLength') },
      { pass: /[A-Z]/.test(password), message: t('passwordRuleUppercase') },
      { pass: /[a-z]/.test(password), message: t('passwordRuleLowercase') },
      { pass: /[0-9]/.test(password), message: t('passwordRuleNumber') },
      { pass: /[^A-Za-z0-9]/.test(password), message: t('passwordRuleSpecial') },
      { pass: password === confirmPassword, message: t('passwordRuleMatch') },
    ]
    // 找到第一条不通过的规则
    const firstFailed = rules.find((rule) => !rule.pass)
    return firstFailed ? firstFailed.message : true
  }

  return (
    <PageWrapper>
      {/* Back to Login */}
      <BackButton onClick={() => navigate('/login')}>
        <ArrowLeft className="w-4 h-4" />
        {t('backToLogin')}
      </BackButton>
      <PageBgIcon>
        <img src={vaikynorIcon} alt="" />
      </PageBgIcon>
      <PageContent>
        <Container>
          {/* Logo */}
          <LogoSection>
            <LogoAvatar>
              <img src="/images/logo.png" alt="logo" />
            </LogoAvatar>
            <h1>{t('resetPasswordTitle')}</h1>
            <p>使用邮箱和 Google Authenticator 重置密码</p>
          </LogoSection>

          {/* Reset Password Form */}
          <Panel>
            {success ? (
              <SuccessBox>
                <div className="text-5xl mb-4">✅</div>
                <h2>{t('resetPasswordSuccess')}</h2>
                <p>3秒后将自动跳转到登录页面...</p>
              </SuccessBox>
            ) : (
              <FormSection onSubmit={handleResetPassword}>
                <FormGroup>
                  <Label>{t('email')}</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('emailPlaceholder')} required />
                </FormGroup>

                <FormGroup>
                  <Label>{t('newPassword')}</Label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={t('newPasswordPlaceholder')} required />
                </FormGroup>

                <FormGroup>
                  <Label>{t('confirmPassword')}</Label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t('confirmPasswordPlaceholder')} required />
                </FormGroup>

                <FormGroup>
                  <Label>{t('otpCode')}</Label>
                  <div className="text-center mb-3">
                    <div className="text-3xl">📱</div>
                    <p className="text-xs mt-1" style={{ color: '#848E9C' }}>
                      打开 Google Authenticator 获取6位验证码
                    </p>
                  </div>
                  <Input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder={t('otpPlaceholder')}
                    maxLength={6}
                    required
                  />
                </FormGroup>

                {error && <ErrorBox>{error}</ErrorBox>}

                <Button type="submit" disabled={loading || otpCode.length !== 6 || !passwordValid}>
                  {loading ? t('loading') : t('resetPasswordButton')}
                </Button>
              </FormSection>
            )}
          </Panel>
        </Container>
      </PageContent>
    </PageWrapper>
  )
}

const PageWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 1440px;
  padding-top: 64px;

  @media (max-width: 1024px) {
    width: 100%;
    padding: 0 16px;
    padding-bottom: 24px;
  }
`

const PageBgIcon = styled.div`
  flex: 1 1 50%;
  display: flex;
  justify-content: center;
  margin-top: -40px;
  background-color: #f3f3f3;
  img {
    max-width: 582px;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`

const BackButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  background: transparent;
`

const PageContent = styled.div`
  flex: 1 1 50%;
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 2rem;
`

const Container = styled.div`
  max-width: 424px;
  width: 100%;
`

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;

  h1 {
    margin: 12px 0 4px;
    font-size: 24px;
    font-weight: bold;
    color: var(--brand-black);
  }

  p {
    font-size: 14px;
  }
`

const LogoAvatar = styled.div`
  width: fit-content;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #0d4751;

  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
`

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const FormSection = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  span {
    display: block;
    width: 100%;
    margin-top: 4px;
    text-align: right;
    text-decoration: underline;
    cursor: pointer;
  }
`

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
`

const Button = styled.button`
  width: 100%;
  padding: 18px 0;
  background: #191a23;
  font-size: 16px;
  color: #fff;
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 16px;
  border: 1px solid #ffffff;

  &:hover {
    transform: translate(4px, 4px) !important;
    box-shadow: none !important;
  }

  &:disabled {
    opacity: 0.5;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 8px 0;
    font-size: 14px;
    border-radius: 8px;
  }
`

const ErrorBox = styled.div`
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  background: var(--binance-red-bg);
  color: var(--binance-red);
  border-radius: 0.5rem;
`

const SuccessBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
  }
  p {
    color: #848e9c;
    font-size: 0.875rem;
  }
`
