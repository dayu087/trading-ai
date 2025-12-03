import { useState } from 'react'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'

import Input from '@/components/ui/InputBox'

interface SignalSourceModalProps {
  coinPoolUrl: string
  oiTopUrl: string
  onSave: (coinPoolUrl: string, oiTopUrl: string) => void
  onClose: () => void
}

export function SignalSourceModal({ coinPoolUrl, oiTopUrl, onSave, onClose }: SignalSourceModalProps) {
  const [coinPool, setCoinPool] = useState(coinPoolUrl || '')
  const [oiTop, setOiTop] = useState(oiTopUrl || '')
  const { t } = useTranslation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(coinPool.trim(), oiTop.trim())
  }

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalTitle>{t('signalSourceConfig')}</ModalTitle>
        <Form onSubmit={handleSubmit}>
          <ScrollArea>
            <div>
              <Label>COIN POOL URL</Label>
              <Input type="url" value={coinPool} onChange={(e) => setCoinPool(e.target.value)} placeholder="https://api.example.com/coinpool" />
              <HelperText>{t('coinPoolDescription')}</HelperText>
            </div>

            <div>
              <Label>OI TOP URL</Label>
              <Input type="url" value={oiTop} onChange={(e) => setOiTop(e.target.value)} placeholder="https://api.example.com/oitop" />
              <HelperText>{t('oiTopDescription')}</HelperText>
            </div>

            <InfoBox>
              <InfoTitle>{t('information')}</InfoTitle>
              <InfoText>{t('signalSourceInfo1')}</InfoText>
              <InfoText>{t('signalSourceInfo2')}</InfoText>
              <InfoText>{t('signalSourceInfo3')}</InfoText>
            </InfoBox>
          </ScrollArea>

          <Footer>
            <CancelButton type="button" onClick={onClose}>
              {t('cancel')}
            </CancelButton>
            <SaveButton type="submit">{t('save')}</SaveButton>
          </Footer>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  )
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
  overflow-y: auto;
`

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 36rem;
  position: relative;
  margin: 2rem 0;
  max-height: calc(100vh - 4rem);
  padding: 1.5rem;
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 24px;
  border: 1px solid #000000;
  background: #fff;

  @media (max-width: 768px) {
    padding: 12px;
    border-radius: 16px;
  }
`

const ModalTitle = styled.h3`
  width: fit-content;
  padding: 4px 12px;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  border-radius: 8px;
  background: #cafe36;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 10px;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
`

const ScrollArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  max-height: calc(100vh - 16rem);
`

const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    margin-bottom: 4px;
    font-size: 14px;
  }
`

const HelperText = styled.div`
  font-size: 12px;
  margin-top: 8px;
  color: #848e9c;

  @media (max-width: 768px) {
    margin-top: 4px;
  }
`

const InfoBox = styled.div`
  padding: 1rem;
  border-radius: 16px;
  background: #f3f3f3;
  @media (max-width: 768px) {
    padding: 12px;
  }
`

const InfoTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`

const InfoText = styled.div`
  font-size: 0.75rem;
  line-height: 1.3;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    margin-bottom: 4px;
  }
`

const Footer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  position: sticky;
  bottom: 0;

  @media (max-width: 768px) {
    margin-top: 12px;
    padding-top: 12px;
  }
`

const CancelButton = styled.button`
  flex: 1;
  padding: 16px 24px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid #191a23;

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`

const SaveButton = styled(CancelButton)`
  background: #000;
  color: #fff;
`
