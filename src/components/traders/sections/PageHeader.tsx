import { styled } from 'styled-components'
import { Bot, Plus, Radio } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface PageHeaderProps {
  tradersCount: number
  configuredModelsCount: number
  configuredExchangesCount: number
  onAddModel: () => void
  onAddExchange: () => void
  onConfigureSignalSource: () => void
  onCreateTrader: () => void
}

export function PageHeader({ tradersCount, configuredModelsCount, configuredExchangesCount, onAddModel, onAddExchange, onConfigureSignalSource, onCreateTrader }: PageHeaderProps) {
  const canCreateTrader = configuredModelsCount > 0 && configuredExchangesCount > 0
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Left>
        <IconWrapper>
          <Bot style={{ width: '24px', height: '24px', color: '#000' }} />
        </IconWrapper>
        <div>
          <TitleWrap>
            <Title>{t('aiTraders')}</Title>
            <ActiveTag>
              {tradersCount} {t('active')}
            </ActiveTag>
          </TitleWrap>
          <SubText>{t('manageAITraders')}</SubText>
        </div>
      </Left>

      <Buttons>
        <ActionButton onClick={onAddModel}>
          <Plus style={{ width: '16px', height: '16px' }} />
          {t('aiModels')}
        </ActionButton>

        <ActionButton onClick={onAddExchange}>
          <Plus style={{ width: '16px', height: '16px' }} />
          {t('exchanges')}
        </ActionButton>

        <ActionButton onClick={onConfigureSignalSource}>
          <Radio style={{ width: '16px', height: '16px' }} />
          {t('signalSource')}
        </ActionButton>

        <ActionButton onClick={onCreateTrader} disabled={!canCreateTrader} highlight={canCreateTrader}>
          <Plus style={{ width: '18px', height: '18px' }} />
          {t('createTrader')}
        </ActionButton>
      </Buttons>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
    gap: 12px;
    flex-direction: column;
    align-items: flex-start;
  }
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
`

const TitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`

const Title = styled.h1`
  padding: 4px 12px;
  font-size: 20px;
  font-weight: bold;
  border-radius: 8px;
  background: #cafe36;
`

const ActiveTag = styled.span`
  height: 100%;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f3f3f3;
`

const SubText = styled.p`
  font-size: 14px;
`

const Buttons = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;
    gap: 12px;
    flex-wrap: wrap;
  }
`

const ActionButton = styled.button<{ disabled?: boolean; highlight?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 6px;
  transition: all 0.2s;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid #191a23;
  background: ${(p) => (p.highlight ? '#000' : '#fff')};
  color: ${(p) => (p.highlight ? '#fff' : '#000')};

  &:hover {
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #2b3139;
    color: #848e9c;
  }

  @media (min-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`
