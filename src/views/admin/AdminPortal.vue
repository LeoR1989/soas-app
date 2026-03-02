<template>
  <div class="admin-container">
    <!-- Sidebar -->
    <div class="admin-sidebar">
      <div class="sidebar-brand">
        <div class="brand-logo">⚡</div>
        <span class="brand-text">{{ $t('admin.brand') }}</span>
      </div>

      <nav class="sidebar-nav">
        <a class="nav-item" :class="{ active: activeTab === 'dashboard' }" @click="activeTab = 'dashboard'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          {{ $t('admin.dashboard') }}
        </a>
        <a class="nav-item" :class="{ active: activeTab === 'agencies' }" @click="activeTab = 'agencies'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          {{ $t('admin.agencyDirectory') }}
        </a>
        <a class="nav-item" :class="{ active: activeTab === 'salary' }" @click="activeTab = 'salary'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          {{ $t('admin.salaryPolicy') }}
        </a>
        <a class="nav-item" :class="{ active: activeTab === 'languages' }" @click="activeTab = 'languages'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
          </svg>
          {{ $t('admin.languageManager') || 'Languages' }}
        </a>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="admin-main">

      <!-- === DASHBOARD TAB === -->
      <div v-if="activeTab === 'dashboard'">
        <div class="flex justify-between items-center mb-16">
          <div>
            <h1 class="text-title" style="font-size: 28px;">{{ $t('admin.platformOverview') }}</h1>
            <p class="text-secondary mt-8">{{ $t('admin.platformDesc') }}</p>
          </div>
          <button class="btn btn-success" @click="showCreateModal = true">{{ $t('admin.createAgency') }}</button>
        </div>

        <!-- Trend Chart -->
        <div class="card mt-24">
          <div class="text-subtitle mb-16">{{ $t('admin.trendTitle') }}</div>
          <div class="chart-container">
            <svg :viewBox="`0 0 ${chartW} ${chartH}`" class="trend-chart">
              <line v-for="i in 4" :key="'g' + i" :x1="0" :y1="chartH * i / 4" :x2="chartW" :y2="chartH * i / 4"
                stroke="rgba(139,92,246,0.08)" stroke-width="1" />
              <polygon :points="areaPoints" fill="url(#chartGrad)" opacity="0.3" />
              <polyline :points="linePoints" fill="none" stroke="#8B5CF6" stroke-width="3" stroke-linecap="round"
                stroke-linejoin="round" />
              <circle v-for="(p, i) in dataPoints" :key="i" :cx="p.x" :cy="p.y" r="5" fill="#8B5CF6" stroke="#0F0A1A"
                stroke-width="3" />
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.4" />
                  <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div class="chart-labels">
              <span v-for="d in adminData.trendData" :key="d.day" class="chart-label">{{ d.day }}</span>
            </div>
          </div>
        </div>

        <!-- Agency Quick Table -->
        <div class="card mt-24">
          <div class="flex justify-between items-center mb-16">
            <div class="text-subtitle">{{ $t('admin.activeAgenciesDir') }}</div>
            <span class="text-caption text-primary" style="cursor:pointer;" @click="activeTab = 'agencies'">{{
              $t('common.viewAll') }}</span>
          </div>
          <table class="admin-table">
            <thead>
              <tr>
                <th>{{ $t('admin.agencyId') }}</th>
                <th>{{ $t('admin.name') }}</th>
                <th>{{ $t('admin.hosts') }}</th>
                <th>{{ $t('admin.model') }}</th>
                <th>{{ $t('admin.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ag in adminData.agencies" :key="ag.id">
                <td class="text-mono text-caption">{{ ag.id }}</td>
                <td>
                  <div class="flex items-center gap-8">
                    <div class="avatar avatar-sm" :style="{ background: avatarColor(ag.name) }">{{
                      avatarInitials(ag.name) }}</div>
                    <span>{{ ag.name }}</span>
                  </div>
                </td>
                <td class="num">{{ ag.hostCount }}</td>
                <td>
                  <span class="badge" :class="ag.payoutModel === 'unified' ? 'badge-primary' : 'badge-success'">
                    {{ ag.payoutModel === 'unified' ? $t('admin.unified') : $t('admin.dualTrack') }}
                  </span>
                </td>
                <td>
                  <span class="flex items-center gap-4">
                    <span class="status-dot" :class="ag.status === 'active' ? 'active' : 'frozen'"></span>
                    <span :class="ag.status === 'frozen' ? 'text-danger' : ''">{{ ag.status === 'active' ?
                      $t('common.active') : $t('common.frozen') }}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- === AGENCIES TAB === -->
      <div v-if="activeTab === 'agencies'">
        <div class="flex justify-between items-center mb-16">
          <h1 class="text-title" style="font-size: 28px;">{{ $t('admin.agencyDirectory') }}</h1>
          <button class="btn btn-success" @click="showCreateModal = true">{{ $t('admin.createAgency') }}</button>
        </div>

        <div class="card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>{{ $t('admin.agencyId') }}</th>
                <th>{{ $t('admin.name') }}</th>
                <th>{{ $t('admin.hosts') }}</th>
                <th>{{ $t('admin.monthlyVolume') }}</th>
                <th>{{ $t('admin.model') }}</th>
                <th>{{ $t('admin.status') }}</th>
                <th>{{ $t('admin.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ag in adminData.agencies" :key="ag.id">
                <td class="text-mono text-caption">{{ ag.id }}</td>
                <td>
                  <div class="flex items-center gap-8">
                    <div class="avatar avatar-sm" :style="{ background: avatarColor(ag.name) }">{{
                      avatarInitials(ag.name) }}</div>
                    <span>{{ ag.name }}</span>
                  </div>
                </td>
                <td class="num">{{ ag.hostCount }}</td>
                <td class="num">{{ formatNumber(ag.monthlyVolume) }}</td>
                <td>
                  <button class="model-badge" :class="ag.payoutModel === 'unified' ? 'badge-primary' : 'badge-success'"
                    @click="openModelChange(ag)">
                    {{ ag.payoutModel === 'unified' ? $t('admin.unified') : $t('admin.dualTrack') }}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2.5">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </button>
                </td>
                <td>
                  <span class="flex items-center gap-4">
                    <span class="status-dot" :class="ag.status === 'active' ? 'active' : 'frozen'"></span>
                    <span>{{ ag.status === 'active' ? $t('common.active') : $t('common.frozen') }}</span>
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm" :class="ag.status === 'active' ? 'btn-danger' : 'btn-ghost'"
                    @click="toggleFreeze(ag)">
                    {{ ag.status === 'active' ? $t('admin.freeze') : $t('admin.unfreeze') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- === SALARY TAB === -->
      <div v-if="activeTab === 'salary'">
        <h1 class="text-title mb-16" style="font-size: 28px;">{{ $t('admin.salaryPolicySetup') }}</h1>
        <p class="text-secondary mb-16">{{ $t('admin.salaryPolicyDesc') }}</p>

        <div class="card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>{{ $t('common.level') }}</th>
                <th>{{ $t('admin.coinsRequired') }}</th>
                <th>{{ $t('admin.validDays') }}</th>
                <th>{{ $t('admin.validHours') }}</th>
                <th>{{ $t('admin.baseSalaryDiamond') }}</th>
                <th>{{ $t('admin.micBonusDiamond') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in adminData.salaryTiers" :key="t.level">
                <td><span class="badge badge-primary">L{{ t.level }}</span></td>
                <td class="num">{{ formatNumber(t.coinsReq) }}</td>
                <td class="num">{{ t.days }}D</td>
                <td class="num">{{ t.hours }}H</td>
                <td class="num text-primary">{{ formatNumber(t.baseSalary) }}</td>
                <td class="num text-success">{{ formatNumber(t.micBonus) }}</td>
              </tr>
            </tbody>
          </table>
          <p class="text-caption mt-16" style="text-align: center;">{{ $t('admin.tiersNote') }}</p>
        </div>

        <div class="card mt-24" style="border-left: 4px solid var(--primary);">
          <div class="text-subtitle mb-8">{{ $t('admin.exchangeRate') }}</div>
          <div class="text-body"><strong>{{ $t('admin.exchangeRateValue') }}</strong></div>
          <div class="text-caption mt-8">{{ $t('admin.exchangeRateDesc') }}</div>
        </div>
      </div>

      <!-- === LANGUAGES TAB === -->
      <div v-if="activeTab === 'languages'">
        <LanguageManager />
      </div>
    </div>

    <!-- Create Agency Modal -->
    <Transition name="fade">
      <div v-if="showCreateModal" class="overlay" @click.self="showCreateModal = false">
        <div class="modal-card" style="max-width: 480px;">
          <h2 class="text-title mb-16">{{ $t('admin.createNewAgency') }}</h2>
          <div class="form-group">
            <label class="form-label">{{ $t('admin.agencyName') }}</label>
            <input v-model="newAgency.name" class="input-field" :placeholder="$t('admin.enterAgencyName')" />
          </div>
          <div class="form-group">
            <label class="form-label">{{ $t('admin.ownerUid') }}</label>
            <input v-model="newAgency.ownerUid" class="input-field" :placeholder="$t('admin.enterOwnerUid')" />
          </div>
          <div class="form-group">
            <label class="form-label">{{ $t('admin.contactLabel') }}</label>
            <input v-model="newAgency.contact" class="input-field" :placeholder="$t('admin.contactPlaceholder')" />
          </div>
          <div class="form-group">
            <label class="form-label">{{ $t('admin.logo') }}</label>
            <div class="logo-upload">
              <span>{{ $t('admin.uploadLogo') }}</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">{{ $t('admin.payoutModelLabel') }}</label>
            <select v-model="newAgency.payoutModel" class="input-field">
              <option value="dual_track">{{ $t('admin.dualTrackDesc') }}</option>
              <option value="unified">{{ $t('admin.unifiedDesc') }}</option>
            </select>
          </div>
          <div class="flex gap-12 mt-24">
            <button class="btn btn-ghost flex-1" @click="showCreateModal = false">{{ $t('common.cancel') }}</button>
            <button class="btn btn-success flex-1" :disabled="!newAgency.name || !newAgency.ownerUid"
              @click="createAgency">
              {{ $t('admin.createAgency') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Change Model Confirm Modal -->
    <Transition name="fade">
      <div v-if="showModelModal" class="overlay" @click.self="showModelModal = false">
        <div class="modal-card text-center" style="max-width: 420px;">
          <div style="font-size: 48px;">⚠️</div>
          <h2 class="text-title" style="margin-top: 16px;">{{ $t('admin.changeModelTitle') }}</h2>
          <p class="text-body text-secondary" style="margin-top: 12px; line-height: 1.6;">
            {{ $t('admin.changeModelDesc', { name: modelTarget?.name }) }}
          </p>

          <!-- 当前使用模式 -->
          <div class="model-info-row" style="margin-top: 20px;">
            <span class="model-info-label">{{ $t('admin.currentModel') }}</span>
            <span class="badge" :class="modelTarget?.payoutModel === 'unified' ? 'badge-primary' : 'badge-success'"
              style="font-size: 14px; padding: 6px 14px;">
              {{ modelTarget?.payoutModel === 'unified' ? $t('admin.unified') : $t('admin.dualTrack') }}
            </span>
          </div>

          <!-- 次月生效模式：变更前 → 变更后 -->
          <div class="model-info-row" style="margin-top: 12px;">
            <span class="model-info-label">{{ $t('admin.nextMonthModel') }}</span>
            <div class="model-switch-preview">
              <span class="badge"
                :class="modelTarget?.nextMonthPayoutModel === 'unified' ? 'badge-primary' : 'badge-success'"
                style="font-size: 14px; padding: 6px 14px;">
                {{ modelTarget?.nextMonthPayoutModel === 'unified' ? $t('admin.unified') : $t('admin.dualTrack') }}
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"
                style="margin: 0 10px;">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              <span class="badge" :class="modelNewValue === 'unified' ? 'badge-primary' : 'badge-success'"
                style="font-size: 14px; padding: 6px 14px;">
                {{ modelNewValue === 'unified' ? $t('admin.unified') : $t('admin.dualTrack') }}
              </span>
            </div>
          </div>

          <p class="text-caption text-warning" style="margin-top: 16px;">{{ $t('admin.changeModelNote') }}</p>
          <button class="btn btn-primary btn-block" style="margin-top: 20px;" @click="confirmModelChange">
            {{ $t('common.confirm') }}
          </button>
          <button class="btn btn-ghost btn-block" style="margin-top: 8px;" @click="showModelModal = false">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { adminData } from '../../mock/data.js'
import { formatNumber, avatarColor, avatarInitials } from '../../utils.js'
import LanguageManager from './LanguageManager.vue'

const { t } = useI18n({ useScope: 'global' })
const activeTab = ref('dashboard')
const showCreateModal = ref(false)
const toast = ref('')

const newAgency = ref({ name: '', ownerUid: '', contact: '', payoutModel: 'dual_track' })

function showToast(msg) { toast.value = msg; setTimeout(() => toast.value = '', 2500) }

const chartW = 1200
const chartH = 200
const dataPoints = computed(() => {
  const max = Math.max(...adminData.trendData.map(d => d.value))
  const padding = 30
  return adminData.trendData.map((d, i) => ({
    x: padding + (i / (adminData.trendData.length - 1)) * (chartW - padding * 2),
    y: padding + (1 - d.value / max) * (chartH - padding * 2)
  }))
})

const linePoints = computed(() => dataPoints.value.map(p => `${p.x},${p.y}`).join(' '))
const areaPoints = computed(() => {
  const pts = dataPoints.value
  const first = pts[0]
  const last = pts[pts.length - 1]
  return `${first.x},${chartH} ${linePoints.value} ${last.x},${chartH}`
})

function createAgency() {
  const id = `AG-${String(Math.floor(Math.random() * 90000) + 10000)}`
  adminData.agencies.push({ id, name: newAgency.value.name, hostCount: 0, payoutModel: newAgency.value.payoutModel, status: 'active', monthlyVolume: 0 })
  showCreateModal.value = false
  newAgency.value = { name: '', ownerUid: '', contact: '', payoutModel: 'dual_track' }
  showToast(t('admin.agencyCreated', { id }))
}

function toggleFreeze(ag) {
  ag.status = ag.status === 'active' ? 'frozen' : 'active'
  showToast(t('admin.agencyStatus', { name: ag.name, status: ag.status }))
}

const showModelModal = ref(false)
const modelTarget = ref(null)
const modelNewValue = ref('')

function openModelChange(ag) {
  modelTarget.value = ag
  modelNewValue.value = ag.nextMonthPayoutModel === 'unified' ? 'dual_track' : 'unified'
  showModelModal.value = true
}

function confirmModelChange() {
  if (modelTarget.value) {
    modelTarget.value.nextMonthPayoutModel = modelNewValue.value
    showToast(t('admin.modelChanged', { name: modelTarget.value.name }))
  }
  showModelModal.value = false
  modelTarget.value = null
}
</script>

<style scoped>
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 40px;
  height: 40px;
  background: var(--primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s;
  text-decoration: none;
  font-size: 15px;
}

.nav-item:hover {
  background: var(--primary-light);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-dim);
  border-bottom: 1px solid var(--border-subtle);
}

.admin-table td {
  padding: 14px 16px;
  font-size: 14px;
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: middle;
}

.admin-table tr:last-child td {
  border-bottom: none;
}

.admin-table tr:hover td {
  background: rgba(139, 92, 246, 0.03);
}

.model-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.model-badge.badge-primary {
  background: var(--primary-light);
  color: var(--primary);
}

.model-badge.badge-success {
  background: rgba(16, 185, 129, 0.15);
  color: var(--success);
}

.model-badge:hover {
  opacity: 0.8;
  transform: scale(1.02);
}

.model-badge:active {
  transform: scale(0.97);
}

.model-switch-preview {
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: rgba(139, 92, 246, 0.06);
  border-radius: 8px;
}

.model-info-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
  margin-right: 12px;
}

.model-select {
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
}

.chart-container {
  margin-top: 8px;
}

.trend-chart {
  width: 100%;
  height: 200px;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 8px 30px 0;
}

.chart-label {
  font-size: 12px;
  color: var(--text-dim);
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.logo-upload {
  padding: 24px;
  text-align: center;
  border: 2px dashed var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-dim);
  cursor: pointer;
}

.logo-upload:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toast-enter-active {
  animation: toastIn 0.3s ease;
}

.toast-leave-active {
  animation: toastIn 0.3s ease reverse;
}
</style>
