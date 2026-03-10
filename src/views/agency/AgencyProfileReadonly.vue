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
        <div class="flex justify-center flex-wrap gap-8 mt-8">
          <span class="badge flex items-center gap-4" 
                :class="agencyData.current.payoutModel === 'unified' ? 'badge-primary' : 'badge-success'"
                @click="showPayoutNotice"
                style="cursor: pointer;">
            {{ agencyData.current.payoutModel === 'unified' ? $t('hostDashboard.unifiedModel') : $t('hostDashboard.dualTrackModel') }}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </span>
        </div>
      </div>

      <!-- Unified Member List -->
      <div class="mt-24">
        <div class="member-list flex flex-col gap-16">
          
          <!-- Owner Item (First) -->
          <div class="flex items-center justify-between" style="padding: 12px; background: rgba(255,255,255,0.02); border-radius: 12px;">
            <div class="flex items-center gap-12">
              <img :src="agencyData.current.adminAvatar" class="avatar avatar-md" alt="admin avatar" />
              <div class="flex flex-col">
                <div class="text-body font-bold">{{ agencyData.current.adminName }}</div>
                <div class="text-caption" style="color: var(--text-primary); opacity: 0.8; font-size: 11px; margin-top: 2px;">{{ $t('agencyProfile.agencyOwner') || 'AGENCY OWNER' }}</div>
              </div>
            </div>
            <button class="icon-btn chat" @click="startChat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>

          <!-- Hosts Items -->
          <template v-if="!isNormalUser">
            <div v-for="member in (agencyData.members || []).slice(0, 10)" :key="member.id" class="flex items-center justify-between" style="padding: 12px; background: rgba(255,255,255,0.02); border-radius: 12px;">
              <div class="flex items-center gap-12">
                <img :src="member.avatar" class="avatar avatar-md" :alt="member.nickname" />
                <div class="flex flex-col">
                  <div class="text-body font-bold">{{ member.nickname }}</div>
                  <div class="text-caption" style="color: var(--text-secondary); opacity: 0.8; font-size: 11px; margin-top: 2px;">Host</div>
                </div>
              </div>
              <button class="icon-btn chat" @click="startChatWith(member.nickname)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>
          </template>

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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { agencyData, hostData } from '../../mock/data.js'
import { avatarColor, avatarInitials } from '../../utils.js'

const { t } = useI18n({ useScope: 'global' })
const toast = ref('')

const isNormalUser = computed(() => !hostData.agency)

function startChat() {
  toast.value = t('agencyProfile.openingChat', { name: agencyData.current.adminName })
  setTimeout(() => toast.value = '', 2000)
}

function startChatWith(name) {
  toast.value = t('agencyProfile.openingChat', { name })
  setTimeout(() => toast.value = '', 2000)
}

function showPayoutNotice() {
  if (agencyData.current.payoutModel === 'unified') {
    toast.value = t('hostDashboard.unifiedNotice')
  } else {
    toast.value = t('hostDashboard.dualTrackNotice')
  }
  setTimeout(() => toast.value = '', 3000)
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
  background: rgba(255, 255, 255, 0.08); /* Dashboard original style */
  color: var(--text-muted);           /* Dashboard original text color base */
}

/* 覆盖之前自定义紫色的做法，向主 Dashboard 对齐使用无背景色附加（或者是同等变亮的效果），因为原版结构中对于 chat 按钮默认并没有额外添加特殊的 background。仅在原本存在 hover 时改变。但在主版中其实聊天也没有专门重绘样式！ */
.icon-btn.chat {
  color: #00D8C9;
}

.icon-btn.chat:hover {
  background: rgba(255,255,255, 0.15);
}

.icon-btn:active {
  transform: scale(0.9);
}
</style>
