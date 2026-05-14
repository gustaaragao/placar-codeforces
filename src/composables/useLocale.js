import { ref, computed } from 'vue'
import pt from '@/i18n/pt'
import en from '@/i18n/en'
import es from '@/i18n/es'

const STORAGE_KEY = 'mfp_locale'
const SUPPORTED = ['pt', 'en', 'es']

const dictionaries = { pt, en, es }

// Singleton reativo: estado compartilhado entre todos que usam o composable
const locale = ref('pt')

// Inicializa uma vez com o valor do localStorage (client-side only)
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && SUPPORTED.includes(stored)) {
    locale.value = stored
  }
}

export function useLocale() {
  const dict = computed(() => dictionaries[locale.value] ?? dictionaries.pt)

  /**
   * Traduz uma chave pontilhada: t('admin.title') => string
   * Suporta funções como valor: t('admin.tries', 3)
   */
  function t(key, ...args) {
    const parts = key.split('.')
    let value = dict.value
    for (const part of parts) {
      value = value?.[part]
      if (value === undefined) break
    }
    if (typeof value === 'function') return value(...args)
    return value ?? key
  }

  function setLocale(lang) {
    if (!SUPPORTED.includes(lang)) return
    locale.value = lang
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang)
    }
  }

  return { locale, t, setLocale, supported: SUPPORTED }
}
