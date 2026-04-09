<template>
  <div class="mobile-container">
    <!-- Header -->
    <div class="dash-header-bar">
      <button class="header-back" @click="$router.push('/')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div class="header-center">
        <h1 class="header-title">{{ $t('bd.title') }}</h1>
        <div class="header-sub">{{ $t('bd.subtitle') }}</div>
      </div>
      <router-link to="/bd/history" class="header-menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </router-link>
    </div>

    <!-- BD Profile Tag -->
    <div class="profile-tag-row px-24">
      <div class="profile-badge">
        <div class="avatar avatar-sm" :style="{ background: avatarColor(bdData.user.nickname) }">
          {{ avatarInitials(bdData.user.nickname) }}
        </div>
        <div class="profile-info">
          <span class="profile-name">{{ bdData.user.nickname }}</span>
          <span class="profile-id">ID: {{ bdData.user.id }}</span>
        </div>
        <span class="badge badge-level">L{{ currentLevel }}</span>
      </div>
    </div>

    <!-- Settlement Notifications List (above wallet) -->
    <div v-if="bdData.pendingSettlements.length > 0" class="settlement-list" style="margin: 16px 24px 0;">
      <div class="settlement-list-header" @click="settlementListExpanded = !settlementListExpanded">
        <div class="flex items-center gap-8">
          <span style="font-size: 18px;">🔔</span>
          <span class="notify-text">{{ $t('bd.settlementNotification', { count: bdData.pendingSettlements.length }) }}</span>
        </div>
        <div class="flex items-center gap-8">
          <span class="settlement-badge">{{ bdData.pendingSettlements.length }}</span>
          <svg :class="{ 'chevron-rotated': settlementListExpanded }" class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
      <Transition name="slide">
        <div v-if="settlementListExpanded" class="settlement-items">
          <div
            v-for="s in bdData.pendingSettlements"
            :key="s.id"
            class="settlement-item"
            @click="openSettlementConfirm(s)"
          >
            <div class="settlement-item-left">
              <div class="settlement-item-amount num">💎 {{ formatNumber(s.diamonds) }}</div>
              <div class="settlement-item-reason">{{ s.reason }}</div>
              <div class="settlement-item-time">{{ s.createdAt }}</div>
            </div>
            <div class="settlement-item-right">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Balance Card -->
    <div class="card card-gradient" style="margin: 16px 24px 0;">
      <div class="text-caption">💎 {{ $t('bd.diamondWallet') }}</div>
      <div class="flex items-center gap-8 mt-8">
        <span style="font-size: 24px;">💎</span>
        <span class="text-hero num" style="font-size: 32px;">{{ formatNumber(bdData.balance.available) }}</span>
      </div>
      <div class="text-caption text-success mt-8">≈ {{ diamondsToUSD(bdData.balance.available) }} USD</div>
      <div class="flex gap-12 mt-16">
        <button class="btn btn-primary" style="flex: 1;" @click="$router.push('/bd/recharge')">{{ $t('bd.recharge') }}</button>
        <button class="btn btn-ghost" style="flex: 1; border: 1px solid var(--border-subtle);"
          @click="$router.push('/bd/withdraw')">{{ $t('bd.withdraw') }}</button>
      </div>

      <!-- Frozen -->
      <div v-if="bdData.balance.frozen > 0"
        style="margin: 16px -24px -24px -24px; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.05); border-radius: 0 0 16px 16px; background: rgba(0, 0, 0, 0.2);">
        <span class="text-caption" style="color: var(--text-secondary);">{{ $t('bd.frozenDiamonds') }}</span>
        <div class="flex items-center gap-4">
          <span style="font-size: 14px;">💎</span>
          <span class="num" style="font-size: 16px; font-weight: 700; color: var(--text-primary);">{{
            formatNumber(bdData.balance.frozen) }}</span>
        </div>
      </div>
    </div>

    <!-- Promotion Progress Card -->
    <div class="card" style="margin: 16px 24px 24px; padding: 20px 24px 24px;">
      <div class="flex justify-between items-center" style="margin-bottom: 12px;">
        <div class="text-subtitle" style="line-height: 1;">{{ $t('bd.salaryProgress') }}</div>
        <router-link to="/bd/task-rules" class="rules-link">{{ $t('hostTaskRules.taskRulesLink') }} →</router-link>
      </div>

      <!-- Category 1: Task Reward (任务奖励) -->
      <div class="progress-category">
        <div class="category-title-row">{{ $t('bd.taskReward') }}</div>
        <div class="salary-comparison">
          <div class="salary-box salary-current">
            <div class="salary-box-label">{{ $t('bd.currentLevelEarn', { level: currentLevel }) }}</div>
            <div class="salary-box-amount num">💎 {{ formatNumber(currentTier?.totalSalary || 0) }}</div>
            <div class="salary-box-usd num">≈ ${{ ((currentTier?.totalSalary || 0) / 8300).toFixed(0) }}</div>
          </div>
          <div v-if="nextTier" class="salary-arrow">→</div>
          <div v-if="nextTier" class="salary-box salary-next">
            <div class="salary-box-label">{{ $t('bd.upgradeLevelEarn', { level: nextTier.level }) }}</div>
            <div class="salary-box-amount num">💎 {{ formatNumber(nextTier.totalSalary) }}</div>
            <div class="salary-box-usd num">≈ ${{ (nextTier.totalSalary / 8300).toFixed(0) }}</div>
          </div>
        </div>
        <div v-if="!nextTier" class="text-caption text-success" style="margin-top: 8px; text-align: center;">🎉 {{ $t('bd.maxLevel') }}</div>
      </div>

      <!-- Category 2: Valid Guild Count (有效公会数量) -->
      <div class="progress-category">
        <div class="category-title-row">{{ $t('bd.validGuildCount') }}</div>
        <div class="category-hero">
          <span class="hero-number num">{{ bdData.currentCycle.validGuilds }}</span>
          <span class="hero-sub">({{ $t('bd.totalBoundGuilds', { count: bdData.currentCycle.totalGuilds }) }})</span>
        </div>
        <div v-if="nextTier" class="level-check-row" :class="nextGuildsMet ? 'check-met' : 'check-unmet'">
          <span>{{ $t('bd.levelReqPrefix', { level: nextTier.level }) }} {{ nextTier.validGuildsReq }}</span>
          <span>{{ nextGuildsMet ? $t('bd.met') : $t('bd.notMet') }}</span>
        </div>
        <div v-if="!nextTier" class="text-caption text-success" style="margin-top: 4px;">🎉 {{ $t('bd.maxLevel') }}</div>
      </div>

      <!-- Category 3: Team Total Revenue (团队总收入) -->
      <div class="progress-category" style="margin-bottom: 0;">
        <div class="category-title-row">{{ $t('bd.teamTotalRevenue') }}</div>
        <div class="category-hero">
          <span class="hero-diamond">💎</span>
          <span class="hero-number num">{{ formatNumber(bdData.currentCycle.teamRevenue) }}</span>
        </div>
        <div v-if="nextTier" class="level-check-row" :class="nextRevenueMet ? 'check-met' : 'check-unmet'">
          <span>{{ $t('bd.levelReqPrefix', { level: nextTier.level }) }} 💎{{ formatNumber(nextTier.teamRevenueReq) }}</span>
          <span>{{ nextRevenueMet ? $t('bd.met') : $t('bd.notMet') }}</span>
        </div>
        <div v-if="!nextTier" class="text-caption text-success" style="margin-top: 4px;">🎉 {{ $t('bd.maxLevel') }}</div>
      </div>
    </div>

    <!-- Spacer -->
    <div style="height: 8px;"></div>

    <!-- My Agencies -->
    <div class="px-24">
      <div class="flex justify-between items-center" style="margin-bottom: 8px;">
        <div class="section-header" style="margin-bottom: 0; line-height: 1;">{{ $t('bd.myAgencies') }} ({{ bdData.agencies.length }})</div>
        <button class="view-all-btn flex items-center gap-4" style="line-height: 1; padding: 0;" @click="toggleSort">
          <span>{{ sortOrder === 'desc' ? $t('bd.highestFirst') : $t('bd.lowestFirst') }}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: block;">
            <template v-if="sortOrder === 'desc'"><path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4" /></template>
            <template v-else><path d="M11 5h10M11 9h7M11 13h4M3 7l3-3 3 3M6 6v14" /></template>
          </svg>
        </button>
      </div>
      <router-link v-for="ag in sortedAgencies" :key="ag.id" :to="'/agency/profile-readonly?id=' + ag.id + '&from=bd'" class="agency-row" style="text-decoration: none; color: inherit;">
        <div class="avatar avatar-sm" :style="{ background: avatarColor(ag.name) }">
          {{ avatarInitials(ag.name) }}
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-8">
            <span class="text-body" style="font-weight: 600;">{{ ag.name }}</span>
            <span v-if="isGuildValid(ag)" class="badge badge-success" style="font-size: 10px;">{{ $t('bd.guildValid') }}</span>
            <span v-else class="badge badge-warning" style="font-size: 10px;">{{ $t('bd.guildInvalid') }}</span>
          </div>
          <!-- Income + inline warning -->
          <div class="flex items-center gap-8 mt-4">
            <span class="text-caption num">💎 {{ formatNumber(ag.income) }}</span>
            <span v-if="ag.income < 1_660_000" class="text-caption" style="color: var(--danger); font-size: 11px;">⚠ {{ $t('bd.incomeReq') }}</span>
          </div>
          <!-- Valid hosts + inline warning -->
          <div class="flex items-center gap-8 mt-4">
            <span class="text-caption text-secondary">{{ $t('bd.validHosts') }}:</span>
            <span class="text-caption num" style="font-weight: 600;"><span :style="{ color: ag.validHostCount >= 5 ? 'var(--text-primary)' : 'var(--warning)' }">{{ ag.validHostCount }}</span><span style="color: var(--text-tertiary);">/{{ ag.totalHosts }}</span></span>
            <span v-if="ag.validHostCount < 5" class="text-caption" style="color: var(--danger); font-size: 11px;">⚠ {{ $t('bd.validHostsReq') }}</span>
          </div>
          <!-- Bind expire date -->
          <div class="text-caption text-muted mt-4" style="font-size: 11px;">{{ $t('bd.bindExpire') }}: {{ getBindExpire(ag.bindDate) }}</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </router-link>
    </div>

    <div style="height: 40px;"></div>

    <!-- Settlement Confirm Modal -->
    <Transition name="fade">
      <div v-if="showSettlementModal" class="overlay" @click.self="showSettlementModal = false">
        <div class="modal-card" style="max-width: 400px; max-height: 85vh; overflow-y: auto;">
          <div class="text-center" style="margin-bottom: 16px;">
            <h2 class="text-title">{{ $t('bd.settlementDetail') }}</h2>
          </div>

          <!-- Settlement Description (prominent, standalone) -->
          <div class="settlement-desc-section">
            <div class="settlement-desc-label">{{ $t('bd.settlementReasonLabel') }}</div>
            <div class="settlement-desc-content">{{ selectedSettlement?.reason }}</div>
          </div>

          <!-- Amount + Date below -->
          <div class="settlement-info-card" style="margin-top: 12px;">
            <div class="settlement-info-row">
              <span class="text-caption text-secondary">{{ $t('bd.settlementAmountLabel') }}</span>
              <span class="num" style="font-weight: 700; font-size: 18px; color: var(--primary);">💎 {{ formatNumber(selectedSettlement?.diamonds || 0) }}</span>
            </div>
            <div class="settlement-info-row">
              <span class="text-caption text-secondary">{{ $t('admin.date') }}</span>
              <span class="text-caption">{{ selectedSettlement?.createdAt }}</span>
            </div>
          </div>

          <button class="btn btn-primary btn-block" style="margin-top: 20px; padding: 14px;" @click="acknowledgeSettlement">{{ $t('bd.iGotIt') }}</button>
          <div class="text-center" style="margin-top: 16px;">
            <span style="font-size: 13px; color: var(--text-muted);">{{ $t('bd.objectionPrompt') }}</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </Transition>

    <!-- BD Agreement Modal -->
    <Transition name="fade">
      <div v-if="showAgreementModal" class="agreement-overlay">
        <div class="agreement-modal">
          <h2 class="agreement-modal-title">{{ $t('bdAgreement.title') }}</h2>
          <div class="agreement-modal-body">
            <p>{{ $t('bdAgreement.item1') }}</p>
            <p>{{ $t('bdAgreement.item2') }}</p>
            <p>{{ $t('bdAgreement.item3') }}</p>
            <p>{{ $t('bdAgreement.item4') }}</p>
            <p>{{ $t('bdAgreement.item5') }}</p>
          </div>
          <button class="btn btn-primary btn-block" @click="acceptAgreement">{{ $t('bdAgreement.agree') }}</button>
          <button class="btn btn-ghost btn-block" style="margin-top: 8px;" @click="declineAgreement">{{ $t('bdAgreement.decline') }}</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { bdData, adminData } from '../../mock/data.js'
import { formatNumber, diamondsToUSD, avatarColor, avatarInitials } from '../../utils.js'

const { t } = useI18n()
const router = useRouter()
const sortOrder = ref('desc')
const toast = ref('')
const showAgreementModal = ref(true)

function acceptAgreement() {
  showAgreementModal.value = false
}

function declineAgreement() {
  showAgreementModal.value = false
  router.back()
}
const showSettlementModal = ref(false)
const selectedSettlement = ref(null)
const settlementListExpanded = ref(false)

function showToast(msg) { toast.value = msg; setTimeout(() => toast.value = '', 2500) }
function toggleSort() { sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc' }

function openSettlementConfirm(settlement) {
  selectedSettlement.value = settlement
  showSettlementModal.value = true
}

function acknowledgeSettlement() {
  if (!selectedSettlement.value) return
  const s = selectedSettlement.value

  // Remove from pending
  const idx = bdData.pendingSettlements.findIndex(p => p.id === s.id)
  if (idx !== -1) bdData.pendingSettlements.splice(idx, 1)

  showSettlementModal.value = false
  selectedSettlement.value = null
}

function raiseObjection() {
  showSettlementModal.value = false
  selectedSettlement.value = null
  showToast(t('bd.objectionPrompt'))
}

const VALID_GUILD_MIN_HOSTS = 5
const VALID_GUILD_MIN_INCOME = 1_660_000

const currentLevel = computed(() => bdData.currentCycle.currentLevel)

const currentTier = computed(() => bdData.salaryTiers.find(t => t.level === currentLevel.value) || null)
const nextTier = computed(() => bdData.salaryTiers.find(t => t.level === currentLevel.value + 1) || null)

// Valid guilds progress percent
const guildsPercent = computed(() => {
  if (!nextTier.value) return 100
  return Math.min(100, Math.max(0, (bdData.currentCycle.validGuilds / nextTier.value.validGuildsReq) * 100))
})

// Team revenue progress percent
const revenuePercent = computed(() => {
  if (!nextTier.value) return 100
  const current = currentTier.value ? currentTier.value.teamRevenueReq : 0
  const next = nextTier.value.teamRevenueReq
  const range = next - current
  if (range <= 0) return 100
  return Math.min(100, Math.max(0, (bdData.currentCycle.teamRevenue - current) / range * 100))
})

// Next level met status (for reference design check rows)
const nextGuildsMet = computed(() => {
  if (!nextTier.value) return true
  return bdData.currentCycle.validGuilds >= nextTier.value.validGuildsReq
})
const nextRevenueMet = computed(() => {
  if (!nextTier.value) return true
  return bdData.currentCycle.teamRevenue >= nextTier.value.teamRevenueReq
})

function isGuildValid(ag) {
  return ag.validHostCount >= VALID_GUILD_MIN_HOSTS && ag.income >= VALID_GUILD_MIN_INCOME
}

function getBindExpire(bindDate) {
  const d = new Date(bindDate)
  d.setMonth(d.getMonth() + 4, 0) // 3个月后的月末
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const sortedAgencies = computed(() => {
  return [...bdData.agencies].sort((a, b) => sortOrder.value === 'desc' ? b.income - a.income : a.income - b.income)
})
</script>

<style scoped>
.dash-header-bar { display: flex; align-items: center; justify-content: space-between; padding: 48px 20px 16px; }
.header-back, .header-menu { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: none; border: none; border-radius: 50%; color: var(--text-muted); cursor: pointer; text-decoration: none; flex-shrink: 0; }
.header-back { color: var(--text-primary); }
.header-center { text-align: center; flex: 1; }
.header-title { font-size: 18px; font-weight: 700; color: var(--text-primary); }
.header-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.profile-tag-row { margin-top: 8px; }
.profile-badge { display: flex; align-items: center; gap: 12px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 12px 16px; }
.profile-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.profile-name { font-weight: 700; font-size: 15px; color: var(--text-primary); }
.profile-id { font-size: 12px; color: var(--text-muted); }
.badge-level { background: linear-gradient(135deg, #6366F1, #8B5CF6); color: #fff; font-size: 13px; padding: 4px 12px; font-weight: 700; }
.agency-row { display: flex; align-items: flex-start; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border-subtle); }
.agency-row:last-child { border-bottom: none; }
.view-all-btn { background: none; border: none; color: var(--primary); font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; padding: 4px 0; }
.section-header { font-size: 16px; font-weight: 700; color: var(--text-primary); }

/* Promotion Progress Categories */
.progress-category {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 14px 16px 12px;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.category-title-row {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
}

/* Hero metric */
.category-hero {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 10px;
}
.hero-number {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}
.hero-sub {
  font-size: 13px;
  color: var(--text-muted);
  margin-left: 6px;
}
.hero-diamond {
  font-size: 22px;
  margin-right: 2px;
}

/* Level check row */
.level-check-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}
.level-check-row.check-met {
  background: rgba(16, 185, 129, 0.08);
  color: var(--success, #10B981);
}
.level-check-row.check-unmet {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-muted);
}

/* Salary comparison */
.salary-comparison {
  display: flex;
  align-items: center;
  gap: 6px;
}
.salary-box {
  flex: 1;
  padding: 12px 10px;
  border-radius: 8px;
  text-align: center;
}
.salary-current {
  background: rgba(0, 216, 201, 0.06);
  border: 1px solid rgba(0, 216, 201, 0.15);
}
.salary-next {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.salary-box-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
  margin-bottom: 6px;
}
.salary-box-amount {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}
.salary-current .salary-box-amount {
  color: var(--primary);
}
.salary-box-usd {
  font-size: 12px;
  color: var(--text-dim);
  margin-top: 3px;
}
.salary-arrow {
  flex-shrink: 0;
  color: var(--text-dim);
  font-size: 16px;
}

/* Settlement Notification List */
.settlement-list {
  margin: 12px 24px 0;
  border-radius: 12px;
  border: 1px solid rgba(0,216,201,0.2);
  background: rgba(0,216,201,0.04);
  overflow: hidden;
  animation: settlePulse 2s ease-in-out infinite;
}
@keyframes settlePulse {
  0%, 100% { border-color: rgba(0,216,201,0.2); }
  50% { border-color: rgba(0,216,201,0.4); }
}
.settlement-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.15s;
}
.settlement-list-header:active {
  background: rgba(0,216,201,0.08);
}
.settlement-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 11px;
  background: var(--primary);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}
.chevron-icon {
  transition: transform 0.25s ease;
}
.chevron-rotated {
  transform: rotate(180deg);
}
.settlement-items {
  border-top: 1px solid rgba(0,216,201,0.1);
}
.settlement-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  cursor: pointer;
  transition: background 0.15s;
}
.settlement-item:last-child {
  border-bottom: none;
}
.settlement-item:active {
  background: rgba(0,216,201,0.08);
}
.settlement-item-left {
  flex: 1;
  min-width: 0;
}
.settlement-item-amount {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
}
.settlement-item-reason {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.settlement-item-time {
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 2px;
}
.settlement-item-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 12px;
}

/* Slide transition */
.slide-enter-active { transition: all 0.25s ease; }
.slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 500px;
  opacity: 1;
}
.overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}
.modal-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 28px 24px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}
/* Notify text */
.notify-text {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

/* Settlement Description Section */
.settlement-desc-section {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 16px;
}
.settlement-desc-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.settlement-desc-content {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
  white-space: pre-line;
  word-break: break-word;
  max-height: 200px;
  overflow-y: auto;
}

.settlement-info-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  overflow: hidden;
}
.settlement-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.settlement-info-row:last-child {
  border-bottom: none;
}
.btn-block {
  display: block;
  width: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.toast-enter-active { animation: toastIn 0.3s ease; }
.toast-leave-active { animation: toastIn 0.3s ease reverse; }
@keyframes toastIn {
  from { opacity: 0; transform: translate(-50%, 20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary);
  color: #fff;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  z-index: 9999;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0,216,201,0.3);
}
.rules-link {
  color: var(--primary);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}
.rules-link:active {
  opacity: 0.7;
}

.agreement-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 24px;
}
.agreement-modal {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}
.agreement-modal-title {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 16px;
  color: var(--text-primary);
}
.agreement-modal-body {
  flex: 1;
  overflow-y: auto;
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 20px;
  padding-right: 4px;
}
.agreement-modal-body p {
  margin: 0 0 12px;
}
</style>
