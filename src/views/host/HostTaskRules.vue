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
        <h1 class="header-title">{{ $t('hostTaskRules.title') }}</h1>
      </div>
      <div style="width: 36px;"></div>
    </div>

    <div class="rules-content px-24">
      <!-- Combined Task Reward Table -->
      <div class="rules-section">
        <div class="rules-section-title">
          <span class="rules-icon">📊</span>
          {{ $t('hostTaskRules.combinedTierTitle') }}
        </div>
        <div class="rules-card" style="padding: 0; overflow: hidden;">
          <div class="table-scroll">
            <table class="tier-table">
              <thead>
                <tr>
                  <th class="sticky-col">{{ $t('hostTaskRules.level') }}</th>
                  <th>{{ $t('hostTaskRules.coinsRequired') }}</th>
                  <th>{{ $t('hostTaskRules.giftReward') }}</th>
                  <th>{{ $t('hostTaskRules.validDays') }}</th>
                  <th>{{ $t('hostTaskRules.validHours') }}</th>
                  <th>{{ $t('hostTaskRules.micBonus') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tier in displayedTiers" :key="tier.level" :class="{ 'current-tier': tier.level === currentLevel }">
                  <td class="sticky-col"><span class="level-badge">LV{{ tier.level }}</span></td>
                  <td class="num">{{ formatNumber(tier.coinsReq) }}</td>
                  <td class="num" style="color: var(--primary); font-weight: 700;">💎 {{ formatNumber(tier.baseSalary) }}</td>
                  <td class="num">{{ tier.days }}{{ $t('hostTaskRules.days') }}</td>
                  <td class="num">{{ tier.hours }}h</td>
                  <td class="num" style="color: var(--primary); font-weight: 700;">💎 {{ formatNumber(tier.micBonus) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="!showAllTiers" class="expand-btn" @click="showAllTiers = true">
            {{ $t('hostTaskRules.viewAllLevels') }} ({{ salaryTiers.length }})
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          <div v-else class="expand-btn" @click="showAllTiers = false">
            {{ $t('hostTaskRules.collapseAll') }}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 15-6-6-6 6"/></svg>
          </div>
        </div>
      </div>

      <!-- Gift Task Rules -->
      <div class="rules-section">
        <div class="rules-section-title">
          <span class="rules-icon">🎁</span>
          {{ $t('hostTaskRules.giftTaskTitle') }}
        </div>
        <div class="rules-card">
          <div class="rule-item" v-for="(rule, i) in giftRules" :key="'g'+i">
            <span class="rule-number">{{ i + 1 }}</span>
            <span class="rule-text">{{ rule }}</span>
          </div>
        </div>
      </div>

      <!-- Mic Task Rules -->
      <div class="rules-section">
        <div class="rules-section-title">
          <span class="rules-icon">🎤</span>
          {{ $t('hostTaskRules.micTaskTitle') }}
        </div>
        <div class="rules-card">
          <div class="rule-item" v-for="(rule, i) in micRules" :key="'m'+i">
            <span class="rule-number">{{ i + 1 }}</span>
            <span class="rule-text">{{ rule }}</span>
          </div>
        </div>
      </div>

      <!-- Important Notes -->
      <div class="rules-section" style="margin-bottom: 40px;">
        <div class="rules-section-title">
          <span class="rules-icon">⚠️</span>
          {{ $t('hostTaskRules.notesTitle') }}
        </div>
        <div class="rules-card notes-card">
          <div class="note-item" v-for="(note, i) in notes" :key="'n'+i">
            <span class="note-bullet">•</span>
            <span class="rule-text">{{ note }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { hostData, adminData } from '../../mock/data.js'
import { formatNumber } from '../../utils.js'

const { t } = useI18n({ useScope: 'global' })

const DEFAULT_SHOW_COUNT = 5
const showAllTiers = ref(false)

const currentLevel = computed(() => hostData.taskProgress.currentLevel)
const salaryTiers = computed(() => adminData.salaryTiers)

const displayedTiers = computed(() => {
  return showAllTiers.value ? salaryTiers.value : salaryTiers.value.slice(0, DEFAULT_SHOW_COUNT)
})

const giftRules = computed(() => [
  t('hostTaskRules.giftRule1'),
  t('hostTaskRules.giftRule2'),
  t('hostTaskRules.giftRule3'),
  t('hostTaskRules.giftRule4'),
])

const micRules = computed(() => [
  t('hostTaskRules.micRule1'),
  t('hostTaskRules.micRule2'),
  t('hostTaskRules.micRule3'),
  t('hostTaskRules.micRule4'),
])

const notes = computed(() => [
  t('hostTaskRules.note1'),
  t('hostTaskRules.note2'),
  t('hostTaskRules.note3'),
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
  min-width: 520px;
}
.tier-table th {
  background: rgba(255,255,255,0.04);
  padding: 12px 8px;
  text-align: center;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 11px;
  white-space: nowrap;
}
.tier-table td {
  padding: 10px 8px;
  text-align: center;
  border-top: 1px solid rgba(255,255,255,0.04);
  color: var(--text-primary);
  white-space: nowrap;
  font-size: 12px;
}
.tier-table .current-tier td {
  background: rgba(0, 216, 201, 0.06);
}
.sticky-col {
  position: sticky;
  left: 0;
  background: var(--bg-card);
  z-index: 2;
}
.current-tier .sticky-col {
  background: rgba(0, 216, 201, 0.06);
}
.level-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(255,255,255,0.06);
  font-size: 12px;
  font-weight: 600;
}
.current-tier .level-badge {
  background: var(--primary);
  color: #0a0f1a;
}

/* Expand button */
.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  border-top: 1px solid rgba(255,255,255,0.04);
  transition: background 0.15s;
}
.expand-btn:active {
  background: rgba(255,255,255,0.03);
}

/* Notes */
.notes-card {
  background: rgba(255, 183, 77, 0.06);
  border-color: rgba(255, 183, 77, 0.15);
}
.note-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 0;
}
.note-bullet {
  color: var(--warning);
  font-size: 16px;
  line-height: 1.4;
  flex-shrink: 0;
}
</style>
