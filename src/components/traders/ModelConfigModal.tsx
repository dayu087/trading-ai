import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { styled, keyframes } from 'styled-components'
import type { AIModel } from '../../types'
import { getModelIcon } from '../ModelIcons'
import { getShortName } from './utils'

import lessIcon from '@/assets/images/dashboard_icon_arrowless.png'
import moreIcon from '@/assets/images/dashboard_icon_arrowmore.png'
import yesIcon from '@/assets/images/home_icon_yesgreen.png'

interface ModelConfigModalProps {
  allModels: AIModel[]
  configuredModels: AIModel[]
  editingModelId: string | null
  onSave: (modelId: string, apiKey: string, baseUrl?: string, modelName?: string) => void
  onDelete: (modelId: string) => void
  onClose: () => void
}

export function ModelConfigModal({ allModels, configuredModels, editingModelId, onSave, onDelete, onClose }: ModelConfigModalProps) {
  const [selectedModelId, setSelectedModelId] = useState(editingModelId || '')
  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [modelName, setModelName] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { t } = useTranslation()

  // 获取当前编辑的模型信息 - 编辑时从已配置的模型中查找,新建时从所有支持的模型中查找
  const selectedModel = editingModelId ? configuredModels?.find((m) => m.id === selectedModelId) : allModels?.find((m) => m.id === selectedModelId)

  // 如果是编辑现有模型,初始化API Key、Base URL和Model Name
  useEffect(() => {
    if (editingModelId && selectedModel) {
      setApiKey(selectedModel.apiKey || '')
      setBaseUrl(selectedModel.customApiUrl || '')
      setModelName(selectedModel.customModelName || '')
    }
  }, [editingModelId, selectedModel])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedModelId || !apiKey.trim()) return

    onSave(selectedModelId, apiKey.trim(), baseUrl.trim() || undefined, modelName.trim() || undefined)
  }

  // 可选择的模型列表(所有支持的模型)
  const availableModels = allModels || []

  console.log(availableModels, 'availableModels')

  return (
    <Backdrop>
      <ModalWrapper>
        <ModalHeader>
          <ModalTitle>{editingModelId ? t('editAIModel') : t('addAIModel')}</ModalTitle>
          {editingModelId && (
            <DeleteButton type="button" onClick={() => onDelete(editingModelId)} title={t('delete')}>
              <Trash2 className="w-4 h-4" />
            </DeleteButton>
          )}
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <ScrollArea>
            {!editingModelId && (
              <div>
                <Label>{t('selectModel')}</Label>
                <Dropdown>
                  <DropdownHeader onClick={() => setDropdownOpen(!dropdownOpen)} $open={dropdownOpen}>
                    {selectedModelId ? selectedModelId : t('pleaseSelectModel')}
                    <DropdownIcon src={dropdownOpen ? lessIcon : moreIcon} />
                  </DropdownHeader>
                  {dropdownOpen && (
                    <DropdownContent>
                      <Option
                        $active={!selectedModelId}
                        onClick={() => {
                          setSelectedModelId('')
                          setDropdownOpen(false)
                        }}
                      >
                        {t('pleaseSelectModel')}
                      </Option>
                      {availableModels.map((model: any) => (
                        <Option
                          key={model.id}
                          $active={model.id === selectedModelId}
                          onClick={() => {
                            setSelectedModelId(model.id)
                            setDropdownOpen(false)
                          }}
                        >
                          {getShortName(model.name)} ({model.provider}){model.id === selectedModelId && <img src={yesIcon} alt="" />}
                        </Option>
                      ))}
                    </DropdownContent>
                  )}
                </Dropdown>
              </div>
            )}

            {selectedModel && (
              <ModelCard>
                <ModelInfoRow>
                  <ModelIconWrapper>
                    {getModelIcon(selectedModel.provider || selectedModel.id, {
                      width: 32,
                      height: 32,
                    }) || <ModelFallbackIcon isDeepseek={selectedModel.id === 'deepseek'}>{selectedModel.name[0]}</ModelFallbackIcon>}
                  </ModelIconWrapper>

                  <div>
                    <ModelName>{getShortName(selectedModel.name)}</ModelName>
                    <ModelMeta>
                      {selectedModel.provider} • {selectedModel.id}
                    </ModelMeta>
                  </div>
                </ModelInfoRow>
              </ModelCard>
            )}

            {selectedModel && (
              <>
                <div>
                  <Label>API Key</Label>
                  <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={t('enterAPIKey')} required />
                </div>

                <div>
                  <Label>{t('customBaseURL')}</Label>
                  <Input type="url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder={t('customBaseURLPlaceholder')} />
                  <InfoText>{t('leaveBlankForDefault')}</InfoText>
                </div>

                <div>
                  <Label> Model Name (可选)</Label>
                  <Input type="text" value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="例如: deepseek-chat, qwen3-max, gpt-5" />
                  <InfoText>留空使用默认模型名称</InfoText>
                </div>

                <InfoBox>
                  <InfoTitle>{t('information')}</InfoTitle>
                  <InfoText>{t('modelConfigInfo1')}</InfoText>
                  <InfoText>{t('modelConfigInfo2')}</InfoText>
                  <InfoText>{t('modelConfigInfo3')}</InfoText>
                </InfoBox>
              </>
            )}
          </ScrollArea>

          <Footer>
            <CancelButton type="button" onClick={onClose}>
              {t('cancel')}
            </CancelButton>

            <SaveButton type="submit" disabled={!selectedModel || !apiKey.trim()}>
              {t('saveConfig')}
            </SaveButton>
          </Footer>
        </Form>
      </ModalWrapper>
    </Backdrop>
  )
}

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`

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
  max-width: 800px;
  position: relative;
  margin: 2rem 0;
  max-height: calc(100vh - 4rem);
  background: #ffffff;
  box-shadow: 4px 4px 0px 0px #191a23;
  border-radius: 24px;
  border: 1px solid #000000;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px 24px;
  position: sticky;
  top: 0;
  z-index: 10;
`

const ModalTitle = styled.h3`
  padding: 4px 12px;
  font-size: 20px;
  font-weight: bold;
  border-radius: 8px;
  background: var(--brand-green);
`

const DeleteButton = styled.button`
  padding: 8px;
  border-radius: 6px;
  transition: 0.2s;
  background: rgba(246, 70, 93, 0.1);
  color: #f6465d;

  &:hover {
    background: rgba(246, 70, 93, 0.2);
  }
`

const Form = styled.form`
  padding-bottom: 24px;
`

const ScrollArea = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 20rem);
  padding: 0 24px;
`

const Label = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 8px;
`

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  background: #0b0e11;
  border: 1px solid #2b3139;
  color: #eaecef;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 24px;
  border-radius: 9px;
  font-size: 14px;
  background: #fff;
  border: 1px solid #191a23;
`

const ModelCard = styled.div`
  padding: 16px;
  border-radius: 8px;
  background: #f3f3f3;
`

const ModelInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ModelIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModelFallbackIcon = styled.div<{ isDeepseek: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background: ${({ isDeepseek }) => (isDeepseek ? '#60a5fa' : '#c084fc')};
`

const ModelName = styled.div`
  font-weight: 600;
`

const ModelMeta = styled.div`
  font-size: 0.75rem;
  color: #848e9c;
`

const InfoBox = styled.div`
  padding: 16px;
  border-radius: 16px;
  background: #f3f3f3;
`

const InfoTitle = styled.div`
  font-size: 0.875rem;
  font-weight: bold;
  margin-bottom: 8px;
`

const InfoText = styled.div`
  font-size: 0.75rem;
  margin-top: 8px;
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

const DropdownHeader = styled.div<{ $open: boolean }>`
  display: ${(p) => (p.$open ? 'none' : 'flex')};
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  color: #1a1a1a;
`

const DropdownIcon = styled.img`
  width: 16px;
  height: 16px;
`

const Dropdown = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #191a23;
`

const DropdownContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  animation: ${slideDown} 0.25s ease forwards;
`

const Option = styled.div<{ $active?: boolean }>`
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease-in-out;

  background: ${(p) => (p.$active ? '#f3f3f3' : 'transparent')};

  &:hover {
    background: #f3f3f3;
  }

  img {
    width: 12px;
    height: 12px;
  }
`
