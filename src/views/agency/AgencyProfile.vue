<template>
  <div class="mobile-container">
    <div class="profile-header">
      <button class="back-btn" @click="$router.push('/agency')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <h1 class="text-title">{{ $t('agencyProfile.title') }}</h1>
      <div style="width: 24px;"></div>
    </div>

    <div class="profile-content px-24">
      <!-- Avatar & Name -->
      <div class="text-center" style="margin-bottom: 32px;">
        <div class="avatar-wrap" @click="showAvatarSheet = true">
          <div class="avatar avatar-xl" :style="{ background: avatarColor(agencyData.current.name), margin: '0 auto' }">
            {{ avatarInitials(agencyData.current.name) }}
          </div>
          <div class="avatar-edit-badge">📷</div>
        </div>
        <h2 class="text-title" style="margin-top: 16px;">{{ agencyData.current.name }}</h2>
        <div class="text-caption">ID: {{ agencyData.current.id }}</div>
        <div class="flex justify-center gap-8 mt-8">
          <span class="badge badge-success">{{ $t('common.active') }}</span>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-item card">
          <div class="text-caption">{{ $t('agencyProfile.totalHosts') }}</div>
          <div class="text-title num">{{ agencyData.current.hostCount }}</div>
        </div>
        <div class="stat-item card">
          <div class="text-caption">{{ $t('agencyProfile.payoutModel') }}</div>
          <div class="text-subtitle" style="text-transform: capitalize;">{{ agencyData.current.payoutModel === 'unified'
            ? $t('admin.unified') : $t('admin.dualTrack') }}</div>
        </div>
      </div>
    </div>

    <!-- Avatar Action Sheet -->
    <Transition name="fade">
      <div v-if="showAvatarSheet" class="overlay" @click.self="showAvatarSheet = false">
        <div class="action-sheet">
          <div class="action-sheet-title">{{ $t('agencyProfile.changeAvatar') }}</div>
          <button class="action-sheet-btn" @click="simulateUpload('camera')">
            <span>📸</span> {{ $t('agencyProfile.takePhoto') }}
          </button>
          <button class="action-sheet-btn" @click="simulateUpload('album')">
            <span>🖼️</span> {{ $t('agencyProfile.chooseFromAlbum') }}
          </button>
          <button class="action-sheet-btn cancel" @click="showAvatarSheet = false">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" class="toast-bar">{{ toast }}</div>
    </Transition>

    <!-- Bottom Agreement Link -->
    <div class="agreement-footer">
      <span class="agreement-footer-text">{{ $t('recharge.agreePrefix') }}</span><router-link to="/agency/agreement" class="agreement-footer-link">{{ $t('agencyAgreement.title') }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { agencyData } from '../../mock/data.js'
import { formatNumber, avatarColor, avatarInitials } from '../../utils.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
const showAvatarSheet = ref(false)
const toast = ref('')

function showToast(msg) {
  toast.value = msg
  setTimeout(() => toast.value = '', 2500)
}

function simulateUpload(source) {
  showAvatarSheet.value = false
  showToast(source === 'camera' ? '📸 ' + t('agencyProfile.takePhoto') + '...' : '🖼️ ' + t('agencyProfile.chooseFromAlbum') + '...')
}
</script>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 56px 24px 16px;
}

.back-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
}

.profile-content {
  padding-top: 8px;
  padding-bottom: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-item {
  text-align: center;
  padding: 16px;
}

.avatar-wrap {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.avatar-edit-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 2px solid var(--bg-primary);
}

.overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
}

.action-sheet {
  width: 100%;
  max-width: 500px;
  background: var(--bg-card);
  border-radius: 16px 16px 0 0;
  padding: 8px 0;
  padding-bottom: env(safe-area-inset-bottom, 16px);
}

.action-sheet-title {
  text-align: center;
  padding: 16px;
  font-weight: 600;
  font-size: 15px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-subtle);
}

.action-sheet-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px 24px;
  background: none;
  border: none;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-primary);
  font-size: 16px;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
}

.action-sheet-btn:active {
  background: var(--bg-input);
}

.action-sheet-btn.cancel {
  justify-content: center;
  color: var(--danger);
  font-weight: 600;
  border-bottom: none;
}

.toast-bar {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  z-index: 200;
  font-size: 14px;
  font-weight: 500;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.toast-enter-active { animation: toastIn 0.3s ease; }
.toast-leave-active { animation: toastIn 0.3s ease reverse; }
@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.agreement-footer {
  text-align: center;
  padding: 24px 24px 40px;
}
.agreement-footer-text {
  font-size: 12px;
  color: var(--text-muted);
}
.agreement-footer-link {
  font-size: 12px;
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}
.agreement-footer-link:active {
  opacity: 0.7;
}
</style>
