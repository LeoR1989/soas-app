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
        <h1 class="header-title">{{ $t('frozenBills.title') }}</h1>
      </div>
      <div style="width: 36px;"></div>
    </div>

    <!-- Total Frozen Amount -->
    <div class="frozen-summary px-24">
      <div class="text-caption text-secondary">{{ $t('frozenBills.totalFrozenDiamonds') }}</div>
      <div class="text-hero num mt-8" style="color: var(--text-primary);">{{ formatNumber(totalFrozen) }}</div>
      <div class="text-caption text-muted mt-8">{{ $t('frozenBills.frozenDesc') }}</div>
    </div>

    <!-- Empty State -->
    <div v-if="frozenBills.length === 0" class="empty-state">
      <div class="empty-icon">🔒</div>
      <p class="text-body text-muted">{{ $t('frozenBills.noFrozenRecords') }}</p>
    </div>

    <!-- Frozen Bill List -->
    <div v-else class="bills-list px-24">
      <div v-for="bill in frozenBills" :key="bill.id" class="bill-item card">
        <div class="flex justify-between items-center">
          <div class="flex-1">
            <div class="text-body" style="font-weight: 600;">{{ bill.label }}</div>
            <div class="text-caption mt-8">{{ bill.date }}</div>
          </div>
          <div class="text-right">
            <div class="text-subtitle num text-warning">
              {{ formatNumber(bill.amount) }} 💎
            </div>
          </div>
        </div>

        <!-- Details box -->
        <div class="mt-16 bg-muted" style="border-radius: 8px; padding: 16px;">
          <div class="flex justify-between items-center">
            <span class="text-caption text-secondary">{{ $t('frozenBills.expectedUnfreezeTime') }}</span>
            <span class="text-caption num" style="font-weight: 600;">{{ bill.unfreezeDate }}</span>
          </div>
        </div>
      </div>
    </div>

    <div style="height: 40px;"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { hostData } from '../../mock/data.js'
import { formatNumber } from '../../utils.js'

const totalFrozen = computed(() => hostData.balance.frozen)

const frozenBills = computed(() => {
  return [
    {
      id: 'FB-90021',
      label: 'Large Gift Review (L6)',
      amount: 45000,
      date: '2026-02-20',
      unfreezeDate: '2026-02-23',
      reason: 'High-value transaction security hold.'
    },
    {
      id: 'FB-90018',
      label: 'New User Gift Alert',
      amount: 38200,
      date: '2026-02-18',
      unfreezeDate: '2026-02-25',
      reason: 'Gifts from highly suspicious new accounts.'
    }
  ]
})
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

.frozen-summary {
  padding-top: 16px;
  padding-bottom: 24px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
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
  margin-bottom: 12px;
  padding: 16px;
}

.bg-muted {
  background: var(--bg-deep);
}
</style>
