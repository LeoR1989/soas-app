<template>
    <div class="demo-home">
        <!-- Header -->
        <div class="demo-header">
            <div class="demo-logo">
                <span class="logo-icon">💎</span>
                <div>
                    <div class="flex items-center gap-8">
                        <h1 class="demo-title">SOAS</h1>
                        <div class="version-selector" @click.stop="showVersionMenu = !showVersionMenu">
                            <span class="version-tag clickable">{{ versionState.current }}</span>
                            <Transition name="fade">
                                <div v-if="showVersionMenu" class="version-dropdown">
                                    <div v-for="v in VERSIONS" :key="v.code" class="version-option"
                                        :class="{ active: versionState.current === v.code }"
                                        @click.stop="selectVersion(v.code)">
                                        <span>{{ v.label }}</span>
                                        <span class="version-desc">{{ v.description }}</span>
                                        <span v-if="versionState.current === v.code" class="version-check">✓</span>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>
                    <p class="demo-subtitle">{{ $t('demo.subtitle') }}</p>
                </div>
            </div>
            <!-- Language Switcher -->
            <div class="lang-switcher">
                <button v-for="loc in locales" :key="loc.code" class="lang-btn" :class="{ active: $i18n.locale === loc.code }"
                    @click="switchLocale(loc.code)">
                    {{ loc.label }}
                </button>
            </div>
        </div>

        <!-- Role Cards -->
        <div class="demo-section">
            <h2 class="demo-section-title">{{ $t('demo.selectRole') }}</h2>
            <p class="demo-section-desc">{{ $t('demo.selectRoleDesc') }}</p>

            <div class="role-grid">
                <div class="role-chip" :class="{ active: activeRole === 'host-unjoined' }"
                    @click="activeRole = 'host-unjoined'">
                    <div class="role-icon" style="background: linear-gradient(135deg, #F59E0B, #D97706);">🔍</div>
                    <span class="role-label">{{ $t('demo.roles.hostUnjoined') }}</span>
                </div>
                <div class="role-chip" :class="{ active: activeRole === 'host-joined' }"
                    @click="activeRole = 'host-joined'">
                    <div class="role-icon" style="background: linear-gradient(135deg, #00D8C9, #009B92);">🎙️</div>
                    <span class="role-label">{{ $t('demo.roles.hostJoined') }}</span>
                </div>
                <div class="role-chip" :class="{ active: activeRole === 'agency' }" @click="activeRole = 'agency'">
                    <div class="role-icon" style="background: linear-gradient(135deg, #10B981, #059669);">🏢</div>
                    <span class="role-label">{{ $t('demo.roles.agency') }}</span>
                </div>
                <div class="role-chip" :class="{ active: activeRole === 'operation' }"
                    @click="activeRole = 'operation'">
                    <div class="role-icon" style="background: linear-gradient(135deg, #EF4444, #B91C1C);">🛡️</div>
                    <span class="role-label">{{ $t('demo.roles.operation') }}</span>
                </div>
                <div v-if="featureFlags.showBD" class="role-chip" :class="{ active: activeRole === 'bd' }" @click="activeRole = 'bd'">
                    <div class="role-icon" style="background: linear-gradient(135deg, #8B5CF6, #6D28D9);">📢</div>
                    <span class="role-label">BD</span>
                </div>

            </div>
        </div>

        <!-- Page Navigator -->
        <div class="demo-section" v-if="activeRole">
            <h2 class="demo-section-title">{{ $t('demo.availablePages') }}</h2>
            <div class="page-list">
                <router-link v-for="page in currentPages" :key="page.path" :to="page.path" class="page-item"
                    @click="switchRole">
                    <div class="page-icon">{{ page.icon }}</div>
                    <div class="page-info">
                        <div class="page-name">{{ $t(page.nameKey) }}</div>
                        <div class="page-path">{{ page.path }}</div>
                    </div>
                    <div class="page-arrow">›</div>
                </router-link>
            </div>
        </div>



        <!-- Footer -->
        <div class="demo-footer">
            <p>{{ $t('demo.footer') }}</p>
            <p style="margin-top: 4px; font-size: 11px;">{{ $t('demo.footerSub') }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { setLocale } from '../i18n/index.js'
import { hostData } from '../mock/data.js'
import i18n from '../i18n/index.js'
import { VERSIONS, versionState, setVersion, useFeatureFlags } from '../config/versionConfig.js'

const router = useRouter()
const activeRole = ref('host-unjoined')
const showVersionMenu = ref(false)
const featureFlags = useFeatureFlags()

function selectVersion(code) {
    setVersion(code)
    showVersionMenu.value = false
    // 如果当前选中了BD角色但BD被隐藏，切换到默认角色
    if (!featureFlags.value.showBD && activeRole.value === 'bd') {
        activeRole.value = 'host-unjoined'
    }
}

// 点击外部关闭版本菜单
function closeVersionMenu(e) {
    showVersionMenu.value = false
}
onMounted(() => document.addEventListener('click', closeVersionMenu))
onUnmounted(() => document.removeEventListener('click', closeVersionMenu))

const locales = [
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '中' },
    { code: 'ar', label: 'عر' },
]

function switchLocale(code) {
    setLocale(code)
}

const hostJoinedPages = [
    { icon: '📊', nameKey: 'demo.pages.hostDashboard', path: '/host/dashboard' },
    { icon: '📜', nameKey: 'demo.pages.historyBills', path: '/host/bills' },
    { icon: '💎', nameKey: 'demo.pages.rechargeForOthers', path: '/host/recharge' },
    { icon: '💸', nameKey: 'demo.pages.withdraw', path: '/host/withdraw' },
    { icon: '👤', nameKey: 'demo.pages.agencyProfileReadonly', path: '/agency/profile-readonly' },
]

const hostUnjoinedPages = [
    { icon: '🔍', nameKey: 'demo.pages.browseAgencies', path: '/host' },
    { icon: '🪙', nameKey: 'demo.pages.coinHistory', path: '/host/coin-history' },
    { icon: '💎', nameKey: 'demo.pages.diamondWallet', path: '/host/diamond-wallet' },
]

const agencyPages = [
    { icon: '📊', nameKey: 'demo.pages.agencyDashboard', path: '/agency' },
    { icon: '📜', nameKey: 'demo.pages.agencyHistory', path: '/agency/history' },
    { icon: '🏢', nameKey: 'demo.pages.agencyProfile', path: '/agency/profile' },
    { icon: '🪙', nameKey: 'demo.pages.agentRecharge', path: '/agency/agent-recharge', agent: true },
    { icon: '💸', nameKey: 'demo.pages.agentTransfer', path: '/agency/agent-transfer', agent: true },
    { icon: '📄', nameKey: 'demo.pages.agentBills', path: '/agency/agent-bills', agent: true },
    { icon: '📐', nameKey: 'demo.pages.agentRules', path: '/agency/agent-rules', agent: true },
]

const operationPages = [
    { icon: '🛡️', nameKey: 'demo.pages.adminPortal', path: '/admin' },
]

const bdPages = [
    { icon: '📊', nameKey: 'demo.pages.bdDashboard', path: '/bd' },
    { icon: '📜', nameKey: 'demo.pages.bdHistory', path: '/bd/history' },
    { icon: '💎', nameKey: 'demo.pages.bdRecharge', path: '/bd/recharge' },
    { icon: '💸', nameKey: 'demo.pages.bdWithdraw', path: '/bd/withdraw' },
]


const currentPages = computed(() => {
    if (activeRole.value === 'host-joined') return hostJoinedPages
    if (activeRole.value === 'host-unjoined') {
        if (!featureFlags.value.showHostUnjoinedWallet) {
            return hostUnjoinedPages.filter(p => !['/host/coin-history', '/host/diamond-wallet'].includes(p.path))
        }
        return hostUnjoinedPages
    }
    if (activeRole.value === 'agency') {
        if (!featureFlags.value.showRechargeAgent) {
            return agencyPages.filter(p => !p.agent)
        }
        return agencyPages
    }
    if (activeRole.value === 'operation') return operationPages
    if (activeRole.value === 'bd') return bdPages
    return []
})

function switchRole() {
    // Ensure mock data matches the selected role
    if (activeRole.value === 'host-joined') {
        // Ensure agency is set so router guard allows dashboard
        if (!hostData.agency) {
            hostData.agency = {
                id: 'AG-15502',
                name: 'Dubai Elite Club',
                logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=DubaiElite'
            }
        }
    } else if (activeRole.value === 'host-unjoined') {
        hostData.agency = null
    }
}
</script>

<style scoped>
.demo-home {
    max-width: 520px;
    margin: 0 auto;
    min-height: 100vh;
    padding: 0 24px 60px;
}

.demo-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 48px 0 32px;
}

.demo-logo {
    display: flex;
    align-items: center;
    gap: 14px;
}

.logo-icon {
    font-size: 36px;
    filter: drop-shadow(0 0 10px rgba(0, 216, 201, 0.5));
}

.demo-title {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #00D8C9, #00f2fe);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.demo-subtitle {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
}

.version-selector {
    position: relative;
}

.version-tag {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    background: var(--primary-light);
    color: var(--primary);
    border-radius: var(--radius-full);
    letter-spacing: 0.5px;
}

.version-tag.clickable {
    cursor: pointer;
    transition: all 0.2s;
}

.version-tag.clickable:hover {
    background: var(--primary);
    color: #fff;
}

.version-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-card);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    min-width: 160px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    z-index: 100;
    overflow: hidden;
}

.version-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    transition: background 0.15s;
}

.version-option:hover {
    background: var(--bg-card-hover);
}

.version-option.active {
    color: var(--primary);
}

.version-desc {
    font-size: 11px;
    color: var(--text-muted);
    flex: 1;
}

.version-check {
    color: var(--primary);
    font-weight: 700;
    font-size: 14px;
}

.demo-section {
    margin-top: 32px;
}

.demo-section-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 6px;
}

.demo-section-desc {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 16px;
}

.role-grid {
    display: flex;
    flex-direction: row;
    gap: 10px;
    flex-wrap: wrap;
}

.role-chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 14px 12px;
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
    text-align: center;
}

.role-chip:hover {
    background: var(--bg-card-hover);
    border-color: var(--border-default);
}

.role-chip.active {
    border-color: var(--primary);
    background: rgba(0, 216, 201, 0.08);
    box-shadow: 0 0 0 1px var(--primary), 0 4px 16px rgba(0, 216, 201, 0.15);
}

.role-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
}

.role-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
}

.role-check {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--primary);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    flex-shrink: 0;
}

.page-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.page-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: all 0.2s ease;
}

.page-item:hover {
    background: var(--bg-card-hover);
    border-color: var(--primary);
    transform: translateX(4px);
}

.page-icon {
    font-size: 20px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-input);
    border-radius: 10px;
    flex-shrink: 0;
}

.page-info {
    flex: 1;
    min-width: 0;
}

.page-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.page-path {
    font-size: 11px;
    color: var(--text-dim);
    margin-top: 2px;
    font-family: 'SF Mono', 'Fira Code', monospace;
}

.page-arrow {
    font-size: 20px;
    color: var(--text-dim);
    flex-shrink: 0;
    transition: transform 0.2s;
}

.page-item:hover .page-arrow {
    transform: translateX(3px);
    color: var(--primary);
}

.admin-entry {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
}

.admin-entry:hover {
    background: var(--bg-card-hover);
    border-color: var(--danger);
}

.demo-footer {
    margin-top: 48px;
    text-align: center;
    font-size: 12px;
    color: var(--text-dim);
    padding: 24px 0;
    border-top: 1px solid var(--border-subtle);
}

/* Language Switcher */
.lang-switcher {
    display: flex;
    gap: 2px;
    background: var(--bg-input);
    border-radius: var(--radius-full);
    padding: 3px;
    border: 1px solid var(--border-subtle);
}

.lang-btn {
    padding: 4px 10px;
    border: none;
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    background: transparent;
    color: var(--text-muted);
    font-family: inherit;
}

.lang-btn.active {
    background: var(--primary);
    color: #fff;
    box-shadow: 0 2px 8px var(--primary-glow);
}

.lang-btn:hover:not(.active) {
    color: var(--text-primary);
    background: var(--primary-light);
}
</style>
