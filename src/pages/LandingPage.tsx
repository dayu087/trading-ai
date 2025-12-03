import { useState } from 'react'
import { styled } from 'styled-components'
import HeroSection from '../components/landing/HeroSection'
import AboutSection from '../components/landing/AboutSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import CommunitySection from '../components/landing/CommunitySection'
import ReadySection from '../components/landing/ReadySection'
import PreviewSection from '../components/landing/PreviewSection'
import LoginModal from '../components/landing/LoginModal'
import FooterSection from '../components/landing/FooterSection'
import { useAuth } from '../contexts/AuthContext'

export function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { user } = useAuth()
  const isLoggedIn = !!user

  console.log('LandingPage - user:', user, 'isLoggedIn:', isLoggedIn)
  return (
    <>
      <LandingContainer>
        <HeroSection setShowLoginModal={setShowLoginModal} />
        <AboutSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PreviewSection />
        <CommunitySection />
        <ReadySection setShowLoginModal={setShowLoginModal} />
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
        <FooterSection />
      </LandingContainer>
    </>
  )
}

const LandingContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 200px;
  width: 100%;
  padding-top: 6.5rem;

  @media (max-width: 1220px) {
    padding-left: 32px;
    padding-right: 32px;
  }

  @media (max-width: 768px) {
    padding: 1rem 0 0;
    gap: 4rem;
  }
`
