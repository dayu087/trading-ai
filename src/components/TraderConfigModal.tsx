import { useState, useEffect, useMemo } from 'react'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'
import type { AIModel, Exchange, CreateTraderRequest } from '../types'
import { traderModalDescTitleMap, traderModalDescMap, traderModalTemplateNameMap } from '@/lib/map'
import { Tooltip } from './traders/Tooltip'
import Checkbox from '@/components/ui/Checkbox'
import SelectBox from '@/components/ui/Select'
import Input from '@/components/ui/InputBox'

import botIcon from '@/assets/images/config_logo_bot.png'
import frameIcon from '@/assets/images/Frame.png'

// 提取下划线后面的名称部分
function getShortName(fullName: string): string {
  const parts = fullName.split('_')
  return parts.length > 1 ? parts[parts.length - 1] : fullName
}

interface TraderConfigData {
  trader_id?: string
  trader_name: string
  ai_model: string
  exchange_id: string
  btc_eth_leverage: number
  altcoin_leverage: number
  trading_symbols: string
  custom_prompt: string
  override_base_prompt: boolean
  system_prompt_template: string
  is_cross_margin: boolean
  use_coin_pool: boolean
  use_oi_top: boolean
  initial_balance: number
  scan_interval_minutes: number
}

interface TraderConfigModalProps {
  isOpen: boolean
  onClose: () => void
  traderData?: TraderConfigData | null
  isEditMode?: boolean
  availableModels?: AIModel[]
  availableExchanges?: Exchange[]
  onSave?: (data: CreateTraderRequest) => Promise<void>
}

export function TraderConfigModal({ isOpen, onClose, traderData, isEditMode = false, availableModels = [], availableExchanges = [], onSave }: TraderConfigModalProps) {
  const [formData, setFormData] = useState<TraderConfigData>({
    trader_name: '',
    ai_model: '',
    exchange_id: '',
    btc_eth_leverage: 5,
    altcoin_leverage: 3,
    trading_symbols: '',
    custom_prompt: '',
    override_base_prompt: false,
    system_prompt_template: 'default',
    is_cross_margin: true,
    use_coin_pool: false,
    use_oi_top: false,
    initial_balance: 1000,
    scan_interval_minutes: 3,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [availableCoins, setAvailableCoins] = useState<string[]>([])
  const [selectedCoins, setSelectedCoins] = useState<string[]>([])
  const [showCoinSelector, setShowCoinSelector] = useState(false)
  const [promptTemplates, setPromptTemplates] = useState<{ name: string }[]>([])
  const [isFetchingBalance, setIsFetchingBalance] = useState(false)
  const [balanceFetchError, setBalanceFetchError] = useState<string>('')

  const { t } = useTranslation()

  useEffect(() => {
    if (traderData) {
      setFormData(traderData)
      // 设置已选择的币种
      if (traderData.trading_symbols) {
        const coins = traderData.trading_symbols
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s)
        setSelectedCoins(coins)
      }
    } else if (!isEditMode) {
      setFormData({
        trader_name: '',
        ai_model: availableModels[0]?.id || '',
        exchange_id: availableExchanges[0]?.id || '',
        btc_eth_leverage: 5,
        altcoin_leverage: 3,
        trading_symbols: '',
        custom_prompt: '',
        override_base_prompt: false,
        system_prompt_template: 'default',
        is_cross_margin: true,
        use_coin_pool: false,
        use_oi_top: false,
        initial_balance: 1000,
        scan_interval_minutes: 3,
      })
    }
    // 确保旧数据也有默认的 system_prompt_template
    if (traderData && traderData.system_prompt_template === undefined) {
      setFormData((prev) => ({
        ...prev,
        system_prompt_template: 'default',
      }))
    }
  }, [traderData, isEditMode, availableModels, availableExchanges])

  // 获取系统配置中的币种列表
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/config`)
        const config = await response.json()
        if (config.default_coins) {
          setAvailableCoins(config.default_coins)
        }
      } catch (error) {
        console.error('Failed to fetch config:', error)
        // 使用默认币种列表
        setAvailableCoins(['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT'])
      }
    }
    fetchConfig()
  }, [])

  // 获取系统提示词模板列表
  useEffect(() => {
    const fetchPromptTemplates = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/prompt-templates`)
        const data = await response.json()
        if (data.templates) {
          setPromptTemplates(data.templates)
        }
      } catch (error) {
        console.error('Failed to fetch prompt templates:', error)
        // 使用默认模板列表
        setPromptTemplates([{ name: 'default' }, { name: 'aggressive' }])
      }
    }
    fetchPromptTemplates()
  }, [])

  const descTitle = useMemo(() => {
    const keyname = formData.system_prompt_template
    return traderModalDescTitleMap[keyname] ? t(traderModalDescTitleMap[keyname]) : t('promptDescDefault')
  }, [formData.system_prompt_template])

  const desc = useMemo(() => {
    const keyname = formData.system_prompt_template
    return traderModalDescMap[keyname] ? t(traderModalDescMap[keyname]) : t('promptDescDefaultContent')
  }, [formData.system_prompt_template])

  if (!isOpen) return null

  const handleInputChange = (field: keyof TraderConfigData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // 如果是直接编辑trading_symbols，同步更新selectedCoins
    if (field === 'trading_symbols') {
      const coins = value
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s)
      setSelectedCoins(coins)
    }
  }

  const handleCoinToggle = (coin: string) => {
    setSelectedCoins((prev) => {
      const newCoins = prev.includes(coin) ? prev.filter((c) => c !== coin) : [...prev, coin]

      // 同时更新 formData.trading_symbols
      const symbolsString = newCoins.join(',')
      setFormData((current) => ({ ...current, trading_symbols: symbolsString }))

      return newCoins
    })
  }

  const handleFetchCurrentBalance = async () => {
    if (!isEditMode || !traderData?.trader_id) {
      setBalanceFetchError('只有在编辑模式下才能获取当前余额')
      return
    }

    setIsFetchingBalance(true)
    setBalanceFetchError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/account?trader_id=${traderData.trader_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('获取账户余额失败')
      }

      const data = await response.json()

      // total_equity = 当前账户净值（包含未实现盈亏）
      // 这应该作为新的初始余额
      const currentBalance = data.total_equity || data.balance || 0

      setFormData((prev) => ({ ...prev, initial_balance: currentBalance }))

      // 显示成功提示
      console.log('已获取当前余额:', currentBalance)
    } catch (error) {
      console.error('获取余额失败:', error)
      setBalanceFetchError('获取余额失败，请检查网络连接')
    } finally {
      setIsFetchingBalance(false)
    }
  }

  const handleSave = async () => {
    if (!onSave) return

    setIsSaving(true)
    try {
      const saveData: CreateTraderRequest = {
        name: formData.trader_name,
        ai_model_id: formData.ai_model,
        exchange_id: formData.exchange_id,
        btc_eth_leverage: formData.btc_eth_leverage,
        altcoin_leverage: formData.altcoin_leverage,
        trading_symbols: formData.trading_symbols,
        custom_prompt: formData.custom_prompt,
        override_base_prompt: formData.override_base_prompt,
        system_prompt_template: formData.system_prompt_template,
        is_cross_margin: formData.is_cross_margin,
        use_coin_pool: formData.use_coin_pool,
        use_oi_top: formData.use_oi_top,
        initial_balance: formData.initial_balance,
        scan_interval_minutes: formData.scan_interval_minutes,
      }
      await onSave(saveData)
      onClose()
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getTemplateName = (name: string) => {
    return traderModalTemplateNameMap[name] ? t(traderModalTemplateNameMap[name]) : name.charAt(0).toUpperCase() + name.slice(1)
  }

  return (
    <ModalOverlay>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <HeaderWrapper>
          <LeftSection>
            <IconBox>
              <img src={botIcon} alt="" />
            </IconBox>
            <TitleBox>
              <Title>{isEditMode ? t('editTrader') : t('createTrader')}</Title>
              <Subtitle>{isEditMode ? t('modifyTheTraderConfigurationParameters') : t('configureNewAITrader')}</Subtitle>
            </TitleBox>
          </LeftSection>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </HeaderWrapper>

        {/* Content */}
        <ContentWrapper>
          {/* Basic Info */}
          <SectionCard>
            <SectionTitle>{t('basicConfiguration')}</SectionTitle>

            <FieldGroup>
              <FieldColumn>
                <Label>{t('traderName')}</Label>
                <Input type="text" value={formData.trader_name} onChange={(e) => handleInputChange('trader_name', e.target.value)} placeholder={t('enterTraderName')} />
              </FieldColumn>

              <Row2>
                <FieldColumn>
                  <Label>{t('AIModel')}</Label>
                  <SelectBox
                    value={formData.ai_model}
                    keyname="id"
                    onChange={(value) => handleInputChange('ai_model', value)}
                    options={availableModels}
                    renderValue={(value) => <span> {getShortName(value).toUpperCase()}</span>}
                    renderOption={(item: any) => <span> {getShortName(item.name || item.id).toUpperCase()}</span>}
                  />
                </FieldColumn>

                <FieldColumn>
                  <Label>{t('Exchange')}</Label>
                  <SelectBox
                    value={formData.exchange_id}
                    keyname="id"
                    onChange={(value) => handleInputChange('exchange_id', value)}
                    options={availableExchanges}
                    renderValue={(value) => <span> {getShortName(value).toUpperCase()}</span>}
                    renderOption={(item: any) => <span> {getShortName(item.name || item.id).toUpperCase()}</span>}
                  />
                </FieldColumn>
              </Row2>
            </FieldGroup>
          </SectionCard>

          {/* Trading Configuration */}
          <SectionCard>
            <SectionTitle>{t('tradingConfiguration')}</SectionTitle>
            <div className="space-y-4">
              {/* 保证金模式 + 初始余额 */}
              <Row2>
                {/* 保证金模式 */}
                <FieldColumn>
                  <Label>{t('marginMode')}</Label>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <ToggleButton type="button" $active={formData.is_cross_margin === true} onClick={() => handleInputChange('is_cross_margin', true)}>
                      {t('crossMargin')}
                    </ToggleButton>
                    <ToggleButton type="button" $active={formData.is_cross_margin === false} onClick={() => handleInputChange('is_cross_margin', false)}>
                      {t('isolatedMargin')}
                    </ToggleButton>
                  </div>
                </FieldColumn>
                {/* 初始余额 */}
                <FieldColumn>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Label>
                      {t('initialBalance')} ($)
                      <span style={{ marginLeft: 4, cursor: 'pointer' }}>
                        {!isEditMode && <Tooltip content="⚠️ 请输入您交易所账户的实际余额，否则 P&L 统计会错误。">*</Tooltip>}
                        {isEditMode && <Tooltip content="点击“获取当前余额”可自动获取交易所账户净值">*</Tooltip>}
                      </span>
                    </Label>
                    {isEditMode && (
                      <YellowButton type="button" onClick={handleFetchCurrentBalance} disabled={isFetchingBalance}>
                        {isFetchingBalance ? '获取中...' : '获取当前余额'}
                      </YellowButton>
                    )}
                  </div>
                  <Input
                    type="number"
                    value={formData.initial_balance}
                    onChange={(e) => handleInputChange('initial_balance', Number(e.target.value))}
                    onBlur={(e) => {
                      const value = Number(e.target.value)
                      if (value < 100) handleInputChange('initial_balance', 100)
                    }}
                    min="100"
                    step="0.01"
                  />
                  {balanceFetchError && <HelperText color="red">{balanceFetchError}</HelperText>}
                </FieldColumn>
              </Row2>

              {/* AI 扫描间隔 */}
              <Row2>
                <FieldColumn>
                  <Label>{t('aiScanInterval')}</Label>
                  <Input
                    type="number"
                    value={formData.scan_interval_minutes}
                    onChange={(e) => {
                      const parsed = Number(e.target.value)
                      handleInputChange('scan_interval_minutes', Number.isFinite(parsed) ? Math.max(3, parsed) : 3)
                    }}
                    min="3"
                    max="60"
                  />
                  <HelperText>{t('scanIntervalRecommend')}</HelperText>
                </FieldColumn>
                <div></div>
              </Row2>

              {/* 杠杆设置 */}
              <Row2>
                <FieldColumn>
                  <Label>BTC/ETH {t('leverage')}</Label>
                  <Input type="number" value={formData.btc_eth_leverage} onChange={(e) => handleInputChange('btc_eth_leverage', Number(e.target.value))} min="1" max="125" />
                </FieldColumn>

                <FieldColumn>
                  <Label>
                    {t('Altcoins')}
                    {t('leverage')}
                  </Label>
                  <Input type="number" value={formData.altcoin_leverage} onChange={(e) => handleInputChange('altcoin_leverage', Number(e.target.value))} min="1" max="75" />
                </FieldColumn>
              </Row2>

              {/* 交易币种 */}
              <FieldColumn>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Label>
                    {t('tradingPairs')} {t('tradingPairsDesc')}{' '}
                  </Label>
                  <YellowButton type="button" onClick={() => setShowCoinSelector(!showCoinSelector)}>
                    {showCoinSelector ? t('lessSelect') : t('moreSelect')}
                  </YellowButton>
                </div>
                <Input
                  type="text"
                  value={formData.trading_symbols}
                  onChange={(e) => handleInputChange('trading_symbols', e.target.value)}
                  placeholder="例如: BTCUSDT,ETHUSDT,ADAUSDT"
                />
                {showCoinSelector && (
                  <CoinSelectorBox>
                    <span>{t('selectTheCurrency')}：</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {availableCoins.map((coin) => (
                        <CoinButton key={coin} type="button" $active={selectedCoins.includes(coin)} onClick={() => handleCoinToggle(coin)}>
                          {coin.replace('USDT', '')}
                        </CoinButton>
                      ))}
                    </div>
                  </CoinSelectorBox>
                )}
              </FieldColumn>
            </div>
          </SectionCard>

          {/* Signal Sources */}
          <SectionCard>
            <SectionTitle>{t('signalSourceConfiguration')}</SectionTitle>
            <Grid>
              <CheckboxRow>
                <Checkbox label={t('useCoinPoolSignals')} checked={formData.use_coin_pool} onChange={(v: any) => handleInputChange('use_coin_pool', v)} />
              </CheckboxRow>
              <CheckboxRow>
                <Checkbox label={t('useOITopSignals')} checked={formData.use_oi_top} onChange={(v: any) => handleInputChange('use_oi_top', v)} />
              </CheckboxRow>
            </Grid>
          </SectionCard>

          {/* Trading Prompt */}
          <SectionCard>
            <SectionTitle>{t('strategyProm')}</SectionTitle>
            <FieldGroup>
              {/* 系统提示词模板选择 */}
              <FieldColumn>
                <Label>{t('systemPromptTemplate')}</Label>
                <SelectBox
                  value={formData.system_prompt_template}
                  keyname="name"
                  onChange={(value) => handleInputChange('system_prompt_template', value)}
                  options={promptTemplates}
                  renderValue={(value) => <span>{traderModalTemplateNameMap[value] ? t(traderModalTemplateNameMap[value]) : value.charAt(0).toUpperCase() + value.slice(1)}</span>}
                  renderOption={(item: any) => (
                    <span>{traderModalTemplateNameMap[item.name] ? t(traderModalTemplateNameMap[item.name]) : item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
                  )}
                />

                {/* 動態描述區域 */}
                <PromptDescBox>
                  <PromptDescTitle>{descTitle}</PromptDescTitle>
                  <TipText>{desc}</TipText>
                </PromptDescBox>
                <TipText>{t('strategyPromTips')}</TipText>
              </FieldColumn>

              <Grid>
                <CheckboxRow>
                  <Checkbox label={t('overrideDefaultProm')} checked={formData.override_base_prompt} onChange={(v: any) => handleInputChange('override_base_prompt', v)} />
                </CheckboxRow>
                <TipsInfo>
                  <img src={frameIcon} alt="" />
                  <span>{t('overrideDefaultPromDesc')}</span>
                </TipsInfo>
              </Grid>
              <FieldColumn>
                <Label>{formData.override_base_prompt ? t('customProm') : t('addItionalProm')}</Label>
                <Textarea
                  value={formData.custom_prompt}
                  onChange={(e) => handleInputChange('custom_prompt', e.target.value)}
                  placeholder={formData.override_base_prompt ? t('enterTheCompleteTradingStrategyPrompts') : t('enterAdditionalTradingStrategyPrompts')}
                />
              </FieldColumn>
            </FieldGroup>
          </SectionCard>
        </ContentWrapper>

        {/* Footer */}
        <Footer>
          <CancelButton onClick={onClose}>{t('cancel')}</CancelButton>
          {onSave && (
            <SaveButton onClick={handleSave} disabled={isSaving || !formData.trader_name || !formData.ai_model || !formData.exchange_id}>
              {isSaving ? `${t('save')}...` : isEditMode ? t('save') : t('createTrader')}
            </SaveButton>
          )}
        </Footer>
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
`

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 50rem;
  position: relative;
  margin: 2rem 0;
  max-height: calc(100vh - 4rem);
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 24px;
  border: 1px solid #000000;
  background: #fff;

  @media (max-width: 768px) {
    border-radius: 16px;
  }
`

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #191a23;

  @media (max-width: 768px) {
    padding: 12px;
  }
`

const ContentWrapper = styled.div`
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
    gap: 12px;
    padding: 12px;
  }
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  @media (max-width: 768px) {
    gap: 8px;
  }
`

const IconBox = styled.div`
  padding: 10px;
  border-radius: 0.5rem;
  border: 1px solid #000000;

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

const TitleBox = styled.div``

const Title = styled.h2`
  width: fit-content;
  padding: 4px 12px;
  font-size: 20px;
  font-weight: bold;
  border-radius: 8px;
  background: #cafe36;
  @media (max-width: 768px) {
    font-size: 18px;
  }
`

const Subtitle = styled.p`
  font-size: 14px;
  margin-top: 4px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const CloseButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  color: #848e9c;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease;

  &:hover {
    background: #2b3139;
    color: #eaecef;
  }
`

const SectionCard = styled.div`
  border-radius: 16px;
  padding: 1.5rem;
  background: #ffffff;

  @media (max-width: 768px) {
    padding: 12px;
    border-radius: 8px;
  }
`

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
  padding: 4px 12px;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  border-radius: 8px;
  background: #f3f3f3;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 14px;
  }
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FieldColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 4px;
  }
`

const Label = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`

const Textarea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 12px 24px;
  font-size: 14px;
  border-radius: 0.5rem;
  border: 1px solid #a3a3a7;
  background: #fff;
  &:focus {
    outline: 1px solid #cafe36;
  }
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`

const Row2 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const Select = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: #0b0e11;
  border: 1px solid #2b3139;
  border-radius: 0.375rem;
  color: #eaecef;
  font-size: 0.875rem;

  &:focus {
    border-color: #f0b90b;
    outline: none;
  }
`

const YellowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  font-size: 0.75rem;
  background: #cafe36;
  color: #000;
  border-radius: 0.375rem;
  transition: 0.2s ease;

  &:disabled {
    background: #848e9c;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 2px 4px;
    font-size: 10px;
  }
`

/* 保证金模式选项按钮 (动态样式) */
const ToggleButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid #2b3139;
  transition: 0.2s ease;
  color: #000;

  ${({ $active }) =>
    $active
      ? `
    background: #CAFE36;
  `
      : `
    background: #fff;
  `}

  @media (max-width: 768px) {
    padding: 8px 14px;
  }
`

/* 币种选择器外层 */
const CoinSelectorBox = styled.div`
  margin-top: 16px;
  padding: 20px 24px;
  border-radius: 8px;
  border: 1px solid #191a23;

  span {
    display: block;
    font-size: 14px;
    margin-bottom: 8px;
  }
`

/* 币种按钮 */
const CoinButton = styled.button<{ $active: boolean }>`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 0.375rem;
  transition: 0.2s;
  color: #000;
  border: 1px solid transparent;
  cursor: pointer;
  background: ${({ $active }) => ($active ? '#cafe36' : '#f3f3f3')};
  border-color: ${({ $active }) => ($active ? '#000' : 'transparent')};
  &:hover {
    border: 1px solid #000;
  }
`

/* 说明文字 */
const HelperText = styled.p`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: ${({ color }) => color || '#848e9c'};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`

const TipsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  img {
    width: 16px;
    height: 16px;
  }

  span {
    font-size: 14px;
    text-decoration: underline;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    img {
      width: 12px;
      height: 12px;
    }

    span {
      font-size: 12px;
    }
  }
`

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 6px;
  }
`

const PromptDescBox = styled.div`
  margin-top: 8px;
  padding: 12px;
  border-radius: 8px;
  background: #f3f3f3;
`

const PromptDescTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #f0b90b;
`

const TipText = styled.p`
  font-size: 0.75rem;
  color: #848e9c;
  margin-top: 8px;
`

const Footer = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 24px;
  position: sticky;
  bottom: 0;
  @media (max-width: 768px) {
    padding: 12px;
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
    font-size: 12px;
    padding: 8px 12px;
  }
`

const SaveButton = styled(CancelButton)`
  background: #000;
  color: #fff;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
