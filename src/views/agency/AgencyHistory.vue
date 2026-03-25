<template>
  <div class="mobile-container min-h-screen bg-body pb-safe">
    <!-- Header -->
    <div class="header-bar bg-card sticky top-0 z-10 blur-bg">
      <button class="header-back" @click="$router.push('/agency')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <div class="header-center">
        <h1 class="header-title">{{ $t('agencyBills.title') || 'Agency Bills' }}</h1>
      </div>
      <div style="width: 36px;"></div>
    </div>

    <!-- Tabs -->
    <div class="tabs px-24 mt-8">
      <button class="tab-btn" :class="{ active: activeTab === 'current' }" @click="activeTab = 'current'">
        {{ $t('agencyBills.historyCycle') || 'History Cycles' }}
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'details' }" @click="activeTab = 'details'">
        {{ $t('agencyBills.details') || 'Details' }}
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'withdraw' }" @click="activeTab = 'withdraw'">
        {{ $t('agencyBills.withdraw') || 'Withdrawals' }}
      </button>
    </div>

    <!-- Tab 1: All Cycle Summaries -->
    <div v-if="activeTab === 'current'" class="px-24 mt-24">
      <div v-if="!agencyData.historyCycles || !agencyData.historyCycles.length" class="empty-state">
        <div class="empty-icon">📄</div>
        <p class="text-body text-muted">{{ $t('common.noData') || 'No historical data' }}</p>
      </div>
      <div v-else class="flex flex-col gap-16">
        <div v-for="(cycle, idx) in agencyData.historyCycles" :key="idx" class="card" style="padding: 20px;">
            <div class="flex justify-between items-start mb-16" style="padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
                <h3 class="text-subtitle m-0">{{ cycle.month }}</h3>
            </div>

            <div class="mb-16">
                <div class="text-caption text-secondary mb-8">{{ $t('agencyDashboard.totalDiamonds') || 'Total Diamonds' }}</div>
                <div class="text-body num" style="font-weight: 600; color: var(--primary); font-size: 20px;">💎 {{ formatNumber(cycle.totalDiamonds) }}</div>
            </div>

            <!-- Host & Agency Income -->
            <div class="flex gap-12 mb-16">
                <div class="flex-1" style="background: var(--bg-input); padding: 12px 16px; border-radius: 10px;">
                    <div class="text-caption text-secondary mb-4">{{ $t('agencyDashboard.hostIncome') || 'Host Income' }}</div>
                    <div class="text-body num" style="font-weight: 600; color: var(--success);">💎 {{ formatNumber(cycle.hostDiamonds || 0) }}</div>
                </div>
                <div class="flex-1" style="background: var(--bg-input); padding: 12px 16px; border-radius: 10px;">
                    <div class="text-caption text-secondary mb-4">{{ $t('agencyDashboard.agencyIncome') || 'Agency Income' }}</div>
                    <div class="text-body num" style="font-weight: 600; color: var(--warning);">💎 {{ formatNumber(cycle.agencyDiamonds || 0) }}</div>
                </div>
            </div>

            <div class="flex justify-between items-center" style="background: var(--bg-input); padding: 16px; border-radius: 12px;">
                <div>
                    <div class="text-caption text-secondary mb-4">{{ $t('agencyDashboard.activeHosts') || 'Active Hosts' }}</div>
                    <div class="text-body num" style="font-weight: 600;">👤 {{ cycle.activeHosts }} / {{ cycle.totalHosts }}</div>
                </div>
                <div class="text-right">
                    <div class="text-caption text-secondary mb-4">{{ $t('agencyDashboard.totalOnlineHours') || 'Online Hours' }}</div>
                    <div class="text-body num" style="font-weight: 600;">⏳ {{ cycle.totalHours }}</div>
                </div>
            </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Details List -->
    <div v-if="activeTab === 'details'">
      <div v-if="!agencyData.bills || !agencyData.bills.length" class="empty-state">
        <div class="empty-icon">📄</div>
        <p class="text-body text-muted">{{ $t('common.noRecords') || 'No records' }}</p>
      </div>

      <div v-else class="bills-list px-24 mt-24">
        <div v-for="(items, month) in groupedBills" :key="month" class="month-group">
          <div class="month-header">{{ month }}</div>
          <div v-for="bill in items" :key="bill.id" class="bill-item card">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="text-body" style="font-weight: 600;">
                  {{ billTitle(bill) }}
                </div>
                
                <!-- Subtitle (exchange coins / withdraw order) -->
                <div v-if="billSubtitle(bill)" class="text-caption mt-8" style="color: var(--text-secondary); font-size: 12px;">
                  {{ billSubtitle(bill) }}
                </div>

                <!-- Host Profile Row (for task_salary) -->
                <div v-if="bill.host" class="flex items-center gap-8 mt-12 mb-4" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px;">
                  <img :src="bill.host.avatar" :alt="bill.host.nickname" class="avatar avatar-sm outline-avatar" style="width: 24px; height: 24px;" />
                  <div class="flex flex-col gap-2">
                    <span class="text-body" style="font-size: 13px; font-weight: 500;">{{ bill.host.nickname }}</span>
                    <span class="text-caption text-secondary" style="font-size: 11px;">ID: {{ bill.host.id }}</span>
                  </div>
                </div>

                <div class="text-caption mt-8" style="color: var(--text-muted);">{{ bill.date }}</div>
              </div>
              <div class="text-right pl-12">
                <div class="flex items-center justify-end gap-4 text-subtitle num" :class="amountClass(bill)">
                  <span style="font-size: 14px;">💎</span>
                  {{ bill.amount > 0 ? '+' : (bill.amount < 0 ? '-' : '') }}{{ formatNumber(Math.abs(bill.amount)) }}
                </div>
                <div v-if="bill.status !== 'normal' && bill.status !== 'rejected'" class="mt-8">
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

    <!-- Tab 3: Withdraw Records -->
    <div v-if="activeTab === 'withdraw'">
      <div v-if="!agencyData.withdrawRecords || !agencyData.withdrawRecords.length" class="empty-state">
        <div class="empty-icon">💸</div>
        <p class="text-body text-muted">{{ $t('common.noRecords') || 'No records' }}</p>
      </div>

      <div v-else class="bills-list px-24 mt-24">
        <div v-for="(items, month) in groupedWithdraws" :key="month" class="month-group">
          <div class="month-header">{{ month }}</div>
          <div v-for="record in items" :key="record.id" class="withdraw-item card">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-8 mb-8">
                  <span class="text-body font-bold">{{ $t('hostBills.withdrawAmountLabel') }} {{ record.amount.toFixed(2) }} USD</span>
                  <span class="badge" :class="record.subStatus ? subStatusBadgeClass(record.subStatus) : withdrawStatusBadgeClass(record.status)">
                    {{ record.subStatus ? subStatusLabel(record.subStatus) : withdrawStatusLabel(record.status) }}
                  </span>
                </div>
                <div v-if="record.status === 'SUCCESS' && record.localAmount" class="text-caption text-success" style="margin-bottom: 4px;">
                  {{ $t('hostBills.localAmountLabel') }} {{ record.localAmount.toLocaleString() }} {{ record.localCurrency }}
                </div>
                <div v-else-if="record.status === 'FAILED' || record.status === 'BOUNCEBACK'" class="text-caption text-warning" style="margin-bottom: 4px;">
                  {{ $t('hostBills.localAmountRefunded') }}
                </div>
                <div v-else class="text-caption text-muted" style="margin-bottom: 4px;">
                  {{ $t('hostBills.localAmountPending') }}
                </div>
                <div v-if="record.orderNo" class="text-caption text-secondary" style="margin-bottom: 4px;">
                  {{ $t('agencyBills.withdrawOrderNo') || 'Order No' }}: {{ record.orderNo }}
                </div>
                <div class="text-caption text-secondary" style="margin-bottom: 4px;">
                  {{ $t('agencyBills.withdrawAccount') || 'Account' }}: {{ record.accountNo }} | {{ $t('agencyBills.withdrawMethod') || 'Payment Method' }}: {{ record.paymentMethod }}
                </div>
                <div class="text-caption text-muted" style="margin-bottom: 4px;">
                  💎 {{ $t('agencyBills.diamondsDeducted') || 'Diamonds Deducted' }}: {{ record.diamondsDeducted.toLocaleString() }} | {{ $t('hostBills.fee') }}: {{ record.status === 'SUCCESS' ? record.fee.toFixed(2) + ' USD' : $t('hostWithdraw.feeCalculating') }} | {{ $t('hostBills.tax') }}: {{ record.status === 'SUCCESS' ? record.tax.toFixed(2) + ' ' + (record.localCurrency || 'EGP') : $t('hostWithdraw.feeCalculating') }}
                </div>
                <div class="text-caption text-muted">
                  {{ $t('hostBills.completedTime') }}: {{ record.createdAt.replace('T', ' ') }}
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
import { agencyData } from '../../mock/data.js'
import { formatNumber, groupBillsByMonth } from '../../utils.js'

const { t } = useI18n({ useScope: 'global' })
const activeTab = ref('current')

const groupedBills = computed(() => {
    return groupBillsByMonth(agencyData.bills || [])
})

// 按月份分组提现记录
const groupedWithdraws = computed(() => {
  const groups = {}
  if (!agencyData.withdrawRecords) return groups
  agencyData.withdrawRecords.forEach(record => {
    const month = record.month
    if (!groups[month]) {
      groups[month] = []
    }
    groups[month].push(record)
  })
  return groups
})

// 提现状态标签样式
function withdrawStatusBadgeClass(status) {
  if (status === 'SUCCESS') return 'badge-success'
  if (status === 'PENDING') return 'badge-primary'
  if (status === 'FAILED') return 'badge-danger'
  if (status === 'BOUNCEBACK') return 'badge-warning'
  return 'badge-muted'
}

// 提现状态标签文字
function withdrawStatusLabel(status) {
  if (status === 'SUCCESS') return t('hostBills.withdrawSuccess') || 'Success'
  if (status === 'PENDING') return t('hostBills.withdrawPending') || 'Pending'
  if (status === 'FAILED') return t('hostBills.withdrawFailed') || 'Failed'
  if (status === 'BOUNCEBACK') return t('hostBills.withdrawBounceback') || 'Bounceback'
  return status
}

// 子状态标签样式
function subStatusBadgeClass(subStatus) {
  if (subStatus === 'PEND_RFI_MATERIAL') return 'badge-warning'
  if (subStatus === 'REVIEW') return 'badge-primary'
  if (subStatus === 'TRANSMIT') return 'badge-info'
  return 'badge-muted'
}

// 子状态标签文字
function subStatusLabel(subStatus) {
  if (subStatus === 'PEND_RFI_MATERIAL') return t('hostBills.subStatusMaterial') || 'Wait Material'
  if (subStatus === 'REVIEW') return t('hostBills.subStatusReview') || 'Under Review'
  if (subStatus === 'TRANSMIT') return t('hostBills.subStatusTransmit') || 'Transmitting'
  return subStatus
}

function billTitle(bill) {
  if (bill.type === 'system_grant') return t('bills.systemGrant')
  if (bill.type === 'system_deduct') return t('bills.systemDeduct')
  if (bill.type === 'diamond_exchange') return t('bills.diamondExchange')
  if (bill.type === 'diamond_withdraw') return t('bills.diamondWithdraw')
  if (bill.type === 'task_salary') return t('bills.taskSalary')
  return bill.label
}

function billSubtitle(bill) {
  if (bill.type === 'diamond_exchange') return t('bills.exchangeCoins') + ': ' + bill.subtitle
  if (bill.type === 'diamond_withdraw') return t('bills.orderNo') + ': ' + bill.subtitle
  return null
}

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
  if (status === 'refunded') return t('hostBills.statusRefunded') || 'Refunded'
  if (status === 'rejected') return t('hostBills.statusRejected') || 'Rejected'
  return status
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

.withdraw-item {
  margin-bottom: 10px;
  padding: 16px;
}

/* 提现状态颜色 */
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
