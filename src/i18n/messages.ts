/**
 * i18n Messages Configuration
 * Dynamic text retrieval based on user language preference
 */

import zhCN from './translations/zh-CN.json'
import enUS from './translations/en-US.json'

export type SupportedLanguage = 'zh-CN' | 'en-US'
export type TranslationKey = string

export const translations: Record<SupportedLanguage, typeof zhCN> = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

export const defaultLanguage: SupportedLanguage = 'zh-CN'
export const supportedLanguages: SupportedLanguage[] = ['zh-CN', 'en-US']

/**
 * Get translation by key path (supports nested keys like 'checkin.mood.1')
 */
export function getTranslation(
  language: SupportedLanguage,
  key: TranslationKey
): string {
  const langTranslations = translations[language] || translations[defaultLanguage]
  
  const keys = key.split('.')
  let value: any = langTranslations
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // Fallback to default language
      const defaultValue = translations[defaultLanguage]
      for (const fallbackKey of keys) {
        if (defaultValue && typeof defaultValue === 'object' && fallbackKey in defaultValue) {
          value = defaultValue[fallbackKey]
        } else {
          return key // Return key if not found in any language
        }
      }
    }
  }
  
  return typeof value === 'string' ? value : key
}

/**
 * Get all translations for a specific language
 */
export function getTranslations(language: SupportedLanguage): typeof zhCN {
  return translations[language] || translations[defaultLanguage]
}

/**
 * Validate if language is supported
 */
export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return supportedLanguages.includes(lang as SupportedLanguage)
}

/**
 * Get user's language from request headers or default
 */
export function getUserLanguage(acceptLanguage?: string | null): SupportedLanguage {
  if (!acceptLanguage) {
    return defaultLanguage
  }
  
  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,zh-CN;q=0.8")
  const preferred = acceptLanguage.split(',')[0].split(';')[0].trim()
  
  if (isSupportedLanguage(preferred)) {
    return preferred
  }
  
  // Try to match language code without region (e.g., "en" from "en-US")
  const langCode = preferred.split('-')[0]
  const matched = supportedLanguages.find(lang => lang.startsWith(langCode))
  
  return matched || defaultLanguage
}

/**
 * Cache helper for translations (optional, for performance)
 */
const translationCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

export function getCachedTranslations(language: SupportedLanguage): typeof zhCN {
  const cacheKey = `translations:${language}`
  const cached = translationCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  
  const data = getTranslations(language)
  translationCache.set(cacheKey, { data, timestamp: Date.now() })
  
  return data
}
