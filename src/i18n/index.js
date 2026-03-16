import { createI18n } from 'vue-i18n'

// 导入静态翻译文件作为默认值
import enMessages from './locales/en.json'
import zhMessages from './locales/zh.json'
import arMessages from './locales/ar.json'

const savedLocale = (typeof localStorage !== 'undefined' && localStorage.getItem('soas-locale')) || 'en'

const i18n = createI18n({
    legacy: false,
    locale: savedLocale,
    fallbackLocale: 'en',
    messages: {
        en: enMessages,
        zh: zhMessages,
        ar: arMessages
    },
    globalInjection: true,
    warnHtmlMessage: false
})

// API 地址
const API_BASE = '/api/translations'

// 将扁平化的 key 转换为嵌套对象
// 例如: "common.confirm" -> { common: { confirm: "..." } }
function flattenToNested(translations) {
    const result = { en: {}, zh: {}, ar: {} }

    for (const item of translations) {
        const key = item.key
        if (!key) continue

        // 设置各语言的值
        if (item.en !== undefined) setNestedValue(result.en, key, item.en)
        if (item.zh !== undefined) setNestedValue(result.zh, key, item.zh)
        if (item.ar !== undefined) setNestedValue(result.ar, key, item.ar)
    }

    return result
}

// 辅助函数：设置嵌套值
function setNestedValue(obj, path, value) {
    const keys = path.split('.')
    let current = obj

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (!current[key]) {
            current[key] = {}
        }
        current = current[key]
    }

    // vue-i18n 中 @ 是特殊字符（链接消息语法），需要转义为 {'@'}
    if (typeof value === 'string' && value.includes('@')) {
        value = value.replace(/@/g, "{'@'}")
    }

    current[keys[keys.length - 1]] = value
}

// 从 API 加载翻译
export async function loadTranslationsFromAPI() {
    try {
        const url = `${API_BASE}?t=${Date.now()}`
        const res = await fetch(url)
        const json = await res.json()

        if (json.success && json.data) {
            const translations = flattenToNested(json.data)

            // 更新 i18n 的消息
            i18n.global.setLocaleMessage('en', translations.en)
            i18n.global.setLocaleMessage('zh', translations.zh)
            i18n.global.setLocaleMessage('ar', translations.ar)

            console.log('Translations loaded from API:', json.data.length, 'keys')
            return true
        }
    } catch (e) {
        console.error('Failed to load translations from API:', e)
    }
    return false
}

// 刷新翻译 - 从 API 重新加载
export async function refreshTranslations() {
    console.log('Refreshing translations from API...')
    await loadTranslationsFromAPI()
}

// 导出配置对象，用于防止 tree-shaking
export const i18nConfig = {
    apiBase: API_BASE,
    loadTranslationsFromAPI,
    refreshTranslations
}

// 应用启动时尝试从 API 加载翻译（如果失败则使用静态文件）
if (typeof window !== 'undefined') {
    // 强制引用，防止 tree-shaking
    console.log('[i18n] Loading translations from API...')
    loadTranslationsFromAPI().then(success => {
        if (!success) {
            console.log('Using static translations (API not available)')
        }
    })
}

export function setLocale(locale) {
    if (i18n.global.locale.value !== undefined) {
        i18n.global.locale.value = locale
    } else {
        i18n.global.locale = locale
    }
    localStorage.setItem('soas-locale', locale)
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
}

// Initialize direction on load
if (typeof document !== 'undefined') {
    document.documentElement.lang = savedLocale
    document.documentElement.dir = savedLocale === 'ar' ? 'rtl' : 'ltr'
}

export default i18n
