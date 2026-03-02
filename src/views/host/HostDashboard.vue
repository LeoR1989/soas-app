<template>
  <div class="mobile-container">
    <!-- Header -->
    <div class="dash-header-bar">
      <button class="header-back" @click="goBack">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div class="header-center">
        <h1 class="header-title">{{ $t('hostDashboard.title') }}</h1>
        <div class="header-sub">{{ $t('hostDashboard.realTimeData') }}</div>
      </div>
      <router-link to="/host/bills" class="header-menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </router-link>
    </div>

    <!-- Agency Tag -->
    <div class="agency-tag-row px-24">
      <router-link to="/agency/profile-readonly" class="agency-badge">
        <div class="avatar avatar-sm" :style="{ background: avatarColor(agencyName) }">
          {{ avatarInitials(agencyName) }}
        </div>
        <div class="agency-info">
          <span class="agency-name">{{ agencyName }}</span>
          <span class="agency-id">ID: {{ hostData.agency?.id }}</span>
        </div>
        <span class="arrow">›</span>
      </router-link>
    </div>

    <!-- Balance Card -->
    <div class="balance-card card-gradient" style="margin: 0 24px; padding: 24px;">
      <div class="text-caption mb-8">{{ isUnifiedPayout ? $t('hostDashboard.totalCreated') :
        $t('hostDashboard.availableDiamonds') }}</div>
      <div class="balance-row">
        <span class="balance-icon">💎</span>
        <span class="text-hero num">{{ formatNumber(hostData.balance.available) }}</span>
      </div>
      <div class="text-caption text-success mt-8" style="font-weight: 600;">
        ≈ {{ diamondsToUSD(hostData.balance.available) }} {{ $t('common.usd') }}
      </div>

      <!-- Withdraw Button or Locked notice -->
      <button v-if="!isUnifiedPayout" class="btn btn-primary btn-block mt-16" @click="$router.push('/host/withdraw')">
        {{ $t('common.withdraw') }}
      </button>
      <div v-else class="unified-notice mt-16">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        <span>{{ $t('hostDashboard.unifiedPayout') }}</span>
      </div>

      <!-- Merged Frozen Assets -->
      <router-link to="/host/frozen-bills" v-if="hostData.balance.frozen > 0" class="frozen-card"
        style="margin: 24px -24px -24px -24px; padding: 16px 24px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.05); border-radius: 0 0 16px 16px; background: rgba(0, 0, 0, 0.2);">
        <div class="flex items-center gap-6">
          <span class="text-caption" style="color: var(--text-secondary);">{{ $t('hostDashboard.frozenDiamonds')
            }}</span>
          <span class="balance-icon" style="font-size: 14px; margin-left: 2px;">💎</span>
          <span class="num" style="font-size: 16px; font-weight: 700; color: var(--text-primary);">{{
            formatNumber(hostData.balance.frozen) }}</span>
        </div>
        <div class="flex items-center gap-4 text-caption text-muted">
          <span>{{ $t('common.viewDetails') }}</span>
          <span class="arrow" style="font-size: 16px;">›</span>
        </div>
      </router-link>
    </div>

    <!-- Base Salary Module -->
    <div class="base-salary-section px-24" style="margin-top: 24px;">
      <div class="flex items-center gap-8 mb-8">
        <span class="text-title" style="font-size: 18px;">{{ $t('hostDashboard.baseSalary') }}</span>
        <span class="help-icon">?</span>
      </div>
      <div class="card base-salary-card p-16 pb-20">

        <div class="flex justify-between items-center" style="margin-bottom: 12px;">
          <div class="text-body text-secondary font-bold">
            {{ $t('hostDashboard.current') }}: <span style="color: var(--text-primary);">LV{{
              hostData.taskProgress.currentLevel }}</span>
          </div>
          <div class="text-caption text-secondary">{{ currentCyclePeriod }}</div>
        </div>

        <div class="flex items-center gap-12" style="margin-bottom: 20px;">
          <div class="progress-bar flex-1"
            style="height: 10px; background: rgba(255,255,255,0.08); border-radius: 5px; overflow: hidden;">
            <div class="progress-bar-fill"
              :style="{ width: baseSalaryPercent + '%', background: 'linear-gradient(90deg, #a78bfa, #d946ef)', height: '100%', borderRadius: '5px' }">
            </div>
          </div>
          <div class="text-caption font-bold text-secondary" style="font-size: 14px;">LV.{{
            hostData.taskProgress.currentLevel + 1 }}</div>
        </div>

        <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <!-- Line 1 -->
          <div class="flex justify-between items-center" style="margin-bottom: 16px;">
            <span class="text-body text-secondary">{{ $t('hostDashboard.currentCycleGiftRevenue') }}</span>
            <div class="flex items-center gap-6">
              <img src="../../assets/coinslogo.png" style="width: 14px; height: 14px; object-fit: contain;"
                alt="coins" />
              <span class="text-body num font-bold">{{ formatNumber(hostData.taskProgress.coinsEarned) }}</span>
            </div>
          </div>
          <!-- Line 2 -->
          <div class="flex justify-between items-center" style="margin-bottom: 24px;">
            <span class="text-body text-secondary">{{ $t('hostDashboard.coinsNeededToLevelUp') }}</span>
            <div class="flex items-center gap-6">
              <img src="../../assets/coinslogo.png" style="width: 14px; height: 14px; object-fit: contain;"
                alt="coins" />
              <span class="text-body num font-bold">{{ formatNumber(coinsToNextLevel) }}</span>
            </div>
          </div>
          <!-- Line 3 -->
          <div class="flex justify-between items-center" style="margin-bottom: 16px;">
            <span class="text-body text-secondary">{{ $t('hostDashboard.currentBaseSalaryEarned') }}</span>
            <div class="flex items-center gap-4 text-body num font-bold" style="color: #00f2fe;">
              <span style="font-size: 14px;">💎</span>
              <span>{{ formatNumber(hostData.taskProgress.baseSalary) }}</span>
            </div>
          </div>
          <!-- Line 4 -->
          <div class="flex justify-between items-center">
            <span class="text-body text-secondary">{{ $t('hostDashboard.baseSalaryAfterLevelUp') }}</span>
            <div class="flex items-center gap-4 text-body num font-bold" style="color: #00f2fe;">
              <span style="font-size: 14px;">💎</span>
              <span>{{ formatNumber(nextLevelBaseSalary) }}</span>
            </div>
          </div>
        </div>

        <div class="text-caption text-muted"
          style="line-height: 1.5; font-size: 13px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px;">
          {{ $t('hostDashboard.newHostPolicy') }}
        </div>
      </div>
    </div>

    <!-- Mic Task Progress -->
    <div class="task-section px-24" style="margin-top: 24px;">
      <div class="section-header">{{ $t('hostDashboard.micTaskProgress') }}</div>
      <div class="card" style="margin-top: 8px;">
        <div class="flex justify-between items-center mb-16">
          <div class="text-subtitle">{{ $t('common.level') }} {{ hostData.taskProgress.currentLevel }}</div>
          <div class="badge" :class="levelBadgeClass">{{ levelBadgeText }}</div>
        </div>

        <!-- Valid Days -->
        <div class="progress-item">
          <div class="flex justify-between mb-8">
            <span class="text-body text-secondary">{{ $t('hostDashboard.validDays') }}</span>
            <span class="text-body num" :class="daysCompleted ? 'text-success' : ''">
              {{ hostData.taskProgress.validDays.current }}/{{ hostData.taskProgress.validDays.target }}
            </span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" :class="{ completed: daysCompleted }" :style="{ width: daysPercent + '%' }">
            </div>
          </div>
        </div>

        <!-- Valid Hours -->
        <div class="progress-item" style="margin-top: 16px;">
          <div class="flex justify-between mb-8">
            <span class="text-body text-secondary">{{ $t('hostDashboard.validHours') }}</span>
            <span class="text-body num" :class="hoursCompleted ? 'text-success' : ''">
              {{ hostData.taskProgress.validHours.current }}/{{ hostData.taskProgress.validHours.target }}
            </span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" :class="{ completed: hoursCompleted }"
              :style="{ width: hoursPercent + '%' }"></div>
          </div>
        </div>

        <!-- Earnings breakdown -->
        <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 16px; margin-top: 16px;">
          <div class="flex justify-between items-center">
            <span class="text-body text-secondary">{{ $t('hostDashboard.micBonus') }}</span>
            <div class="flex items-center gap-4 text-body num font-bold" style="color: #00f2fe;">
              <span style="font-size: 14px;">💎</span>
              <span>{{ formatNumber(hostData.taskProgress.micBonus) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { hostData, adminData } from '../../mock/data.js'
import { formatNumber, diamondsToUSD, avatarColor, avatarInitials } from '../../utils.js'

const { t } = useI18n({ useScope: 'global' })

const nextLevelData = computed(() => {
  const nextLv = hostData.taskProgress.currentLevel + 1
  return adminData.salaryTiers.find(t => t.level === nextLv)
})

const coinsToNextLevel = computed(() => {
  if (!nextLevelData.value) return 0
  return Math.max(0, nextLevelData.value.coinsReq - hostData.taskProgress.coinsEarned)
})

const nextLevelBaseSalary = computed(() => {
  return nextLevelData.value ? nextLevelData.value.baseSalary : hostData.taskProgress.baseSalary
})

const baseSalaryPercent = computed(() => {
  if (!nextLevelData.value) return 100
  const currentLv = adminData.salaryTiers.find(t => t.level === hostData.taskProgress.currentLevel)
  const currentReq = currentLv ? currentLv.coinsReq : 0
  const targetReq = nextLevelData.value.coinsReq
  const earned = hostData.taskProgress.coinsEarned
  if (earned <= currentReq) return 0
  return Math.min(100, ((earned - currentReq) / (targetReq - currentReq)) * 100)
})

const currentCyclePeriod = computed(() => {
  const d = new Date()
  const y = d.getFullYear()
  const m = d.getMonth()
  const lastDay = new Date(y, m + 1, 0).getDate()
  const monthStr = String(m + 1).padStart(2, '0')
  return `${monthStr}.01 - ${monthStr}.${String(lastDay).padStart(2, '0')}`
})

const router = useRouter()

function goBack() {
  router.push('/')
}

const agencyName = computed(() => hostData.agency?.name || 'Unknown')

const isUnifiedPayout = computed(() => hostData.payoutModel === 'unified')

const daysPercent = computed(() => {
  const { current, target } = hostData.taskProgress.validDays
  return Math.min((current / target) * 100, 100)
})

const hoursPercent = computed(() => {
  const { current, target } = hostData.taskProgress.validHours
  return Math.min((current / target) * 100, 100)
})

const daysCompleted = computed(() => hostData.taskProgress.validDays.current >= hostData.taskProgress.validDays.target)
const hoursCompleted = computed(() => hostData.taskProgress.validHours.current >= hostData.taskProgress.validHours.target)

const levelBadgeClass = computed(() => {
  if (daysCompleted.value && hoursCompleted.value) return 'badge-success'
  return 'badge-primary'
})

const levelBadgeText = computed(() => {
  if (daysCompleted.value && hoursCompleted.value) return t('hostDashboard.completed')
  return t('hostDashboard.inProgress')
})
</script>

<style scoped>
/* Header Bar */
.dash-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 48px 20px 16px;
  background: var(--bg-deep);
}

.header-back,
.header-menu {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border-radius: 50%;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  text-decoration: none;
  flex-shrink: 0;
}

.header-back:active,
.header-menu:active {
  background: var(--primary-light);
}

.header-center {
  text-align: center;
  flex: 1;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.header-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

/* Agency Tag Row */
.agency-tag-row {
  padding-top: 16px;
  padding-bottom: 8px;
}

.agency-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  padding: 6px 12px 6px 6px;
  background: var(--bg-card);
  border-radius: var(--radius-full);
  border: 1px solid var(--border-subtle);
  transition: all 0.2s;
}

.agency-badge:active {
  transform: scale(0.97);
}

.agency-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 2px;
}

.agency-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
}

.agency-id {
  font-size: 11px;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  line-height: 1;
  width: fit-content;
}

.arrow {
  color: var(--text-dim);
  font-size: 18px;
}

/* Balance */
.balance-card {
  padding: 28px 24px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-default);
}

.balance-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.balance-icon {
  font-size: 28px;
}

.unified-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--primary-light);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: 13px;
}

/* Frozen */
.frozen-card {
  padding: 14px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}

.frozen-icon {
  font-size: 18px;
}

/* Base Salary */
.base-salary-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
}

.help-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: bold;
}

/* Earnings */
.earnings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
}

.earning-item {
  text-align: center;
}

/* Bills Link */
.bills-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.bills-link:active {
  transform: scale(0.98);
}

.bills-link .arrow {
  color: var(--primary);
  font-size: 20px;
}
</style>
