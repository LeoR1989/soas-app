<template>
  <div class="mobile-container">
    <!-- Header -->
    <div class="header-bar">
      <button class="header-back" @click="$router.push('/agency')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
      </button>
      <div class="header-center">
        <h1 class="header-title">{{ $t('rechargeAgent.rulesTitle') }}</h1>
      </div>
      <div style="width: 36px;"></div>
    </div>

    <div class="px-24 mt-16">
      <!-- Level Summary Card -->
      <div class="card" style="background: linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(217, 70, 239, 0.10)); border: 1px solid rgba(167, 139, 250, 0.25);">
        <div class="flex items-center gap-8 mb-12">
          <span style="font-size: 24px;">🏅</span>
          <span class="text-subtitle">{{ $t('rechargeAgent.levelSystem') }}</span>
        </div>
        <p class="text-body text-secondary" style="line-height: 1.6;">
          {{ $t('rechargeAgent.levelSystemDesc') }}
        </p>
      </div>

      <!-- Level Table -->
      <div class="card mt-16">
        <div class="text-subtitle mb-16">{{ $t('rechargeAgent.levelTable') }}</div>
        <div class="level-table">
          <!-- Header -->
          <div class="table-header">
            <div class="table-cell col-level">{{ $t('rechargeAgent.colLevel') }}</div>
            <div class="table-cell col-range">{{ $t('rechargeAgent.colMonthlyCoins') }}</div>
            <div class="table-cell col-subsidy">{{ $t('rechargeAgent.colSubsidy') }}</div>
          </div>
          <!-- Rows -->
          <div v-for="tier in agencyData.rechargeAgentTiers" :key="tier.level" class="table-row" :class="{ 'is-current': tier.level === currentLevel }">
            <div class="table-cell col-level">
              <span class="level-badge" :class="'level-' + tier.level">{{ tier.label }}</span>
              <span v-if="tier.level === currentLevel" class="current-tag">{{ $t('rechargeAgent.current') }}</span>
            </div>
            <div class="table-cell col-range text-caption num">
              <template v-if="tier.level === 1">&lt; {{ formatM(tier.maxCoins) }}</template>
              <template v-else-if="tier.maxCoins === Infinity">&gt; {{ formatM(tier.minCoins) }}</template>
              <template v-else>{{ formatM(tier.minCoins) }} ~ {{ formatM(tier.maxCoins) }}</template>
            </div>
            <div class="table-cell col-subsidy num">
              <span v-if="tier.subsidyPer8700 > 0" class="text-success font-bold">{{ tier.subsidyPer8700 }}</span>
              <span v-else class="text-muted">0</span>
            </div>
          </div>
        </div>
        <div class="text-caption text-muted mt-12">
          * {{ $t('rechargeAgent.mUnit') }}
        </div>
      </div>

      <!-- Subsidy Formula -->
      <div class="card mt-16">
        <div class="flex items-center gap-8 mb-12">
          <span style="font-size: 20px;">📐</span>
          <span class="text-subtitle">{{ $t('rechargeAgent.formulaTitle') }}</span>
        </div>
        <div class="formula-box">
          <div class="formula-text num">
            {{ $t('rechargeAgent.subsidyLabel') }} = ⌊ {{ $t('rechargeAgent.monthlyTotal') }} ÷ 8700 ⌋ × {{ $t('rechargeAgent.subsidyRate') }}
          </div>
        </div>
        <!-- Example -->
        <div class="example-box mt-16">
          <div class="text-body font-bold mb-8">{{ $t('rechargeAgent.example') }}</div>
          <div class="text-body text-secondary" style="line-height: 1.8;">
            {{ $t('rechargeAgent.exampleText') }}
          </div>
        </div>
      </div>

      <!-- Settlement Rules -->
      <div class="card mt-16">
        <div class="flex items-center gap-8 mb-12">
          <span style="font-size: 20px;">📅</span>
          <span class="text-subtitle">{{ $t('rechargeAgent.settlementRules') }}</span>
        </div>
        <div class="rule-list">
          <div class="rule-item">
            <span class="rule-dot"></span>
            <span class="text-body text-secondary">{{ $t('rechargeAgent.rule1') }}</span>
          </div>
          <div class="rule-item mt-8">
            <span class="rule-dot"></span>
            <span class="text-body text-secondary">{{ $t('rechargeAgent.rule2') }}</span>
          </div>
          <div class="rule-item mt-8">
            <span class="rule-dot"></span>
            <span class="text-body text-secondary">{{ $t('rechargeAgent.rule3') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div style="height: 40px;"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { agencyData } from '../../mock/data.js'
import { formatNumber } from '../../utils.js'

const currentLevel = computed(() => {
  const monthly = agencyData.rechargeAgent.monthlyRecharge
  const tiers = agencyData.rechargeAgentTiers
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (monthly >= tiers[i].minCoins) return tiers[i].level
  }
  return 1
})

function formatM(coins) {
  if (coins === Infinity) return '∞'
  if (coins >= 1_000_000) return (coins / 1_000_000) + 'M'
  if (coins >= 1_000) return (coins / 1_000) + 'K'
  return String(coins)
}
</script>

<style scoped>
.header-bar { display: flex; align-items: center; justify-content: space-between; padding: 48px 20px 16px; }
.header-back { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: none; border: none; border-radius: 50%; color: var(--text-primary); cursor: pointer; }
.header-back:active { background: var(--primary-light); }
.header-center { text-align: center; flex: 1; }
.header-title { font-size: 18px; font-weight: 700; color: var(--text-primary); }

/* Level Table */
.level-table { border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-subtle); }
.table-header { display: flex; background: rgba(255,255,255,0.06); padding: 12px 16px; font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
.table-row { display: flex; padding: 14px 16px; border-top: 1px solid var(--border-subtle); align-items: center; transition: background 0.2s; }
.table-row.is-current { background: rgba(0, 216, 201, 0.06); border-left: 3px solid var(--primary); }
.table-cell { display: flex; align-items: center; gap: 6px; }
.col-level { flex: 0 0 90px; }
.col-range { flex: 1; font-size: 13px; color: var(--text-secondary); }
.col-subsidy { flex: 0 0 60px; justify-content: flex-end; font-size: 14px; }

.level-badge { display: inline-block; padding: 2px 10px; border-radius: 10px; font-size: 12px; font-weight: 700; }
.level-1 { background: rgba(150, 150, 150, 0.2); color: #999; }
.level-2 { background: rgba(99, 179, 237, 0.2); color: #63b3ed; }
.level-3 { background: rgba(167, 139, 250, 0.2); color: #a78bfa; }
.level-4 { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
.level-5 { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
.current-tag { font-size: 10px; color: var(--primary); background: rgba(0, 216, 201, 0.15); padding: 1px 6px; border-radius: 4px; font-weight: 600; }

/* Formula */
.formula-box { padding: 16px; background: rgba(167, 139, 250, 0.08); border: 1px solid rgba(167, 139, 250, 0.2); border-radius: var(--radius-md); }
.formula-text { font-size: 14px; font-weight: 600; color: var(--text-primary); text-align: center; }
.example-box { padding: 16px; background: var(--bg-input); border-radius: var(--radius-md); }

/* Rules */
.rule-list { padding-left: 4px; }
.rule-item { display: flex; align-items: flex-start; gap: 10px; }
.rule-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary); flex-shrink: 0; margin-top: 7px; }
</style>
