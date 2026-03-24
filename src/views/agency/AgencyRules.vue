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
        <h1 class="header-title">{{ $t('agencyRules.title') }}</h1>
      </div>
      <div style="width: 36px;"></div>
    </div>

    <div class="rules-content px-24">
      <!-- Revenue Distribution -->
      <div class="rules-section">
        <div class="rules-section-title">
          <span class="rules-icon">💎</span>
          {{ $t('agencyRules.revenueDistTitle') }}
        </div>
        <div class="rules-card">
          <div class="rule-item" v-for="(rule, i) in revenueDist" :key="'r'+i">
            <span class="rule-number">{{ i + 1 }}</span>
            <span class="rule-text">{{ rule }}</span>
          </div>
        </div>
      </div>

      <!-- Payout Models -->
      <div class="rules-section">
        <div class="rules-section-title">
          <span class="rules-icon">🔄</span>
          {{ $t('agencyRules.payoutModelsTitle') }}
        </div>
        <div class="rules-card">
          <div class="model-block">
            <div class="model-name">{{ $t('agencyRules.unifiedModel') }}</div>
            <div class="model-desc">{{ $t('agencyRules.unifiedModelDesc') }}</div>
          </div>
          <div class="model-divider"></div>
          <div class="model-block">
            <div class="model-name">{{ $t('agencyRules.dualTrackModel') }}</div>
            <div class="model-desc">{{ $t('agencyRules.dualTrackModelDesc') }}</div>
          </div>
        </div>
      </div>

      <!-- Salary Tier Table -->
      <div class="rules-section">
        <div class="rules-section-title">
          <span class="rules-icon">📊</span>
          {{ $t('agencyRules.salaryTierTitle') }}
        </div>
        <div class="rules-card" style="padding: 0; overflow: hidden;">
          <table class="tier-table">
            <thead>
              <tr>
                <th>{{ $t('agencyRules.level') }}</th>
                <th>{{ $t('agencyRules.coinsRequired') }}</th>
                <th>{{ $t('agencyRules.giftReward') }}</th>
                <th>{{ $t('agencyRules.micBonus') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tier in salaryTiers" :key="tier.level">
                <td><span class="level-badge">LV{{ tier.level }}</span></td>
                <td class="num">{{ formatNumber(tier.coinsReq) }}</td>
                <td class="num" style="color: var(--primary);">💎 {{ formatNumber(tier.baseSalary) }}</td>
                <td class="num" style="color: var(--primary);">💎 {{ formatNumber(tier.micBonus) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Agency Obligations -->
      <div class="rules-section">
        <div class="rules-section-title">
          <span class="rules-icon">📋</span>
          {{ $t('agencyRules.obligationsTitle') }}
        </div>
        <div class="rules-card">
          <div class="rule-item" v-for="(rule, i) in obligations" :key="'o'+i">
            <span class="rule-number">{{ i + 1 }}</span>
            <span class="rule-text">{{ rule }}</span>
          </div>
        </div>
      </div>

      <!-- Settlement Cycle -->
      <div class="rules-section" style="margin-bottom: 40px;">
        <div class="rules-section-title">
          <span class="rules-icon">📅</span>
          {{ $t('agencyRules.cycleTitle') }}
        </div>
        <div class="rules-card">
          <div class="rule-item" v-for="(rule, i) in cycleRules" :key="'c'+i">
            <span class="rule-number">{{ i + 1 }}</span>
            <span class="rule-text">{{ rule }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { adminData } from '../../mock/data.js'
import { formatNumber } from '../../utils.js'

const { t } = useI18n({ useScope: 'global' })

const salaryTiers = computed(() => adminData.salaryTiers)

const revenueDist = computed(() => [
  t('agencyRules.revenueDist1'),
  t('agencyRules.revenueDist2'),
  t('agencyRules.revenueDist3'),
])

const obligations = computed(() => [
  t('agencyRules.obligation1'),
  t('agencyRules.obligation2'),
  t('agencyRules.obligation3'),
])

const cycleRules = computed(() => [
  t('agencyRules.cycleRule1'),
  t('agencyRules.cycleRule2'),
  t('agencyRules.cycleRule3'),
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

.rules-content { padding-top: 16px; }
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
  padding: 16px;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.rule-item:last-child { border-bottom: none; }

.rule-number {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary);
  color: #0a0f1a;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}

.rule-text {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Model blocks */
.model-block { padding: 8px 0; }
.model-name { font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 6px; }
.model-desc { font-size: 13px; line-height: 1.6; color: var(--text-secondary); }
.model-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 8px 0; }

/* Table */
.tier-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.tier-table th { background: rgba(255,255,255,0.04); padding: 12px 8px; text-align: center; color: var(--text-secondary); font-weight: 600; font-size: 11px; white-space: nowrap; }
.tier-table td { padding: 10px 8px; text-align: center; border-top: 1px solid rgba(255,255,255,0.04); color: var(--text-primary); }
.level-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,0.06); font-size: 12px; font-weight: 600; }
</style>
