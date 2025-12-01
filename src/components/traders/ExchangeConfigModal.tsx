import React, { useState, useEffect, useMemo } from 'react'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'
import type { Exchange } from '../../types'
import { api } from '../../lib/api'
import { getExchangeIcon } from '../ExchangeIcons'
import { TwoStageKeyModal, type TwoStageKeyModalResult } from '../TwoStageKeyModal'
import { WebCryptoEnvironmentCheck, type WebCryptoCheckStatus } from '../WebCryptoEnvironmentCheck'
import { BookOpen, Trash2, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Tooltip } from './Tooltip'
import { getShortName } from './utils'
import useCopy from '@/hooks/useCopy'

import Dropdown from '@/components/ui/Dropdown'
import GuideOverlay from './exchange/GuideOverlay'

import lessIcon from '@/assets/images/dashboard_icon_arrowless.png'
import moreIcon from '@/assets/images/dashboard_icon_arrowmore.png'

interface ExchangeConfigModalProps {
  allExchanges: Exchange[]
  editingExchangeId: string | null
  onSave: (
    exchangeId: string,
    apiKey: string,
    secretKey?: string,
    testnet?: boolean,
    hyperliquidWalletAddr?: string,
    asterUser?: string,
    asterSigner?: string,
    asterPrivateKey?: string,
    lighterWalletAddr?: string,
    lighterPrivateKey?: string,
    lighterApiKeyPrivateKey?: string
  ) => Promise<void>
  onDelete: (exchangeId: string) => void
  onClose: () => void
}

export function ExchangeConfigModal({ allExchanges, editingExchangeId, onSave, onDelete, onClose }: ExchangeConfigModalProps) {
  const [selectedExchangeId, setSelectedExchangeId] = useState(editingExchangeId || '')
  const [apiKey, setApiKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [testnet, setTestnet] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [serverIP, setServerIP] = useState<{
    public_ip: string
    message: string
  } | null>(null)
  const [loadingIP, setLoadingIP] = useState(false)
  const [copiedIP, setCopiedIP] = useState(false)
  const [webCryptoStatus, setWebCryptoStatus] = useState<WebCryptoCheckStatus>('idle')
  const [showTwoStageKeyModal, setShowTwoStageKeyModal] = useState(false)

  const { t } = useTranslation()
  const { onCopy, copiedMap } = useCopy()

  // 币安配置指南展开状态
  const [showBinanceGuide, setShowBinanceGuide] = useState(false)

  // Aster 特定字段
  const [asterUser, setAsterUser] = useState('')
  const [asterSigner, setAsterSigner] = useState('')
  const [asterPrivateKey, setAsterPrivateKey] = useState('')

  // Hyperliquid 特定字段
  const [hyperliquidWalletAddr, setHyperliquidWalletAddr] = useState('')

  // LIGHTER 特定字段
  const [lighterWalletAddr, setLighterWalletAddr] = useState('')
  const [lighterPrivateKey, setLighterPrivateKey] = useState('')
  const [lighterApiKeyPrivateKey, setLighterApiKeyPrivateKey] = useState('')

  // 安全输入状态
  const [secureInputTarget, setSecureInputTarget] = useState<null | 'hyperliquid' | 'aster' | 'lighter'>(null)

  // 获取当前编辑的交易所信息
  const selectedExchange = allExchanges?.find((e) => e.id === selectedExchangeId)

  // 如果是编辑现有交易所，初始化表单数据
  useEffect(() => {
    if (editingExchangeId && selectedExchange) {
      setApiKey(selectedExchange.apiKey || '')
      setSecretKey(selectedExchange.secretKey || '')
      setPassphrase('') // Don't load existing passphrase for security
      setTestnet(selectedExchange.testnet || false)

      // Aster 字段
      setAsterUser(selectedExchange.asterUser || '')
      setAsterSigner(selectedExchange.asterSigner || '')
      setAsterPrivateKey('') // Don't load existing private key for security

      // Hyperliquid 字段
      setHyperliquidWalletAddr(selectedExchange.hyperliquidWalletAddr || '')

      // LIGHTER 字段
      setLighterWalletAddr(selectedExchange.lighterWalletAddr || '')
      setLighterPrivateKey('') // Don't load existing private key for security
      setLighterApiKeyPrivateKey('') // Don't load existing API key for security
    }
  }, [editingExchangeId, selectedExchange])

  // 加载服务器IP（当选择binance时）
  useEffect(() => {
    if (selectedExchangeId === 'binance' && !serverIP) {
      setLoadingIP(true)
      api
        .getServerIP()
        .then((data) => {
          setServerIP(data)
        })
        .catch((err) => {
          console.error('Failed to load server IP:', err)
        })
        .finally(() => {
          setLoadingIP(false)
        })
    }
  }, [selectedExchangeId])

  const isInvalid = useMemo(() => {
    if (!selectedExchange) return true

    const commonCexCheck = !apiKey.trim() || !secretKey.trim()
    const validators: Record<string, () => boolean> = {
      binance: () => !apiKey.trim() || !secretKey.trim(),
      okx: () => !apiKey.trim() || !secretKey.trim() || !passphrase.trim(),
      hyperliquid: () => !apiKey.trim() || !hyperliquidWalletAddr.trim(),
      aster: () => !asterUser.trim() || !asterSigner.trim() || !asterPrivateKey.trim(),
      lighter: () => !lighterWalletAddr.trim() || !lighterPrivateKey.trim(),
      bybit: () => !apiKey.trim() || !secretKey.trim(),
    }
    // 优先按具体 id 校验
    if (validators[selectedExchange.id]) {
      return validators[selectedExchange.id]() // 返回对应的 true/false
    }
    // 通用 CEX 校验（排除特例）
    if (selectedExchange.type === 'cex' && !['hyperliquid', 'aster', 'lighter', 'binance', 'bybit', 'okx'].includes(selectedExchange.id)) {
      return commonCexCheck
    }

    return false
  }, [selectedExchange, apiKey, secretKey, passphrase, hyperliquidWalletAddr, asterUser, asterSigner, asterPrivateKey, lighterWalletAddr, lighterPrivateKey])

  // 安全输入处理函数
  const secureInputContextLabel = secureInputTarget === 'aster' ? t('asterExchangeName') : secureInputTarget === 'hyperliquid' ? t('hyperliquidExchangeName') : undefined

  const handleSecureInputCancel = () => {
    setSecureInputTarget(null)
  }

  const handleSecureInputComplete = ({ value, obfuscationLog }: TwoStageKeyModalResult) => {
    const trimmed = value.trim()
    if (secureInputTarget === 'hyperliquid') {
      setApiKey(trimmed)
    }
    if (secureInputTarget === 'aster') {
      setAsterPrivateKey(trimmed)
    }
    if (secureInputTarget === 'lighter') {
      setLighterPrivateKey(trimmed)
      toast.success(t('lighterPrivateKeyImported'))
    }
    // 仅在开发环境输出调试信息
    // if (import.meta.env.DEV) {
    //   console.log('Secure input obfuscation log:', obfuscationLog)
    // }
    setSecureInputTarget(null)
  }

  // 掩盖敏感数据显示
  const maskSecret = (secret: string) => {
    if (!secret || secret.length === 0) return ''
    if (secret.length <= 8) return '*'.repeat(secret.length)
    return secret.slice(0, 4) + '*'.repeat(Math.max(secret.length - 8, 4)) + secret.slice(-4)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedExchangeId) return

    // 根据交易所类型验证不同字段
    if (selectedExchange?.id === 'binance') {
      if (!apiKey.trim() || !secretKey.trim()) return
      await onSave(selectedExchangeId, apiKey.trim(), secretKey.trim(), testnet)
    } else if (selectedExchange?.id === 'hyperliquid') {
      if (!apiKey.trim() || !hyperliquidWalletAddr.trim()) return // 验证私钥和钱包地址
      await onSave(selectedExchangeId, apiKey.trim(), '', testnet, hyperliquidWalletAddr.trim())
    } else if (selectedExchange?.id === 'aster') {
      if (!asterUser.trim() || !asterSigner.trim() || !asterPrivateKey.trim()) return
      await onSave(selectedExchangeId, '', '', testnet, undefined, asterUser.trim(), asterSigner.trim(), asterPrivateKey.trim())
    } else if (selectedExchange?.id === 'lighter') {
      if (!lighterWalletAddr.trim() || !lighterPrivateKey.trim()) return
      await onSave(
        selectedExchangeId,
        lighterPrivateKey.trim(),
        '',
        testnet,
        lighterWalletAddr.trim(),
        undefined,
        undefined,
        undefined,
        lighterWalletAddr.trim(),
        lighterPrivateKey.trim(),
        lighterApiKeyPrivateKey.trim()
      )
    } else if (selectedExchange?.id === 'okx') {
      if (!apiKey.trim() || !secretKey.trim() || !passphrase.trim()) return
      await onSave(selectedExchangeId, apiKey.trim(), secretKey.trim(), testnet)
    } else {
      // 默认情况（其他CEX交易所）
      if (!apiKey.trim() || !secretKey.trim()) return
      await onSave(selectedExchangeId, apiKey.trim(), secretKey.trim(), testnet)
    }
  }

  // 可选择的交易所列表（所有支持的交易所）
  const availableExchanges = allExchanges || []

  return (
    <Backdrop>
      <ModalWrapper>
        <Header>
          <Title>{editingExchangeId ? t('editExchange') : t('addExchange')}</Title>
          <HeaderRight>
            {selectedExchange?.id === 'binance' && (
              <GuideButton type="button" onClick={() => setShowGuide(true)}>
                <BookOpen className="w-4 h-4" />
                {t('viewGuide')}
              </GuideButton>
            )}

            {editingExchangeId && (
              <DeleteButton type="button" onClick={() => onDelete(editingExchangeId)} title={t('delete')}>
                <Trash2 className="w-4 h-4" />
              </DeleteButton>
            )}
          </HeaderRight>
        </Header>

        <Form onSubmit={handleSubmit}>
          <ScrollArea $id={selectedExchange?.id || ''} $selectOpen={showTwoStageKeyModal}>
            {!editingExchangeId && (
              <div className="space-y-3">
                <FromGroup>
                  <Lable>{t('environmentSteps.checkTitle')}</Lable>
                  <WebCryptoEnvironmentCheck variant="card" onStatusChange={setWebCryptoStatus} />
                </FromGroup>
                <FromGroup>
                  <Lable>{t('environmentSteps.selectTitle')}</Lable>
                  <Dropdown
                    lable={t('pleaseSelectExchange')}
                    open={showTwoStageKeyModal}
                    DropdownDataList={availableExchanges}
                    selectId={selectedExchangeId}
                    setSelectId={setSelectedExchangeId}
                    setOpen={setShowTwoStageKeyModal}
                    isDisabled={webCryptoStatus !== 'secure'}
                  />
                </FromGroup>
              </div>
            )}

            {selectedExchange && (
              <ExchangeCard>
                <ExchangeHeader>
                  <ExchangeIconWrapper>{getExchangeIcon(selectedExchange.id, { width: 48, height: 48 })}</ExchangeIconWrapper>
                  <div>
                    <ExchangeName>{getShortName(selectedExchange.name)}</ExchangeName>
                    <ExchangeSubText>
                      {selectedExchange.type.toUpperCase()} • {selectedExchange.id}
                    </ExchangeSubText>
                  </div>
                </ExchangeHeader>
              </ExchangeCard>
            )}

            {selectedExchange && (
              <>
                {/* Binance/Bybit 和其他 CEX 交易所的字段 */}
                {(selectedExchange.id === 'binance' || selectedExchange.id === 'bybit' || selectedExchange.type === 'cex') &&
                  selectedExchange.id !== 'hyperliquid' &&
                  selectedExchange.id !== 'aster' && (
                    <>
                      {/* 币安用户配置提示 (D1 方案) */}
                      {selectedExchange.id === 'binance' && (
                        <GuideWrapper onClick={() => setShowBinanceGuide(!showBinanceGuide)}>
                          <GuideHeader>
                            <GuideHeaderLeft>
                              <GuideTitle>
                                <strong>币安用户必读：</strong>
                                使用「现货与合约交易」API，不要用「统一账户 API」
                              </GuideTitle>
                            </GuideHeaderLeft>
                            <ArrowIcon src={showBinanceGuide ? lessIcon : moreIcon} alt="" />
                          </GuideHeader>
                          {showBinanceGuide && (
                            <GuideContent onClick={(e) => e.stopPropagation()}>
                              <GuideParagraph>
                                <strong>原因：</strong> 统一账户 API 权限结构不同，会导致订单提交失败
                              </GuideParagraph>
                              <GuideStepTitle>正确配置步骤：</GuideStepTitle>
                              <GuideSteps>
                                <li>登录币安 → 个人中心 → API 管理</li>
                                <li>创建 API → 选择「 系统生成的 API 密钥」</li>
                                <li>勾选「现货与合约交易」( 不选统一账户 )</li>
                                <li>IP 限制选「无限制」或添加服务器 IP</li>
                              </GuideSteps>
                              <WarningBox>
                                <strong>💡多资产模式用户注意：</strong>
                                如果您开启了多资产模式，将强制使用全仓模式。建议关闭多资产模式以支持逐仓交易。
                              </WarningBox>
                              <GuideLink href="https://www.binance.com/zh-CN/support/faq/how-to-create-api-keys-on-binance-360002502072" target="_blank" rel="noopener noreferrer">
                                查看币安官方教程 ↗
                              </GuideLink>
                            </GuideContent>
                          )}
                        </GuideWrapper>
                      )}

                      <FromGroup>
                        <Lable>{t('apiKey')}</Lable>
                        <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={t('enterAPIKey')} required />
                      </FromGroup>
                      <FromGroup>
                        <Lable>{t('secretKey')}</Lable>
                        <Input type="password" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} placeholder={t('enterSecretKey')} required />
                      </FromGroup>

                      {selectedExchange.id === 'okx' && (
                        <FromGroup>
                          <Lable>{t('passphrase')}</Lable>
                          <Input type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} placeholder={t('enterPassphrase')} required />
                        </FromGroup>
                      )}

                      {/* Binance 白名单IP提示 */}
                      {selectedExchange.id === 'binance' && (
                        <WhitelistIPBox>
                          <h2> {t('whitelistIP')}</h2>
                          <span> {t('whitelistIPDesc')}</span>

                          {loadingIP ? (
                            <span> {t('loadingServerIP')}</span>
                          ) : serverIP && serverIP.public_ip ? (
                            <IpInfo>
                              <code>{serverIP.public_ip}</code>
                              <button type="button" onClick={() => onCopy(serverIP.public_ip, 'ipCopied')}>
                                {copiedMap['ipCopied'] ? t('ipCopied') : t('copyIP')}
                              </button>
                            </IpInfo>
                          ) : null}
                        </WhitelistIPBox>
                      )}
                    </>
                  )}

                {/* Aster 交易所的字段 */}
                {selectedExchange.id === 'aster' && (
                  <>
                    <FromGroup>
                      <Lable>
                        {t('user')}
                        <Tooltip content={t('asterUserDesc')}>
                          <HelpCircle className="w-4 h-4 cursor-help" />
                        </Tooltip>
                      </Lable>
                      <Input type="text" value={asterUser} onChange={(e) => setAsterUser(e.target.value)} placeholder={t('enterUser')} required />
                    </FromGroup>

                    <FromGroup>
                      <Lable>
                        {t('signer')}
                        <Tooltip content={t('asterSignerDesc')}>
                          <HelpCircle className="w-4 h-4 cursor-help" />
                        </Tooltip>
                      </Lable>
                      <Input type="text" value={asterSigner} onChange={(e) => setAsterSigner(e.target.value)} placeholder={t('enterSigner')} required />
                    </FromGroup>

                    <FromGroup>
                      <Lable>
                        {t('privateKey')}
                        <Tooltip content={t('asterPrivateKeyDesc')}>
                          <HelpCircle className="w-4 h-4 cursor-help" />
                        </Tooltip>
                      </Lable>
                      <Input type="password" value={asterPrivateKey} onChange={(e) => setAsterPrivateKey(e.target.value)} placeholder={t('enterPrivateKey')} required />
                    </FromGroup>
                  </>
                )}

                {/* Hyperliquid 交易所的字段 */}
                {selectedExchange.id === 'hyperliquid' && (
                  <>
                    {/* 安全提示 banner */}
                    <Tips>
                      <span style={{ color: '#F0B90B', fontSize: '16px' }}>🔐</span>
                      <div>
                        <h2>{t('hyperliquidAgentWalletTitle')}</h2>
                        <p>{t('hyperliquidAgentWalletDesc')}</p>
                      </div>
                    </Tips>

                    {/* Agent Private Key 字段 */}
                    <FromGroup>
                      <Lable>{t('hyperliquidAgentPrivateKey')}</Lable>
                      <FromCustomGroup>
                        <InputGroup>
                          <Input type="text" value={maskSecret(apiKey)} readOnly placeholder={t('enterHyperliquidAgentPrivateKey')} />
                          <GroupButton type="button" onClick={() => setSecureInputTarget('hyperliquid')}>
                            {apiKey ? t('secureInputReenter') : t('secureInputButton')}
                          </GroupButton>
                          {apiKey && (
                            <GroupButton $clear={true} type="button" onClick={() => setApiKey('')}>
                              {t('secureInputClear')}
                            </GroupButton>
                          )}
                        </InputGroup>
                        {apiKey && <FormDescription>{t('secureInputHint')}</FormDescription>}
                      </FromCustomGroup>
                      <FormDescription>{t('hyperliquidAgentPrivateKeyDesc')}</FormDescription>
                    </FromGroup>

                    {/* Main Wallet Address 字段 */}
                    <FromGroup>
                      <Lable>{t('hyperliquidMainWalletAddress')}</Lable>
                      <Input
                        type="text"
                        value={hyperliquidWalletAddr}
                        onChange={(e) => setHyperliquidWalletAddr(e.target.value)}
                        placeholder={t('enterHyperliquidMainWalletAddress')}
                        required
                      />
                      <FormDescription>{t('hyperliquidMainWalletAddressDesc')}</FormDescription>
                    </FromGroup>
                  </>
                )}

                {/* LIGHTER 特定配置 */}
                {selectedExchange?.id === 'lighter' && (
                  <>
                    {/* L1 Wallet Address */}
                    <FromGroup>
                      <Lable>{t('lighterWalletAddress')}</Lable>
                      <Input type="text" value={lighterWalletAddr} onChange={(e) => setLighterWalletAddr(e.target.value)} placeholder={t('enterLighterWalletAddress')} required />
                      <FormDescription>{t('lighterWalletAddressDesc')}</FormDescription>
                    </FromGroup>

                    {/* L1 Private Key */}
                    <FromGroup>
                      <Lable>
                        {t('lighterPrivateKey')}
                        <button type="button" onClick={() => setSecureInputTarget('lighter')} className="ml-2 text-xs underline" style={{ color: '#F0B90B' }}>
                          {t('secureInputButton')}
                        </button>
                      </Lable>
                      <Input type="password" value={lighterPrivateKey} onChange={(e) => setLighterPrivateKey(e.target.value)} placeholder={t('enterLighterPrivateKey')} required />
                      <FormDescription>{t('lighterPrivateKeyDesc')}</FormDescription>
                    </FromGroup>

                    {/* API Key Private Key */}
                    <FromGroup>
                      <Lable>{t('lighterApiKeyPrivateKey')} ⭐</Lable>
                      <Input
                        type="password"
                        value={lighterApiKeyPrivateKey}
                        onChange={(e) => setLighterApiKeyPrivateKey(e.target.value)}
                        placeholder={t('enterLighterApiKeyPrivateKey')}
                      />
                      <FormDescription>{t('lighterApiKeyPrivateKeyDesc')}</FormDescription>
                      <Tips>💡 {t('lighterApiKeyOptionalNote')}</Tips>
                    </FromGroup>

                    {/* V1/V2 Status Display */}
                    <LighterBox $isV2={!!lighterApiKeyPrivateKey}>
                      <LighterHeader>
                        <LighterTitle $isV2={!!lighterApiKeyPrivateKey}>{lighterApiKeyPrivateKey ? '✅ LIGHTER V2' : '⚠️ LIGHTER V1'}</LighterTitle>
                      </LighterHeader>
                      <LighterDescription>{lighterApiKeyPrivateKey ? t('lighterV2Description') : t('lighterV1Description')}</LighterDescription>
                    </LighterBox>
                  </>
                )}
              </>
            )}
          </ScrollArea>

          <Footer>
            <CancelButton type="button" onClick={onClose}>
              {t('cancel')}
            </CancelButton>
            <SaveButton type="submit" disabled={isInvalid}>
              {t('saveConfig')}
            </SaveButton>
          </Footer>
        </Form>
      </ModalWrapper>

      {/* Binance Setup Guide Modal */}
      {showGuide && <GuideOverlay onClose={() => setShowGuide(false)} />}

      {/* Two Stage Key Modal */}
      <TwoStageKeyModal
        isOpen={secureInputTarget !== null}
        contextLabel={secureInputContextLabel}
        expectedLength={64}
        onCancel={handleSecureInputCancel}
        onComplete={handleSecureInputComplete}
      />
    </Backdrop>
  )
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
  overflow-y: auto;
`

const ModalWrapper = styled.div`
  width: 100%;
  max-width: 36rem;
  position: relative;
  margin: 2rem 0;
  max-height: calc(100vh - 4rem);
  background: #ffffff;
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 24px;
  border: 1px solid #000000;
`

const Form = styled.form`
  padding-bottom: 24px;
`

const ScrollArea = styled.div<{ $id: string; $selectOpen: boolean }>`
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: ${({ $id, $selectOpen }) => ($id !== 'aster' || $selectOpen ? 'auto' : 'visible')};
  max-height: calc(100vh - 20rem);
  padding: 0 24px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 20px 24px;
  position: sticky;
  top: 0;
  z-index: 10;
`

const Title = styled.h3`
  padding: 4px 12px;
  font-size: 1.25rem;
  font-weight: bold;
  border-radius: 8px;
  background: var(--brand-green);
`

// 查看指南按钮（仅在 binance 时出现）
const GuideButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: bold;
  color: #fff;
  border-radius: 8px;
  background: #000;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`

// 删除按钮
const DeleteButton = styled.button`
  padding: 8px;
  border-radius: 6px;
  background: rgba(246, 70, 93, 0.1);
  color: #f6465d;
  transition: background 0.2s;

  &:hover {
    background: rgba(246, 70, 93, 0.2);
  }
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const FromGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const FromCustomGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const FormDescription = styled.span`
  font-size: 12px;
  color: #848e9c;
`

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input {
    flex: 1;
  }
`

const GroupButton = styled.button<{ $clear?: boolean }>`
  height: 100%;
  padding: 13px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #fff;
  background-color: ${({ $clear }) => ($clear ? '#F6465D' : '#000')};
`

const Lable = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: bold;
`

const Input = styled.input`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  border: 1px solid #a3a3a7;

  &::placeholder {
    color: #848e9c;
  }

  &:focus {
    outline: 1px solid var(--brand-green);
  }
`

const ExchangeCard = styled.div`
  padding: 12px 24px;
  border-radius: 8px;
  background: #f3f3f3;
`

const ExchangeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ExchangeIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
`

const ExchangeName = styled.div`
  font-weight: bold;
`

const ExchangeSubText = styled.div`
  font-size: 12px;
`

const GuideWrapper = styled.div`
  margin-bottom: 16px;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  background: #f3f3f3;
`

const GuideHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const GuideHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const GuideTitle = styled.span`
  font-size: 14px;
  strong {
    font-weight: 700;
  }
`

const ArrowIcon = styled.img`
  width: 12px;
  height: 12px;
`

const GuideContent = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #000;
  font-size: 14px;
`

const GuideParagraph = styled.p`
  margin-bottom: 8px;

  strong {
    font-weight: 700;
  }
`

const GuideStepTitle = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
`

const GuideSteps = styled.ol`
  list-style: decimal;
  padding-left: 16px;
  margin-bottom: 12px;

  li {
    margin-bottom: 4px;
  }
`

const WarningBox = styled.p`
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 6px;
  background: #f0b90b;
`

const GuideLink = styled.a`
  display: inline-block;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`

const WhitelistIPBox = styled.div`
  padding: 24px;
  background: #f3f3f3;
  border-radius: 16px;

  h2 {
    font-size: 16px;
    font-weight: bold;
  }

  span {
    font-size: 14px;
  }
`

const IpInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 14px;

  code {
    color: #f0b90b;
  }

  button {
    padding: 4px 8px;
    border-radius: 8px;
    border: 1px solid #000;
  }
`

const Tips = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 24px;
  background: #f3f3f3;
  border-radius: 8px;

  h2 {
    font-size: 16px;
    font-weight: bold;
  }
  span {
    color: #000;
  }
  p {
    font-size: 14px;
  }
`

const LighterBox = styled.div<{ $isV2: boolean }>`
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
  background: ${(p) => (p.$isV2 ? '#0F3F2E' : '#3F2E0F')};
  border: 1px solid ${(p) => (p.$isV2 ? '#10B981' : '#F59E0B')};
`

const LighterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const LighterTitle = styled.div<{ $isV2: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(p) => (p.$isV2 ? '#10B981' : '#F59E0B')};
`

const LighterDescription = styled.div`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: #848e9c;
`

const Footer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding: 24px 24px 0;
  position: sticky;
  bottom: 0;
`

const CancelButton = styled.button`
  flex: 1;
  padding: 16px 24px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: bold;
  border: 1px solid #191a23;
`

const SaveButton = styled(CancelButton)`
  flex: 1;
  color: #fff;
  background: #000;

  &:disabled {
    opacity: 0.5;
  }
`
