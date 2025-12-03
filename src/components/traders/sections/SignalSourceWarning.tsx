import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SignalSourceWarningProps {
  onConfigure: () => void
}

export function SignalSourceWarning({ onConfigure }: SignalSourceWarningProps) {
  const { t } = useTranslation()
  return (
    <div
      className="rounded-lg px-4 py-3 flex items-start gap-3 animate-slide-in mb-8"
      style={{
        background: 'rgba(246, 70, 93, 0.1)',
        border: '1px solid rgba(246, 70, 93, 0.3)',
      }}
    >
      <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" style={{ color: '#F6465D' }} />
      <div className="flex-1">
        <div className="font-semibold mb-1" style={{ color: '#F6465D' }}>
          ⚠️ {t('signalSourceNotConfigured')}
        </div>
        <div className="text-sm" style={{ color: '#848E9C' }}>
          <p className="mb-2">{t('signalSourceWarningMessage')}</p>
          <p>
            <strong>{t('solutions')}</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
            <li>点击"{t('signalSource')}"按钮配置API地址</li>
            <li>或在交易员配置中禁用"使用币种池"和"使用OI Top"</li>
            <li>或在交易员配置中设置自定义币种列表</li>
          </ul>
        </div>
        <button
          onClick={onConfigure}
          className="mt-3 px-3 py-1.5 rounded text-sm font-semibold transition-all hover:scale-105"
          style={{
            background: '#F0B90B',
            color: '#000',
          }}
        >
          {t('configureSignalSourceNow')}
        </button>
      </div>
    </div>
  )
}
