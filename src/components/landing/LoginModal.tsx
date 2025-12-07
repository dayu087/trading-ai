import { motion } from 'framer-motion'
import { styled } from 'styled-components'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface LoginModalProps {
  onClose: () => void
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const goLogin = () => {
    navigate('/login')
    onClose()
  }

  const goRegister = () => {
    navigate('/register')
    onClose()
  }

  return (
    <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <ModalContainer initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} onClick={(e) => e.stopPropagation()}>
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4"
          style={{ color: 'var(--text-secondary)' }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-6 h-6" />
        </motion.button>
        <h2 className="text-2xl font-bold mb-6">{t('accessNofxPlatform')}</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          {t('loginRegisterPrompt')}
        </p>
        <div className="space-y-3">
          <Button onClick={goLogin}>{t('signIn')}</Button>
          <RegisterButton onClick={goRegister}>{t('registerNewAccount')}</RegisterButton>
        </div>
      </ModalContainer>
    </ModalOverlay>
  )
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`

const ModalContainer = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 2rem 0;
  padding: 1.5rem;
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 24px;
  border: 1px solid #000000;
  background: #fff;
`

const Button = styled.div`
  width: 100%;
  padding: 1rem 2.5rem;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  color: #000;
  background: #fff;
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 16px;
  border: 1px solid #000;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translate(4px, 4px);
    box-shadow: none !important;
  }

  @media (max-width: 768px) {
    gap: 0.25rem;
    padding: 0.75rem 0;
    font-size: 0.75rem;
  }
`

const RegisterButton = styled(Button)`
  color: #fff;
  background: #191a23;
`
