import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 模拟 import
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import translations from './src/i18n/translations.js';

function buildMessages(trans, lang) {
    const msgs = {}
    for (const [key, text] of Object.entries(trans)) {
        const parts = key.split('.')
        let current = msgs
        for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) current[parts[i]] = {}
            current = current[parts[i]]
        }
        current[parts[parts.length - 1]] = text[lang] || ''
    }
    return msgs
}

const langs = ['en', 'zh', 'ar']
const targetDir = path.join(__dirname, 'src', 'i18n', 'locales')
fs.mkdirSync(targetDir, { recursive: true })

for (const lang of langs) {
    fs.writeFileSync(path.join(targetDir, `${lang}.json`), JSON.stringify(buildMessages(translations, lang), null, 2))
}
