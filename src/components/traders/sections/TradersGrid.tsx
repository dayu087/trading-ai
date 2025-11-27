import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Bot, BarChart3, Trash2, Pencil } from 'lucide-react'
import { getModelDisplayName } from '../index'
import type { TraderInfo } from '../../../types'

interface TradersGridProps {
  traders: TraderInfo[] | undefined
  onTraderSelect: (traderId: string) => void
  onEditTrader: (traderId: string) => void
  onDeleteTrader: (traderId: string) => void
  onToggleTrader: (traderId: string, running: boolean) => void
}

export function TradersGrid({ traders, onTraderSelect, onEditTrader, onDeleteTrader, onToggleTrader }: TradersGridProps) {
  const { t } = useTranslation()
  if (!traders || traders.length === 0) {
    return (
      <EmptyWrapper>
        <Bot className="w-24 h-24" />
        <div className="title">{t('noTraders')}</div>
        <div className="subtitle">{t('createFirstTrader')}</div>
      </EmptyWrapper>
    )
  }

  return (
    <GridSection>
      <GridHeader>
        <GridTitle>{t('leaderboard')}</GridTitle>
        <GridTag>{t('live')}</GridTag>
      </GridHeader>
      <GridWrapper>
        {traders.map((trader) => {
          const isDeepseek = trader.ai_model.includes('deepseek')
          const avatarBg = isDeepseek ? '#60a5fa' : '#c084fc'

          return (
            <TraderCard key={trader.trader_id}>
              <TraderLeft>
                <Avatar bg={avatarBg}>
                  <Bot className="w-5 h-5" />
                </Avatar>

                <Info>
                  <div className="name">{trader.trader_name}</div>
                  <div className="model" style={{ color: avatarBg }}>
                    {getModelDisplayName(trader.ai_model.split('_').pop() || trader.ai_model)} Model • {trader.exchange_id?.toUpperCase()}
                  </div>
                </Info>
              </TraderLeft>

              <TraderRight>
                <StatusTag $running={trader.is_running || false}>{trader.is_running ? t('running') : t('stopped')}</StatusTag>

                <ActionGroup>
                  {/* View */}
                  <ActionButton onClick={() => onTraderSelect(trader.trader_id)} bg="rgba(99,102,241,0.1)" color="#6366F1">
                    <BarChart3 className="w-4 h-4" />
                    {t('view')}
                  </ActionButton>

                  {/* Edit */}
                  <ActionButton
                    onClick={() => !trader.is_running && onEditTrader(trader.trader_id)}
                    bg={trader.is_running ? 'rgba(132,142,156,0.1)' : 'rgba(255,193,7,0.1)'}
                    color={trader.is_running ? '#848E9C' : '#FFC107'}
                    disabledStyle={trader.is_running}
                  >
                    <Pencil className="w-4 h-4" />
                    {t('edit')}
                  </ActionButton>

                  {/* Start / Stop */}
                  <ActionButton
                    onClick={() => onToggleTrader(trader.trader_id, trader.is_running || false)}
                    bg={trader.is_running ? 'rgba(246,70,93,0.1)' : 'rgba(14,203,129,0.1)'}
                    color={trader.is_running ? '#F6465D' : '#0ECB81'}
                  >
                    {trader.is_running ? t('stop') : t('start')}
                  </ActionButton>

                  {/* Delete */}
                  <ActionButton onClick={() => onDeleteTrader(trader.trader_id)} bg="rgba(246,70,93,0.1)" color="#F6465D">
                    <Trash2 className="w-4 h-4" />
                  </ActionButton>
                </ActionGroup>
              </TraderRight>
            </TraderCard>
          )
        })}
      </GridWrapper>
    </GridSection>
  )
}

const EmptyWrapper = styled.div`
  text-align: center;
  color: #848e9c;
  padding: 12rem 0;

  @media (max-width: 768px) {
    padding: 8rem 0;
  }

  svg {
    opacity: 0.5;
    margin: 0 auto 1rem;
  }

  .title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  .subtitle {
    font-size: 0.875rem;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 0.75rem;
    }
  }
`

const GridSection = styled.div`
  padding: 24px;
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 24px;
  border: 1px solid #000000;
`

const GridHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const GridTag = styled.span`
  font-size: 14px;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 16px;
  border: 1px solid #000;
`

const GridTitle = styled.h2`
  width: fit-content;
  padding: 4px 12px;
  font-weight: bold;
  font-size: 20px;
  background: #cafe36;
  border-radius: 8px;
  margin-bottom: 20px;
`

const GridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`

const TraderCard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  border: 1px solid #f3f3f3;
  padding: 10px 16px;
  border-radius: 8px;
  transition: 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0.75rem;
  }
`

const TraderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`

const Avatar = styled.div<{ bg: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  background: ${(p) => p.bg};

  @media (max-width: 768px) {
    width: 2.5rem;
    height: 2.5rem;
  }
`

const Info = styled.div`
  min-width: 0;

  .name {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 2px;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  .model {
    font-size: 0.875rem;
    color: #60a5fa;

    @media (max-width: 768px) {
      font-size: 0.75rem;
    }
  }
`

const TraderRight = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
`

const StatusTag = styled.div<{ $running: boolean }>`
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 0.375rem;
  text-align: center;
  background: ${(p) => (p.$running ? 'var(--up_bg)' : 'var(--down_bg)')};
  color: ${(p) => (p.$running ? 'var(--up_color)' : 'var(--down_color)')};

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`

const ActionGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: nowrap;
  overflow-x: auto;

  @media (max-width: 768px) {
    gap: 0.35rem;
    width: 100%;
  }
`

const ActionButton = styled.button<{
  bg: string
  color: string
  disabledStyle?: boolean
}>`
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: ${(p) => p.bg};
  color: ${(p) => p.color};
  transition: 0.15s ease;

  &:hover {
    transform: scale(1.05);
  }

  ${(p) =>
    p.disabledStyle &&
    `
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
    }
  `}

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.35rem 0.5rem;
  }
`
