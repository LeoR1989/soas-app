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
        <h1 class="header-title">{{ $t('bdTaskRules.title') }}</h1>
      </div>
      <div style="width: 36px;"></div>
    </div>

    <div class="rules-content px-24">
      <!-- BD Settlement Tier Table -->
      <div class="rules-section">
        <div class="rules-section-title">
          <span class="rules-icon">📊</span>
          {{ $t('bdTaskRules.tierTableTitle') }}
        </div>
        <div class="rules-card" style="padding: 0; overflow: hidden;">
          <div class="table-scroll">
            <table class="tier-table">
              <thead>
                <tr>
                  <th>{{ $t('bdTaskRules.level') }}</th>
                  <th>{{ $t('bdTaskRules.validAgencies') }}</th>
                  <th>{{ $t('bdTaskRules.teamRevenue') }}</th>
                  <th>{{ $t('bdTaskRules.bdSalary') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tier in bdTiers" :key="tier.level">
                  <td><span class="level-badge">L{{ tier.level }}</span></td>
                  <td class="num">{{ tier.validAgencies }} {{ $t('bdTaskRules.unit') }}</td>
                  <td class="num">💎 {{ formatNumber(tier.teamRevenue) }}</td>
                  <td class="num" style="color: var(--primary); font-weight: 700;">💎 {{ formatNumber(tier.salary) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- BD Settlement Rules -->
      <div class="rules-section" style="margin-bottom: 40px;">
        <div class="rules-section-title">
          <span class="rules-icon">📋</span>
          {{ $t('bdTaskRules.rulesTitle') }}
        </div>
        <div class="rules-card">
          <div class="rule-item" v-for="(rule, i) in rules" :key="'r'+i">
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
import { formatNumber } from '../../utils.js'

const { t } = useI18n({ useScope: 'global' })

const bdTiers = [
  { level: 1, validAgencies: 2, teamRevenue: 4980000, salary: 415000 },
  { level: 2, validAgencies: 3, teamRevenue: 8300000, salary: 830000 },
  { level: 3, validAgencies: 4, teamRevenue: 16600000, salary: 1660000 },
  { level: 4, validAgencies: 5, teamRevenue: 24900000, salary: 2490000 },
  { level: 5, validAgencies: 6, teamRevenue: 33200000, salary: 3320000 },
  { level: 6, validAgencies: 7, teamRevenue: 49800000, salary: 4980000 },
  { level: 7, validAgencies: 8, teamRevenue: 66400000, salary: 6640000 },
]

const rules = computed(() => [
  t('bdTaskRules.rule1'),
  t('bdTaskRules.rule7'),
  t('bdTaskRules.rule2'),
  t('bdTaskRules.rule3'),
  t('bdTaskRules.rule4'),
  t('bdTaskRules.rule5'),
  t('bdTaskRules.rule6'),
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

/* Table */
.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.tier-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.tier-table th {
  background: rgba(255,255,255,0.04);
  padding: 12px 10px;
  text-align: center;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}
.tier-table td {
  padding: 10px;
  text-align: center;
  border-top: 1px solid rgba(255,255,255,0.04);
  color: var(--text-primary);
  white-space: nowrap;
}
.level-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(255,255,255,0.06);
  font-size: 12px;
  font-weight: 600;
}
</style>
