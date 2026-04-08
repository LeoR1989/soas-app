<template>
  <div class="mobile-container">
    <!-- Header -->
    <div class="header-bar">
      <button class="header-back" @click="$router.push('/host/diamond-wallet')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div class="header-center">
        <h1 class="header-title">{{ $t('diamondBills.title') }}</h1>
      </div>
      <div style="width: 36px;"></div>
    </div>

    <!-- Tabs -->
    <div class="tabs px-24 mt-8">
      <button class="tab-btn" :class="{ active: activeTab === 'details' }" @click="activeTab = 'details'">
        {{ $t('hostBills.details') }}
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'withdraw' }" @click="activeTab = 'withdraw'">
        {{ $t('hostBills.withdrawRecords') || '提现记录' }}
      </button>
    </div>

    <!-- Tab 1: Details List -->
    <div v-if="activeTab === 'details'">
      <div v-if="!hostData.bills.length" class="empty-state">
        <div class="empty-icon">📄</div>
        <p class="text-body text-muted">{{ $t('common.noRecords') }}</p>
      </div>

      <div v-else class="bills-list px-24 mt-24">
          <div v-for="bill in hostData.bills" :key="bill.id" class="bill-item card">
            <div class="flex justify-between items-center">
              <div class="flex-1">
                <div class="text-body" style="font-weight: 600;">
                  {{ billTitle(bill) }}
                </div>
                <div v-if="billSubtitle(bill)" class="text-caption mt-8" style="color: var(--text-secondary); font-size: 12px;">
                  {{ billSubtitle(bill) }}
                </div>
                <div class="text-caption mt-8" style="color: var(--text-muted);">{{ bill.date }}</div>
              </div>
              <div class="text-right">
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

    <!-- Tab 2: Withdraw Records -->
    <div v-if="activeTab === 'withdraw'">
      <div v-if="!hostData.withdrawRecords.length" class="empty-state">
        <div class="empty-icon">💸</div>
        <p class="text-body text-muted">{{ $t('common.noRecords') }}</p>
      </div>

      <div v-else class="bills-list px-24 mt-24">
          <div v-for="record in hostData.withdrawRecords" :key="record.id" class="withdraw-item card">
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
                  {{ $t('hostBills.withdrawOrderNo') }}: {{ record.orderNo }}
                </div>
                <div class="text-caption text-secondary" style="margin-bottom: 4px;">
                  {{ $t('hostBills.account') }}: {{ record.accountNo }} | {{ $t('hostBills.paymentMethodLabel') }}: {{ record.paymentMethod }}
                </div>
                <div class="text-caption text-muted" style="margin-bottom: 4px;">
                  💎 {{ $t('hostBills.diamondsDeducted') }}: {{ record.diamondsDeducted.toLocaleString() }} | {{ $t('hostBills.fee') }}: {{ record.status === 'SUCCESS' ? record.fee.toFixed(2) + ' USD' : $t('hostWithdraw.feeCalculating') }} | {{ $t('hostBills.tax') }}: {{ record.status === 'SUCCESS' ? record.tax.toFixed(2) + ' ' + (record.localCurrency || 'EGP') : $t('hostWithdraw.feeCalculating') }}
                </div>
                <div class="text-caption text-muted">
                  {{ $t('hostBills.completedTime') }}: {{ record.createdAt.replace('T', ' ') }}
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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { hostData } from '../../mock/data.js'
import { formatNumber } from '../../utils.js'

const { t } = useI18n({ useScope: 'global' })
const activeTab = ref('details')

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
  if (status === 'SUCCESS') return t('hostBills.withdrawSuccess')
  if (status === 'PENDING') return t('hostBills.withdrawPending')
  if (status === 'FAILED') return t('hostBills.withdrawFailed')
  if (status === 'BOUNCEBACK') return t('hostBills.withdrawBounceback')
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
  if (subStatus === 'PEND_RFI_MATERIAL') return t('hostBills.subStatusMaterial')
  if (subStatus === 'REVIEW') return t('hostBills.subStatusReview')
  if (subStatus === 'TRANSMIT') return t('hostBills.subStatusTransmit')
  return subStatus
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
  if (status === 'refunded') return t('hostBills.statusRefunded')
  if (status === 'rejected') return t('hostBills.statusRejected')
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
