<template>
  <div class="page-container">
    <!-- Header -->
    <div class="agent-header">
      <button class="back-btn" @click="$router.push('/agency')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
      </button>
      <h1 class="header-title">{{ $t('rechargeAgent.rechargeTitle') }}</h1>
      <div style="width: 22px;"></div>
    </div>

    <!-- Region Selector -->
    <div class="px-24 mt-8 flex justify-end">
      <div class="flex items-center gap-16 px-20 py-10" style="background: rgba(255, 255, 255, 0.05); border-radius: 40px; border: 1px solid var(--border-subtle);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <select v-model="selectedRegion" class="region-select" style="background: transparent; border: none; outline: none; color: var(--text-primary); font-size: 16px; font-weight: bold; cursor: pointer; padding: 4px 20px 4px 4px;">
          <option v-for="region in regions" :key="region.id" :value="region.id">{{ region[$i18n.locale] || region.en }}</option>
        </select>
      </div>
    </div>

    <!-- Recharge Packages Section (Accordion) -->
    <div class="px-24 mt-16 flex flex-col gap-16">
      
      <div v-for="group in channelGroups" :key="group.id" class="channel-group" :class="{ 'is-expanded': group.expanded }">
        <!-- Channel Selector Header -->
        <div class="channel-selector" @click="group.expanded = !group.expanded">
          <div class="flex items-center gap-12">
            <!-- Multi-Card Mode (Mock Fig 3) -->
            <div v-if="group.svgType === 'card'" class="flex items-center gap-4">
              <svg width="24" height="16" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Visa-like -->
                <rect width="40" height="24" rx="3" fill="#fff" />
                <path d="M12 16L15 8H18L15 16H12Z" fill="#1434CB" />
                <path d="M22 16L20 8H23L24 16H22Z" fill="#1434CB" />
                <path d="M28 16C28 16 26 15 25 12C25 10 27 8 28 8H31C31 8 29 10 30 14C31 16 31 16 31 16H28Z" fill="#1A1F71" />
              </svg>
              <svg width="24" height="16" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- MasterCard-like -->
                <rect width="40" height="24" rx="3" fill="#fff" />
                <circle cx="16" cy="12" r="7" fill="#EB001B" />
                <circle cx="24" cy="12" r="7" fill="#F79E1B" fill-opacity="0.9" />
              </svg>
            </div>
            <!-- Wallet Mode (Mock Fig 4) -->
            <div v-else-if="group.svgType === 'wallet'" class="flex items-center gap-8">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#F03D4C" />
                <path d="M8 8.5C8 7.67157 8.67157 7 9.5 7H14.5C15.3284 7 16 7.67157 16 8.5V15.5C16 16.3284 15.3284 17 14.5 17H9.5C8.67157 17 8 16.3284 8 15.5V8.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                <circle cx="14" cy="12" r="1" fill="white" />
                <path d="M8 10H14" stroke="white" stroke-linecap="round" />
              </svg>
            </div>
            <span class="text-body font-bold" style="color: var(--text-primary);">{{ group.name }}</span>
          </div>
          
          <div :style="{ transform: group.expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>

        <!-- Packages Grid (Expandable Body) -->
        <div v-show="group.expanded" class="channel-body">
          <div class="topup-grid">
            <div v-for="pkg in group.packages" :key="pkg.price" class="topup-card" @click="doRecharge(pkg)">
              <img src="../../assets/coinslogo.png" class="topup-coin-img" alt="coins" />
              <div class="topup-coins num">{{ formatNumber(pkg.coins) }}</div>
              <div class="topup-price num">{{ pkg.currency }} {{ formatNumber(pkg.price) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Issue -->
    <div class="payment-issue">
      {{ $t('rechargeAgent.paymentIssue') }}
    </div>

    <!-- Success Modal -->
    <Transition name="fade">
      <div v-if="showSuccess" class="overlay" @click.self="showSuccess = false">
        <div class="modal-card text-center">
          <div style="font-size: 48px;">✅</div>
          <h2 class="text-title mt-16">{{ $t('rechargeAgent.rechargeSuccess') }}</h2>
          <div class="result-details mt-16">
            <div class="flex justify-between items-center">
              <span class="text-body text-secondary">{{ $t('rechargeAgent.coinsAdded') }}</span>
              <div class="flex items-center gap-4">
                <img src="../../assets/coinslogo.png" style="width: 16px; height: 16px;" alt="coins" />
                <span class="text-body num font-bold">{{ formatNumber(lastPurchase?.coins || 0) }}</span>
              </div>
            </div>
            <div class="flex justify-between items-center mt-8">
              <span class="text-body text-secondary">{{ $t('rechargeAgent.amountPaid') }}</span>
              <span class="text-body num font-bold text-success">{{ lastPurchase?.currency }} {{ formatNumber(lastPurchase?.price || 0) }}</span>
            </div>
          </div>
          <button class="btn btn-primary btn-block mt-24" @click="showSuccess = false">{{ $t('common.confirm') }}</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { agencyData } from '../../mock/data.js'
import { formatNumber } from '../../utils.js'

const selectedRegion = ref('global')
const regions = ref([
  { id: 'global', zh: '全球', en: 'Global', ar: 'عالمي' },
  { id: 'bh', zh: '巴林', en: 'Bahrain', ar: 'البحرين' },
  { id: 'eg', zh: '埃及', en: 'Egypt', ar: 'مصر' },
  { id: 'jo', zh: '约旦', en: 'Jordan', ar: 'الأردن' },
  { id: 'kw', zh: '科威特', en: 'Kuwait', ar: 'الكويت' },
  { id: 'ma', zh: '摩洛哥', en: 'Morocco', ar: 'المغرب' },
  { id: 'om', zh: '阿曼', en: 'Oman', ar: 'عمان' },
  { id: 'qa', zh: '卡塔尔', en: 'Qatar', ar: 'قطر' },
  { id: 'ae', zh: '阿联酋', en: 'UAE', ar: 'الإمارات' },
  { id: 'sa', zh: '沙特阿拉伯', en: 'Saudi Arabia', ar: 'السعودية' },
])

const channelGroups = ref([
  {
    id: 'card',
    name: 'MasterCard',
    expanded: true,
    svgType: 'card',
    packages: agencyData.rechargeAgentPackages // Uses updated mockup packages from data.js
  },
  {
    id: 'wallet',
    name: 'E-Wallet',
    expanded: false,
    svgType: 'wallet',
    packages: [
      { coins: 870_000,   currency: 'USD', price: 100 },
      { coins: 2_610_000, currency: 'USD', price: 300 },
      { coins: 4_350_000, currency: 'USD', price: 500 },
      { coins: 8_700_000, currency: 'USD', price: 1000 },
      { coins: 17_400_000,currency: 'USD', price: 2000 },
    ]
  }
])

const showSuccess = ref(false)
const lastPurchase = ref(null)

function doRecharge(pkg) {
  agencyData.rechargeAgent.coinBalance += pkg.coins
  agencyData.rechargeAgent.monthlyRecharge += pkg.coins
  
  agencyData.rechargeAgentBills.rechargeRecords.unshift({
    id: 'RAR-' + Date.now(),
    date: new Date().toISOString().replace('T', ' ').slice(0, 19),
    coins: pkg.coins,
    usd: pkg.price,
    status: 'success'
  })
  
  lastPurchase.value = pkg
  showSuccess.value = true
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  max-width: 500px;
  margin: 0 auto;
  padding-bottom: 40px;
}

.agent-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 48px 20px 16px;
}

.back-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

/* Accordion Wrapper Card */
.channel-group {
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border-subtle);
  overflow: hidden;
  transition: all 0.3s;
}

/* Channel Header */
.channel-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.02);
  cursor: pointer;
  border-bottom: 1px solid transparent;
  transition: background 0.2s, border-bottom-color 0.2s;
}

.channel-selector:active {
  background: rgba(255, 255, 255, 0.05);
}

.channel-group.is-expanded .channel-selector {
  border-bottom-color: var(--border-subtle);
}

/* Accordion Body */
.channel-body {
  padding: 20px;
}

/* Responsive Grids */
.topup-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
}

.topup-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 8px;
  background: var(--bg-input);
  border-radius: 12px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.topup-card:active {
  transform: scale(0.96);
  border-color: var(--primary);
  background: rgba(0, 216, 201, 0.05);
}

.topup-coin-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.topup-coins {
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1.2;
}

.topup-price {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
  white-space: nowrap;
}

.payment-issue {
  text-align: center;
  margin-top: 32px;
  font-size: 13px;
  color: var(--text-muted);
}

/* Modal styles */
.overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
}

.modal-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  width: 100%;
  max-width: 420px;
  border: 1px solid var(--border-subtle);
}

.result-details {
  padding: 16px;
  background: var(--bg-input);
  border-radius: var(--radius-md);
}

.region-select option {
  background: var(--bg-card);
  color: var(--text-primary);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

