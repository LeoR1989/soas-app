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
        <div class="avatar avatar-xl" :style="{ background: avatarColor(agencyData.current.name), margin: '0 auto' }">
          {{ avatarInitials(agencyData.current.name) }}
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
        <div class="stat-item card">
          <div class="text-caption">{{ $t('agencyProfile.revenuePool') }}</div>
          <div class="text-title num text-success">{{ formatNumber(agencyData.current.totalBalance) }}</div>
        </div>
        <div class="stat-item card">
          <div class="text-caption">{{ $t('agencyProfile.contact') }}</div>
          <div class="text-body truncate">{{ agencyData.current.contact }}</div>
        </div>
      </div>

      <!-- Owner -->
      <div class="card mt-24">
        <div class="text-caption mb-8">{{ $t('agencyProfile.ownerUid') }}</div>
        <div class="text-body text-mono">{{ agencyData.current.ownerUid }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { agencyData } from '../../mock/data.js'
import { formatNumber, avatarColor, avatarInitials } from '../../utils.js'
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
</style>
