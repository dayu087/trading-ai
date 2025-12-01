import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, ChevronDown, ChevronUp, Bolt } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { styled, keyframes } from 'styled-components'
import { useLocation, useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

import logoIcon from '@/assets/images/home_nav_logo.png'

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
    if (user) {
      return [
        { key: 'competition', label: t('realtimeNav') },
        { key: 'traders', label: t('configNav') },
        { key: 'dashboard', label: t('dashboardNav') },
        // { key: 'faq', label: t('faqNav') },
      ]
    } else {
      return [
        { key: 'competition', label: t('realtimeNav') },
        // { key: 'faq', label: t('faqNav') },
      ]
    }
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

  const languageList = useMemo(() => {
    if (!i18n.options.supportedLngs) return []
    return (i18n.options.supportedLngs as string[])?.filter((lang: any) => lang !== 'cimode' && lang !== 'dev')
  }, [i18n.options.supportedLngs])

  const mapLanguage: Record<string, string> = {
    en: 'English',
    zh: '中文',
  }

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

  const handlePositioning = (key: string) => {
    switch (key) {
      case 'GitHub':
        return window.open('https://github.com/tinkle-community/nofx', '_blank')

      case 'community':
        return window.open('https://t.me/nofx_dev_community', '_blank')
      case 'about':
        return window.location.assign('#about')

      case 'features':
        return window.location.assign('#features')

      case 'howItWorks':
        return window.location.assign('#howItWorks')

      default:
        break
    }
  }

  return (
    <HeaderContainer>
      <HeaderInner>
        <LogoLink href="/">
          <img src={logoIcon} alt="Valkynor Logo" />
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
            {user ? (
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
              currentPage !== 'login' && <LoginBtn onClick={() => navigate('/login')}> {t('signIn')}</LoginBtn>
            )}

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

      {/* 遮罩层 + 侧边抽屉 */}
      {mobileMenuOpen && (
        <>
          <Overlay onClick={() => setMobileMenuOpen(false)} />
          <MobileMenu>
            <MobileMenuHeader>
              <LogoLink href="/">
                <img src={logoIcon} alt="Valkynor Logo" />
              </LogoLink>
              <CloseButton onClick={() => setMobileMenuOpen(false)}>{/* <img src={Close} alt="" /> */}</CloseButton>
            </MobileMenuHeader>
            <MobileNav>
              {leftNavList.map((n: any) => (
                <MobileNavItem to={n.key} key={n.key} onClick={() => setMobileMenuOpen(false)}>
                  {n.label}
                </MobileNavItem>
              ))}
            </MobileNav>

            <MobileNav>
              {rightNavList.map((n: any) => (
                <MobileNavBtn
                  key={n.key}
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handlePositioning(n.key)
                  }}
                >
                  {n.label}
                </MobileNavBtn>
              ))}
            </MobileNav>

            {/* 移动端 语言 设置 */}
            <MobileSection>
              <MobileSectionTitle>
                <Bolt size={16} color="var(--brand-black)" />
                {/* <img src={SettingIcon} alt="" style={{ width: 16, marginRight: 6 }} /> */}
                Language Setting:
              </MobileSectionTitle>
              <MobileRPCList>
                {languageList.map((lang) => (
                  <MobileRPCItem
                    key={lang}
                    $active={i18n.language === lang}
                    onClick={() => {
                      handleSwichLanguage(lang)
                      setMobileMenuOpen(false)
                    }}
                  >
                    {mapLanguage[lang]}
                  </MobileRPCItem>
                ))}
              </MobileRPCList>
            </MobileSection>
          </MobileMenu>
        </>
      )}
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
    width: 142px;
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
  position: relative;
  padding: 8px;
  border-radius: 8px;
  transition: color 0.3s;
  color: var(--brand-black);
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  transition: all 0.1s ease-in-out;
  cursor: pointer;

  &:hover {
    &::before {
      content: '';
    }
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

/* 遮罩层动画 */
const fadeIn = keyframes`
	from { opacity: 0; }
	to { opacity: 1; }
`

/* 菜单滑入动画 */
const slideIn = keyframes`
	from { transform: translateX(-100%); }
	to { transform: translateX(0); }
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 40;
  animation: ${fadeIn} 0.3s ease forwards;
`

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 85%;
  /* max-width: 280px; */
  height: 100vh;
  background: #f3f3f3;
  box-shadow: 4px 4px 8px 0px rgba(0, 1, 13, 0.1);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 50;
  animation: ${slideIn} 0.3s ease forwards;
`

const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const CloseButton = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
`

const MobileNav = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 48px;
  gap: 24px;
`

const MobileNavItem = styled(NavLink)`
  text-decoration: none;
  font-size: 14px;
  font-weight: 300;
  padding: 8px 0;

  &[aria-current='page'] {
    font-weight: 700;
  }
`

const MobileNavBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
`

const MobileSection = styled.div`
  margin-top: 40px;
`

const MobileSectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 16px;
`

const MobileRPCList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const MobileRPCItem = styled.div<{ $active?: boolean }>`
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '700' : '400')};
  cursor: pointer;
  padding: 8px 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const LoginBtn = styled.button`
  padding: 8px 16px;
  color: #fff;
  border-radius: 8px;
  background: #000;
`
