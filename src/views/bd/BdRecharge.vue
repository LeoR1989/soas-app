<template>
  <div class="page-container">
    <!-- Header -->
    <div class="withdraw-header px-24">
      <button class="back-btn" @click="$router.push('/bd')">‹</button>
      <h1 class="text-title">{{ $t('bd.rechargeTitle') }}</h1>
      <div style="width: 28px;"></div>
    </div>

    <!-- Balance Card -->
    <div class="balance-card px-24 mt-16">
      <div class="text-caption text-secondary">💎 {{ $t('bd.diamondWallet') }}</div>
      <div class="balance-row">
        <span class="balance-icon">💎</span>
        <span class="text-hero num">{{ formatNumber(bdData.balance.available) }}</span>
      </div>
    </div>

    <!-- Select Recipient -->
    <div class="px-24 mt-24">
      <label class="form-label">{{ $t('bd.selectRecipient') }} <span class="text-danger">*</span></label>
      <div v-if="!selectedUser" class="select-recipient-btn" @click="showRecipientModal = true">
        <span class="text-muted">{{ $t('bd.tapToSelect') }}</span>
        <span class="arrow">›</span>
      </div>
      <div v-else class="selected-user-card" @click="showRecipientModal = true">
        <img :src="selectedUser.avatar" class="user-avatar" />
        <div class="user-info">
          <div class="user-name">{{ selectedUser.name }}</div>
          <div class="user-id text-caption text-muted">ID: {{ selectedUser.uid }}</div>
        </div>
        <span class="change-text">{{ $t('bd.change') }}</span>
      </div>

      <!-- Diamond Input -->
      <div class="form-group mt-24">
        <label class="form-label">{{ $t('bd.diamondsToDeduct') }} <span class="text-danger">*</span></label>
        <div class="amount-input-wrap">
          <span class="diamond-prefix">💎</span>
          <input v-model="diamondInput" type="tel" class="amount-input" :placeholder="$t('bd.enterDiamonds')" />
          <button class="btn-max" @click="setMaxDiamonds">ALL</button>
        </div>
        <div v-if="diamondError" class="text-caption text-danger mt-8">{{ diamondError }}</div>
        <div v-if="diamondInputUSD" class="text-caption text-muted mt-8">≈ {{ diamondInputUSD }} USD</div>
      </div>

      <!-- Gold coins received -->
      <div v-if="goldCoinsReceived > 0" class="coins-preview mt-16">
        <div class="text-caption text-secondary">{{ $t('bd.recipientReceives') }}</div>
        <div class="coins-value">
          <img src="../../assets/coinslogo.png" class="coin-icon-img" alt="coins" />
          <span class="text-subtitle num">{{ formatNumber(goldCoinsReceived) }}</span>
          <span class="text-caption text-muted">{{ $t('bd.goldCoins') }}</span>
        </div>
      </div>

      <!-- Notes -->
      <div class="notes-section mt-24">
        <div class="text-body font-bold" style="color: var(--warning);">{{ $t('bd.importantNotes') }}</div>
        <div class="note-item mt-8">
          <span class="note-icon">⚠️</span>
          <span class="text-caption text-secondary">{{ $t('bd.noteNoConvert') }}</span>
        </div>
        <div class="note-item mt-8">
          <span class="note-icon">⚠️</span>
          <span class="text-caption text-secondary">{{ $t('bd.noteImmediate') }}</span>
        </div>
      </div>

      <!-- Confirm Button -->
      <button class="btn btn-primary btn-block mt-24" :disabled="!canConfirm" @click="doRecharge">
        {{ $t('bd.confirmRecharge') }}
      </button>
      <div style="height: 40px;"></div>
    </div>

    <!-- Recipient Modal -->
    <Transition name="fade">
      <div v-if="showRecipientModal" class="overlay" @click.self="showRecipientModal = false">
        <div class="modal-card" style="max-height: 80vh; overflow-y: auto;">
          <div class="modal-header">
            <h2 class="text-title">{{ $t('bd.selectRecipient') }}</h2>
            <button class="close-btn" @click="showRecipientModal = false">&times;</button>
          </div>
          <div class="tab-bar mt-16">
            <button class="tab-btn" :class="{ active: recipientTab === 'uid' }" @click="recipientTab = 'uid'">{{ $t('bd.byUID') }}</button>
            <button class="tab-btn" :class="{ active: recipientTab === 'recent' }" @click="recipientTab = 'recent'">{{ $t('bd.recent') }}</button>
          </div>
          <div v-if="recipientTab === 'uid'" class="mt-16 px-16">
            <input v-model="uidInput" type="text" class="form-input" :placeholder="$t('bd.enterUID')" />
            <button class="btn btn-primary btn-block mt-16" :disabled="!uidInput.trim()" @click="searchByUID">{{ $t('bd.search') }}</button>
            <div v-if="uidSearchResult" class="user-result-card mt-16" @click="pickUser(uidSearchResult)">
              <img :src="uidSearchResult.avatar" class="user-avatar" />
              <div class="user-info">
                <div class="user-name">{{ uidSearchResult.name }}</div>
                <div class="user-id text-caption text-muted">ID: {{ uidSearchResult.uid }}</div>
              </div>
              <span class="select-text">{{ $t('bd.select') }}</span>
            </div>
            <div v-if="uidNotFound" class="text-caption text-danger mt-8">{{ $t('bd.userNotFound') }}</div>
          </div>
          <div v-if="recipientTab === 'recent'" class="mt-16">
            <div v-for="user in recentContacts" :key="user.uid" class="user-result-card" @click="pickUser(user)">
              <img :src="user.avatar" class="user-avatar" />
              <div class="user-info">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-id text-caption text-muted">ID: {{ user.uid }}</div>
              </div>
              <span class="select-text">{{ $t('bd.select') }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Success Modal -->
    <Transition name="fade">
      <div v-if="showSuccess" class="overlay" @click.self="resetAndContinue">
        <div class="modal-card text-center">
          <div class="result-icon">✅</div>
          <h2 class="text-title mt-16">{{ $t('bd.rechargeSuccess') }}</h2>
          <p class="text-body text-secondary mt-8">{{ $t('bd.rechargeSuccessDesc') }}</p>
          <div class="result-details mt-16">
            <div class="flex justify-between items-center">
              <span class="text-body text-secondary">{{ $t('bd.diamondsDeducted') }}</span>
              <span class="text-body num font-bold">💎 {{ formatNumber(parseInt(diamondInput)) }}</span>
            </div>
            <div class="flex justify-between items-center mt-8">
              <span class="text-body text-secondary">{{ $t('bd.recipientReceived') }}</span>
              <span class="text-body num font-bold"><img src="../../assets/coinslogo.png" class="coin-icon-img inline" alt="coins" /> {{ formatNumber(goldCoinsReceived) }}</span>
            </div>
            <div class="flex justify-between items-center mt-8">
              <span class="text-body text-secondary">{{ $t('bd.recipient') }}</span>
              <span class="text-body font-bold">{{ selectedUser?.name }}</span>
            </div>
          </div>
          <button class="btn btn-primary btn-block mt-24" @click="resetAndContinue">{{ $t('bd.continue') }}</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { bdData, recentContacts, mockUsers } from '../../mock/data.js'
import { formatNumber } from '../../utils.js'

const { t } = useI18n()
const showRecipientModal = ref(false)
const recipientTab = ref('uid')
const uidInput = ref('')
const uidSearchResult = ref(null)
const uidNotFound = ref(false)
const selectedUser = ref(null)
const diamondInput = ref('')
const showSuccess = ref(false)
const GOLD_RATE = 1

const goldCoinsReceived = computed(() => {
  const val = parseInt(diamondInput.value)
  return isNaN(val) || val <= 0 ? 0 : Math.floor(val * GOLD_RATE)
})

const diamondInputUSD = computed(() => {
  const val = parseInt(diamondInput.value)
  return isNaN(val) || val <= 0 ? '' : (val / 8300).toFixed(2)
})

const diamondError = computed(() => {
  const val = parseInt(diamondInput.value)
  if (!diamondInput.value) return ''
  if (isNaN(val) || val <= 0) return t('bd.invalidAmount')
  if (val > bdData.balance.available) return t('bd.insufficientBalance')
  return ''
})

const canConfirm = computed(() => {
  const val = parseInt(diamondInput.value)
  return selectedUser.value && !isNaN(val) && val > 0 && val <= bdData.balance.available
})

function setMaxDiamonds() { diamondInput.value = String(bdData.balance.available) }

function searchByUID() {
  uidNotFound.value = false; uidSearchResult.value = null
  const found = mockUsers.find(u => u.uid === uidInput.value.trim())
  if (found) uidSearchResult.value = found; else uidNotFound.value = true
}

function pickUser(user) {
  selectedUser.value = user; showRecipientModal.value = false; uidSearchResult.value = null; uidInput.value = ''
}

function doRecharge() {
  const diamonds = parseInt(diamondInput.value)
  bdData.balance.available -= diamonds
  showSuccess.value = true
}

function resetAndContinue() { showSuccess.value = false; diamondInput.value = '' }
</script>

<style scoped>
.page-container { min-height: 100vh; background: var(--bg-primary); color: var(--text-primary); max-width: 500px; margin: 0 auto; }
.withdraw-header { display: flex; align-items: center; justify-content: space-between; padding-top: 16px; }
.back-btn { background: none; border: none; font-size: 28px; color: var(--text-primary); cursor: pointer; padding: 0; width: 28px; line-height: 1; }
.balance-card { padding: 20px 24px; background: var(--bg-card); border-radius: var(--radius-lg); margin: 16px 24px 0; }
.balance-row { display: flex; align-items: center; gap: 10px; }
.balance-icon { font-size: 28px; }
.form-group { margin-bottom: 0; }
.form-label { display: block; font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px; }
.form-input { width: 100%; padding: 14px 16px; background: var(--bg-input); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-primary); font-family: inherit; font-size: 15px; outline: none; box-sizing: border-box; }
.select-recipient-btn { display: flex; align-items: center; justify-content: space-between; padding: 16px; background: var(--bg-input); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg); cursor: pointer; }
.select-recipient-btn:hover { border-color: var(--primary); }
.select-recipient-btn .arrow { font-size: 20px; color: var(--text-muted); }
.selected-user-card { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: var(--bg-input); border: 1px solid var(--primary); border-radius: var(--radius-lg); cursor: pointer; }
.user-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
.user-info { flex: 1; }
.user-name { font-weight: 700; font-size: 15px; }
.user-id { margin-top: 2px; }
.change-text { color: var(--primary); font-weight: 600; font-size: 14px; }
.amount-input-wrap { display: flex; align-items: center; background: var(--bg-input); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 4px; }
.diamond-prefix { padding: 0 12px; font-size: 20px; }
.amount-input { flex: 1; background: transparent; border: none; color: var(--text-primary); font-size: 22px; font-weight: 700; font-family: inherit; outline: none; padding: 10px 0; }
.btn-max { padding: 8px 16px; margin-right: 4px; background: var(--primary-light); border: none; border-radius: var(--radius-md); color: var(--primary); font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; }
.coins-preview { padding: 16px; background: rgba(255, 215, 0, 0.08); border: 1px solid rgba(255, 215, 0, 0.2); border-radius: var(--radius-md); }
.coins-value { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
.coin-icon-img { width: 20px; height: 20px; object-fit: contain; vertical-align: middle; }
.coin-icon-img.inline { display: inline; margin-right: 4px; }
.notes-section { padding: 16px; background: var(--bg-input); border-radius: var(--radius-md); }
.note-item { display: flex; align-items: flex-start; gap: 8px; }
.note-icon { flex-shrink: 0; }
.overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 24px; }
.modal-card { background: var(--bg-card); border-radius: var(--radius-lg); padding: 24px; width: 100%; max-width: 420px; border: 1px solid var(--border-subtle); }
.modal-header { display: flex; justify-content: space-between; align-items: center; }
.close-btn { background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text-muted); line-height: 1; padding: 4px; }
.tab-bar { display: flex; gap: 8px; border-bottom: 1px solid var(--border-subtle); }
.tab-btn { flex: 1; padding: 10px; background: none; border: none; border-bottom: 2px solid transparent; color: var(--text-muted); font-weight: 600; font-size: 14px; cursor: pointer; font-family: inherit; }
.tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }
.px-16 { padding-left: 8px; padding-right: 8px; }
.user-result-card { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: var(--bg-input); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); cursor: pointer; margin-bottom: 8px; }
.user-result-card:hover { border-color: var(--primary); }
.select-text { color: var(--primary); font-weight: 600; font-size: 13px; }
.result-icon { font-size: 48px; }
.result-details { padding: 16px; background: var(--bg-input); border-radius: var(--radius-md); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
