<template>
  <div class="mobile-container">
    <div class="profile-header">
      <button class="back-btn" @click="$router.push('/host/dashboard')">
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
        <div class="avatar avatar-xl" :style="{ background: avatarColor(agencyData.current.name), margin: '0 auto' }">
          {{ avatarInitials(agencyData.current.name) }}
        </div>
        <h2 class="text-title" style="margin-top: 16px;">{{ agencyData.current.name }}</h2>
        <div class="text-caption">ID: {{ agencyData.current.id }}</div>
        <div class="flex justify-center gap-8 mt-8">
          <span class="badge badge-success">{{ $t('agencyProfile.hosts', { count: agencyData.current.hostCount })
            }}</span>
        </div>
      </div>

      <!-- Admin Info Card -->
      <div class="admin-card mt-16">
        <div class="text-caption mb-12">{{ $t('agencyProfile.agencyAdmin') }}</div>
        <div class="flex items-center gap-12">
          <img :src="agencyData.current.adminAvatar" class="avatar avatar-md" alt="admin avatar" />
          <div class="flex-1">
            <div class="text-body font-bold">{{ agencyData.current.adminName }}</div>
            <div class="text-caption text-muted">ID: {{ agencyData.current.ownerUid }}</div>
          </div>
          <button class="btn btn-primary btn-sm" @click="startChat"
            style="padding: 6px 12px; font-size: 13px; border-radius: 99px; display: flex; align-items: center; gap: 4px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {{ $t('common.chat') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { agencyData } from '../../mock/data.js'
import { avatarColor, avatarInitials } from '../../utils.js'

const { t } = useI18n()
const toast = ref('')

function startChat() {
  toast.value = t('agencyProfile.openingChat', { name: agencyData.current.adminName })
  setTimeout(() => toast.value = '', 2000)
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

.admin-card {
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}

.toast-enter-active {
  animation: toastIn 0.3s ease;
}

.toast-leave-active {
  animation: toastIn 0.3s ease reverse;
}
</style>
