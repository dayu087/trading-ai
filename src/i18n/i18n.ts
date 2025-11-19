import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './en.json'
import zh from './zh.json'

i18n
  .use(LanguageDetector) // 检测浏览器语言
  .use(initReactI18next) // 连接 React
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh'],
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: 'src/i18n/{{ns}}.json',
    },
  })

export default i18n
