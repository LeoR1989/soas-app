import { createI18n } from 'vue-i18n'

const savedLocale = (typeof localStorage !== 'undefined' && localStorage.getItem('soas-locale')) || 'en'

const i18n = createI18n({
    legacy: false,
    locale: savedLocale,
    fallbackLocale: 'en',
    messages: { en: {}, zh: {}, ar: {} }, // Will be loaded dynamically from API
})

// Unflatten dot-notation keys back into objects, e.g. "common.confirm" -> {common: {confirm: "xyz"}}
function unflattenObject(data, lang) {
    const result = {};
    for (const row of data) {
        const keyPath = row.key.split('.');
        const text = row[lang] || '';
        let current = result;
        for (let i = 0; i < keyPath.length - 1; i++) {
            const part = keyPath[i];
            if (!current[part]) current[part] = {};
            current = current[part];
        }
        current[keyPath[keyPath.length - 1]] = text;
    }
    return result;
}

export async function loadTranslations() {
    try {
        const res = await fetch('/api/translations');
        const json = await res.json();

        if (json.success && json.data) {
            const langs = ['en', 'zh', 'ar'];
            langs.forEach(lang => {
                const msgs = unflattenObject(json.data, lang);
                i18n.global.setLocaleMessage(lang, msgs);
            });
            console.log(`Loaded ${json.data.length} translation keys.`);
        }
    } catch (e) {
        console.error('Failed to load translations', e);
    }
}


export function setLocale(locale) {
    i18n.global.locale.value = locale
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
