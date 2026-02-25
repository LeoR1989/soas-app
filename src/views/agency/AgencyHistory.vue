<template>
    <div class="mobile-container min-h-screen bg-body pb-safe">
        <!-- Header -->
        <div class="header-bar bg-card sticky top-0 z-10 blur-bg">
            <button class="header-back" @click="$router.push('/agency')">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </button>
            <div class="header-center">
                <h1 class="header-title">{{ $t('agencyDashboard.historyCycles') || 'Historical Cycles' }}</h1>
            </div>
            <div style="width: 36px"></div>
        </div>

        <!-- Contents -->
        <div class="px-24 mt-24">
            <div v-if="!agencyData.historyCycles || !agencyData.historyCycles.length"
                class="text-center text-secondary py-32">
                {{ $t('common.noData') || 'No historical data' }}
            </div>
            <div v-else class="flex flex-col gap-12">
                <div v-for="(cycle, idx) in agencyData.historyCycles" :key="idx" class="card p-16">
                    <div class="flex justify-between items-center mb-12 pb-12 border-b border-subtle">
                        <h3 class="text-subtitle m-0">{{ cycle.month }}</h3>
                        <span class="badge badge-primary">{{ $t('common.settled') || 'Settled' }}</span>
                    </div>

                    <div class="stats-grid mb-12">
                        <div class="stat-item" style="grid-column: span 2;">
                            <div class="text-caption text-secondary">{{ $t('agencyDashboard.totalDiamonds') || 'Total Diamonds' }}</div>
                            <div class="text-body num" style="font-weight: 600; color: var(--primary);">💎 {{ formatNumber(cycle.totalDiamonds) }}</div>
                        </div>
                    </div>

                    <!-- Keeping details consistent with dashboard -->
                    <div class="flex justify-between items-center mt-12 bg-body p-12 rounded-lg">
                        <div>
                            <div class="text-caption text-secondary">{{ $t('agencyDashboard.activeHosts') || 'Active Hosts' }}</div>
                            <div class="text-body num" style="font-weight: 600;">👤 {{ cycle.activeHosts }} / {{ cycle.totalHosts }}</div>
                        </div>
                        <div class="text-right">
                            <div class="text-caption text-secondary">{{ $t('agencyDashboard.totalOnlineHours') || 'Online Hours' }}</div>
                            <div class="text-body num" style="font-weight: 600;">⏳ {{ cycle.totalHours }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { agencyData } from '../../mock/data.js'
import { formatNumber } from '../../utils.js'
</script>

<style scoped>
.header-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 48px 20px 16px;
    border-bottom: 1px solid var(--border-subtle);
}

.header-back {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    border-radius: 50%;
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
    margin: 0;
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

.rounded-lg {
    border-radius: var(--radius-lg);
}
</style>
