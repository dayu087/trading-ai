import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function HeaderBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const currentPage = pathname.replace('/', '') || ''

  const leftNavList = useMemo<any | []>(() => {
    return []
    // if (user) {
    //   return [
    //     { key: 'competition', label: t('realtimeNav') },
    //     { key: 'traders', label: t('configNav') },
    //     { key: 'dashboard', label: t('dashboardNav') },
    //     { key: 'faq', label: t('faqNav') },
    //   ]
    // } else {
    //   return [
    //     { key: 'competition', label: t('realtimeNav') },
    //     { key: 'faq', label: t('faqNav') },
    //   ]
    // }
  }, [user, i18n])

  const rightNavList = useMemo(() => {
    if (pathname == '/') {
      return [
        { key: 'about', label: t('about') },
        { key: 'features', label: t('features') },
        { key: 'howItWorks', label: t('howItWorks') },
        // { key: 'GitHub', label: 'GitHub' },
        // { key: 'community', label: t('community') },
      ]
    } else {
      return []
    }
  }, [pathname, i18n])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setLanguageDropdownOpen(false)
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) setUserDropdownOpen(false)
    }
    const handleScroll = () => {}
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSwichLanguage = (lang: string) => {
    if (i18n.language === lang || !lang) return
    setLanguageDropdownOpen(false)
    i18n.changeLanguage(lang)
  }

  return (
    <HeaderContainer>
      <HeaderInner>
        <LogoLink href="/">
          <img src="/icons/nofx.svg" alt="NOFX Logo" />
          <span className="brand">NOFX</span>
        </LogoLink>

        {/* Desktop Menu */}
        <DesktopMenu>
          <NavGroup>
            {leftNavList.map((it: any) => (
              <NavButton key={it.key} $active={currentPage === it.key} onClick={() => navigate(`/${it.key}`)}>
                {it.label}
              </NavButton>
            ))}
          </NavGroup>

          <CenterGroup>
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
          </CenterGroup>

          <RIghtGroup>
            {/* User */}
            {/* {user ? (
              <UserDropdownContainer ref={userDropdownRef}>
                <UserButton onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
                  <UserIcon>{user.email[0].toUpperCase()}</UserIcon>
                  <span>{user.email}</span>
                  {userDropdownOpen ? <ChevronUp size={18} color="var(--brand-black)" /> : <ChevronDown size={18} color="var(--brand-black)" />}
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
                        {t('loggedInAs')}
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
                        {t('exitLogin')}
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
                    {t('signIn')}
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
                    {t('signUp')}
                  </a>
                </>
              )
            )} */}

            {/* Language */}
            <LangDropdownContainer ref={dropdownRef}>
              <LangButton onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}>
                <span>{i18n.language.toLocaleUpperCase()}</span>
                {languageDropdownOpen ? <ChevronUp size={18} color="var(--brand-black)" /> : <ChevronDown size={18} color="var(--brand-black)" />}
              </LangButton>
              {languageDropdownOpen && (
                <LangDropdown>
                  <LangOption $active={i18n.language === 'zh'} onClick={() => handleSwichLanguage('zh')}>
                    🇨🇳 中文
                  </LangOption>
                  <LangOption $active={i18n.language === 'en'} onClick={() => handleSwichLanguage('en')}>
                    🇺🇸 English
                  </LangOption>
                </LangDropdown>
              )}
            </LangDropdownContainer>
          </RIghtGroup>
        </DesktopMenu>

        {/* Mobile Menu Button */}
        <motion.button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden" style={{ color: 'var(--brand-black)' }} whileTap={{ scale: 0.9 }}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </HeaderInner>

      {/* Mobile Menu */}
      <MobileMenuContainer initial={false} animate={mobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
        <div style={{ padding: '16px' }}>
          {user && (
            <>
              {leftNavList.map((it: any) => (
                <MobileItem
                  key={it.key}
                  $active={currentPage === it.key}
                  onClick={() => {
                    setMobileMenuOpen(false)
                    navigate(`/${it.key}`)
                  }}
                >
                  {it.label}
                </MobileItem>
              ))}
            </>
          )}
        </div>
      </MobileMenuContainer>
    </HeaderContainer>
  )
}

// ---------- Styled Components ----------
const HeaderContainer = styled.nav`
  /* position: sticky; */
  /* top: 0; */
  width: 100%;
  z-index: 50;
  background-color: var(--background);
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease-in-out;
  border-bottom: 1px solid #191a23;
`

const HeaderInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
`

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--brand-black);
  }
`

const DesktopMenu = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 2rem;
  @media (max-width: 768px) {
    display: none;
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
  padding: 8px;
  border-radius: 8px;
  transition: color 0.3s;
  color: var(--brand-black);
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  transition: all 0.1s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    font-weight: bold;
  }

  &::before {
    position: absolute;
    bottom: -4px;
    left: calc(50% - 4px);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #000;
    z-index: 2;
  }

  ${({ $active }) =>
    $active &&
    `
    &::before {
      content: '';
     
    }
  `}
`

const CenterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const RIghtGroup = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`

const TextLink = styled.a`
  padding: 8px;
  font-size: 0.875rem;
  color: var(--brand-black);
  position: relative;
  transition: color 0.3s;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--brand-black);
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
  padding: 7px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-black);
  transition: background 0.2s;

  span {
    font-size: 1rem;
    color: var(--brand-black);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`

const UserIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: var(--brand-black);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  border: 1px solid var(--border-black);
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
  padding: 8px 16px;
  border-radius: 8px;
  transition: background 0.2s;
  color: var(--brand-black);
  border: 1px solid var(--border-black);

  span {
    font-size: 1rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`

const LangDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 0.5rem;
  width: 8rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: #fff;
  border: 1px solid #000;
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
  border-radius: 6px;
  background: ${({ $active }) => ($active ? 'var(--brand-green)' : 'transparent')};
  transition: background 0.2s;

  &:hover {
    transform: none !important;
    background: var(--brand-green);
  }
`

const MobileMenuContainer = styled(motion.div)`
  border-top: 1px solid rgba(240, 185, 11, 0.1);
  overflow: hidden;
`

const MobileItem = styled.button<{ $active?: boolean }>`
  display: block;
  width: 100%;
  text-align: left;
  font-size: 0.875rem;
  padding: 12px 16px;
  border-radius: 8px;
  position: relative;
  color: var(--brand-black);
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
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
      background: #f3f3f3;
      z-index: -1;
    }
  `}
`
