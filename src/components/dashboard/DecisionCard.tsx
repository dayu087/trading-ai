import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'
import type { DecisionRecord } from '@/types'
import yesIcon from '@/assets/images/home_icon_yesgreen.png'
import noIcon from '@/assets/images/home_icon_nogreen.png'

import moreIcon from '@/assets/images/dashboard_icon_arrowmore.png'
import lessIcon from '@/assets/images/dashboard_icon_arrowless.png'

export default function DecisionCard({ decision }: { decision: DecisionRecord }) {
  const [showInputPrompt, setShowInputPrompt] = useState(false)
  const [showCoT, setShowCoT] = useState(false)
  const { t } = useTranslation()

  return (
    <DecisionBox>
      {/* Header */}
      <DecisionHeader>
        <DecisionInfo>
          <DecisionCycle>
            {t('cycle')} #{decision.cycle_number}
          </DecisionCycle>
          <DecisionStatus $success={decision.success}>{t(decision.success ? 'success' : 'failed')}</DecisionStatus>
        </DecisionInfo>
        <DecisionTime>{new Date(decision.timestamp).toLocaleString()}</DecisionTime>
      </DecisionHeader>

      {/* Input Prompt */}
      {decision.input_prompt && (
        <div>
          <ToggleRow>
            <ToggleButton color="#60a5fa" onClick={() => setShowInputPrompt(!showInputPrompt)}>
              <strong>{t('inputPrompt')}</strong>
              <ArrowBox>
                <img src={showInputPrompt ? lessIcon : moreIcon} alt="Arrow" />
              </ArrowBox>
            </ToggleButton>
          </ToggleRow>
          {showInputPrompt && <CodeBlock>{decision.input_prompt}</CodeBlock>}
        </div>
      )}

      {/* CoT */}
      {decision.cot_trace && (
        <div>
          <ToggleRow>
            <ToggleButton color="#F0B90B" onClick={() => setShowCoT(!showCoT)}>
              <strong> {t('aiThinking')}</strong>
              <ArrowBox>
                <img src={showCoT ? lessIcon : moreIcon} alt="Arrow" />
              </ArrowBox>
            </ToggleButton>
          </ToggleRow>
          {showCoT && <CodeBlock>{decision.cot_trace}</CodeBlock>}
        </div>
      )}

      {/* Decisions Actions */}
      {decision.decisions && decision.decisions.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {decision.decisions.map((action, j) => (
            <ActionItem key={j}>
              <ActionSymbol>{action.symbol}</ActionSymbol>
              <ActionBadge $isOpen={action.action.includes('open')}>{action.action}</ActionBadge>
              {action.leverage > 0 && <ActionText>{action.leverage}x</ActionText>}
              {action.price > 0 && (
                <ActionText className="mono" color="#848E9C">
                  @{action.price.toFixed(4)}
                </ActionText>
              )}
              <ActionText color={action.success ? '#0ECB81' : '#F6465D'}>
                <img src={action.success ? yesIcon : noIcon} alt="" />
              </ActionText>
              {action.error && <ActionText color="#F6465D">{action.error}</ActionText>}
            </ActionItem>
          ))}
        </div>
      )}

      {/* Account State Summary */}
      {decision.account_state && (
        <AccountState>
          <span>净值: {decision.account_state.total_balance.toFixed(2)} USDT</span>
          <span>可用: {decision.account_state.available_balance.toFixed(2)} USDT</span>
          <span>保证金率: {decision.account_state.margin_used_pct.toFixed(1)}%</span>
          <span>持仓: {decision.account_state.position_count}</span>
          <span
            style={{
              color: decision.candidate_coins && decision.candidate_coins.length === 0 ? '#F6465D' : '#848E9C',
            }}
          >
            {t('candidateCoins')}: {decision.candidate_coins?.length || 0}
          </span>
        </AccountState>
      )}

      {/* Candidate Coins Warning */}
      {decision.candidate_coins && decision.candidate_coins.length === 0 && (
        <WarningRow>
          <AlertTriangle size={16} />
          <WarningContent>
            <div style={{ fontWeight: 700 }}>⚠️ {t('candidateCoinsZeroWarning')}</div>
            <div style={{ color: '#848E9C', fontSize: 12 }}>
              <div>{t('possibleReasons')}</div>
              <ul style={{ marginLeft: 16 }}>
                <li>{t('coinPoolApiNotConfigured')}</li>
                <li>{t('apiConnectionTimeout')}</li>
                <li>{t('noCustomCoinsAndApiFailed')}</li>
              </ul>
              <div style={{ marginTop: 6, fontWeight: 700 }}>{t('solutions')}</div>
              <ul style={{ marginLeft: 16 }}>
                <li>{t('setCustomCoinsInConfig')}</li>
                <li>{t('orConfigureCorrectApiUrl')}</li>
                <li>{t('orDisableCoinPoolOptions')}</li>
              </ul>
            </div>
          </WarningContent>
        </WarningRow>
      )}

      {/* Execution Logs */}
      {decision.execution_log && decision.execution_log.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {decision.execution_log.map((log, k) => (
            <LogLine key={k} $success={log.includes('✓') || log.includes('成功')}>
              {log}
            </LogLine>
          ))}
        </div>
      )}

      {/* Error Message */}
      {decision.error_message && <ErrorBox>❌ {decision.error_message}</ErrorBox>}
    </DecisionBox>
  )
}
/* Decision internal */
const DecisionBox = styled.div`
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid #f3f3f3;
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-2px);
  }
`
const DecisionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const DecisionInfo = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`

const DecisionCycle = styled.div`
  padding: 4px 12px;
  color: #cafe36;
  font-weight: bold;
  background: #0d4751;
  border-radius: 8px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`
const DecisionTime = styled.div`
  padding-bottom: 16px;
  margin-bottom: 16px;
  font-size: 0.75rem;
  color: #191a23;
  border-bottom: 1px solid #f3f3f3;
`
const DecisionStatus = styled.div<{ $success: boolean }>`
  position: relative;
  z-index: 2;
  font-size: 1rem;
  font-weight: bold;
  color: ${({ $success }) => ($success ? 'var(--up_color)' : 'var(--down_color)')};

  @media (max-width: 768px) {
    font-size: 14px;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    z-index: -1;
    bottom: 8px;
    width: 100%;
    height: 12px;
    background: ${({ $success }) => ($success ? 'var(--up_bg)' : 'var(--down_bg)')};
  }
`
const ToggleRow = styled.div`
  margin-bottom: 8px;
`
const ToggleButton = styled.button<{ color?: string }>`
  background: none;
  border: none;
  color: #191a23;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  transform: none !important;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`
const ArrowBox = styled.div`
  padding: 4px;
  border-radius: 50%;
  background: #f3f3f3;

  @media (max-width: 768px) {
    padding: 2px;
  }

  img {
    width: 12px;
    height: 12px;
    @media (max-width: 768px) {
      width: 10px;
      height: 10px;
    }
  }
`

const CodeBlock = styled.pre`
  max-width: 320px;
  border: 1px solid #2b3139;
  border-radius: 8px;
  padding: 0.75rem;
  white-space: pre-wrap;
  max-height: 24rem;
  overflow-y: auto;
  margin-top: 8px;
  background: rgba(243, 243, 243, 0.7);

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 12px;
  }
`
const ActionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: rgba(243, 243, 243, 0.7);
  border-radius: 4px;
  margin-bottom: 12px;
`
const ActionSymbol = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace;
  font-size: 14px;
  color: #191a23;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`
const ActionBadge = styled.span<{ $isOpen: boolean }>`
  margin-left: auto;
  border-radius: 4px;
  font-size: 14px;
  /* color: ${({ $isOpen }) => ($isOpen ? '#60a5fa' : '#F0B90B')}; */
  @media (max-width: 768px) {
    font-size: 12px;
  }
`
const ActionText = styled.div<{ color?: string }>`
  /* color: ${({ color }) => color || '#848E9C'}; */
  font-size: 0.875rem;
  @media (max-width: 768px) {
    font-size: 12px;
  }

  img {
    width: 12px;
    height: 12px;
  }
`

const AccountState = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(243, 243, 243, 0.7);
  border-radius: 4px;
  color: #191a23;
  margin-top: 8px;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const WarningRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  background: rgba(246, 70, 93, 0.1);
  border: 1px solid rgba(246, 70, 93, 0.3);
  padding: 8px;
  border-radius: 6px;
  color: #f6465d;
  margin-top: 8px;
`
const WarningContent = styled.div`
  flex: 1;
`

const LogLine = styled.div<{ $success?: boolean }>`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace;
  color: ${({ $success }) => ($success ? '#0ECB81' : '#F6465D')};
  font-size: 0.875rem;
  margin-top: 4px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const ErrorBox = styled.div`
  background: rgba(246, 70, 93, 0.1);
  color: #f6465d;
  padding: 8px;
  border-radius: 6px;
  margin-top: 8px;
`
