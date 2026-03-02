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
        <h1 class="header-title">{{ $t('agencyDashboard.title') }}</h1>
        <div class="header-sub">{{ $t('agencyDashboard.realTimeData') }}</div>
      </div>
      <router-link to="/agency/profile" class="header-action" style="padding: 0;">
        <div class="avatar avatar-sm" :style="{ background: avatarColor(agencyData.current.name) }">
          {{ avatarInitials(agencyData.current.name) }}
        </div>
      </router-link>
    </div>

    <!-- Pending Applications Card -->
    <div v-if="agencyData.pendingApplications.length" class="card px-16 py-16" style="margin: 16px 24px 16px;">
      <div class="flex justify-between items-center" style="margin-bottom: 20px;">
        <div class="text-caption text-secondary"
          style="font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">{{
            $t('agencyDashboard.pendingApplications', { count: agencyData.pendingApplications.length }) }}</div>
        <button v-if="agencyData.pendingApplications.length > 1" @click="showAllApps = true" class="text-caption"
          style="color: var(--primary); font-weight: 600; background: none; border: none; padding: 0; cursor: pointer;">{{
            $t('common.viewAll') }}</button>
      </div>
      <div v-for="app in previewApps" :key="app.id" class="flex items-center gap-12"
        style="border-top: 1px solid var(--border-subtle); padding-top: 24px;">
        <UserAvatar :src="app.avatar" :name="app.nickname" size="md" />
        <div class="flex-1">
          <div class="text-body" style="font-weight: 600; font-size: 16px;">{{ app.nickname }}</div>
          <div class="text-caption text-secondary mt-4">{{ $t('agencyDashboard.applied', { date: app.appliedAt }) }}
          </div>
        </div>
        <div class="flex gap-12">
          <button class="icon-btn accept" style="width: 36px; height: 36px; border-radius: 50%;"
            @click="acceptApp(app)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
              stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
          <button class="icon-btn reject" style="width: 36px; height: 36px; border-radius: 50%; opacity: 0.8;"
            @click="rejectApp(app)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Balance Card -->
    <div class="card card-gradient" style="margin: 0 24px;">
      <div class="text-caption">{{ $t('agencyDashboard.revenuePool') }}</div>
      <div class="flex items-center gap-8 mt-8">
        <span style="font-size: 24px;">💎</span>
        <span class="text-hero num" style="font-size: 32px;">{{ formatNumber(agencyData.current.totalBalance) }}</span>
      </div>
      <div class="text-caption text-success mt-8">≈ {{ diamondsToUSD(agencyData.current.totalBalance) }} {{
        $t('common.usd') }}</div>
      <button class="btn btn-primary btn-block mt-16" @click="$router.push('/host/withdraw')">{{ $t('common.withdraw')
        }}</button>
    </div>

    <!-- Frozen Assets -->
    <router-link to="/host/frozen-bills" v-if="agencyData.current.frozenBalance > 0" class="frozen-card px-24"
      style="margin: 16px 24px 0; text-decoration: none; display: flex; align-items: center; justify-content: space-between;">
      <div class="flex items-center gap-8">
        <span class="frozen-icon">🔒</span>
        <span class="text-body" style="color: var(--text-primary);">{{ $t('agencyDashboard.frozenAmount', {
          amount:
            formatNumber(agencyData.current.frozenBalance)
        }) }}</span>
      </div>
      <div class="text-caption text-secondary" style="display: flex; align-items: center; gap: 4px;">
        {{ $t('common.viewDetails') }} <span style="font-size: 14px;">›</span>
      </div>
    </router-link>

    <!-- Cycle Stats -->
    <div class="card mt-16 px-24 pt-20 pb-24" style="margin: 16px 24px 0;">
      <div class="flex justify-between items-center mb-16">
        <div class="text-subtitle" style="line-height: 1;">{{ $t('agencyDashboard.cycleStats') || 'Current Cycle Stats'
          }}</div>
        <router-link to="/agency/history" class="text-caption flex items-center"
          style="color: var(--primary); text-decoration: none; font-weight: 600; line-height: 1;">{{
            $t('common.viewAll') || 'View All'
          }} ></router-link>
      </div>

      <div class="stats-grid">
        <div class="stat-item" style="grid-column: span 2;">
          <div class="text-caption text-secondary">{{ $t('agencyDashboard.totalDiamonds') || 'Total Diamonds' }}</div>
          <div class="text-body num" style="font-weight: 600;">💎 {{ formatNumber(agencyData.current.cycleTotalDiamonds)
          }}</div>
        </div>
        <div class="stat-item">
          <div class="text-caption text-secondary">{{ $t('agencyDashboard.hostDiamonds') || 'Host Earnings' }}</div>
          <div class="text-body num" style="font-weight: 600;">💎 {{ formatNumber(agencyData.current.cycleHostDiamonds)
          }}</div>
        </div>
        <div class="stat-item">
          <div class="text-caption text-secondary">{{ $t('agencyDashboard.agencyDiamonds') || 'Agency Share' }}</div>
          <div class="text-body num" style="font-weight: 600;">💎 {{
            formatNumber(agencyData.current.cycleAgencyDiamonds) }}</div>
        </div>
        <div class="stat-item">
          <div class="text-caption text-secondary">{{ $t('agencyDashboard.activeHosts') || 'Active Hosts' }}</div>
          <div class="text-body num" style="font-weight: 600;">👤 {{ agencyData.current.activeHosts }} / {{
            agencyData.current.hostCount }}
          </div>
        </div>
        <div class="stat-item">
          <div class="text-caption text-secondary">{{ $t('agencyDashboard.totalOnlineHours') || 'Online Hours' }}</div>
          <div class="text-body num" style="font-weight: 600;">⏳ {{ formatNumber(agencyData.current.totalOnlineHours) }}
          </div>
        </div>
      </div>
    </div>



    <!-- Members -->
    <div class="px-24 mt-24">
      <div class="flex justify-between items-center" style="margin-bottom: 8px;">
        <div class="section-header" style="margin-bottom: 0; line-height: 1;">{{ $t('agencyDashboard.members', {
          count:
            agencyData.members.length
        }) }}</div>
        <button class="view-all-btn flex items-center gap-4" style="line-height: 1; padding: 0;" @click="toggleSort">
          <span>{{ sortOrder === 'desc' ? ($t('agencyDashboard.sortHighest') || 'Highest First') :
            ($t('agencyDashboard.sortLowest') || 'Lowest First') }}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            style="display: block;">
            <template v-if="sortOrder === 'desc'">
              <path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4" />
            </template>
            <template v-else>
              <path d="M11 5h10M11 9h7M11 13h4M3 7l3-3 3 3M6 6v14" />
            </template>
          </svg>
        </button>
      </div>
      <div v-for="m in sortedMembers" :key="m.id" class="member-row"
        :class="{ 'member-frozen': m.status === 'frozen' }">
        <UserAvatar :src="m.avatar" :name="m.nickname" />
        <div class="flex-1">
          <div class="flex items-center gap-8">
            <span class="text-body" style="font-weight: 600;">{{ m.nickname }}</span>
            <span class="badge" :class="levelBadgeClass(m)">L{{ getMemberLevel(m).level }}</span>
            <span v-if="m.isNew" class="badge badge-new"
              style="background: rgba(255, 107, 107, 0.1); color: #FF6B6B; font-weight: normal; font-size: 10px; padding: 2px 6px;">NEW</span>
            <span v-if="m.status === 'frozen'" class="badge badge-frozen">{{ $t('common.frozen') }}</span>
          </div>
          <div class="text-caption num">💎 {{ formatNumber(m.coinsEarned) }}</div>
          <div class="level-progress">
            <div class="level-bar">
              <div class="level-fill" :style="{ width: getLevelPercent(m) + '%' }"></div>
            </div>
            <div v-if="getMemberLevel(m).nextReq" class="flex items-center gap-4 level-label">
              <img src="../../assets/coinslogo.png" style="width: 12px; height: 12px; object-fit: contain;"
                alt="coins" />
              <span>{{ $t('agencyDashboard.toLevel', {
                gap: formatNumber(getMemberLevel(m).gap), level:
                  getMemberLevel(m).level + 1
              }) }}</span>
            </div>
            <span v-else class="level-label text-success">MAX</span>
          </div>
          <div class="flex gap-16 mt-8">
            <div class="flex items-center gap-4">
              <span class="text-caption text-secondary">{{ $t('agencyDashboard.validDays') || 'Valid Days' }}:</span>
              <span class="text-caption num" style="font-weight: 600;">{{ m.validDays || 0 }}</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-caption text-secondary">{{ $t('agencyDashboard.micHours') || 'Mic Hours' }}:</span>
              <span class="text-caption num" style="font-weight: 600;">{{ m.validHours || 0 }}</span>
            </div>
          </div>
        </div>
        <div class="member-actions">
          <button v-if="m.status === 'active'" class="icon-btn chat" @click="openChat(m)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <div v-if="m.status === 'active'" class="more-wrap">
            <button class="icon-btn more" @click.stop="toggleMenu(m.id)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
            <Transition name="pop">
              <div v-if="openMenuId === m.id" class="popover-menu">
                <button class="popover-item danger" @click="kickMember(m)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  {{ $t('agencyDashboard.kickOut') }}
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <Transition name="fade">
      <div v-if="showConfirm" class="overlay" @click.self="showConfirm = false">
        <div class="modal-card text-center">
          <div style="font-size: 48px;">⚠️</div>
          <h2 class="text-title" style="margin-top: 16px;">{{ $t('agencyDashboard.confirmUnbind') }}</h2>
          <p class="text-body text-secondary" style="margin-top: 8px;">
            {{ $t('agencyDashboard.unbindDesc', { name: confirmTarget?.nickname }) }}
          </p>
          <button class="btn btn-danger btn-block" style="margin-top: 24px;" @click="confirmKick">
            {{ $t('agencyDashboard.confirmUnbindBtn') }}
          </button>
          <button class="btn btn-ghost btn-block" style="margin-top: 8px;" @click="showConfirm = false">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- All Applications Modal -->
    <Transition name="fade">
      <div v-if="showAllApps" class="overlay" @click.self="showAllApps = false">
        <div class="modal-card" style="max-width: 420px; max-height: 80vh; display: flex; flex-direction: column;">
          <div class="flex justify-between items-center" style="margin-bottom: 16px;">
            <h2 class="text-title">{{ $t('agencyDashboard.allApplications', {
              count:
                agencyData.pendingApplications.length
            }) }}</h2>
            <button class="close-btn" @click="showAllApps = false">✕</button>
          </div>
          <div class="apps-scroll">
            <div v-for="app in agencyData.pendingApplications" :key="app.id" class="list-item">
              <UserAvatar :src="app.avatar" :name="app.nickname" size="sm" />
              <div class="flex-1">
                <div class="text-body" style="font-weight: 600;">{{ app.nickname }}</div>
                <div class="text-caption">{{ app.appliedAt }}</div>
              </div>
              <div class="flex gap-8">
                <button class="icon-btn accept" @click="acceptApp(app)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
                <button class="icon-btn reject" @click="rejectApp(app)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </Transition>

    <div style="height: 40px;"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { agencyData, adminData } from '../../mock/data.js'
import { formatNumber, diamondsToUSD, avatarColor, avatarInitials } from '../../utils.js'
import UserAvatar from '../../components/UserAvatar.vue'

const { t } = useI18n({ useScope: 'global' })
const toast = ref('')
const showConfirm = ref(false)
const showAllApps = ref(false)
const openMenuId = ref(null)

function toggleMenu(id) { openMenuId.value = openMenuId.value === id ? null : id }
function openChat(m) { showToast(t('agencyDashboard.openingChat', { name: m.nickname })) }
if (typeof document !== 'undefined') { document.addEventListener('click', () => { openMenuId.value = null }) }

const confirmTarget = ref(null)
const previewApps = computed(() => agencyData.pendingApplications.slice(0, 1))

function getMemberLevel(m) {
  const tiers = adminData.salaryTiers; let level = 0; let nextReq = tiers[0]?.coinsReq || 0; let gap = nextReq - (m.coinsEarned || 0)
  for (let i = tiers.length - 1; i >= 0; i--) {
    if ((m.coinsEarned || 0) >= tiers[i].coinsReq) { level = tiers[i].level; const nextTier = tiers[i + 1]; nextReq = nextTier ? nextTier.coinsReq : null; gap = nextReq ? nextReq - (m.coinsEarned || 0) : 0; break }
  }
  return { level, nextReq, gap }
}

function levelBadgeClass(m) { const { level } = getMemberLevel(m); if (level >= 4) return 'badge-success'; if (level >= 2) return 'badge-primary'; if (level >= 1) return 'badge-warning'; return 'badge-muted' }

function getLevelPercent(m) {
  const info = getMemberLevel(m); if (!info.nextReq) return 100
  const tiers = adminData.salaryTiers; const currentTier = tiers.find(t => t.level === info.level); const currentReq = currentTier ? currentTier.coinsReq : 0
  const range = info.nextReq - currentReq; if (range <= 0) return 100
  return Math.min(100, Math.max(0, ((m.coinsEarned || 0) - currentReq) / range * 100))
}

const sortOrder = ref('desc')
function toggleSort() { sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc' }

const sortedMembers = computed(() => {
  return [...agencyData.members].sort((a, b) => {
    const valA = a.coinsEarned || 0;
    const valB = b.coinsEarned || 0;
    if (sortOrder.value === 'desc') {
      return valB - valA;
    } else {
      return valA - valB;
    }
  })
})

function showToast(msg) { toast.value = msg; setTimeout(() => toast.value = '', 2500) }
function kickMember(m) { openMenuId.value = null; confirmTarget.value = m; showConfirm.value = true }

function confirmKick() {
  const idx = agencyData.members.findIndex(m => m.id === confirmTarget.value.id)
  if (idx !== -1) agencyData.members.splice(idx, 1)
  showConfirm.value = false
  showToast(t('agencyDashboard.memberRemoved', { name: confirmTarget.value.nickname }))
  confirmTarget.value = null
}

function acceptApp(app) {
  const idx = agencyData.pendingApplications.findIndex(a => a.id === app.id)
  if (idx !== -1) {
    agencyData.pendingApplications.splice(idx, 1)
    agencyData.members.push({ id: app.userId, nickname: app.nickname, avatar: app.avatar || '', monthlyEarnings: 0, coinsEarned: 0, status: 'active' })
    agencyData.current.hostCount++
    showToast(t('agencyDashboard.joinedAgency', { name: app.nickname }))
  }
}

function rejectApp(app) {
  const idx = agencyData.pendingApplications.findIndex(a => a.id === app.id)
  if (idx !== -1) { agencyData.pendingApplications.splice(idx, 1); showToast(t('agencyDashboard.applicationRejected')) }
}
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 48px 20px 16px;
}

.header-back,
.header-action {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 50%;
  color: var(--text-muted);
  cursor: pointer;
  text-decoration: none;
  flex-shrink: 0;
}

.header-back {
  color: var(--text-primary);
}

.header-back:active,
.header-action:active {
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

.header-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.member-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.member-row:last-child {
  border-bottom: none;
}

.member-frozen {
  opacity: 0.5;
}

.badge-frozen {
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger);
  font-size: 11px;
  padding: 2px 8px;
}

.icon-btn.disabled,
.icon-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.level-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.level-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
}

.level-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.level-label {
  font-size: 11px;
  color: var(--text-dim);
  white-space: nowrap;
  flex-shrink: 0;
}

.member-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.icon-btn.chat {
  background: rgba(139, 92, 246, 0.12);
  color: var(--primary);
}

.icon-btn.chat:hover {
  background: rgba(139, 92, 246, 0.25);
}

.icon-btn.more {
  background: none;
  color: var(--text-muted);
}

.icon-btn.more:hover {
  color: var(--text-primary);
}

.more-wrap {
  position: relative;
}

.popover-menu {
  position: absolute;
  right: 0;
  top: 40px;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 4px;
  min-width: 140px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 100;
}

.popover-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: none;
  color: var(--text-primary);
  font-size: 14px;
  font-family: inherit;
  border-radius: 6px;
  cursor: pointer;
}

.popover-item:hover {
  background: var(--primary-light);
}

.popover-item.danger {
  color: var(--danger);
}

.popover-item.danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

.pop-enter-active {
  animation: popIn 0.15s ease;
}

.pop-leave-active {
  animation: popIn 0.15s ease reverse;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-4px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
  flex-shrink: 0;
}

.icon-btn:active {
  transform: scale(0.9);
}

.icon-btn.accept {
  background: var(--success);
  color: #fff;
}

.icon-btn.reject {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-muted);
}

.icon-btn.reject:hover {
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger);
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

.view-all-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  padding: 4px 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-input);
  border: none;
  border-radius: 50%;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 16px;
}

.apps-scroll {
  overflow-y: auto;
  flex: 1;
  -webkit-overflow-scrolling: touch;
}

.frozen-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: 16px;
}

.frozen-card:active {
  background: rgba(255, 255, 255, 0.05);
}

.frozen-icon {
  font-size: 16px;
  opacity: 0.8;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.03);
  padding: 10px 12px;
  border-radius: 8px;
}
</style>
