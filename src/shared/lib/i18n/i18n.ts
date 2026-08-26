import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { STORAGE_KEYS } from '@/shared/config/storage'

import esCommon from './locales/es/common.json'
import esNav from './locales/es/nav.json'
import esAuth from './locales/es/auth.json'
import esAppSelector from './locales/es/appSelector.json'
import esOperations from './locales/es/operations.json'
import esChat from './locales/es/chat.json'
import esDocuments from './locales/es/documents.json'
import esSummary from './locales/es/summary.json'
import esFinancialModel from './locales/es/financialModel.json'
import esReports from './locales/es/reports.json'
import esAnalytics from './locales/es/analytics.json'
import esAgentConfig from './locales/es/agentConfig.json'

import enCommon from './locales/en/common.json'
import enNav from './locales/en/nav.json'
import enAuth from './locales/en/auth.json'
import enAppSelector from './locales/en/appSelector.json'
import enOperations from './locales/en/operations.json'
import enChat from './locales/en/chat.json'
import enDocuments from './locales/en/documents.json'
import enSummary from './locales/en/summary.json'
import enFinancialModel from './locales/en/financialModel.json'
import enReports from './locales/en/reports.json'
import enAnalytics from './locales/en/analytics.json'
import enAgentConfig from './locales/en/agentConfig.json'

// Anadir un namespace: el import de sus dos JSON y su entrada en `es` y `en`.
// La lista `ns` de i18next se deriva de aqui, no se repite.
const resources = {
  es: {
    common: esCommon,
    nav: esNav,
    auth: esAuth,
    appSelector: esAppSelector,
    operations: esOperations,
    chat: esChat,
    documents: esDocuments,
    summary: esSummary,
    financialModel: esFinancialModel,
    reports: esReports,
    analytics: esAnalytics,
    agentConfig: esAgentConfig,
  },
  en: {
    common: enCommon,
    nav: enNav,
    auth: enAuth,
    appSelector: enAppSelector,
    operations: enOperations,
    chat: enChat,
    documents: enDocuments,
    summary: enSummary,
    financialModel: enFinancialModel,
    reports: enReports,
    analytics: enAnalytics,
    agentConfig: enAgentConfig,
  },
} as const

const stored =
  (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEYS.locale)) || null

// Ingles por defecto: es requisito explicito de la RFP de Saeta que la
// interfaz se demuestre en ingles. El español sigue disponible via LangToggle.
void i18n.use(initReactI18next).init({
  resources,
  lng: stored ?? 'en',
  fallbackLng: 'en',
  ns: Object.keys(resources.en),
  defaultNS: 'common',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEYS.locale, lng)
  document.documentElement.lang = lng
})

document.documentElement.lang = i18n.language

export default i18n
