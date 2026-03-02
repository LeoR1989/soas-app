<template>
  <div class="mobile-container">
    <!-- Header -->
    <div class="header-bar">
      <button class="header-back" @click="$router.push('/')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div class="header-center">
        <h1 class="header-title">{{ $t('hostUnjoined.title') }}</h1>
      </div>
      <div style="width: 36px;"></div>
    </div>

    <!-- Lock Illustration -->
    <div class="lock-section">
      <div class="lock-icon-circle">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <p class="lock-title">{{ $t('hostUnjoined.withdrawLocked') }}</p>
      <p class="lock-desc">{{ $t('hostUnjoined.lockDesc') }}</p>
    </div>

    <!-- Pending Application Banner -->
    <div v-if="hostData.pendingApplication" class="pending-banner">
      <div class="pending-icon">⏳</div>
      <div class="pending-text">
        <span class="pending-label">{{ $t('hostUnjoined.applicationReview') }}</span>
        <span class="pending-sub">{{ hostData.pendingApplication.agencyName }}</span>
      </div>
      <button class="btn btn-sm btn-ghost"
        style="color: var(--warning); padding: 4px 12px; height: 32px; background: rgba(245, 158, 11, 0.1);"
        @click="cancelApplication">{{ $t('common.cancel') }}</button>
    </div>

    <!-- Search Box -->
    <div class="search-section px-24">
      <div class="search-box" :class="{ disabled: !!hostData.pendingApplication }">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input v-model="searchQuery" type="text" :placeholder="$t('hostUnjoined.searchPlaceholder')"
          class="search-input" :disabled="!!hostData.pendingApplication" />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</button>
      </div>
    </div>

    <!-- Recommended / Search Results -->
    <div class="recommend-section px-24">
      <div class="section-header" style="text-transform: uppercase;">
        {{ searchQuery ? $t('hostUnjoined.searchResults') : $t('hostUnjoined.recommendedAgencies') }}
      </div>
      <div class="agency-list">
        <div v-if="searchQuery && filteredAgencies.length === 0" class="search-error text-center py-20 text-muted"
          style="color: var(--text-muted); padding: 24px 0;">
          {{ $t('hostUnjoined.noAgencyFound') }}
        </div>
        <div v-for="ag in (searchQuery ? filteredAgencies : recommendedAgencies)" :key="ag.id"
          class="agency-row hover-effect" style="cursor: pointer;" @click="viewAgency(ag)">
          <UserAvatar :src="ag.logo" :name="ag.name" size="sm" />
          <div class="flex-1">
            <div class="flex items-center gap-8">
              <span class="text-subtitle">{{ ag.name }}</span>
            </div>
            <div class="text-caption">ID: {{ ag.id }}</div>
          </div>
          <button class="btn btn-sm" :class="getApplyBtnClass(ag)" :disabled="!!hostData.pendingApplication"
            @click.stop="applyAgency(ag)">
            {{ getApplyBtnText(ag) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Create Agency Enticement -->
    <div class="create-agency-section"
      style="margin: 32px 24px; padding: 20px; text-align: center; border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle); background: var(--bg-input);">
      <div class="text-subtitle">{{ $t('hostUnjoined.createAgencyTitle') }}</div>
      <div class="text-caption text-muted" style="margin-top: 8px; line-height: 1.5;">
        {{ $t('hostUnjoined.createAgencyDesc') }}
      </div>
      <a href="mailto:cs@gugukapp.com" class="btn btn-ghost"
        style="margin-top: 16px; width: 100%; border: 1px solid var(--border-default);">
        {{ $t('hostUnjoined.createAgencyEmail') }}
      </a>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { hostData, recommendedAgencies, agencyData } from '../../mock/data.js'
import { delay } from '../../utils.js'
import UserAvatar from '../../components/UserAvatar.vue'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const searchQuery = ref('')
const toast = ref('')

const filteredAgencies = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []
  return recommendedAgencies.filter(a =>
    a.id.toLowerCase().includes(q) ||
    a.id.toLowerCase().replace('ag-', '').includes(q) ||
    a.name.toLowerCase().includes(q)
  )
})

function showToast(msg) {
  toast.value = msg
  setTimeout(() => toast.value = '', 2500)
}

function viewAgency(ag) {
  agencyData.current = {
    ...agencyData.current,
    id: ag.id,
    name: ag.name,
    logo: ag.logo,
    hostCount: Math.floor(Math.random() * 80) + 20 // Mock
  }
  router.push('/agency/profile-readonly')
}

async function applyAgency(ag) {
  if (hostData.pendingApplication) return

  hostData.pendingApplication = {
    agencyId: ag.id,
    agencyName: ag.name,
    appliedAt: new Date().toISOString()
  }
  showToast(t('hostUnjoined.applicationSent', { name: ag.name }))
  searchQuery.value = ''

  // Simulate auto-accept after 3 seconds for demo
  await delay(3000)
  if (hostData.pendingApplication?.agencyId === ag.id) {
    hostData.agency = {
      id: ag.id,
      name: ag.name,
      logo: null
    }
    hostData.pendingApplication = null
    showToast(t('hostUnjoined.applicationAccepted'))
    await delay(1000)
    router.push('/host/dashboard')
  }
}

function cancelApplication() {
  const name = hostData.pendingApplication?.agencyName
  hostData.pendingApplication = null
  showToast(t('hostUnjoined.applicationCancelled', { name }))
}

function getApplyBtnClass(ag) {
  if (hostData.pendingApplication?.agencyId === ag.id) return 'btn-disabled badge-warning'
  if (hostData.pendingApplication) return 'btn-ghost btn-disabled'
  return 'btn-primary'
}

function getApplyBtnText(ag) {
  if (hostData.pendingApplication?.agencyId === ag.id) return t('common.pending')
  return t('common.apply')
}
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 48px 20px 16px;
}

.header-back {
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

.header-back:active {
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

.lock-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px 40px;
  text-align: center;
}

.lock-icon-circle {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  margin-bottom: 20px;
}

.lock-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.lock-desc {
  font-size: 14px;
  color: var(--text-muted);
  max-width: 280px;
  line-height: 1.6;
}

/* Pending Banner */
.pending-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 24px 20px;
  padding: 14px 16px;
  background: var(--warning-light);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform 0.2s;
}

.pending-banner:active {
  transform: scale(0.98);
}

.pending-icon {
  font-size: 24px;
}

.pending-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pending-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--warning);
}

.pending-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.pending-arrow {
  color: var(--warning);
  font-weight: 700;
}

/* Search */
.search-section {
  margin-bottom: 8px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: var(--text-dim);
}

.search-input {
  width: 100%;
  padding: 14px 40px 14px 48px;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 16px;
  outline: none;
  -moz-appearance: textfield;
  appearance: textfield;
}

.search-input::-webkit-outer-spin-button,
.search-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
}

.search-input::placeholder {
  color: var(--text-dim);
}

.search-input:focus {
  border-color: var(--primary);
}

.search-clear {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  font-size: 16px;
}

.search-result,
.search-error {
  margin-top: 12px;
}

.search-error {
  color: var(--danger);
  font-size: 14px;
  padding: 8px 0;
}

/* Agency Rows */
.agency-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  margin-bottom: 10px;
}

.recommend-section {
  margin-top: 16px;
}

.agency-list {
  margin-top: 8px;
}

/* Toast animation */
.toast-enter-active {
  animation: toastIn 0.3s ease;
}

.toast-leave-active {
  animation: toastIn 0.3s ease reverse;
}
</style>
