const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// 获取所有翻译
app.get('/api/translations', (req, res) => {
    db.all('SELECT * FROM translations ORDER BY key ASC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // format to simple JSON map to match original structure
        // like: { common: { confirm: { en: 'x', zh: 'y', ar: 'z'} } ... }
        res.json({ success: true, count: rows.length, data: rows });
    });
});

// 更新翻译内容
app.put('/api/translations', (req, res) => {
    const { key, lang, text } = req.body;
    if (!key || !lang || text === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // lang must be en, zh, or ar
    if (!['en', 'zh', 'ar'].includes(lang)) {
        return res.status(400).json({ error: 'Invalid language code' });
    }

    const query = `UPDATE translations SET ${lang} = ? WHERE key = ?`;
    db.run(query, [text, key], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, changed: this.changes });
    });
});

// 批量更新多个翻译内容 (适用于表格一次性保存)
app.post('/api/translations/batch-update', (req, res) => {
    const updates = req.body.updates; // format: [{key: '...', en: '...', zh: '...', ar: '...'}, ...]
    if (!Array.isArray(updates)) {
        return res.status(400).json({ error: 'Updates should be an array' });
    }

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        const stmt = db.prepare("UPDATE translations SET en = ?, zh = ?, ar = ? WHERE key = ?");

        for (const row of updates) {
            stmt.run([row.en, row.zh, row.ar, row.key]);
        }
        stmt.finalize();

        db.run("COMMIT", (err) => {
            if (err) {
                return res.status(500).json({ success: false, error: err.message });
            }
            res.json({ success: true, message: `Successfully updated ${updates.length} rows.` });
        });
    });
});


// 将目前的 JS 静态文件导入到数据库中(初始化用)
app.post('/api/translations/init', async (req, res) => {
    try {
        // Read the static locale files dynamically
        // Using simple regex or eval since they are ES modules exporting default
        // An easier way is to just read them as text, replace 'export default' with 'module.exports =' and require them

        const locales = ['en', 'zh', 'ar'];
        const loadedLocales = {};

        for (const lang of locales) {
            const filePath = path.resolve(__dirname, `../src/i18n/locales/${lang}.json`);
            let content = fs.readFileSync(filePath, 'utf8');
            loadedLocales[lang] = JSON.parse(content);
        }

        // Flatten keys e.g. "common.confirm" -> { en: "Confirm", zh: "确认", ar: "تأكيد" }
        const allKeys = new Set();
        const flattened = {};

        function flattenObject(obj, lang, parentPrefix = '') {
            for (const k in obj) {
                const value = obj[k];
                const newKey = parentPrefix ? `${parentPrefix}.${k}` : k;
                if (typeof value === 'object' && value !== null) {
                    flattenObject(value, lang, newKey);
                } else {
                    allKeys.add(newKey);
                    if (!flattened[newKey]) flattened[newKey] = {};
                    flattened[newKey][lang] = value;
                }
            }
        }

        for (const lang of locales) {
            flattenObject(loadedLocales[lang], lang);
        }

        let insertedCount = 0;

        db.serialize(() => {
            // Begin transaction
            db.run("BEGIN TRANSACTION");

            const stmt = db.prepare("INSERT OR REPLACE INTO translations (key, en, zh, ar) VALUES (?, ?, ?, ?)");
            for (const key of allKeys) {
                const entry = flattened[key];
                stmt.run([key, entry.en || '', entry.zh || '', entry.ar || '']);
                insertedCount++;
            }
            stmt.finalize();

            db.run("COMMIT", (err) => {
                if (err) {
                    return res.status(500).json({ success: false, error: err.message });
                }
                res.json({ success: true, message: `Successfully initialized ${insertedCount} keys into database.` });
            });
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Translation API server is running on http://localhost:${PORT}`);
});
