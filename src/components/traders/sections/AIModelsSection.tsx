import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { getModelIcon } from '../../ModelIcons'
import { getShortName } from '../utils'
import type { AIModel } from '../../../types'

interface AIModelsSectionProps {
  configuredModels: AIModel[]
  isModelInUse: (modelId: string) => boolean
  onModelClick: (modelId: string) => void
}

export function AIModelsSection({ configuredModels, isModelInUse, onModelClick }: AIModelsSectionProps) {
  const { t } = useTranslation()
  return (
    <Card>
      <Title>{t('aiModels')}</Title>
      <List>
        {configuredModels.map((model) => {
          const inUse = isModelInUse(model.id)
          const icon = getModelIcon(model.provider || model.id, { width: 28, height: 28 })
          return (
            <Item key={model.id} $inUse={inUse} onClick={() => onModelClick(model.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IconBox>{icon || <GeneratedIcon color={model.id === 'deepseek' ? '#60a5fa' : '#c084fc'}>{getShortName(model.name)[0]}</GeneratedIcon>}</IconBox>
                <Info>
                  <Name>{getShortName(model.name)}</Name>
                  <Status>{inUse ? t('inUse') : model.enabled ? t('enabled') : t('configured')}</Status>
                </Info>
              </div>
              <Dot $enabled={model.enabled} />
            </Item>
          )
        })}

        {configuredModels.length === 0 && (
          <EmptyState>
            <div style={{ fontSize: '13px' }}>{t('noModelsConfigured')}</div>
          </EmptyState>
        )}
      </List>
    </Card>
  )
}

const Card = styled.div`
  padding: 24px;
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 24px;
  border: 1px solid #000000;

  @media (max-width: 768px) {
    padding: 12px;
    border-radius: 16px;
  }
`

const Title = styled.h3`
  width: fit-content;
  padding: 4px 12px;
  margin-bottom: 20px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
  color: #191a23;
  background: var(--brand-green);

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 12px;
  }
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`

const Item = styled.div<{ $inUse: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #f3f3f3;
  border-radius: 8px;
  transition: 0.2s;
  cursor: ${(p) => (p.$inUse ? 'not-allowed' : 'pointer')};

  &:hover {
    border-color: ${(p) => (p.$inUse ? '#f3f3f3' : '#000')};
  }

  @media (max-width: 768px) {
    padding: 8px;
  }
`

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid #f3f3f3;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`

const GeneratedIcon = styled.div<{ color: string }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  background: ${(p) => p.color};

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
`

const Info = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
`

const Name = styled.div`
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`

const Status = styled.div`
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const Dot = styled.div<{ $enabled: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(p) => (p.$enabled ? '#2EE434' : '#6b7280')};

  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 0;

  @media (max-width: 768px) {
    padding: 24px 0;
  }
`
