import { useState } from 'react'
import { styled } from 'styled-components'
import type { TraderConfigData } from '../types'
import useCopy from '@/hooks/useCopy'

import botIcon from '@/assets/images/config_logo_bot.png'

// 提取下划线后面的名称部分
function getShortName(fullName: string): string {
  const parts = fullName.split('_')
  return parts.length > 1 ? parts[parts.length - 1] : fullName
}

function sliceText(text: string, maxLength: number = 10): string {
  if (text.length <= maxLength) return text
  return text.slice(0, 2) + '...' + text.slice(-4)
}

interface TraderConfigViewModalProps {
  isOpen: boolean
  onClose: () => void
  traderData?: TraderConfigData | null
}

export function TraderConfigViewModal({ isOpen, onClose, traderData }: TraderConfigViewModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { copiedMap, onCopy } = useCopy()

  if (!isOpen || !traderData) return null

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const InfoRow = ({ label, value, copyable = false, fieldName = '' }: { label: string; value: string | number | boolean; copyable?: boolean; fieldName?: string }) => (
    <Row>
      <Label>{label}</Label>
      <ValueBox>
        <ValueText>{typeof value === 'boolean' ? (value ? '是' : '否') : fieldName == 'trader_id' && typeof value === 'string' ? sliceText(value) : value}</ValueText>
        {copyable && typeof value === 'string' && value && <CopyButton onClick={() => onCopy(value, value)}>{copiedMap[value] ? '✓ copyed' : 'copy'}</CopyButton>}
      </ValueBox>
    </Row>
  )

  return (
    <Overlay>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderLeft>
            <IconBox>
              <img src={botIcon} alt="" />
            </IconBox>
            <div>
              <Title>交易员配置</Title>
              <Subtitle>{traderData.trader_name} 的配置信息</Subtitle>
            </div>
          </HeaderLeft>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <StatusTag $running={traderData.is_running}>
              <span>{traderData.is_running ? '●' : '○'}</span>
              {traderData.is_running ? '运行中' : '已停止'}
            </StatusTag>
            <CloseBtn onClick={onClose}>✕</CloseBtn>
          </div>
        </Header>

        <ContentSection>
          <Section>
            <SectionTitle>🤖 基础信息</SectionTitle>
            <SectionContent>
              <InfoRow label="交易员ID" value={traderData.trader_id || ''} copyable fieldName="trader_id" />
              <InfoRow label="交易员名称" value={traderData.trader_name} copyable fieldName="trader_name" />
              <InfoRow label="AI模型" value={getShortName(traderData.ai_model).toUpperCase()} />
              <InfoRow label="交易所" value={getShortName(traderData.exchange_id).toUpperCase()} />
              <InfoRow label="初始余额" value={`$${traderData.initial_balance.toLocaleString()}`} />
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>⚖️ 交易配置</SectionTitle>
            <SectionContent>
              <InfoRow label="保证金模式" value={traderData.is_cross_margin ? '全仓' : '逐仓'} />
              <InfoRow label="BTC/ETH 杠杆" value={`${traderData.btc_eth_leverage}x`} />
              <InfoRow label="山寨币杠杆" value={`${traderData.altcoin_leverage}x`} />
              <InfoRow label="交易币种" value={traderData.trading_symbols || '使用默认币种'} copyable fieldName="trading_symbols" />
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>📡 信号源配置</SectionTitle>
            <SectionContent>
              <InfoRow label="Coin Pool 信号" value={traderData.use_coin_pool} />
              <InfoRow label="OI Top 信号" value={traderData.use_oi_top} />
            </SectionContent>
          </Section>

          <Section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <SectionTitle>💬 交易策略提示词</SectionTitle>
              {traderData.custom_prompt && (
                <CopyButton onClick={() => onCopy(traderData.custom_prompt, 'custom_prompt')}>{copiedField === 'custom_prompt' ? '✓ copyed' : 'copy'}</CopyButton>
              )}
            </div>

            {traderData.custom_prompt ? (
              <SectionContent>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>{traderData.override_base_prompt ? '自定义提示词' : '附加提示词'}：</div>
                <PromptDescription>{traderData.custom_prompt}</PromptDescription>
              </SectionContent>
            ) : (
              <PromptDescription>未设置自定义提示词，使用系统默认策略</PromptDescription>
            )}
          </Section>
        </ContentSection>

        <Footer>
          <Btn onClick={onClose}>关闭</Btn>
          <CopyBtn onClick={() => copyToClipboard(JSON.stringify(traderData, null, 2), 'full_config')}>
            {copiedField === 'full_config' ? '✓ 已复制配置' : '📋 复制完整配置'}
          </CopyBtn>
        </Footer>
      </ModalWrapper>
    </Overlay>
  )
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  animation: fadeIn 0.3s ease-out;
`

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 42rem;
  width: 100%;
  margin: 0 1rem;
  max-height: 90vh;
  background: #fff;
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 24px 24px 24px 24px;
  border: 1px solid #000000;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 90vw;
    border-radius: 16px;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #2b3139;
  @media (max-width: 768px) {
    padding: 12px;
  }
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const IconBox = styled.div`
  padding: 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;

  img {
    width: 40px;
    height: 40px;
  }

  @media (max-width: 768px) {
    img {
      width: 32px;
      height: 32px;
    }
  }
`

const Title = styled.h2`
  width: fit-content;
  padding: 4px 12px;
  font-size: 20px;
  font-weight: bold;
  border-radius: 8px;
  background-color: var(--brand-green);
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

const Subtitle = styled.p`
  font-size: 14px;
  margin-top: 8px;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const StatusTag = styled.div<{ $running: boolean }>`
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ $running }) => ($running ? '#0ECB81' : '#F6465D')};
  background: ${({ $running }) => ($running ? 'rgba(14,203,129,0.1)' : 'rgba(246,70,93,0.1)')};

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 2px 8px;
  }
`

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    color: #eaecf0;
    background: #2b3139;
  }
`

const ContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  overflow-y: auto;
  background: #f3f3f3;

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(25, 26, 35, 0.2);
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`

const Section = styled.div`
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
  @media (max-width: 768px) {
    padding: 12px;
  }
`

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 6px;
  }
`

const SectionTitle = styled.h3`
  width: fit-content;
  margin-bottom: 16px;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  background: #f3f3f3;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 8px;
  }
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 48px;
  border-top: 1px solid #191a23;
  @media (max-width: 768px) {
    gap: 6px;
    padding: 12px 24px;
  }
`

const Btn = styled.button`
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  transition: 0.2s;
  border: 1px solid #191a23;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px 12px;
  }
`

const CopyBtn = styled(Btn)`
  color: #fff;
  background: #000;
  border: 1px solid #000;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #a3a3a7;

  &:last-child {
    border-bottom: 0;
  }
`

const Label = styled.span`
  font-size: 14px;
  white-space: nowrap;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const ValueBox = styled.div`
  display: flex;
  align-items: center;
  text-align: right;
  gap: 6px;
`

const ValueText = styled.span`
  font-size: 14px;
  font-weight: bold;
  font-family: monospace;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const CopyButton = styled.button`
  padding: 2px 4px;
  font-size: 12px;
  border-radius: 4px;
  font-weight: bold;
  border: 1px solid #000;
  @media (max-width: 768px) {
    font-size: 10px;
    padding: 0 2px;
  }
`

const PromptDescription = styled.p`
  padding: 12px;
  border-radius: 6px;
  background: #f3f3f3;
  border: 1px solid #2b3139;
  white-space: pre-wrap;
  /* color: #eaecf0; */
  font-size: 14px;
  max-height: 180px;
  overflow-y: auto;
  @media (max-width: 768px) {
    padding: 6px;
    font-size: 12px;
  }
`
