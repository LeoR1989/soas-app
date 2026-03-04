<template>
  <div class="admin-container">
    <!-- Sidebar -->
    <div class="admin-sidebar">
      <div class="sidebar-brand">
        <div class="brand-logo">⚡</div>
        <span class="brand-text">{{ $t('admin.brand') }}</span>
      </div>

      <nav class="sidebar-nav">
        <a class="nav-item" :class="{ active: activeTab === 'agencies' }" @click="activeTab = 'agencies'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          {{ $t('admin.agencyDirectory') }}
        </a>
        <a class="nav-item" :class="{ active: activeTab === 'withdrawOrders' }" @click="activeTab = 'withdrawOrders'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="18" rx="2" />
            <path d="M8 7h8" /><path d="M8 11h8" /><path d="M8 15h4" />
          </svg>
          {{ $t('admin.withdrawOrders') || 'Withdraw Orders' }}
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
          <div class="flex items-center gap-12">
            <div class="search-box">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input v-model="agencySearch" type="text" :placeholder="$t('common.searchPlaceholder') || 'Search ID or Name'" class="search-input" />
              <button v-if="agencySearch" class="search-clear" @click="agencySearch = ''">✕</button>
            </div>
            <button class="btn btn-success" @click="showCreateModal = true">{{ $t('admin.createAgency') }}</button>
          </div>
        </div>

        <div class="card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>{{ $t('admin.agencyId') }}</th>
                <th>{{ $t('admin.name') }}</th>
                <th>{{ $t('admin.hosts') || 'Active / Total' }}</th>
                <th>{{ $t('admin.monthlyVolume') }}</th>
                <th>{{ $t('admin.model') }}</th>
                <th>{{ $t('admin.status') }}</th>
                <th>{{ $t('admin.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ag in filteredAgencies" :key="ag.id">
                <td class="text-mono text-caption">{{ ag.id }}</td>
                <td>
                  <div class="flex items-center gap-8">
                    <div class="avatar avatar-sm" :style="{ background: avatarColor(ag.name) }">{{
                      avatarInitials(ag.name) }}</div>
                    <span>{{ ag.name }}</span>
                  </div>
                </td>
                <td class="num">{{ ag.activeHostCount }} / <span class="text-muted">{{ ag.hostCount }}</span></td>
                <td class="num">
                  <div class="flex flex-col">
                    <span>💎 {{ formatNumber(ag.monthlyVolume) }}</span>
                    <span style="font-size: 11px; margin-top: 2px;" :class="getVolumeGrowth(ag) >= 0 ? 'text-success' : 'text-danger'">
                      {{ getVolumeGrowth(ag) >= 0 ? '↑' : '↓' }} {{ Math.abs(getVolumeGrowth(ag)) }}% vs Last Month
                    </span>
                  </div>
                </td>
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
                  <div class="flex items-center gap-8">
                    <button class="btn btn-sm btn-primary" @click="openHostsModal(ag)">{{ $t('admin.viewHosts') || 'Hosts' }}</button>
                    <button class="btn btn-sm" :class="ag.status === 'active' ? 'btn-danger' : 'btn-ghost'"
                      @click="toggleFreeze(ag)">
                      {{ ag.status === 'active' ? $t('admin.freeze') : $t('admin.unfreeze') }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- === WITHDRAW ORDERS TAB === -->
      <div v-if="activeTab === 'withdrawOrders'">
        <div class="flex justify-between items-center mb-16">
          <h1 class="text-title" style="font-size: 28px;">{{ $t('admin.withdrawOrders') || 'Withdraw Orders' }}</h1>
          <div class="search-box">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input v-model="withdrawSearch" type="text" :placeholder="$t('common.searchPlaceholder') || 'Search Order, UID or Name'" class="search-input" />
            <button v-if="withdrawSearch" class="search-clear" @click="withdrawSearch = ''">✕</button>
          </div>
        </div>
        <div class="card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>{{ $t('admin.orderNo') || 'Order No' }}</th>
                <th>UID</th>
                <th>{{ $t('admin.name') }}</th>
                <th>{{ $t('admin.diamondsAmount') || 'Diamonds' }}</th>
                <th>{{ $t('admin.usdAmount') || 'USD' }}</th>
                <th>{{ $t('admin.status') }}</th>
                <th>{{ $t('admin.date') || 'Date' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="wo in filteredWithdrawOrders" :key="wo.orderNo">
                <td class="text-mono text-caption">{{ wo.orderNo }}</td>
                <td class="text-mono">{{ wo.uid }}</td>
                <td>{{ wo.name }}</td>
                <td class="num text-primary">💎 {{ formatNumber(wo.diamonds) }}</td>
                <td class="num text-success">${{ formatNumber(wo.usdAmount) }}</td>
                <td>
                  <span class="badge" :class="{
                    'badge-success': wo.status === 'completed',
                    'badge-warning': wo.status === 'pending',
                    'badge-primary': wo.status === 'processing',
                    'badge-danger': wo.status === 'rejected'
                  }">{{ wo.status }}</span>
                </td>
                <td class="text-caption">{{ wo.date }}</td>
              </tr>
              <tr v-if="filteredWithdrawOrders.length === 0">
                <td colspan="7" class="text-center text-muted py-32">{{ $t('common.noData') || 'No Data' }}</td>
              </tr>
            </tbody>
          </table>
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

    <!-- Freeze/Unfreeze Confirm Modal -->
    <Transition name="fade">
      <div v-if="showFreezeModal" class="overlay" @click.self="showFreezeModal = false">
        <div class="modal-card text-center" style="max-width: 420px;">
          <div style="font-size: 48px;">⚠️</div>
          <h2 class="text-title" style="margin-top: 16px;">
            {{ freezeTarget?.status === 'active' ? $t('admin.freezeConfirmTitle') : $t('admin.unfreezeConfirmTitle') }}
          </h2>
          <p class="text-body text-secondary" style="margin-top: 12px; line-height: 1.6;">
            {{ freezeTarget?.status === 'active' ? $t('admin.freezeConfirmDesc', { name: freezeTarget?.name }) : $t('admin.unfreezeConfirmDesc', { name: freezeTarget?.name }) }}
          </p>

          <button class="btn btn-primary btn-block" style="margin-top: 24px;" @click="confirmToggleFreeze">
            {{ $t('common.confirm') }}
          </button>
          <button class="btn btn-ghost btn-block" style="margin-top: 8px;" @click="showFreezeModal = false">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Host Management Modal -->
    <Transition name="fade">
      <div v-if="showHostsModal" class="overlay" @click.self="showHostsModal = false">
        <div class="modal-card" style="max-width: 1100px; max-height: 85vh; overflow-y: auto;">
          <div class="flex justify-between items-center mb-16">
            <h2 class="text-title">{{ hostsModalAgency?.name }} - {{ $t('admin.viewHosts') || 'Hosts' }}</h2>
            <button class="close-btn" @click="showHostsModal = false">&times;</button>
          </div>
          <table class="admin-table" style="font-size: 13px;">
            <thead>
              <tr>
                <th>UID</th>
                <th>{{ $t('admin.name') }}</th>
                <th>{{ $t('admin.joinDate') || 'Joined' }}</th>
                <th>{{ $t('admin.currentCoins') || 'Coins (Month)' }}</th>
                <th>{{ $t('admin.lastMonthCoins') || 'Coins (Last)' }}</th>
                <th>{{ $t('admin.currentDiamonds') || 'Diamonds (Month)' }}</th>
                <th>{{ $t('admin.lastMonthDiamonds') || 'Diamonds (Last)' }}</th>
                <th>{{ $t('admin.activeDays') || 'Days' }}</th>
                <th>{{ $t('admin.micHours') || 'Mic Hrs' }}</th>
                <th>{{ $t('admin.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="host in currentHosts" :key="host.uid">
                <td class="text-mono">{{ host.uid }}</td>
                <td>
                  <div class="flex items-center gap-8">
                    <img v-if="host.avatar" :src="host.avatar" class="avatar avatar-sm" :alt="host.name" />
                    <div v-else class="avatar avatar-sm" :style="{ background: avatarColor(host.name) }">
                      {{ avatarInitials(host.name) }}
                    </div>
                    <span>{{ host.name }}</span>
                  </div>
                </td>
                <td class="text-caption">{{ host.joinDate }}</td>
                <td class="num">{{ formatNumber(host.currentCoins) }}</td>
                <td class="num text-muted">{{ formatNumber(host.lastMonthCoins) }}</td>
                <td class="num">💎 {{ formatNumber(host.currentDiamonds) }}</td>
                <td class="num text-muted">💎 {{ formatNumber(host.lastMonthDiamonds) }}</td>
                <td class="num">{{ host.activeDays }} / {{ host.lastMonthActiveDays }}</td>
                <td class="num">{{ host.micHours }} / {{ host.lastMonthMicHours }}</td>
                <td>
                  <div class="flex gap-4">
                    <button class="btn btn-sm btn-ghost" style="font-size: 11px;" @click="viewHostWithdrawals(host)">{{ $t('admin.withdrawRecords') || 'W/D' }}</button>
                    <button class="btn btn-sm btn-danger" style="font-size: 11px;" @click="kickHost(host)">{{ $t('admin.kick') || 'Kick' }}</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Transition>

    <!-- Host Withdraw Records Modal -->
    <Transition name="fade">
      <div v-if="showHostWithdrawModal" class="overlay" @click.self="showHostWithdrawModal = false">
        <div class="modal-card" style="max-width: 700px; max-height: 80vh; overflow-y: auto;">
          <div class="flex justify-between items-center mb-16">
            <h2 class="text-title">{{ hostWithdrawTarget?.name }} - {{ $t('admin.withdrawRecords') || 'Withdraw Records' }}</h2>
            <button class="close-btn" @click="showHostWithdrawModal = false">&times;</button>
          </div>
          <table v-if="hostWithdrawRecords.length" class="admin-table" style="font-size: 13px;">
            <thead>
              <tr>
                <th>{{ $t('admin.orderNo') || 'Order No' }}</th>
                <th>{{ $t('admin.diamondsAmount') || 'Diamonds' }}</th>
                <th>{{ $t('admin.usdAmount') || 'USD' }}</th>
                <th>{{ $t('admin.status') }}</th>
                <th>{{ $t('admin.date') || 'Date' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="wd in hostWithdrawRecords" :key="wd.orderNo">
                <td class="text-mono text-caption">{{ wd.orderNo }}</td>
                <td class="num">💎 {{ formatNumber(wd.diamonds) }}</td>
                <td class="num">${{ wd.usdAmount }}</td>
                <td><span class="badge" :class="{
                  'badge-success': wd.status === 'completed',
                  'badge-warning': wd.status === 'pending',
                  'badge-primary': wd.status === 'processing',
                  'badge-danger': wd.status === 'rejected'
                }">{{ wd.status }}</span></td>
                <td class="text-caption">{{ wd.date }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else class="text-center text-secondary py-32">{{ $t('common.noRecords') }}</div>
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
const activeTab = ref('agencies')
const showCreateModal = ref(false)
const toast = ref('')
const agencySearch = ref('')
const withdrawSearch = ref('')

const newAgency = ref({ name: '', ownerUid: '', contact: '', payoutModel: 'dual_track' })

function showToast(msg) { toast.value = msg; setTimeout(() => toast.value = '', 2500) }

function getVolumeGrowth(ag) {
  if (!ag.lastMonthVolume) return 100;
  return Math.round(((ag.monthlyVolume - ag.lastMonthVolume) / ag.lastMonthVolume) * 100);
}

// Filtered agencies
const filteredAgencies = computed(() => {
  const q = agencySearch.value.toLowerCase().trim()
  if (!q) return adminData.agencies
  return adminData.agencies.filter(ag => ag.id.toLowerCase().includes(q) || ag.name.toLowerCase().includes(q))
})

// Filtered withdraw orders
const filteredWithdrawOrders = computed(() => {
  const q = withdrawSearch.value.toLowerCase().trim()
  if (!q) return adminData.withdrawOrders
  return adminData.withdrawOrders.filter(wo =>
    wo.orderNo.toLowerCase().includes(q) ||
    wo.uid.toLowerCase().includes(q) ||
    wo.name.toLowerCase().includes(q) ||
    wo.status.toLowerCase().includes(q)
  )
})

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
  adminData.agencies.push({ id, name: newAgency.value.name, hostCount: 0, activeHostCount: 0, payoutModel: newAgency.value.payoutModel, status: 'active', monthlyVolume: 0, lastMonthVolume: 0 })
  showCreateModal.value = false
  newAgency.value = { name: '', ownerUid: '', contact: '', payoutModel: 'dual_track' }
  showToast(t('admin.agencyCreated', { id }))
}

const showFreezeModal = ref(false)
const freezeTarget = ref(null)

function toggleFreeze(ag) {
  freezeTarget.value = ag
  showFreezeModal.value = true
}

function confirmToggleFreeze() {
  if (freezeTarget.value) {
    const ag = freezeTarget.value
    ag.status = ag.status === 'active' ? 'frozen' : 'active'
    showToast(t('admin.agencyStatus', { name: ag.name, status: ag.status }))
  }
  showFreezeModal.value = false
  freezeTarget.value = null
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

// Host management
const showHostsModal = ref(false)
const hostsModalAgency = ref(null)
const currentHosts = ref([])

function openHostsModal(ag) {
  hostsModalAgency.value = ag
  currentHosts.value = adminData.agencyHosts[ag.id] || []
  showHostsModal.value = true
}

function kickHost(host) {
  currentHosts.value = currentHosts.value.filter(h => h.uid !== host.uid)
  showToast(host.name + ' has been removed')
}

// Host withdraw records
const showHostWithdrawModal = ref(false)
const hostWithdrawTarget = ref(null)
const hostWithdrawRecords = ref([])

function viewHostWithdrawals(host) {
  hostWithdrawTarget.value = host
  hostWithdrawRecords.value = adminData.withdrawOrders.filter(wo => wo.uid === host.uid)
  showHostWithdrawModal.value = true
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

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 14px;
  font-family: inherit;
  outline: none;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--text-muted);
  line-height: 1;
  padding: 4px;
}

.badge-warning {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.badge-danger {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}
</style>
