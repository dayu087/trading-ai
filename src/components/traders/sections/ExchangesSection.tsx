import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { getExchangeIcon } from '../../ExchangeIcons'
import { getShortName } from '../index'
import type { Exchange } from '../../../types'

interface ExchangesSectionProps {
  configuredExchanges: Exchange[]
  isExchangeInUse: (exchangeId: string) => boolean
  onExchangeClick: (exchangeId: string) => void
}

export function ExchangesSection({ configuredExchanges, isExchangeInUse, onExchangeClick }: ExchangesSectionProps) {
  const { t } = useTranslation()
  return (
    <Card>
      <Title>{t('exchanges')}</Title>

      <List>
        {configuredExchanges.map((exchange) => {
          const inUse = isExchangeInUse(exchange.id)
          return (
            <Item key={exchange.id} $inUse={inUse} onClick={() => onExchangeClick(exchange.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IconBox>{getExchangeIcon(exchange.id, { width: 28, height: 28 })}</IconBox>
                <Info>
                  <Name>{getShortName(exchange.name)}</Name>
                  <Status>
                    {exchange.type.toUpperCase()} •{inUse ? t('inUse') : exchange.enabled ? t('enabled') : t('configured')}
                  </Status>
                </Info>
              </div>
              <Dot enabled={exchange.enabled} />
            </Item>
          )
        })}

        {configuredExchanges.length === 0 && (
          <EmptyState>
            <div style={{ fontSize: '13px' }}>{t('noExchangesConfigured')}</div>
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
    background: ${(p) => (p.$inUse ? '#fff' : 'var(--brand-green)')};
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

const Dot = styled.div<{ enabled: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(p) => (p.enabled ? '#2EE434' : '#6b7280')};

  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 0;
  color: #848e9c;

  @media (max-width: 768px) {
    padding: 24px 0;
  }
`
