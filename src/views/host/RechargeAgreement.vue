<template>
  <div class="mobile-container">
    <!-- Header -->
    <div class="dash-header-bar">
      <button class="header-back" @click="$router.back()">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div class="header-center">
        <h1 class="header-title">{{ $t('recharge.exchangeAgreementTitle') }}</h1>
      </div>
      <div style="width: 36px;"></div>
    </div>

    <div class="rules-content px-24">
      <div class="rules-section">
        <div class="rules-section-title">
          <span class="rules-icon">📄</span>
          {{ $t('recharge.exchangeAgreementTitle') }}
        </div>
        <div class="rules-card">
          <div class="agreement-block" v-for="(item, i) in agreementItems" :key="i">
            <div class="agreement-item-title">{{ item.title }}</div>
            <div class="agreement-item-content">{{ item.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

const agreementItems = computed(() => [
  { title: t('recharge.agreementItem1Title'), content: t('recharge.agreementItem1') },
  { title: t('recharge.agreementItem2Title'), content: t('recharge.agreementItem2') },
  { title: t('recharge.agreementItem3Title'), content: t('recharge.agreementItem3') },
  { title: t('recharge.agreementItem4Title'), content: t('recharge.agreementItem4') },
  { title: t('recharge.agreementItem5Title'), content: t('recharge.agreementItem5') },
])
</script>

<style scoped>
.dash-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 48px 20px 16px;
  background: var(--bg-deep);
}
.header-back { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: none; border-radius: 50%; border: none; color: var(--text-primary); cursor: pointer; flex-shrink: 0; }
.header-back:active { background: var(--primary-light); }
.header-center { text-align: center; flex: 1; }
.header-title { font-size: 18px; font-weight: 700; color: var(--text-primary); }

.rules-content { padding-top: 16px; padding-bottom: 40px; }
.rules-section { margin-bottom: 24px; }
.rules-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}
.rules-icon { font-size: 20px; }

.rules-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 20px;
}

.agreement-block {
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.agreement-block:last-child { border-bottom: none; }
.agreement-block:first-child { padding-top: 0; }

.agreement-item-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.agreement-item-content {
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
}
</style>
