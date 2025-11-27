import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../i18n/translations'
import { Eye, EyeOff } from 'lucide-react'
import logoIcon from '@/assets/images/home_logo_1.png'
import vaikynorIcon from '@/assets/images/log_img_bg.png'

export function LoginPage() {
  const { language } = useLanguage()
  const { login, loginAdmin, verifyOTP } = useAuth()
  const [step, setStep] = useState<'login' | 'otp'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [userID, setUserID] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')

  const navigate = useNavigate()

  const adminMode = false

  /* -------- 管理员登录 -------- */
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await loginAdmin(adminPassword)
    if (!result.success) {
      setError(result.message || t('loginFailed', language))
    }
    setLoading(false)
  }

  /* -------- 用户登录 -------- */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)

    if (result.success) {
      if (result.requiresOTP && result.userID) {
        setUserID(result.userID)
        setStep('otp')
      }
    } else {
      setError(result.message || t('loginFailed', language))
    }

    setLoading(false)
  }

  /* -------- 验证 OTP -------- */
  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await verifyOTP(userID, otpCode)
    if (!result.success) {
      setError(result.message || t('verificationFailed', language))
    }

    setLoading(false)
  }

  return (
    <PageWrapper>
      <PageBgIcon>
        <img src={vaikynorIcon} alt="" />
      </PageBgIcon>
      <PageContent>
        <Container>
          {/* Logo 部分 */}
          <LogoSection>
            <LogoAvatar>
              <img src={logoIcon} alt="Valkynor Logo" />
            </LogoAvatar>
            <h1>Log in to Valkynor</h1>
            <p>{step === 'login' ? 'Please enter your email and password' : '请输入两步验证码'}</p>
          </LogoSection>

          {/* 面板 */}
          <Panel>
            {adminMode ? (
              <FormSection onSubmit={handleAdminLogin}>
                <div style={{ marginBottom: '1rem' }}>
                  <Label>管理员密码</Label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      background: 'var(--brand-black)',
                      border: '1px solid var(--panel-border)',
                      color: 'var(--brand-light-gray)',
                    }}
                    placeholder="请输入管理员密码"
                    required
                  />
                </div>
                {error && <ErrorBox>{error}</ErrorBox>}
                <Button type="submit" disabled={loading}>
                  {loading ? t('loading', language) : '登录'}
                </Button>
              </FormSection>
            ) : step === 'login' ? (
              <FormSection onSubmit={handleLogin}>
                <FormGroup>
                  <Label>{t('email', language)}</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('emailPlaceholder', language)} required />
                </FormGroup>
                <FormGroup>
                  <Label>{t('password', language)}</Label>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('passwordPlaceholder', language)}
                      required
                    />
                    <PasswordToggle type="button" onClick={() => setShowPassword((v) => !v)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </PasswordToggle>
                  </InputGroup>
                  <span onClick={() => navigate('/reset-password')}>{t('forgotPassword', language)}</span>
                </FormGroup>
                {error && <ErrorBox>{error}</ErrorBox>}
                <Button type="submit" disabled={loading}>
                  {loading ? t('loading', language) : t('loginButton', language)}
                </Button>
              </FormSection>
            ) : (
              /* ------------------ OTP 验证 ------------------ */
              <FormSection onSubmit={handleOTPVerify}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📱</div>
                  <p style={{ fontSize: '0.875rem', color: '#848E9C' }}>
                    {t('scanQRCodeInstructions', language)}
                    <br />
                    {t('enterOTPCode', language)}
                  </p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <Label>{t('otpCode', language)}</Label>
                  <Input type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} required />
                </div>
                {error && <ErrorBox>{error}</ErrorBox>}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <SecondaryButton type="button" onClick={() => setStep('login')}>
                    {t('back', language)}
                  </SecondaryButton>
                  <OTPButton type="submit" disabled={loading || otpCode.length !== 6}>
                    {loading ? t('loading', language) : t('verifyOTP', language)}
                  </OTPButton>
                </div>
              </FormSection>
            )}
          </Panel>

          {/* 注册 */}
          {!adminMode && (
            <RegisterBox>
              <p>还没有账户？ </p>
              <button onClick={() => navigate('/register')}>立即注册</button>
            </RegisterBox>
          )}
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
  min-height: calc(100vh - 104px);
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
`

const PageContent = styled.div`
  flex: 1 1 50%;
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 7rem;
`

const Container = styled.div`
  min-width: 424px;
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

const InputGroup = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 16px;
  border: 1px solid #191a23;
  background: #fff;

  &:focus {
    outline: 1px solid #cafe36;
  }

  &::placeholder {
    color: #848e9c;
  }
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
`

const ErrorBox = styled.div`
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  background: var(--binance-red-bg);
  color: var(--binance-red);
  border-radius: 0.5rem;
`

const SecondaryButton = styled(Button)`
  flex: 1;
`

const OTPButton = styled(Button)`
  flex: 1;
  background: #f0b90b;
  color: #000;
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 8px;
  top: 0;
  bottom: 0;
  width: 32px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
`

const RegisterBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 1.5rem;
  font-size: 16px;

  button {
    font-weight: bold;
    &:hover {
      text-decoration: underline;
    }
  }
`
