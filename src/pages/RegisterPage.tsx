import React, { useState, useEffect } from 'react'
import { styled } from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getSystemConfig } from '../lib/config'
import { Eye, EyeOff } from 'lucide-react'

import logoIcon from '@/assets/images/home_logo_1.png'
import vaikynorIcon from '@/assets/images/log_img_bg.png'

// 本地密码强度校验（与 UI 规则一致）
function isStrongPassword(pwd: string): boolean {
  if (!pwd || pwd.length < 8) return false
  const hasUpper = /[A-Z]/.test(pwd)
  const hasLower = /[a-z]/.test(pwd)
  const hasNumber = /\d/.test(pwd)
  const hasSpecial = /[@#$%!&*?]/.test(pwd)
  return hasUpper && hasLower && hasNumber && hasSpecial
}

export function RegisterPage() {
  const { t } = useTranslation()
  const { register, completeRegistration } = useAuth()
  const [step, setStep] = useState<'register' | 'setup-otp' | 'verify-otp'>('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [betaCode, setBetaCode] = useState('')
  const [betaMode, setBetaMode] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [userID, setUserID] = useState('')
  const [otpSecret, setOtpSecret] = useState('')
  const [qrCodeURL, setQrCodeURL] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    // 获取系统配置，检查是否开启内测模式
    getSystemConfig()
      .then((config) => {
        setBetaMode(config.beta_mode || false)
      })
      .catch((err) => {
        console.error('Failed to fetch system config:', err)
      })
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 客户端强校验：长度>=8，包含大小写、数字、特殊字符，且两次一致
    const strong = validatePassword(password, confirmPassword)
    if (typeof strong === 'string') {
      setError(strong)
      return
    }

    if (betaMode && !betaCode.trim()) {
      setError('内测期间，注册需要提供内测码')
      return
    }

    setLoading(true)

    const result = await register(email, password, betaCode.trim() || undefined)

    if (result.success && result.userID) {
      setUserID(result.userID)
      setOtpSecret(result.otpSecret || '')
      setQrCodeURL(result.qrCodeURL || '')
      setStep('setup-otp')
    } else {
      setError(result.message || t('registrationFailed'))
    }

    setLoading(false)
  }

  const handleSetupComplete = () => {
    setStep('verify-otp')
  }

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await completeRegistration(userID, otpCode)

    if (!result.success) {
      setError(result.message || t('registrationFailed'))
    }
    // 成功的话AuthContext会自动处理登录状态

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <PageWrapper>
      <PageBgIcon>
        <img src={vaikynorIcon} alt="" />
      </PageBgIcon>
      <PageContent>
        <PageContentContainer>
          {/* Logo */}
          <LogoSection $step={step}>
            <LogoAvatar>
              <img src={logoIcon} alt="Valkynor Logo" />
            </LogoAvatar>
            <h1> Valkynor</h1>
            <p>
              {step === 'register' && t('registerTitle')}
              {step === 'setup-otp' && t('setupTwoFactor')}
              {step === 'verify-otp' && t('verifyOTP')}
            </p>
          </LogoSection>

          {/* Registration Form */}
          <Panel>
            {step === 'register' && (
              <Form onSubmit={handleRegister}>
                <FormGroup>
                  <Label>{t('email')}</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('emailPlaceholder')} required />
                </FormGroup>
                <FormGroup>
                  <Label>{t('password')}</Label>
                  <Relative>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      placeholder={t('passwordPlaceholder')}
                      required
                    />
                    <ToggleBtn type="button" aria-label={showPassword ? '隐藏密码' : '显示密码'} onMouseDown={(e) => e.preventDefault()} onClick={() => setShowPassword((v) => !v)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </ToggleBtn>
                  </Relative>
                </FormGroup>
                <FormGroup>
                  <Label>{t('confirmPassword')}</Label>
                  <Relative>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10"
                      placeholder={t('confirmPasswordPlaceholder')}
                      required
                    />
                    <ToggleBtn
                      type="button"
                      aria-label={showConfirmPassword ? '隐藏密码' : '显示密码'}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowConfirmPassword((v) => !v)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </ToggleBtn>
                  </Relative>
                </FormGroup>

                {betaMode && (
                  <div>
                    <Label style={{ color: '#EAECEF' }}>内测码 *</Label>
                    <BetaInput
                      type="text"
                      value={betaCode}
                      onChange={(e) => setBetaCode(e.target.value.replace(/[^a-z0-9]/gi, '').toLowerCase())}
                      placeholder="请输入6位内测码"
                      maxLength={6}
                      required={betaMode}
                    />
                    <p style={{ fontSize: '0.75rem', color: '#848E9C', marginTop: '0.25rem' }}>内测码由6位字母数字组成，区分大小写</p>
                  </div>
                )}

                {error && <ErrorBox>{error}</ErrorBox>}

                <SubmitBtn type="submit" disabled={loading || (betaMode && !betaCode.trim())}>
                  {loading ? t('loading') : t('registerButton')}
                </SubmitBtn>
              </Form>
            )}

            {step === 'setup-otp' && (
              <Container>
                <CenterBox>
                  <Emoji>📱</Emoji>
                  <Title>{t('setupTwoFactor')}</Title>
                  <Desc>{t('setupTwoFactorDesc')}</Desc>
                </CenterBox>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <StepBox>
                    <StepTitle>{t('authStep1Title')}</StepTitle>
                    <StepText>{t('authStep1Desc')}</StepText>
                  </StepBox>

                  <StepBox>
                    <StepTitle>{t('authStep2Title')}</StepTitle>
                    <StepText style={{ color: '#848E9C', marginBottom: '0.5rem' }}>{t('authStep2Desc')}</StepText>

                    {qrCodeURL && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <QRHint>{t('qrCodeHint')}</QRHint>
                        <QRWrapper>
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeURL)}`} alt="QR Code" style={{ margin: '0 auto' }} />
                        </QRWrapper>
                      </div>
                    )}

                    <div style={{ marginTop: '0.5rem' }}>
                      <SecretLabel>{t('otpSecret')}</SecretLabel>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <SecretCode>{otpSecret}</SecretCode>
                        <CopyBtn onClick={() => copyToClipboard(otpSecret)}>{t('copy')}</CopyBtn>
                      </div>
                    </div>
                  </StepBox>

                  <StepBox>
                    <StepTitle>{t('authStep3Title')}</StepTitle>
                    <StepText>{t('authStep3Desc')}</StepText>
                  </StepBox>
                </div>

                <ContinueBtn onClick={handleSetupComplete}>{t('setupCompleteContinue')}</ContinueBtn>
              </Container>
            )}

            {step === 'verify-otp' && (
              <Form onSubmit={handleOTPVerify}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📱</div>
                  <p style={{ fontSize: '0.875rem', color: '#848E9C' }}>
                    {t('enterOTPCode')}
                    <br />
                    {t('completeRegistrationSubtitle')}
                  </p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <Label>{t('otpCode')}</Label>
                  <Input
                    type="text"
                    value={otpCode}
                    placeholder={t('otpPlaceholder')}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                  />
                </div>
                {error && <ErrorBox>{error}</ErrorBox>}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <SecondaryButton type="button" onClick={() => setStep('setup-otp')}>
                    {t('back')}
                  </SecondaryButton>
                  <OTPButton type="submit" disabled={loading || otpCode.length !== 6}>
                    {loading ? t('loading') : t('completeRegistration')}
                  </OTPButton>
                </div>
              </Form>
            )}
          </Panel>
          {/* Login Link */}
          {step === 'register' && (
            <RegisterBox>
              <p>已有账户？ </p>
              <button onClick={() => navigate('/login')}>立即登录</button>
            </RegisterBox>
          )}
        </PageContentContainer>
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
  overflow: hidden;
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

const PageContentContainer = styled.div`
  max-width: 424px;
  width: 100%;
`

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Container = styled.div``

const LogoSection = styled.div<{ $step: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${({ $step }) => ($step === 'register' ? '40px' : '8px')};

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
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

const Relative = styled.div`
  position: relative;
`

const ToggleBtn = styled.button`
  position: absolute;
  right: 0.5rem;
  bottom: 0;
  width: 2rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  color: var(--text-secondary);
`

const ChecklistWrapper = styled.div`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-secondary);

  .title {
    margin-bottom: 0.25rem;
    color: var(--brand-light-gray);
  }
`

const BetaInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-family: monospace;
  background: #0b0e11;
  border: 1px solid #2b3139;
  color: #eaecef;
`

const ErrorBox = styled.div`
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  background: var(--binance-red-bg);
  color: var(--binance-red);
`

const SubmitBtn = styled.button`
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

const SecondaryButton = styled(SubmitBtn)`
  flex: 1;
`

const OTPButton = styled(SubmitBtn)`
  flex: 1;
  background: #f0b90b;
  color: #000;
`

const CenterBox = styled.div`
  text-align: center;
`

const Emoji = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`

const Desc = styled.p`
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`

const StepBox = styled.div`
  padding: 0.75rem;
  border-radius: 0.375rem;
  background: #fff;
  border: 1px solid var(--panel-border);
`

const StepTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`

const StepText = styled.p`
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
`

const QRHint = styled.p`
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  color: #848e9c;
`

const QRWrapper = styled.div`
  background: #fff;
  padding: 0.5rem;
  border-radius: 0.375rem;
  text-align: center;
`

const SecretLabel = styled.p`
  font-size: 0.75rem;
  color: #848e9c;
  margin-bottom: 0.25rem;
`

const SecretCode = styled.code`
  flex: 1;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 0.375rem;
  background: var(--panel-bg-hover);
  color: var(--brand-light-gray);
  font-family: monospace;
`

const CopyBtn = styled.button`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 0.375rem;
  background: var(--brand-yellow);
  color: var(--brand-black);
`

const ContinueBtn = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  margin-top: 8px;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  background: #f0b90b;
  color: #000;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
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
