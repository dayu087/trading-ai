import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Loader2, ShieldAlert, ShieldCheck } from 'lucide-react'
import { diagnoseWebCryptoEnvironment } from '../lib/crypto'

import { useTranslation } from 'react-i18next'

export type WebCryptoCheckStatus = 'idle' | 'checking' | 'secure' | 'insecure' | 'unsupported'

interface WebCryptoEnvironmentCheckProps {
  variant?: 'card' | 'compact'
  onStatusChange?: (status: WebCryptoCheckStatus) => void
}

export function WebCryptoEnvironmentCheck({ variant = 'card', onStatusChange }: WebCryptoEnvironmentCheckProps) {
  const [status, setStatus] = useState<WebCryptoCheckStatus>('idle')
  const [summary, setSummary] = useState<string | null>(null)

  const { t } = useTranslation()

  useEffect(() => {
    onStatusChange?.(status)
  }, [onStatusChange, status])

  const runCheck = useCallback(() => {
    setStatus('checking')
    setSummary(null)

    setTimeout(() => {
      const result = diagnoseWebCryptoEnvironment()
      setSummary(
        t('environmentCheck.summary', {
          origin: result.origin || 'N/A',
          protocol: result.protocol || 'unknown',
        })
      )

      if (!result.isBrowser || !result.hasSubtleCrypto) {
        setStatus('unsupported')
        return
      }

      if (!result.isSecureContext) {
        setStatus('insecure')
        return
      }

      setStatus('secure')
    }, 0)
  }, [t])

  useEffect(() => {
    runCheck()
  }, [runCheck])

  const isCompact = variant === 'compact'
  const containerClass = isCompact ? 'p-3 rounded border border-gray-700 bg-gray-900 space-y-3' : 'p-4 rounded border border-[#2B3139] bg-[#0B0E11] space-y-4'

  const descriptionColor = isCompact ? '#CBD5F5' : '#A1AEC8'
  const showInfo = status !== 'idle'

  const statusRendererMap: Record<WebCryptoCheckStatus, () => ReactNode> = {
    secure: () => (
      <div className="flex items-start gap-2 text-green-400 text-xs">
        <ShieldCheck className="w-4 h-4 flex-shrink-0" />
        <div>
          <div className="font-semibold">{t('environmentCheck.secureTitle')}</div>
          <div>{t('environmentCheck.secureDesc')}</div>
        </div>
      </div>
    ),
    insecure: () => (
      <div className="text-xs" style={{ color: '#F59E0B' }}>
        <div className="flex items-start gap-2 mb-1">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <div className="font-semibold">{t('environmentCheck.insecureTitle')}</div>
        </div>
        <div>{t('environmentCheck.insecureDesc')}</div>
        <div className="mt-2 font-semibold">{t('environmentCheck.tipsTitle')}</div>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>{t('environmentCheck.tipHTTPS')}</li>
          <li>{t('environmentCheck.tipLocalhost')}</li>
          <li>{t('environmentCheck.tipIframe')}</li>
        </ul>
      </div>
    ),
    unsupported: () => (
      <div className="text-xs" style={{ color: '#F87171' }}>
        <div className="flex items-start gap-2 mb-1">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <div className="font-semibold">{t('environmentCheck.unsupportedTitle')}</div>
        </div>
        <div>{t('environmentCheck.unsupportedDesc')}</div>
      </div>
    ),
    checking: () => (
      <div className="flex items-center gap-2 text-xs" style={{ color: '#EAECEF' }}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{t('environmentCheck.checking')}</span>
      </div>
    ),
    idle: () => null,
  }

  const renderStatus = () => statusRendererMap[status]()

  return (
    <div className={containerClass}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {showInfo && (
          <div className="text-xs" style={{ color: descriptionColor }}>
            {summary ?? t('environmentCheck.description')}
          </div>
        )}
      </div>
      {showInfo && <div className="min-h-[1.5rem]">{renderStatus()}</div>}
    </div>
  )
}
