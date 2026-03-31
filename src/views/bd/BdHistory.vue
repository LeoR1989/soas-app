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
      <button class="tab-btn" :class="{ active: activeTab === 'withdraw' }" @click="activeTab = 'withdraw'">{{ $t('hostBills.withdrawRecords') || '提现记录' }}</button>
    </div>

    <!-- Tab 1: Cycle Settlements -->
    <div v-if="activeTab === 'cycles'" class="px-24 mt-24">
      <div v-for="(cycle, idx) in historyCycles" :key="idx" class="card p-20" style="margin-bottom: 16px;">
        <!-- Header: Period + Status -->
        <div class="flex justify-between items-center" style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px; margin-bottom: 16px;">
          <span class="text-body font-bold" style="font-size: 15px;">{{ formatCyclePeriod(cycle) }}</span>
          <span class="badge badge-primary" style="font-size: 14px; padding: 4px 12px;">L{{ cycle.level }}</span>
        </div>

        <!-- Row: 有效公会 -->
        <div class="flex justify-between items-center mb-12">
          <span class="text-body text-secondary">{{ $t('bd.validGuilds') }}</span>
          <span class="text-body num" style="font-weight: 600;">{{ cycle.validGuilds }}</span>
        </div>

        <!-- Row: 团队总流水 -->
        <div class="flex justify-between items-center" style="margin-bottom: 24px;">
          <span class="text-body text-secondary">{{ $t('bd.teamRevenue') }}</span>
          <div class="flex items-center gap-4 text-body num" style="font-weight: 600; color: var(--primary);">
            <span style="font-size: 14px;">💎</span>
            <span>{{ formatNumber(cycle.teamRevenue) }}</span>
          </div>
        </div>

        <!-- Row: 薪资 -->
        <div class="flex justify-between items-center mb-4" style="border-top: 1px solid var(--border-subtle); padding-top: 12px;">
          <span class="text-body" style="font-weight: 700;">{{ $t('bd.salary') }}</span>
          <div class="flex items-center gap-4 text-body num" style="font-weight: 700; color: var(--primary);">
            <span style="font-size: 14px;">💎</span>
            <span>{{ formatNumber(cycle.salary) }}</span>
          </div>
        </div>

      </div>
    </div>

    <!-- Tab 2: Details (Flat, no month grouping) -->
    <div v-if="activeTab === 'details'">
      <div v-if="!bdData.bills.length" class="empty-state">
        <div class="empty-icon">📄</div>
        <p class="text-body text-muted">{{ $t('bd.noRecords') }}</p>
      </div>
      <div v-else class="bills-list px-24 mt-24">
        <div v-for="bill in bdData.bills" :key="bill.id" class="bill-item card">
          <div class="flex justify-between items-center">
            <div class="flex-1">
              <div class="text-body" style="font-weight: 600;">{{ billTitle(bill) }}</div>
              <div v-if="billSubtitle(bill)" class="text-caption mt-8" style="color: var(--text-secondary); font-size: 12px;">
                {{ billSubtitle(bill) }}
              </div>
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

    <!-- Tab 3: Withdraw Records (Flat, full detail like HostBills) -->
    <div v-if="activeTab === 'withdraw'">
      <div v-if="!bdData.withdrawRecords.length" class="empty-state">
        <div class="empty-icon">💸</div>
        <p class="text-body text-muted">{{ $t('bd.noRecords') }}</p>
      </div>
      <div v-else class="bills-list px-24 mt-24">
        <div v-for="record in bdData.withdrawRecords" :key="record.id" class="withdraw-item card">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-8 mb-8">
                <span class="text-body font-bold">{{ $t('hostBills.withdrawAmountLabel') || '提现金额' }} {{ record.amount.toFixed(2) }} USD</span>
                <span class="badge" :class="record.subStatus ? subStatusBadgeClass(record.subStatus) : withdrawStatusBadgeClass(record.status)">
                  {{ record.subStatus ? subStatusLabel(record.subStatus) : withdrawStatusLabel(record.status) }}
                </span>
              </div>
              <div v-if="record.status === 'SUCCESS' && record.localAmount" class="text-caption text-success" style="margin-bottom: 4px;">
                {{ $t('hostBills.localAmountLabel') || '本地到账' }} {{ record.localAmount.toLocaleString() }} {{ record.localCurrency }}
              </div>
              <div v-else-if="record.status === 'FAILED' || record.status === 'BOUNCEBACK'" class="text-caption text-warning" style="margin-bottom: 4px;">
                {{ $t('hostBills.localAmountRefunded') || '已退还' }}
              </div>
              <div v-else class="text-caption text-muted" style="margin-bottom: 4px;">
                {{ $t('hostBills.localAmountPending') || '处理中...' }}
              </div>
              <div v-if="record.orderNo" class="text-caption text-secondary" style="margin-bottom: 4px;">
                {{ $t('hostBills.withdrawOrderNo') || '订单号' }}: {{ record.orderNo }}
              </div>
              <div class="text-caption text-secondary" style="margin-bottom: 4px;">
                {{ $t('hostBills.account') || '账号' }}: {{ record.accountNo }} | {{ $t('hostBills.paymentMethodLabel') || '收款方式' }}: {{ record.paymentMethod }}
              </div>
              <div class="text-caption text-muted" style="margin-bottom: 4px;">
                💎 {{ $t('hostBills.diamondsDeducted') || '扣除钻石' }}: {{ record.diamondsDeducted.toLocaleString() }} | {{ $t('hostBills.fee') || '手续费' }}: {{ record.status === 'SUCCESS' ? record.fee.toFixed(2) + ' USD' : ($t('hostWithdraw.feeCalculating') || '计算中...') }} | {{ $t('hostBills.tax') || '税费' }}: {{ record.status === 'SUCCESS' ? record.tax.toFixed(2) + ' ' + (record.localCurrency || 'EGP') : ($t('hostWithdraw.feeCalculating') || '计算中...') }}
              </div>
              <div class="text-caption text-muted">
                {{ $t('hostBills.completedTime') || '时间' }}: {{ record.createdAt.replace('T', ' ') }}
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
import { formatNumber } from '../../utils.js'

const { t } = useI18n()
const activeTab = ref('cycles')
const historyCycles = computed(() => bdData.cycles.filter(c => c.status !== 'in_progress'))

function formatCyclePeriod(cycle) {
  const start = new Date(cycle.cycleStart)
  const end = new Date(cycle.cycleEnd)
  const sm = String(start.getMonth() + 1).padStart(2, '0')
  const sd = String(start.getDate()).padStart(2, '0')
  const em = String(end.getMonth() + 1).padStart(2, '0')
  const ed = String(end.getDate()).padStart(2, '0')
  return `${sm}.${sd} - ${em}.${ed}`
}

function cycleStatusClass(s) { return s === 'settled' ? 'badge-success' : s === 'unmet' ? 'badge-warning' : '' }
function cycleStatusLabel(s) { return s === 'settled' ? t('bd.settled') : s === 'unmet' ? t('bd.unmet') : t('bd.inProgress') }

function withdrawStatusBadgeClass(s) {
  if (s === 'SUCCESS') return 'badge-success'
  if (s === 'PENDING') return 'badge-primary'
  if (s === 'FAILED') return 'badge-danger'
  if (s === 'BOUNCEBACK') return 'badge-warning'
  return 'badge-muted'
}

function withdrawStatusLabel(s) {
  if (s === 'SUCCESS') return t('hostBills.withdrawSuccess') || 'Success'
  if (s === 'PENDING') return t('hostBills.withdrawPending') || 'Pending'
  if (s === 'FAILED') return t('hostBills.withdrawFailed') || 'Failed'
  if (s === 'BOUNCEBACK') return t('hostBills.withdrawBounceback') || 'Bounced'
  return s
}

function subStatusBadgeClass(s) {
  if (s === 'PEND_RFI_MATERIAL') return 'badge-warning'
  if (s === 'REVIEW') return 'badge-primary'
  if (s === 'TRANSMIT') return 'badge-info'
  return 'badge-muted'
}

function subStatusLabel(s) {
  if (s === 'PEND_RFI_MATERIAL') return t('hostBills.subStatusMaterial') || 'Wait Material'
  if (s === 'REVIEW') return t('hostBills.subStatusReview') || 'Under Review'
  if (s === 'TRANSMIT') return t('hostBills.subStatusTransmit') || 'Transmitting'
  return s
}

function billTitle(bill) {
  if (bill.type === 'system_grant') return t('bills.systemGrant')
  if (bill.type === 'system_deduct') return t('bills.systemDeduct')
  if (bill.type === 'diamond_exchange') return t('bills.diamondExchange')
  if (bill.type === 'diamond_withdraw') return t('bills.diamondWithdraw')
  if (bill.type === 'task_salary') return t('bills.taskSalary') + (bill.taskLevel ? ` (${bill.taskLevel})` : '')
  return bill.label
}

function billSubtitle(bill) {
  if (bill.type === 'diamond_exchange') return t('bills.exchangeCoins') + ': ' + bill.subtitle
  if (bill.type === 'diamond_withdraw') return t('bills.orderNo') + ': ' + bill.subtitle
  return null
}
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 48px 20px 16px;
  border-bottom: 1px solid var(--border-subtle);
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
  margin: 0;
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

.bill-item {
  margin-bottom: 10px;
  padding: 16px;
}

.withdraw-item {
  margin-bottom: 10px;
  padding: 16px;
}

.badge-info {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
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
