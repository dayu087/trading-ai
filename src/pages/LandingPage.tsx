import { useState } from 'react'
import { styled } from 'styled-components'
import HeroSection from '../components/landing/HeroSection'
import AboutSection from '../components/landing/AboutSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import CommunitySection from '../components/landing/CommunitySection'
import ReadySection from '../components/landing/ReadySection'
import LoginModal from '../components/landing/LoginModal'
import FooterSection from '../components/landing/FooterSection'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

export function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { user } = useAuth()
  const { language } = useLanguage()
  const isLoggedIn = !!user

  console.log('LandingPage - user:', user, 'isLoggedIn:', isLoggedIn)
  return (
    <>
      <LandingContainer>
        <HeroSection language={language} />
        <AboutSection language={language} />
        <FeaturesSection language={language} />
        <HowItWorksSection language={language} />
        <CommunitySection />
        <ReadySection language={language} setShowLoginModal={setShowLoginModal} />

        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} language={language} />}
        <FooterSection language={language} />
      </LandingContainer>
    </>
  )
}

const LandingContainer = styled.section`
  width: 100%;
`
