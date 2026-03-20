<template>
  <div class="mobile-container min-h-screen bg-body pb-safe">
    <!-- Header -->
    <div class="header-bar bg-card sticky top-0 z-10 blur-bg">
      <button class="header-back" @click="$router.push('/bd')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <div class="header-center">
        <h1 class="header-title">{{ $t('bd.bills') }}</h1>
      </div>
      <div style="width: 36px;"></div>
    </div>

    <!-- Tabs -->
    <div class="tabs px-24 mt-8">
      <button class="tab-btn" :class="{ active: activeTab === 'cycles' }" @click="activeTab = 'cycles'">{{ $t('bd.cycles') }}</button>
      <button class="tab-btn" :class="{ active: activeTab === 'details' }" @click="activeTab = 'details'">{{ $t('bd.details') }}</button>
      <button class="tab-btn" :class="{ active: activeTab === 'withdraw' }" @click="activeTab = 'withdraw'">{{ $t('bd.withdrawals') }}</button>
    </div>

    <!-- Tab 1: Cycle Settlements -->
    <div v-if="activeTab === 'cycles'" class="px-24 mt-24">
      <div v-for="(cycle, idx) in historyCycles" :key="idx" class="card p-20" style="margin-bottom: 16px;">
        <div class="flex justify-between items-center" style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px; margin-bottom: 20px;">
          <span class="text-body font-bold" style="font-size: 15px;">{{ cycle.month }}</span>
          <span class="badge" :class="cycleStatusClass(cycle.status)">{{ cycleStatusLabel(cycle.status) }}</span>
        </div>
        <div class="flex justify-between items-center mb-20">
          <span class="text-body text-secondary">{{ $t('bd.level') }}</span>
          <span class="badge badge-primary" style="font-size: 14px; padding: 4px 12px;">L{{ cycle.level }}</span>
        </div>
        <div class="flex gap-12 mb-16">
          <div class="flex-1" style="background: var(--bg-input); padding: 12px 16px; border-radius: 10px;">
            <div class="text-caption text-secondary mb-4">{{ $t('bd.validGuilds') }}</div>
            <div class="text-body num" style="font-weight: 600;">🏢 {{ cycle.validGuilds }} / {{ cycle.totalGuilds }}</div>
          </div>
          <div class="flex-1" style="background: var(--bg-input); padding: 12px 16px; border-radius: 10px;">
            <div class="text-caption text-secondary mb-4">{{ $t('bd.teamRevenue') }}</div>
            <div class="text-body num" style="font-weight: 600;">💎 {{ formatNumber(cycle.teamRevenue) }}</div>
          </div>
        </div>
        <div class="flex justify-between items-center" style="border-top: 1px solid var(--border-subtle); padding-top: 12px;">
          <span class="text-body" style="font-weight: 700;">{{ $t('bd.salary') }}</span>
          <div class="flex items-center gap-4 text-body num" style="font-weight: 700; color: var(--primary);">
            <span style="font-size: 14px;">💎</span>
            <span>{{ formatNumber(cycle.salary) }}</span>
          </div>
        </div>
        <div class="flex justify-between items-center py-4">
          <span class="text-caption text-secondary">≈ USD</span>
          <span class="text-caption num text-success" style="font-weight: 600;">${{ (cycle.salary / 8300).toFixed(0) }}</span>
        </div>
      </div>
    </div>

    <!-- Tab 2: Details -->
    <div v-if="activeTab === 'details'">
      <div v-if="!bdData.bills.length" class="empty-state">
        <div class="empty-icon">📄</div>
        <p class="text-body text-muted">{{ $t('bd.noRecords') }}</p>
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
                <div class="flex items-center justify-end gap-4 text-subtitle num" :class="bill.amount < 0 ? 'text-danger' : 'text-success'">
                  <span style="font-size: 14px;">💎</span>
                  {{ bill.amount > 0 ? '+' : '' }}{{ formatNumber(bill.amount) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Withdraw Records -->
    <div v-if="activeTab === 'withdraw'">
      <div v-if="!bdData.withdrawRecords.length" class="empty-state">
        <div class="empty-icon">💸</div>
        <p class="text-body text-muted">{{ $t('bd.noRecords') }}</p>
      </div>
      <div v-else class="bills-list px-24 mt-24">
        <div v-for="(items, month) in groupedWithdraws" :key="month" class="month-group">
          <div class="month-header">{{ month }}</div>
          <div v-for="record in items" :key="record.id" class="withdraw-item card">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-8 mb-8">
                  <span class="text-body font-bold">{{ record.amount.toFixed(2) }} USD</span>
                  <span class="badge" :class="withdrawStatusBadgeClass(record.status)">{{ withdrawStatusLabel(record.status) }}</span>
                </div>
                <div class="text-caption text-secondary" style="margin-bottom: 4px;">{{ $t('bd.orderNo') }}: {{ record.orderNo }}</div>
                <div class="text-caption text-secondary" style="margin-bottom: 4px;">{{ $t('bd.account') }}: {{ record.accountNo }} | {{ record.paymentMethod }}</div>
                <div class="text-caption text-muted">💎 {{ $t('bd.deducted') }}: {{ record.diamondsDeducted.toLocaleString() }} | {{ $t('bd.fee') }}: {{ record.fee.toFixed(2) }} USD | {{ record.createdAt }}</div>
                <div v-if="record.subStatus" class="mt-8">
                  <span class="badge" :class="subStatusBadgeClass(record.subStatus)">{{ subStatusLabel(record.subStatus) }}</span>
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
import { bdData } from '../../mock/data.js'
import { formatNumber, groupBillsByMonth } from '../../utils.js'

const { t } = useI18n()
const activeTab = ref('cycles')
const historyCycles = computed(() => bdData.cycles.filter(c => c.status !== 'in_progress'))
const groupedBills = computed(() => groupBillsByMonth(bdData.bills || []))
const groupedWithdraws = computed(() => {
  const groups = {}
  bdData.withdrawRecords.forEach(r => { if (!groups[r.month]) groups[r.month] = []; groups[r.month].push(r) })
  return groups
})

function cycleStatusClass(s) { return s === 'settled' ? 'badge-success' : s === 'unmet' ? 'badge-warning' : '' }
function cycleStatusLabel(s) { return s === 'settled' ? t('bd.settled') : s === 'unmet' ? t('bd.unmet') : t('bd.inProgress') }
function withdrawStatusBadgeClass(s) { return s === 'SUCCESS' ? 'badge-success' : s === 'PENDING' ? 'badge-primary' : s === 'FAILED' ? 'badge-danger' : 'badge-muted' }
function withdrawStatusLabel(s) { return s === 'SUCCESS' ? t('bd.success') : s === 'PENDING' ? t('bd.pending') : s === 'FAILED' ? t('bd.failed') : s }
function subStatusBadgeClass(s) { return s === 'REVIEW' ? 'badge-primary' : s === 'TRANSMIT' ? 'badge-info' : 'badge-muted' }
function subStatusLabel(s) { return s === 'REVIEW' ? t('bd.underReview') : s === 'TRANSMIT' ? t('bd.transmitting') : s }
</script>

<style scoped>
.header-bar { display: flex; align-items: center; justify-content: space-between; padding: 48px 20px 16px; border-bottom: 1px solid var(--border-subtle); }
.header-back { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: none; border: none; border-radius: 50%; color: var(--text-primary); cursor: pointer; }
.header-center { text-align: center; flex: 1; }
.header-title { font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; gap: 16px; }
.empty-icon { font-size: 64px; opacity: 0.3; }
.bills-list { margin-top: 8px; }
.month-group { margin-bottom: 24px; }
.month-header { font-size: 15px; font-weight: 700; color: var(--text-secondary); padding: 8px 0 12px; border-bottom: 1px solid var(--border-subtle); margin-bottom: 12px; }
.bill-item { margin-bottom: 10px; padding: 16px; }
.withdraw-item { margin-bottom: 10px; padding: 16px; }
.badge-info { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.tabs { display: flex; gap: 12px; border-bottom: 1px solid var(--border-subtle); }
.tab-btn { background: none; border: none; padding: 12px 4px; font-size: 15px; font-weight: 600; color: var(--text-muted); cursor: pointer; position: relative; transition: color 0.2s; }
.tab-btn.active { color: var(--primary); }
.tab-btn.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 3px; background: var(--primary); border-radius: 3px 3px 0 0; }
</style>
