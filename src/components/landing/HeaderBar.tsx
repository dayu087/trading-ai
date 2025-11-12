import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import styled from 'styled-components'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import { t } from '../../i18n/translations'

interface HeaderBarProps {
  isLoggedIn?: boolean
  isHomePage?: boolean
  currentPage?: string
  handleRoute?: (route: string) => void
}

export default function HeaderBar({
  isLoggedIn = false,
  isHomePage = false,
  currentPage,
  handleRoute,
}: HeaderBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const { language, setLanguage } = useLanguage()
  const { user, logout } = useAuth()

  const leftNavList = useMemo(() => {
    if (isLoggedIn) {
      return [
        { key: 'competition', label: t('realtimeNav', language) },
        { key: 'traders', label: t('configNav', language) },
        { key: 'dashboard', label: 'dashboardNav' },
        { key: 'faq', label: t('faqNav', language) },
      ]
    } else {
      return [
        { key: 'competition', label: t('realtimeNav', language) },
        { key: 'faq', label: t('faqNav', language) },
      ]
    }
  }, [isLoggedIn])

  const rightNavList = useMemo(() => {
    if (isHomePage) {
      return [
        { key: 'features', label: t('features', language) },
        { key: 'howItWorks', label: t('howItWorks', language) },
        { key: 'GitHub', label: 'GitHub' },
        { key: 'community', label: t('community', language) },
      ]
    } else {
      return []
    }
  }, [isHomePage])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setLanguageDropdownOpen(false)
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) setUserDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChangePage = (page: string) => {
    const curentRoute = window.location.pathname
    if (curentRoute === '/' || curentRoute === '/faq' || !isLoggedIn) {
      setTimeout(() => {
        window.location.href = `/${page}`
      }, 0)
    } else {
      if (handleRoute) handleRoute(page)
      window.history.pushState({}, '', `/${page}`)
    }
  }

  return (
    <HeaderContainer>
      <HeaderInner>
        <LogoLink href="/">
          <img src="/icons/nofx.svg" alt="NOFX Logo" />
          <span className="brand">NOFX</span>
          <span className="sub">Agentic Trading OS</span>
        </LogoLink>

        {/* Desktop Menu */}
        <DesktopMenu>
          <NavGroup>
            {leftNavList.map((it) => (
              <NavButton key={it.key} $active={currentPage === it.key} onClick={() => handleChangePage(it.key)}>
                {it.label}
              </NavButton>
            ))}
          </NavGroup>

          <RightGroup>
            {rightNavList.map((item) => (
              <TextLink
                key={item.key}
                href={
                  item.key === 'GitHub'
                    ? 'https://github.com/tinkle-community/nofx'
                    : item.key === 'community'
                      ? 'https://t.me/nofx_dev_community'
                      : `#${item.key === 'features' ? 'features' : 'how-it-works'}`
                }
                target={item.key === 'GitHub' || item.key === 'community' ? '_blank' : undefined}
                rel="noopener noreferrer"
              >
                {item.label}
              </TextLink>
            ))}

            {/* User */}
            {isLoggedIn && user ? (
              <UserDropdownContainer ref={userDropdownRef}>
                <UserButton onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
                  <UserIcon>{user.email[0].toUpperCase()}</UserIcon>
                  <span style={{ color: 'var(--brand-light-gray)' }}>{user.email}</span>
                  <ChevronDown size={16} color="var(--brand-light-gray)" />
                </UserButton>

                {userDropdownOpen && (
                  <UserDropdown>
                    <div
                      style={{
                        padding: '8px 12px',
                        borderBottom: '1px solid var(--panel-border)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {t('loggedInAs', language)}
                      </div>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--brand-light-gray)',
                        }}
                      >
                        {user.email}
                      </div>
                    </div>
                    {logout && (
                      <UserDropdownItem
                        onClick={() => {
                          logout()
                          setUserDropdownOpen(false)
                        }}
                      >
                        {t('exitLogin', language)}
                      </UserDropdownItem>
                    )}
                  </UserDropdown>
                )}
              </UserDropdownContainer>
            ) : (
              currentPage !== 'login' &&
              currentPage !== 'register' && (
                <>
                  <a
                    href="/login"
                    style={{
                      color: 'var(--brand-light-gray)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {t('signIn', language)}
                  </a>
                  <a
                    href="/register"
                    style={{
                      background: 'var(--brand-yellow)',
                      color: 'var(--brand-black)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    {t('signUp', language)}
                  </a>
                </>
              )
            )}

            {/* Language */}
            <LangDropdownContainer ref={dropdownRef}>
              <LangButton onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}>
                <span>{language === 'zh' ? '🇨🇳' : '🇺🇸'}</span>
                <ChevronDown size={16} />
              </LangButton>
              {languageDropdownOpen && (
                <LangDropdown>
                  <LangOption
                    $active={language === 'zh'}
                    onClick={() => {
                      setLanguage('zh')
                      setLanguageDropdownOpen(false)
                    }}
                  >
                    🇨🇳 中文
                  </LangOption>
                  <LangOption
                    $active={language === 'en'}
                    onClick={() => {
                      setLanguage('en')
                      setLanguageDropdownOpen(false)
                    }}
                  >
                    🇺🇸 English
                  </LangOption>
                </LangDropdown>
              )}
            </LangDropdownContainer>
          </RightGroup>
        </DesktopMenu>

        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
          style={{ color: 'var(--brand-light-gray)' }}
          whileTap={{ scale: 0.9 }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </HeaderInner>

      {/* Mobile Menu */}
      <MobileMenuContainer
        initial={false}
        animate={mobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ padding: '16px' }}>
          <MobileItem
            $active={currentPage === 'competition'}
            onClick={() => {
              handleChangePage?.('competition')
              setMobileMenuOpen(false)
            }}
          >
            {t('realtimeNav', language)}
          </MobileItem>
          {isLoggedIn && (
            <>
              <MobileItem
                $active={currentPage === 'traders'}
                onClick={() => {
                  handleChangePage?.('traders')
                  setMobileMenuOpen(false)
                }}
              >
                {t('configNav', language)}
              </MobileItem>
              <MobileItem
                $active={currentPage === 'trader'}
                onClick={() => {
                  handleChangePage?.('trader')
                  setMobileMenuOpen(false)
                }}
              >
                {t('dashboardNav', language)}
              </MobileItem>
              <MobileItem
                $active={currentPage === 'faq'}
                onClick={() => {
                  handleChangePage?.('faq')
                  setMobileMenuOpen(false)
                }}
              >
                {t('faqNav', language)}
              </MobileItem>
            </>
          )}
        </div>
      </MobileMenuContainer>
    </HeaderContainer>
  )
}

// ---------- Styled Components ----------
const HeaderContainer = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
  background: var(--brand-dark-gray);
`

const HeaderInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }
  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  img {
    width: 2rem;
    height: 2rem;
  }

  .brand {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--brand-yellow);
  }

  .sub {
    font-size: 0.875rem;
    color: var(--text-secondary);
    display: none;

    @media (min-width: 640px) {
      display: block;
    }
  }
`

const DesktopMenu = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    margin-left: 2rem;
  }
`

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const NavButton = styled.button<{ $active?: boolean }>`
  font-size: 0.875rem;
  font-weight: bold;
  position: relative;
  padding: 8px 16px;
  border-radius: 8px;
  transition: color 0.3s;

  color: ${({ $active }) => ($active ? 'var(--brand-yellow)' : 'var(--brand-light-gray)')};

  &:hover {
    color: var(--brand-yellow);
  }

  ${({ $active }) =>
    $active &&
    `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 8px;
      background: rgba(240, 185, 11, 0.15);
      z-index: -1;
    }
  `}
`

const LinkText = styled.a<{ $active?: boolean }>`
  font-size: 0.875rem;
  font-weight: bold;
  position: relative;
  padding: 8px 16px;
  border-radius: 8px;
  transition: color 0.3s;

  color: ${({ $active }) => ($active ? 'var(--brand-yellow)' : 'var(--brand-light-gray)')};

  &:hover {
    color: var(--brand-yellow);
  }

  ${({ $active }) =>
    $active &&
    `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 8px;
      background: rgba(240, 185, 11, 0.15);
      z-index: -1;
    }
  `}
`

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`

const TextLink = styled.a`
  font-size: 0.875rem;
  color: var(--brand-light-gray);
  position: relative;
  transition: color 0.3s;
  &:hover {
    color: var(--brand-yellow);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--brand-yellow);
    transition: width 0.3s;
  }

  &:hover::after {
    width: 100%;
  }
`

const UserDropdownContainer = styled.div`
  position: relative;
`

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`

const UserIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--brand-yellow);
  color: var(--brand-black);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
`

const UserDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  width: 12rem;
  border-radius: 0.5rem;
  overflow: hidden;
  background: var(--brand-dark-gray);
  border: 1px solid var(--panel-border);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 50;
`

const UserDropdownItem = styled.button`
  width: 100%;
  text-align: center;
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 600;
  background: var(--binance-red-bg);
  color: var(--binance-red);
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`

const LangDropdownContainer = styled.div`
  position: relative;
`

const LangButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.2s;
  color: var(--brand-light-gray);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`

const LangDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  width: 8rem;
  border-radius: 0.5rem;
  background: var(--brand-dark-gray);
  border: 1px solid var(--panel-border);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 50;
`

const LangOption = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 8px 12px;
  font-size: 0.875rem;
  color: var(--brand-light-gray);
  background: ${({ $active }) => ($active ? 'rgba(240, 185, 11, 0.1)' : 'transparent')};
  transition: opacity 0.2s;

  &:hover {
    opacity: ${({ $active }) => ($active ? 1 : 0.8)};
  }
`

const MobileMenuContainer = styled(motion.div)`
  background: var(--brand-dark-gray);
  border-top: 1px solid rgba(240, 185, 11, 0.1);
  overflow: hidden;
`

const MobileItem = styled.button<{ $active?: boolean }>`
  display: block;
  width: 100%;
  text-align: left;
  font-size: 0.875rem;
  font-weight: bold;
  padding: 12px 16px;
  border-radius: 8px;
  position: relative;
  color: ${({ $active }) => ($active ? 'var(--brand-yellow)' : 'var(--brand-light-gray)')};
  transition: color 0.3s;

  &:hover {
    color: var(--brand-yellow);
  }

  ${({ $active }) =>
    $active &&
    `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 8px;
      background: rgba(240, 185, 11, 0.15);
      z-index: -1;
    }
  `}
`
