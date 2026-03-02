<template>
  <div class="mobile-container">
    <!-- Header -->
    <div class="header-bar">
      <button class="header-back" @click="$router.push('/host/dashboard')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div class="header-center">
        <h1 class="header-title">{{ $t('hostBills.title') }}</h1>
      </div>
      <div style="width: 36px;"></div>
    </div>

    <!-- Tabs -->
    <div class="tabs px-24 mt-8">
      <button class="tab-btn" :class="{ active: activeTab === 'current' }" @click="activeTab = 'current'">
        {{ $t('hostBills.historyCycle') }}
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'details' }" @click="activeTab = 'details'">
        {{ $t('hostBills.details') }}
      </button>
    </div>

    <!-- Tab 1: All Cycle Summaries -->
    <div v-if="activeTab === 'current'" class="px-24 mt-24">
      <div v-for="(cycle, idx) in historyCycles" :key="idx" class="card p-20" style="margin-bottom: 16px;">
        <div class="flex justify-between items-center"
          style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px; margin-bottom: 20px;">
          <span class="text-body font-bold" style="font-size: 15px;">{{ formatCyclePeriod(cycle) }}</span>
          <span v-if="cycle.status !== 'in_progress'" class="badge" :class="cycleStatusClass(cycle.status)" style="font-size: 12px; padding: 3px 10px;">
            {{ cycleStatusLabel(cycle.status) }}
          </span>
        </div>

        <div class="flex justify-between items-center"
          style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 16px; margin-bottom: 20px;">
          <span class="text-body text-secondary">{{ $t('hostBills.finalLevel') }}</span>
          <span class="badge badge-primary" style="font-size: 14px; padding: 4px 12px;">LV.{{ cycle.currentLevel
            }}</span>
        </div>

        <div class="flex justify-between items-center mb-20">
          <span class="text-body text-secondary">{{ $t('hostBills.accumulatedGiftRevenue') }}</span>
          <div class="flex items-center gap-6">
            <img src="../../assets/coinslogo.png" style="width: 14px; height: 14px; object-fit: contain;" alt="coins" />
            <span class="text-body num font-bold">{{ formatNumber(cycle.coinsEarned) }}</span>
          </div>
        </div>

        <div class="flex justify-between items-center mb-20">
          <span class="text-body text-secondary">{{ $t('hostBills.baseSalaryEarned') }}</span>
          <div class="flex items-center gap-4 text-body num font-bold"
            :style="{ color: cycle.baseSalary > 0 ? '#00f2fe' : 'var(--text-muted)' }">
            <span style="font-size: 14px;">💎</span>
            <span>{{ formatNumber(cycle.baseSalary) }}</span>
          </div>
        </div>

        <div class="flex justify-between items-center mb-20">
          <span class="text-body text-secondary">{{ $t('hostBills.micBonusEarned') }}</span>
          <div class="flex items-center gap-4 text-body num font-bold"
            :style="{ color: cycle.micBonus > 0 ? '#00f2fe' : 'var(--text-muted)' }">
            <span style="font-size: 14px;">💎</span>
            <span>{{ formatNumber(cycle.micBonus) }}</span>
          </div>
        </div>

        <div class="flex justify-between items-center mb-20">
          <span class="text-body text-secondary">{{ $t('hostBills.validDays') }}</span>
          <span class="text-body num font-bold"
            :class="{ 'text-danger': cycle.validDays.current < cycle.validDays.target && cycle.status !== 'in_progress' }">{{
              cycle.validDays.current }} / {{ cycle.validDays.target }}</span>
        </div>

        <div class="flex justify-between items-center">
          <span class="text-body text-secondary">{{ $t('hostBills.validHours') }}</span>
          <span class="text-body num font-bold"
            :class="{ 'text-danger': cycle.validHours.current < cycle.validHours.target && cycle.status !== 'in_progress' }">{{
              cycle.validHours.current }} / {{ cycle.validHours.target }}</span>
        </div>
      </div>
    </div>

    <!-- Tab 2: Details List -->
    <div v-if="activeTab === 'details'">
      <div v-if="!hostData.bills.length" class="empty-state">
        <div class="empty-icon">📄</div>
        <p class="text-body text-muted">{{ $t('common.noRecords') }}</p>
      </div>

      <div v-else class="bills-list px-24 mt-24">
        <div v-for="(items, month) in groupedBills" :key="month" class="month-group">
          <div class="month-header">{{ month }}</div>
          <div v-for="bill in items" :key="bill.id" class="bill-item card">
            <div class="flex justify-between items-center">
              <div class="flex-1">
                <div class="text-body" style="font-weight: 600;">{{ bill.label }}</div>
                <div class="text-caption mt-8" style="color: var(--text-muted);">{{ bill.date }}</div>
              </div>
              <div class="text-right">
                <div class="flex items-center justify-end gap-4 text-subtitle num" :class="amountClass(bill)">
                  <span v-if="bill.type === 'gift_income' || bill.type === 'policy_bonus'">
                    <img src="../../assets/coinslogo.png" style="width: 14px; height: 14px; object-fit: contain;"
                      alt="coins" />
                  </span>
                  <span v-else style="font-size: 14px;">💎</span>
                  {{ bill.amount > 0 ? '+' : '' }}{{ formatNumber(bill.amount) }}
                </div>
                <div v-if="bill.status !== 'normal'" class="mt-8">
                  <span class="badge" :class="statusBadgeClass(bill.status)">
                    {{ statusLabel(bill.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="height: 40px;"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { hostData } from '../../mock/data.js'
import { formatNumber, groupBillsByMonth } from '../../utils.js'

const { t } = useI18n({ useScope: 'global' })
const activeTab = ref('current')

const filteredBills = computed(() => {
  return hostData.bills.filter(bill => bill.type !== 'gift_income')
})

const groupedBills = computed(() => groupBillsByMonth(filteredBills.value))

const historyCycles = computed(() => {
  return hostData.cycles.filter(c => c.status !== 'in_progress' && c.status !== 'frozen')
})

function amountClass(bill) {
  if (bill.status === 'refunded') return 'text-danger'
  if (bill.status === 'rejected') return 'text-dim'
  if (bill.amount < 0) return 'text-danger'
  return 'text-success'
}

function statusBadgeClass(status) {
  if (status === 'refunded') return 'badge-danger'
  if (status === 'rejected') return 'badge-muted'
  return ''
}

function statusLabel(status) {
  if (status === 'refunded') return t('hostBills.statusRefunded')
  if (status === 'rejected') return t('hostBills.statusRejected')
  return status
}

function formatCyclePeriod(cycle) {
  const start = new Date(cycle.cycleStart)
  const end = new Date(cycle.cycleEnd)
  const currentYear = new Date().getFullYear()
  const sy = start.getFullYear()
  const sm = String(start.getMonth() + 1).padStart(2, '0')
  const sd = String(start.getDate()).padStart(2, '0')
  const em = String(end.getMonth() + 1).padStart(2, '0')
  const ed = String(end.getDate()).padStart(2, '0')

  if (sy === currentYear) {
    return `${sm}.${sd} - ${em}.${ed}`
  }
  return `${sm}.${sd}.${sy} - ${em}.${ed}.${sy}`
}

function cycleStatusClass(status) {
  if (status === 'in_progress') return 'badge-primary'
  if (status === 'settled') return 'badge-success'
  if (status === 'unmet') return 'badge-warning'
  if (status === 'frozen') return 'badge-danger'
  return ''
}

function cycleStatusLabel(status) {
  if (status === 'in_progress') return t('hostBills.statusInProgress')
  if (status === 'settled') return t('hostBills.statusSettled')
  if (status === 'unmet') return t('hostBills.statusUnmet')
  if (status === 'frozen') return t('hostBills.statusFrozen')
  return status
}
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 48px 20px 16px;
}

.header-back {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 50%;
  color: var(--text-primary);
  cursor: pointer;
}

.header-back:active {
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
}

.empty-icon {
  font-size: 64px;
  opacity: 0.3;
}

.bills-list {
  margin-top: 8px;
}

.month-group {
  margin-bottom: 24px;
}

.month-header {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-secondary);
  padding: 8px 0 12px;
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 12px;
}

.bill-item {
  margin-bottom: 10px;
  padding: 16px;
}

.agency-tag {
  display: inline-flex;
  padding: 4px 10px;
  background: var(--primary-light);
  border-radius: 6px;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.tab-btn {
  background: none;
  border: none;
  padding: 12px 4px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tab-btn.active {
  color: var(--primary);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--primary);
  border-radius: 3px 3px 0 0;
}
</style>
