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

        <!-- Section 1: Core Terms -->
        <div class="rules-card section-card">
          <div class="section-heading">{{ $t('bdTaskRules.section1Title') }}</div>
          <div class="term-item">
            <span class="term-label">{{ $t('bdTaskRules.term_validHost_label') }}</span>
            <span class="term-desc">{{ $t('bdTaskRules.term_validHost') }}</span>
          </div>
          <div class="term-item">
            <span class="term-label">{{ $t('bdTaskRules.term_validGuild_label') }}</span>
            <span class="term-desc">{{ $t('bdTaskRules.term_validGuild') }}</span>
          </div>
          <div class="term-item">
            <span class="term-label">{{ $t('bdTaskRules.term_teamRevenue_label') }}</span>
            <span class="term-desc">{{ $t('bdTaskRules.term_teamRevenue') }}</span>
          </div>
        </div>

        <!-- Section 2: Binding Rules -->
        <div class="rules-card section-card">
          <div class="section-heading">{{ $t('bdTaskRules.section2Title') }}</div>
          <div class="term-item">
            <span class="term-label">{{ $t('bdTaskRules.bind_window_label') }}</span>
            <span class="term-desc">{{ $t('bdTaskRules.bind_window') }}</span>
          </div>
          <div class="term-item">
            <span class="term-label">{{ $t('bdTaskRules.bind_period_label') }}</span>
            <span class="term-desc">{{ $t('bdTaskRules.bind_period') }}</span>
          </div>
        </div>

        <!-- Section 3: Performance Reward Calculation -->
        <div class="rules-card section-card">
          <div class="section-heading">{{ $t('bdTaskRules.section3Title') }}</div>
          <div class="section-intro">{{ $t('bdTaskRules.section3Intro') }}</div>

          <div class="perf-item">
            <div class="perf-label">{{ $t('bdTaskRules.perf_threshold_label') }}</div>
            <div class="perf-desc">{{ $t('bdTaskRules.perf_threshold') }}</div>
          </div>
          <div class="perf-item">
            <div class="perf-label">{{ $t('bdTaskRules.perf_full_label') }}</div>
            <div class="perf-desc">{{ $t('bdTaskRules.perf_full') }}</div>
          </div>
          <div class="perf-item">
            <div class="perf-label">{{ $t('bdTaskRules.perf_partial_label') }}</div>
            <div class="perf-desc">{{ $t('bdTaskRules.perf_partial') }}</div>
          </div>

          <div class="formula-box">
            {{ $t('bdTaskRules.perf_formula') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { formatNumber } from '../../utils.js'

const { t } = useI18n({ useScope: 'global' })

const bdTiers = [
  { level: 1, validAgencies: 1, teamRevenue: 2490000, salary: 207500 },
  { level: 2, validAgencies: 2, teamRevenue: 4980000, salary: 415000 },
  { level: 3, validAgencies: 3, teamRevenue: 8300000, salary: 830000 },
  { level: 4, validAgencies: 4, teamRevenue: 16600000, salary: 1660000 },
  { level: 5, validAgencies: 5, teamRevenue: 24900000, salary: 2490000 },
  { level: 6, validAgencies: 6, teamRevenue: 33200000, salary: 3320000 },
  { level: 7, validAgencies: 7, teamRevenue: 49800000, salary: 4980000 },
  { level: 8, validAgencies: 8, teamRevenue: 66400000, salary: 6640000 },
]
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

.section-card {
  margin-bottom: 12px;
}

.section-heading {
  font-size: 14px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.section-intro {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.term-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.term-item:last-child { border-bottom: none; }

.term-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.term-desc {
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-secondary);
  padding-left: 4px;
}

.perf-item {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.perf-item:last-child { border-bottom: none; }

.perf-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.perf-desc {
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-secondary);
  padding-left: 4px;
}

.formula-box {
  margin-top: 12px;
  padding: 12px;
  background: rgba(0, 224, 179, 0.08);
  border: 1px solid rgba(0, 224, 179, 0.2);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  line-height: 1.5;
  text-align: center;
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
