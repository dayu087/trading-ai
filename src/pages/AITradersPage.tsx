import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'
import useSWR from 'swr'
import { api } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import { useTradersConfigStore, useTradersModalStore } from '../stores'
import { useTraderActions } from '@/hooks/useTraderActions'
import { TraderConfigModal } from '../components/TraderConfigModal'
import { SignalSourceModal, ModelConfigModal, ExchangeConfigModal } from '../components/traders'
import { PageHeader } from '@/components/traders/sections/PageHeader'
import { SignalSourceWarning } from '@/components/traders/sections/SignalSourceWarning'
import { AIModelsSection } from '@/components/traders/sections/AIModelsSection'
import { ExchangesSection } from '@/components/traders/sections/ExchangesSection'
import { TradersGrid } from '@/components/traders/sections/TradersGrid'

interface AITradersPageProps {
  onTraderSelect?: (traderId: string) => void
}

export function AITradersPage({ onTraderSelect }: AITradersPageProps) {
  const { user, token } = useAuth()
  const navigate = useNavigate()

  // Zustand stores
  const {
    allModels,
    allExchanges,
    supportedModels,
    supportedExchanges,
    configuredModels,
    configuredExchanges,
    userSignalSource,
    loadConfigs,
    setAllModels,
    setAllExchanges,
    setUserSignalSource,
  } = useTradersConfigStore()

  const {
    showCreateModal,
    showEditModal,
    showModelModal,
    showExchangeModal,
    showSignalSourceModal,
    editingModel,
    editingExchange,
    editingTrader,
    setShowCreateModal,
    setShowEditModal,
    setShowModelModal,
    setShowExchangeModal,
    setShowSignalSourceModal,
    setEditingModel,
    setEditingExchange,
    setEditingTrader,
  } = useTradersModalStore()

  // SWR for traders data
  const { data: traders, mutate: mutateTraders } = useSWR(user && token ? 'traders' : null, api.getTraders, { refreshInterval: 5000 })

  // Load configurations
  useEffect(() => {
    loadConfigs(user, token)
  }, [user, token, loadConfigs])

  // Business logic hook
  const {
    isModelInUse,
    isExchangeInUse,
    handleCreateTrader,
    handleEditTrader,
    handleSaveEditTrader,
    handleDeleteTrader,
    handleToggleTrader,
    handleAddModel,
    handleAddExchange,
    handleModelClick,
    handleExchangeClick,
    handleSaveModel,
    handleDeleteModel,
    handleSaveExchange,
    handleDeleteExchange,
    handleSaveSignalSource,
  } = useTraderActions({
    traders,
    allModels,
    allExchanges,
    supportedModels,
    supportedExchanges,
    mutateTraders,
    setAllModels,
    setAllExchanges,
    setUserSignalSource,
    setShowCreateModal,
    setShowEditModal,
    setShowModelModal,
    setShowExchangeModal,
    setShowSignalSourceModal,
    setEditingModel,
    setEditingExchange,
    editingTrader,
    setEditingTrader,
  })

  // 计算派生状态
  const enabledModels = allModels?.filter((m) => m.enabled) || []
  const enabledExchanges =
    allExchanges?.filter((e) => {
      if (!e.enabled) return false
      if (e.id === 'aster') {
        return e.asterUser?.trim() && e.asterSigner?.trim()
      }
      if (e.id === 'hyperliquid') {
        return e.hyperliquidWalletAddr?.trim()
      }
      return true
    }) || []

  // 检查是否需要显示信号源警告
  const showSignalWarning = traders?.some((t) => t.use_coin_pool || t.use_oi_top) && !userSignalSource.coinPoolUrl && !userSignalSource.oiTopUrl

  // 处理交易员查看
  const handleTraderSelect = (traderId: string) => {
    if (onTraderSelect) {
      onTraderSelect(traderId)
    } else {
      navigate(`/dashboard?trader=${traderId}`)
    }
  }

  console.log(configuredModels, 'configuredModels')

  return (
    <AITradersSection>
      {/* Header */}
      <PageHeader
        tradersCount={traders?.length || 0}
        configuredModelsCount={configuredModels.length}
        configuredExchangesCount={configuredExchanges.length}
        onAddModel={handleAddModel}
        onAddExchange={handleAddExchange}
        onConfigureSignalSource={() => setShowSignalSourceModal(true)}
        onCreateTrader={() => setShowCreateModal(true)}
      />

      {/* Signal Source Warning */}
      {showSignalWarning && <SignalSourceWarning onConfigure={() => setShowSignalSourceModal(true)} />}

      {/* Configuration Status */}
      <ConfigurationSection>
        <AIModelsSection configuredModels={configuredModels} isModelInUse={isModelInUse} onModelClick={handleModelClick} />
        <ExchangesSection configuredExchanges={configuredExchanges} isExchangeInUse={isExchangeInUse} onExchangeClick={handleExchangeClick} />
      </ConfigurationSection>

      {/* Traders Grid */}
      <TradersGrid traders={traders} onTraderSelect={handleTraderSelect} onEditTrader={handleEditTrader} onDeleteTrader={handleDeleteTrader} onToggleTrader={handleToggleTrader} />

      {/* Modals */}
      <TraderConfigModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        isEditMode={false}
        availableModels={enabledModels}
        availableExchanges={enabledExchanges}
        onSave={handleCreateTrader}
      />

      <TraderConfigModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        isEditMode={true}
        traderData={editingTrader}
        availableModels={enabledModels}
        availableExchanges={enabledExchanges}
        onSave={handleSaveEditTrader}
      />

      {showModelModal && (
        <ModelConfigModal
          allModels={supportedModels}
          configuredModels={allModels}
          editingModelId={editingModel}
          onSave={handleSaveModel}
          onDelete={handleDeleteModel}
          onClose={() => setShowModelModal(false)}
        />
      )}

      {showExchangeModal && (
        <ExchangeConfigModal
          allExchanges={supportedExchanges}
          editingExchangeId={editingExchange}
          onSave={handleSaveExchange}
          onDelete={handleDeleteExchange}
          onClose={() => setShowExchangeModal(false)}
        />
      )}

      {showSignalSourceModal && (
        <SignalSourceModal
          coinPoolUrl={userSignalSource.coinPoolUrl}
          oiTopUrl={userSignalSource.oiTopUrl}
          onSave={handleSaveSignalSource}
          onClose={() => setShowSignalSourceModal(false)}
        />
      )}
    </AITradersSection>
  )
}

const AITradersSection = styled.div`
  width: 100%;
  max-width: 1220px;
  animation: fadeIn 0.25s ease;

  @media (max-width: 768px) {
    padding: 0 1rem 1rem;
  }
`

const ConfigurationSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
`
