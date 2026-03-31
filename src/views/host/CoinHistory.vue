<template>
  <div class="coin-history-page">
    <!-- Header with Tabs -->
    <div class="ch-header">
      <button class="ch-back" @click="$router.back()">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div class="ch-header-tabs">
        <button class="ch-tab-btn" :class="{ active: activeTab === 'coins' }" @click="activeTab = 'coins'">
          {{ $t('coinHistory.tabCoins') }}
        </button>
        <button class="ch-tab-btn" :class="{ active: activeTab === 'gifts' }" @click="activeTab = 'gifts'">
          {{ $t('coinHistory.tabGifts') }}
        </button>
      </div>
      <div style="width: 36px;"></div>
    </div>

    <!-- Filters (Only for coins tab) -->
    <div class="ch-filters" v-if="activeTab === 'coins'">
      <div class="ch-filter-select" @click="showTypeMenu = !showTypeMenu">
        <span>{{ currentTypeLabel }}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="m6 9 6 6 6-6" />
        </svg>
        <Transition name="fade">
          <div v-if="showTypeMenu" class="ch-dropdown" @click.stop>
            <div v-for="opt in typeOptions" :key="opt.value" class="ch-dropdown-item"
              :class="{ active: selectedType === opt.value }" @click="selectType(opt.value)">
              {{ opt.label }}
            </div>
          </div>
        </Transition>
      </div>

      <div class="ch-filter-select" @click="showMonthMenu = !showMonthMenu">
        <span>{{ selectedMonth }}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="m6 9 6 6 6-6" />
        </svg>
        <Transition name="fade">
          <div v-if="showMonthMenu" class="ch-dropdown ch-dropdown-right" @click.stop>
            <div v-for="month in monthOptions" :key="month" class="ch-dropdown-item"
              :class="{ active: selectedMonth === month }" @click="selectMonth(month)">
              {{ month }}
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Month Filter (Only for gifts tab) -->
    <div class="ch-filters" v-if="activeTab === 'gifts'">
      <div style="flex: 1"></div>
      <div class="ch-filter-select" @click="showMonthMenu = !showMonthMenu">
        <span>{{ selectedMonth }}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="m6 9 6 6 6-6" />
        </svg>
        <Transition name="fade">
          <div v-if="showMonthMenu" class="ch-dropdown ch-dropdown-right" @click.stop>
            <div v-for="month in monthOptions" :key="month" class="ch-dropdown-item"
              :class="{ active: selectedMonth === month }" @click="selectMonth(month)">
              {{ month }}
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Transaction List: Coins -->
    <div class="ch-list" v-if="activeTab === 'coins'">
      <div v-if="filteredRecords.length === 0" class="ch-empty">
        <div class="ch-empty-icon">🪙</div>
        <p>{{ $t('common.noRecords') }}</p>
      </div>

      <div v-for="(record, idx) in filteredRecords" :key="idx" class="ch-item">
        <div class="ch-item-left">
          <div class="ch-item-type">{{ record.typeLabel }}</div>
          <div class="ch-item-detail">{{ record.detail }}</div>
          <div class="ch-item-time">{{ record.time }}</div>
        </div>
        <div class="ch-item-right">
          <span class="ch-item-amount" :class="{ positive: record.amount > 0 }">{{ record.amount > 0 ? '+' : '' }}{{ formatNumber(record.amount) }}</span>
          <img src="../../assets/coinslogo.png" class="ch-coin-icon" alt="coins" />
        </div>
      </div>
    </div>

    <!-- Transaction List: Gifts -->
    <div class="ch-list" v-if="activeTab === 'gifts'">
      <div v-if="filteredGiftRecords.length === 0" class="ch-empty">
        <div class="ch-empty-icon">🎁</div>
        <p>{{ $t('common.noRecords') }}</p>
      </div>

      <div v-for="(gift, idx) in filteredGiftRecords" :key="idx" class="ch-gift-item">
        <div class="ch-gift-icon-wrap" :style="{ backgroundColor: gift.bgColor || '#f0eeeb' }">
          <span style="font-size: 24px">{{ gift.icon }}</span>
        </div>
        <div class="ch-gift-info">
          <div class="ch-gift-name">
            {{ gift.giftName }}
            <span class="ch-gift-qty">x{{ gift.quantity }}</span>
          </div>
          <div class="ch-gift-sender">
            {{ $t('coinHistory.sender') }}: 
            <img :src="gift.senderAvatar" class="ch-sender-avatar" alt="avatar" />
            <span class="text-primary">{{ gift.senderName }}</span>
          </div>
          <div class="ch-gift-value-inline">
            {{ $t('coinHistory.giftValue') }}: <span class="text-primary font-bold">{{ formatNumber(gift.giftValue) }}</span>
            <img src="../../assets/coinslogo.png" style="width: 12px; height: 12px; margin-left: 4px; display: inline-block; vertical-align: -1px;" alt="coins" />
          </div>
          <div class="ch-gift-time">{{ gift.time }}</div>
        </div>
        <div class="ch-gift-action">
          <button class="ch-btn-thanks" @click="goToChat(gift.senderName)">{{ $t('coinHistory.thanks') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { formatNumber } from '../../utils.js'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })

const activeTab = ref('coins') // 'coins' or 'gifts'
const showTypeMenu = ref(false)
const showMonthMenu = ref(false)
const selectedType = ref('all')
const selectedMonth = ref(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
})

// Initialize selectedMonth properly
const now = new Date()
selectedMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

const typeOptions = computed(() => [
  { value: 'all', label: t('coinHistory.filterAll') },
  { value: 'send_gift', label: t('coinHistory.filterSendGift') },
  { value: 'receive_gift', label: t('coinHistory.filterReceiveGift') },
  { value: 'recharge', label: t('coinHistory.filterRecharge') },
])

const currentTypeLabel = computed(() => {
  const found = typeOptions.value.find(o => o.value === selectedType.value)
  return found ? found.label : t('coinHistory.filterAll')
})

// Generate available month options (last 6 months)
const monthOptions = computed(() => {
  const months = []
  const d = new Date()
  for (let i = 0; i < 6; i++) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    months.push(`${y}-${m}`)
    d.setMonth(d.getMonth() - 1)
  }
  return months
})

function selectType(val) {
  selectedType.value = val
  showTypeMenu.value = false
}

function selectMonth(val) {
  selectedMonth.value = val
  showMonthMenu.value = false
}

// Close dropdown on outside click
function closeDropdowns() {
  showTypeMenu.value = false
  showMonthMenu.value = false
}
onMounted(() => document.addEventListener('click', closeDropdowns))
onUnmounted(() => document.removeEventListener('click', closeDropdowns))

// Mock coin transaction data
const mockRecords = ref([
  { type: 'send_gift', giftName: 'Fish', targetUser: 'host123', amount: -555, date: '2026-03-30', time: '03/30 13:59' },
  { type: 'send_gift', giftName: 'Stage', targetUser: 'host123', amount: -1000000, date: '2026-03-30', time: '03/30 13:59' },
  { type: 'receive_gift', giftName: 'Heart', targetUser: 'user789', amount: 500, date: '2026-03-29', time: '03/29 18:00' },
  { type: 'recharge', giftName: '', targetUser: '', amount: 10000000, date: '2026-03-29', time: '03/29 10:30' },
  { type: 'send_gift', giftName: 'Rose', targetUser: 'host456', amount: -200, date: '2026-03-28', time: '03/28 20:15' },
  { type: 'receive_gift', giftName: 'Diamond', targetUser: 'user999', amount: 50000, date: '2026-03-28', time: '03/28 15:00' },
  { type: 'send_gift', giftName: 'Car', targetUser: 'host101', amount: -5000000, date: '2026-02-15', time: '02/15 16:22' },
  { type: 'recharge', giftName: '', targetUser: '', amount: 5000000, date: '2026-02-10', time: '02/10 09:00' },
])

// Mock received gifts data
const mockReceivedGifts = ref([
  { giftName: 'Heart', quantity: 1, senderName: 'user789', senderAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=user789', giftValue: 500, date: '2026-03-29', time: '03/29 18:00', icon: '❤️', bgColor: '#fecdd3' },
  { giftName: 'Diamond', quantity: 10, senderName: 'user999', senderAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=user999', giftValue: 50000, date: '2026-03-28', time: '03/28 15:00', icon: '💎', bgColor: '#bfdbfe' },
  { giftName: 'Rose', quantity: 99, senderName: 'user888', senderAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=user888', giftValue: 200, date: '2026-03-28', time: '03/28 14:20', icon: '🌹', bgColor: '#fecdd3' },
  { giftName: 'Castle', quantity: 1, senderName: 'big_whale_001', senderAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=big_whale_001', giftValue: 2000000, date: '2026-03-25', time: '03/25 21:00', icon: '🏰', bgColor: '#fde68a' },
  { giftName: 'Car', quantity: 5, senderName: 'big_whale_001', senderAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=big_whale_001', giftValue: 5000000, date: '2026-02-28', time: '02/28 20:00', icon: '🏎️', bgColor: '#bbf7d0' },
])

const filteredRecords = computed(() => {
  return mockRecords.value
    .filter(r => {
      // Filter by type
      if (selectedType.value !== 'all' && r.type !== selectedType.value) return false
      // Filter by month
      const rMonth = r.date.substring(0, 7)
      if (rMonth !== selectedMonth.value) return false
      return true
    })
    .map(r => ({
      ...r,
      typeLabel: getTypeLabel(r),
      detail: getDetail(r),
    }))
})

const filteredGiftRecords = computed(() => {
  return mockReceivedGifts.value.filter(gift => {
    // Filter by month
    const gMonth = gift.date.substring(0, 7)
    if (gMonth !== selectedMonth.value) return false
    return true
  })
})

function getTypeLabel(record) {
  if (record.type === 'send_gift') return `${t('coinHistory.sendGift')}: ${record.giftName}`
  if (record.type === 'receive_gift') return `${t('coinHistory.receiveGift')}: ${record.giftName}`
  if (record.type === 'recharge') return t('coinHistory.rechargeType')
  return record.type
}

function getDetail(record) {
  if (record.type === 'send_gift') return `${t('coinHistory.receiveUser')}: ${record.targetUser}`
  if (record.type === 'receive_gift') return `${t('coinHistory.fromUser')}: ${record.targetUser}`
  if (record.type === 'recharge') return t('coinHistory.rechargeDesc')
  return ''
}

function goToChat(senderName) {
  // Replace with actual route when chat page is implemented
  alert(`Redirecting to chat with ${senderName}...`)
}
</script>

<style scoped>
.coin-history-page {
  max-width: 520px;
  margin: 0 auto;
  min-height: 100vh;
  background: #FAF9F6;
  color: #1a1a1a;
}

/* Header */
.ch-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 48px 20px 10px;
  background: #FAF9F6;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #f0eeeb;
}

.ch-back {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 50%;
  color: #1a1a1a;
  cursor: pointer;
  flex-shrink: 0;
}

.ch-back:active {
  background: rgba(0, 0, 0, 0.06);
}

.ch-header-tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex: 1;
}

.ch-tab-btn {
  background: none;
  border: none;
  padding: 8px 4px 10px;
  font-size: 16px;
  font-weight: 600;
  color: #999;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.ch-tab-btn.active {
  color: #1a1a1a;
}

.ch-tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background: #F59E0B;
  border-radius: 3px 3px 0 0;
}

/* Filters */
.ch-filters {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 8px 20px 16px;
}

.ch-filter-select {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  position: relative;
  user-select: none;
  transition: border-color 0.2s;
}

.ch-filter-select:hover {
  border-color: #ccc;
}

.ch-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 140px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  z-index: 50;
  overflow: hidden;
}

.ch-dropdown-right {
  left: auto;
  right: 0;
}

.ch-dropdown-item {
  padding: 10px 16px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: background 0.15s;
}

.ch-dropdown-item:hover {
  background: #f5f5f5;
}

.ch-dropdown-item.active {
  color: #F59E0B;
  font-weight: 600;
  background: rgba(245, 158, 11, 0.06);
}

/* List */
.ch-list {
  padding: 0 20px;
}

.ch-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 12px;
  color: #999;
}

.ch-empty-icon {
  font-size: 48px;
  opacity: 0.4;
}

.ch-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #f0eeeb;
}

.ch-item:last-child {
  border-bottom: none;
}

.ch-item-left {
  flex: 1;
  min-width: 0;
}

.ch-item-type {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
}

.ch-item-detail {
  font-size: 12px;
  color: #999;
  margin-top: 3px;
}

.ch-item-time {
  font-size: 12px;
  color: #bbb;
  margin-top: 3px;
}

.ch-item-right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  padding-left: 16px;
}

.ch-item-amount {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  font-family: 'SF Pro Display', -apple-system, sans-serif;
  font-variant-numeric: tabular-nums;
}

.ch-item-amount.positive {
  color: #22c55e;
}

.ch-coin-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

/* Gift List Specific */
.ch-gift-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0eeeb;
}

.ch-gift-item:last-child {
  border-bottom: none;
}

.ch-gift-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
  overflow: hidden;
}

.ch-gift-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.ch-gift-info {
  flex: 1;
  min-width: 0;
}

.ch-gift-name {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 6px;
}

.ch-gift-qty {
  font-size: 14px;
  font-weight: 800;
  color: #F59E0B;
}

.ch-gift-sender {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
  display: flex;
  align-items: center;
}

.ch-sender-avatar {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin: 0 4px;
  object-fit: cover;
}

.ch-gift-value-inline {
  font-size: 13px;
  color: #666;
  margin-top: 2px;
  display: flex;
  align-items: center;
}

.ch-gift-time {
  font-size: 11px;
  color: #bbb;
  margin-top: 4px;
}

.text-primary {
  color: #F59E0B;
  font-weight: 600;
}

.ch-gift-action {
  flex-shrink: 0;
  margin-left: 12px;
}

.ch-btn-thanks {
  padding: 6px 16px;
  background: #fff;
  border: 1px solid #FF5A5F;
  color: #FF5A5F;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.ch-btn-thanks:active {
  background: rgba(255, 90, 95, 0.05);
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
