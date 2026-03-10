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

console.log('✅ Local JSON files generated successfully.');

// Automatically trigger backend re-initialization
const API_URL = 'http://localhost:3001/api/translations/init';

fetch(API_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            console.log(`✅ Backend SQLite updated: ${data.message}`);
        } else {
            console.error(`❌ Failed to update SQLite: ${data.error}`);
        }
    })
    .catch(err => {
        console.warn(`⚠️ Could not reach backend at ${API_URL} to sync translations. Is the local server running? Error: ${err.message}`);
    });
