<template>
  <div class="mobile-container">
    <!-- Header -->
    <div class="header-bar">
      <button class="header-back" @click="$router.push('/host')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div class="header-center">
        <h1 class="header-title">{{ $t('diamondWallet.title') }}</h1>
      </div>
      <button class="header-action" @click="$router.push('/host/diamond-bills')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="px-24 mt-16">
      <div class="wallet-card">
        <div class="wallet-label">{{ $t('diamondWallet.available') }}</div>
        
        <div class="wallet-amount-row">
          <span class="diamond-icon">💎</span>
          <span class="wallet-amount">452,000</span>
        </div>
        
        <div class="wallet-fiat">≈ $54.46 {{ $t('diamondWallet.usd') }}</div>
        
        <div class="wallet-actions">
          <button class="action-btn btn-exchange" @click="$router.push('/host/recharge')">{{ $t('diamondWallet.exchange') }}</button>
          <button class="action-btn btn-withdraw" @click="$router.push('/host/unjoined-withdraw')">{{ $t('diamondWallet.withdraw') }}</button>
        </div>
        
        <div class="wallet-divider"></div>
        
        <div class="wallet-frozen-row">
          <div class="frozen-label">
            {{ $t('diamondWallet.frozen') }}
            <svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div class="frozen-value">
            <span style="font-size: 14px;">💎</span>
            <span style="font-weight: 700; font-size: 16px; margin-left: 4px;">83,200</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
</script>

<style scoped>
.mobile-container {
  min-height: 100vh;
  background: var(--bg-default);
}

.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 48px 20px 16px;
  background: var(--bg-default);
}

.header-back, .header-action {
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

.header-back:active, .header-action:active {
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

.wallet-card {
  background: #0D1B22; /* Dark teal/blue background */
  border-radius: 20px;
  padding: 24px 20px 20px;
  color: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.wallet-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.wallet-amount-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.diamond-icon {
  font-size: 24px;
}

.wallet-amount {
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  font-family: 'SF Pro Display', -apple-system, sans-serif;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.wallet-fiat {
  font-size: 13px;
  font-weight: 600;
  color: #2ED573;
  margin-bottom: 24px;
}

.wallet-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.action-btn {
  flex: 1;
  padding: 14px 0;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.action-btn:active {
  opacity: 0.8;
}

.btn-exchange {
  background: linear-gradient(90deg, #37D6B9, #28B0C0);
  border: none;
  color: #fff;
}

.btn-withdraw {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.wallet-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin-bottom: 16px;
}

.wallet-frozen-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.frozen-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.info-icon {
  opacity: 0.7;
}

.frozen-value {
  display: flex;
  align-items: center;
  color: #fff;
}
</style>
