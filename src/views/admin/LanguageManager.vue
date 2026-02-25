<template>
    <div class="lang-manager">
        <div class="flex justify-between items-center mb-16">
            <h1 class="text-title" style="font-size: 28px;">{{ $t('admin.languageManager') || 'Language Management' }}
            </h1>
            <div class="flex gap-12">
                <div class="search-box">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input v-model="searchQuery" class="input-field" placeholder="Search key or text..."
                        style="padding-left: 36px;" />
                </div>
                <button class="btn btn-primary" @click="exportExcel">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        style="margin-right: 6px;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                    Export Excel
                </button>
            </div>
        </div>

        <!-- Stats -->
        <div class="card mb-24">
            <div class="flex gap-24">
                <div>
                    <div class="text-caption text-secondary">Total Keys</div>
                    <div class="text-subtitle mt-4">{{ keys.length }}</div>
                </div>
                <div>
                    <div class="text-caption text-secondary">Showing Results</div>
                    <div class="text-subtitle mt-4">{{ filteredKeys.length }}</div>
                </div>
                <div v-if="savingCount > 0" class="flex items-center text-primary" style="margin-left: auto;">
                    <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" style="margin-right: 8px;">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Saving {{ savingCount }} item(s)...
                </div>
                <div v-else-if="saveSuccessMsg" class="flex items-center text-success" style="margin-left: auto;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        style="margin-right: 8px;">
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {{ saveSuccessMsg }}
                </div>
            </div>
        </div>

        <!-- Excel-like Table -->
        <div class="card p-0" style="overflow-x: auto;">
            <table class="excel-table">
                <thead>
                    <tr>
                        <th width="25%">Translation Key (ID)</th>
                        <th width="25%">English (EN)</th>
                        <th width="25%">中文 (ZH)</th>
                        <th width="25%">العربية (AR)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="filteredKeys.length === 0">
                        <td colspan="4" class="text-center text-secondary py-24">
                            {{ isLoading ? 'Loading translations...' : 'No translations found.' }}
                        </td>
                    </tr>
                    <tr v-for="item in filteredKeys" :key="item.key">
                        <td class="key-cell">
                            <span class="text-mono text-caption">{{ item.key }}</span>
                        </td>
                        <td class="edit-cell" :class="{ 'editing': activeCell === item.key + '-en' }">
                            <textarea v-model="item.en" rows="1" @focus="activeCell = item.key + '-en'"
                                @blur="saveField(item, 'en', item.en)"
                                @keydown.enter.prevent="blurActiveTarget"></textarea>
                        </td>
                        <td class="edit-cell" :class="{ 'editing': activeCell === item.key + '-zh' }">
                            <textarea v-model="item.zh" rows="1" @focus="activeCell = item.key + '-zh'"
                                @blur="saveField(item, 'zh', item.zh)"
                                @keydown.enter.prevent="blurActiveTarget"></textarea>
                        </td>
                        <td class="edit-cell" :class="{ 'editing': activeCell === item.key + '-ar' }" dir="rtl">
                            <textarea v-model="item.ar" rows="1" @focus="activeCell = item.key + '-ar'"
                                @blur="saveField(item, 'ar', item.ar)"
                                @keydown.enter.prevent="blurActiveTarget"></textarea>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as xlsx from 'xlsx'

const keys = ref([])
const searchQuery = ref('')
const isLoading = ref(true)
const activeCell = ref(null)
const savingCount = ref(0)
const saveSuccessMsg = ref('')

let initialDataMap = {}

// Fetch Data
async function loadData() {
    isLoading.value = true;
    try {
        const res = await fetch('/api/translations')
        const json = await res.json()
        if (json.success) {
            keys.value = json.data || [];
            // Store local copy to check if really modified
            initialDataMap = keys.value.reduce((acc, curr) => {
                acc[curr.key] = { ...curr };
                return acc;
            }, {});
        }
    } catch (e) {
        console.error('Failed to load translations', e)
    }
    isLoading.value = false;
}

onMounted(() => {
    loadData()
})

// Search Filter
const filteredKeys = computed(() => {
    if (!searchQuery.value) return keys.value;
    const q = searchQuery.value.toLowerCase()
    return keys.value.filter(item => {
        return (item.key && item.key.toLowerCase().includes(q)) ||
            (item.en && item.en.toLowerCase().includes(q)) ||
            (item.zh && item.zh.toLowerCase().includes(q)) ||
            (item.ar && item.ar.toLowerCase().includes(q))
    })
})

function blurActiveTarget(e) {
    if (e && e.target) {
        e.target.blur()
    }
}

// Auto-save on blur
async function saveField(item, lang, newText) {
    activeCell.value = null; // remove highlight

    const initial = initialDataMap[item.key]
    // Only save if changed
    if (initial && initial[lang] === newText) {
        return;
    }

    savingCount.value++;
    try {
        const res = await fetch('/api/translations', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: item.key, lang, text: newText })
        })
        const json = await res.json()
        if (json.success) {
            if (initial) initial[lang] = newText;
            showSuccess('Saved automatically');
        }
    } catch (e) {
        console.error('Save failed', e)
        // Optional: show error toast
    } finally {
        savingCount.value--;
    }
}

let successTimeout;
function showSuccess(msg) {
    saveSuccessMsg.value = msg;
    clearTimeout(successTimeout);
    successTimeout = setTimeout(() => {
        saveSuccessMsg.value = '';
    }, 2000);
}

// Export to Excel
function exportExcel() {
    // Create spreadsheet from current filtered data
    const exportData = filteredKeys.value.map(item => ({
        'Key (ID)': item.key,
        'English (en)': item.en || '',
        '中文 (zh)': item.zh || '',
        'العربية (ar)': item.ar || ''
    }))

    const ws = xlsx.utils.json_to_sheet(exportData);

    // Auto-width for columns
    ws['!cols'] = [
        { wch: 30 }, // Key
        { wch: 40 }, // EN
        { wch: 40 }, // ZH
        { wch: 40 }, // AR
    ];

    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Translations");

    xlsx.writeFile(wb, `SOAS_Translations_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
</script>

<style scoped>
.search-box {
    position: relative;
    display: flex;
    align-items: center;
}

.search-box svg {
    position: absolute;
    left: 12px;
    color: var(--text-dim);
}

.excel-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

.excel-table th {
    text-align: left;
    padding: 12px 16px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    background: var(--bg-body);
    border-bottom: 2px solid var(--border-default);
    border-right: 1px solid var(--border-subtle);
}

.excel-table td {
    border-bottom: 1px solid var(--border-subtle);
    border-right: 1px solid var(--border-subtle);
    vertical-align: top;
    padding: 0;
}

.excel-table tr:hover td.key-cell {
    background: var(--bg-body);
}

.key-cell {
    padding: 12px 16px !important;
    background: rgba(0, 0, 0, 0.01);
}

.edit-cell {
    position: relative;
    background: var(--bg-card);
    transition: all 0.2s;
}

.edit-cell textarea {
    width: 100%;
    height: 100%;
    min-height: 48px;
    padding: 12px 16px;
    border: none;
    background: transparent;
    color: var(--text-primary);
    font-family: inherit;
    font-size: 14px;
    resize: vertical;
    outline: none;
    line-height: 1.5;
}

.edit-cell.editing {
    box-shadow: inset 0 0 0 2px var(--primary);
    background: var(--bg-input);
    z-index: 2;
}

.spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
}

.py-24 {
    padding-top: 24px;
    padding-bottom: 24px;
}
</style>
