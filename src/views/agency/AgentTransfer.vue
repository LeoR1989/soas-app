<template>
  <div class="page-container">
    <!-- Header -->
    <div class="agent-header">
      <button class="back-btn" @click="goBack">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
      </button>
      <h1 class="header-title">{{ $t('rechargeAgent.transferTitle') }}</h1>
      <div style="width: 22px;"></div>
    </div>

    <!-- KYC Check Modal -->
    <Transition name="fade">
      <div v-if="step === 'kyc'" class="overlay" @click.self="goBack">
        <div class="modal-card text-center">
          <div style="font-size: 56px;">🛡️</div>
          <h2 class="text-title" style="margin-top: 20px;">{{ $t('hostWithdraw.verificationRequired') }}</h2>
          <p class="text-body text-secondary" style="margin-top: 12px; line-height: 1.6;">{{ $t('hostWithdraw.verificationDesc') }}</p>
          <button class="btn btn-danger btn-block" style="margin-top: 24px;" @click="completeKyc">{{ $t('hostWithdraw.verifyNow') }}</button>
          <button class="btn btn-ghost btn-block" style="margin-top: 8px;" @click="goBack">{{ $t('common.cancel') }}</button>
        </div>
      </div>
    </Transition>

    <!-- PIN Setup -->
    <div v-if="step === 'pin-setup'" class="step-content">
      <div class="card" style="margin: 0 24px; text-align: center; position: relative;">
        <button @click="goBack" style="position: absolute; top: 12px; right: 16px; background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text-muted); line-height: 1; padding: 4px;">&times;</button>
        <div style="font-size: 56px; margin-top: 8px;">🔐</div>
        <h2 class="text-title" style="margin-top: 16px;">{{ $t('hostWithdraw.setPinTitle') }}</h2>
        <p class="text-body text-secondary" style="margin-top: 8px;">{{ $t('hostWithdraw.setPinDesc') }}</p>
        <div class="pin-dots" style="margin-top: 24px;">
          <div v-for="i in 6" :key="i" class="pin-dot" :class="{ filled: pinInput.length >= i }"></div>
        </div>
        <div class="numpad">
          <button v-for="n in [1,2,3,4,5,6,7,8,9,null,0,'del']" :key="n" class="numpad-key" :class="{ invisible: n === null }" @click="handlePinKey(n)">
            <template v-if="n === 'del'"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/><path d="m18 9-6 6"/><path d="m12 9 6 6"/></svg></template>
            <template v-else>{{ n }}</template>
          </button>
        </div>
        <p v-if="pinSetupPhase === 'confirm'" class="text-caption text-primary" style="margin-top: 12px;">{{ $t('hostWithdraw.reEnterPin') }}</p>
      </div>
    </div>

    <!-- PIN Verify -->
    <Transition name="fade">
      <div v-if="step === 'pin-verify'" class="overlay" @click.self="goBack">
        <div class="modal-card text-center" style="position: relative;">
          <button @click="goBack" style="position: absolute; top: 12px; right: 16px; background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text-muted); line-height: 1; padding: 4px;">&times;</button>
          <h2 class="text-title" style="margin-top: 8px;">{{ $t('hostWithdraw.enterPassword') }}</h2>
          <p class="text-body text-secondary" style="margin-top: 8px;">{{ $t('hostWithdraw.enterPinDesc') }}</p>
          <div class="pin-dots" style="margin-top: 24px;">
            <div v-for="i in 6" :key="i" class="pin-dot" :class="{ filled: verifyInput.length >= i, error: pinError }"></div>
          </div>
          <div class="numpad" style="margin-top: 24px;">
            <button v-for="n in [1,2,3,4,5,6,7,8,9,null,0,'del']" :key="n" class="numpad-key" :class="{ invisible: n === null }" @click="handleVerifyKey(n)">
              <template v-if="n === 'del'"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/><path d="m18 9-6 6"/><path d="m12 9 6 6"/></svg></template>
              <template v-else>{{ n }}</template>
            </button>
          </div>
          <div v-if="pinError" class="warning-bar mt-16"><span>⚠️</span><span>{{ pinError }}</span></div>
        </div>
      </div>
    </Transition>

    <!-- MAIN TRANSFER FORM -->
    <template v-if="step === 'main'">
      <!-- Balance Card -->
      <div class="balance-card px-24 mt-16">
        <div class="text-caption text-secondary">{{ $t('rechargeAgent.agentCoinBalance') }}</div>
        <div class="balance-row">
          <img src="../../assets/coinslogo.png" style="width: 24px; height: 24px;" alt="coins" />
          <span class="text-hero num" style="font-size: 28px;">{{ formatNumber(agencyData.rechargeAgent.coinBalance) }}</span>
        </div>
      </div>

      <!-- Select Recipient -->
      <div class="px-24 mt-24">
        <label class="form-label">{{ $t('recharge.selectRecipient') }} <span class="text-danger">*</span></label>
        <div v-if="!selectedUser" class="select-recipient-btn" @click="showRecipientModal = true">
          <span class="text-muted">{{ $t('recharge.tapToSelect') }}</span>
          <span class="arrow">›</span>
        </div>
        <div v-else class="selected-user-card" @click="showRecipientModal = true">
          <img :src="selectedUser.avatar" class="user-avatar" />
          <div class="user-info">
            <div class="user-name">{{ selectedUser.name }}</div>
            <div class="user-id text-caption text-muted">UID: {{ selectedUser.uid }}</div>
          </div>
          <span class="change-text">{{ $t('recharge.change') }}</span>
        </div>

        <!-- Coin Input -->
        <div class="form-group mt-24">
          <label class="form-label">{{ $t('rechargeAgent.transferAmount') }} <span class="text-danger">*</span></label>
          <div class="amount-input-wrap">
            <img src="../../assets/coinslogo.png" style="width: 20px; height: 20px; margin: 0 12px;" alt="coins" />
            <input v-model="coinInput" type="tel" class="amount-input" :placeholder="$t('rechargeAgent.enterCoins')" />
            <button class="btn-max" @click="coinInput = String(agencyData.rechargeAgent.coinBalance)">{{ $t('recharge.all') }}</button>
          </div>
          <div v-if="coinError" class="text-caption text-danger mt-8">{{ coinError }}</div>
        </div>

        <!-- Confirm Button -->
        <button class="btn btn-primary btn-block mt-24" :disabled="!canConfirm" @click="doTransfer">{{ $t('rechargeAgent.confirmTransfer') }}</button>
        <div style="height: 40px;"></div>
      </div>
    </template>

    <!-- Recipient Selection Modal -->
    <Transition name="fade">
      <div v-if="showRecipientModal" class="overlay" @click.self="showRecipientModal = false">
        <div class="modal-card" style="max-height: 80vh; overflow-y: auto;">
          <div class="modal-header">
            <h2 class="text-title">{{ $t('recharge.selectRecipient') }}</h2>
            <button class="close-btn" @click="showRecipientModal = false">&times;</button>
          </div>
          <div class="tab-bar mt-16">
            <button class="tab-btn" :class="{ active: recipientTab === 'uid' }" @click="recipientTab = 'uid'">{{ $t('recharge.byUID') }}</button>
            <button class="tab-btn" :class="{ active: recipientTab === 'recent' }" @click="recipientTab = 'recent'">{{ $t('recharge.recentChats') }}</button>
          </div>
          <div v-if="recipientTab === 'uid'" class="mt-16 px-16">
            <input v-model="uidInput" type="text" class="form-input" :placeholder="$t('recharge.enterUID')" />
            <button class="btn btn-primary btn-block mt-16" :disabled="!uidInput.trim()" @click="searchByUID">{{ $t('recharge.search') }}</button>
            <div v-if="uidSearchResult" class="user-result-card mt-16" @click="pickUser(uidSearchResult)">
              <img :src="uidSearchResult.avatar" class="user-avatar" />
              <div class="user-info">
                <div class="user-name">{{ uidSearchResult.name }}</div>
                <div class="user-id text-caption text-muted">UID: {{ uidSearchResult.uid }}</div>
              </div>
              <span class="select-text">{{ $t('recharge.selectUser') }}</span>
            </div>
            <div v-if="uidNotFound" class="text-caption text-danger mt-8">{{ $t('recharge.userNotFound') }}</div>
          </div>
          <div v-if="recipientTab === 'recent'" class="mt-16">
            <div v-for="user in recentContacts" :key="user.uid" class="user-result-card" @click="pickUser(user)">
              <img :src="user.avatar" class="user-avatar" />
              <div class="user-info">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-id text-caption text-muted">UID: {{ user.uid }}</div>
              </div>
              <span class="select-text">{{ $t('recharge.selectUser') }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Success Modal -->
    <Transition name="fade">
      <div v-if="showSuccess" class="overlay" @click.self="resetForm">
        <div class="modal-card text-center">
          <div style="font-size: 48px;">✅</div>
          <h2 class="text-title mt-16">{{ $t('rechargeAgent.transferSuccess') }}</h2>
          <div class="result-details mt-16">
            <div class="flex justify-between items-center">
              <span class="text-body text-secondary">{{ $t('rechargeAgent.coinsTransferred') }}</span>
              <div class="flex items-center gap-4">
                <img src="../../assets/coinslogo.png" style="width: 16px; height: 16px;" alt="coins" />
                <span class="text-body num font-bold">{{ formatNumber(parseInt(lastTransferAmount)) }}</span>
              </div>
            </div>
            <div class="flex justify-between items-center mt-8">
              <span class="text-body text-secondary">{{ $t('recharge.recipientLabel') }}</span>
              <span class="text-body font-bold">{{ lastTransferRecipient }}</span>
            </div>
          </div>
          <button class="btn btn-primary btn-block mt-24" @click="resetForm">{{ $t('common.confirm') }}</button>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" class="toast-bar">{{ toast }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { agencyData, hostData, MAX_PIN_ATTEMPTS, recentContacts, mockUsers } from '../../mock/data.js'
import { formatNumber } from '../../utils.js'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })

const step = ref('loading')
const toast = ref('')
const pinInput = ref('')
const pinSetupPhase = ref('create')
const firstPin = ref('')
const verifyInput = ref('')
const pinError = ref('')

const showRecipientModal = ref(false)
const recipientTab = ref('uid')
const uidInput = ref('')
const uidSearchResult = ref(null)
const uidNotFound = ref(false)
const selectedUser = ref(null)
const coinInput = ref('')
const showSuccess = ref(false)
const lastTransferAmount = ref(0)
const lastTransferRecipient = ref('')

onMounted(() => {
  if (!hostData.user.isKycVerified) {
    step.value = 'kyc'
  } else if (!hostData.user.hasPinSetup) {
    step.value = 'pin-setup'
  } else {
    step.value = 'pin-verify'
  }
})

function goBack() { router.push('/agency') }
function completeKyc() {
  hostData.user.isKycVerified = true
  step.value = hostData.user.hasPinSetup ? 'pin-verify' : 'pin-setup'
}

function handlePinKey(key) {
  if (key === null) return
  if (key === 'del') { pinInput.value = pinInput.value.slice(0, -1); return }
  if (pinInput.value.length >= 6) return
  pinInput.value += String(key)
  if (pinInput.value.length === 6) {
    if (pinSetupPhase.value === 'create') {
      firstPin.value = pinInput.value; pinInput.value = ''; pinSetupPhase.value = 'confirm'
    } else {
      if (pinInput.value === firstPin.value) {
        hostData.user.hasPinSetup = true; hostData.user.pin = pinInput.value
        showToast(t('hostWithdraw.pinSetSuccess')); step.value = 'main'
      } else {
        showToast(t('hostWithdraw.pinNoMatch')); pinInput.value = ''; pinSetupPhase.value = 'create'; firstPin.value = ''
      }
    }
  }
}

function handleVerifyKey(key) {
  if (key === null) return
  if (key === 'del') { verifyInput.value = verifyInput.value.slice(0, -1); pinError.value = ''; return }
  if (verifyInput.value.length >= 6) return
  verifyInput.value += String(key)
  if (verifyInput.value.length === 6) {
    if (verifyInput.value === hostData.user.pin) {
      step.value = 'main'; verifyInput.value = ''
    } else {
      hostData.user.pinAttempts++
      if (hostData.user.pinAttempts >= MAX_PIN_ATTEMPTS) {
        pinError.value = t('hostWithdraw.accountLocked'); setTimeout(() => router.push('/agency'), 2000)
      } else {
        pinError.value = t('hostWithdraw.wrongPin', { remaining: MAX_PIN_ATTEMPTS - hostData.user.pinAttempts }); verifyInput.value = ''
      }
    }
  }
}

const coinError = computed(() => {
  const val = parseInt(coinInput.value)
  if (!coinInput.value) return ''
  if (isNaN(val) || val <= 0) return t('recharge.invalidAmount')
  if (val > agencyData.rechargeAgent.coinBalance) return t('recharge.insufficientBalance')
  return ''
})

const canConfirm = computed(() => {
  const val = parseInt(coinInput.value)
  return selectedUser.value && !isNaN(val) && val > 0 && val <= agencyData.rechargeAgent.coinBalance
})

function searchByUID() {
  uidNotFound.value = false; uidSearchResult.value = null
  const found = mockUsers.find(u => u.uid === uidInput.value.trim())
  if (found) { uidSearchResult.value = found } else { uidNotFound.value = true }
}

function pickUser(user) {
  selectedUser.value = user; showRecipientModal.value = false; uidSearchResult.value = null; uidInput.value = ''
}

function doTransfer() {
  const coins = parseInt(coinInput.value)
  agencyData.rechargeAgent.coinBalance -= coins
  agencyData.rechargeAgentBills.transferRecords.unshift({
    id: 'RAT-' + Date.now(),
    date: new Date().toISOString().replace('T', ' ').slice(0, 19),
    coins,
    recipientUid: selectedUser.value.uid,
    recipientName: selectedUser.value.name,
    status: 'success'
  })
  lastTransferAmount.value = coins
  lastTransferRecipient.value = selectedUser.value.name
  showSuccess.value = true
}

function resetForm() { showSuccess.value = false; coinInput.value = '' }
function showToast(msg) { toast.value = msg; setTimeout(() => toast.value = '', 2500) }
</script>

<style scoped>
.page-container { min-height: 100vh; background: var(--bg-primary); color: var(--text-primary); max-width: 500px; margin: 0 auto; }
.agent-header { display: flex; align-items: center; justify-content: space-between; padding: 48px 20px 16px; }
.back-btn { background: none; border: none; color: var(--text-primary); cursor: pointer; padding: 0; }
.header-title { font-size: 18px; font-weight: 700; }
.step-content { padding-top: 16px; }
.balance-card { padding: 20px 24px; background: var(--bg-card); border-radius: var(--radius-lg); margin: 16px 24px 0; }
.balance-row { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
.form-label { display: block; font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px; }
.form-group { margin-bottom: 0; }
.select-recipient-btn { display: flex; align-items: center; justify-content: space-between; padding: 16px; background: var(--bg-input); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg); cursor: pointer; transition: border-color 0.2s; }
.select-recipient-btn:hover { border-color: var(--primary); }
.select-recipient-btn .arrow { font-size: 20px; color: var(--text-muted); }
.selected-user-card { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: var(--bg-input); border: 1px solid var(--primary); border-radius: var(--radius-lg); cursor: pointer; }
.user-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
.user-info { flex: 1; }
.user-name { font-weight: 700; font-size: 15px; }
.user-id { margin-top: 2px; }
.change-text { color: var(--primary); font-weight: 600; font-size: 14px; }
.amount-input-wrap { display: flex; align-items: center; background: var(--bg-input); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 4px; }
.amount-input { flex: 1; background: transparent; border: none; color: var(--text-primary); font-size: 22px; font-weight: 700; font-family: inherit; outline: none; padding: 10px 0; }
.btn-max { padding: 8px 16px; margin-right: 4px; background: var(--primary-light); border: none; border-radius: var(--radius-md); color: var(--primary); font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; }
.overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 24px; }
.modal-card { background: var(--bg-card); border-radius: var(--radius-lg); padding: 24px; width: 100%; max-width: 420px; border: 1px solid var(--border-subtle); }
.modal-header { display: flex; justify-content: space-between; align-items: center; }
.close-btn { background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text-muted); line-height: 1; padding: 4px; }
.tab-bar { display: flex; gap: 8px; border-bottom: 1px solid var(--border-subtle); }
.tab-btn { flex: 1; padding: 10px; background: none; border: none; border-bottom: 2px solid transparent; color: var(--text-muted); font-weight: 600; font-size: 14px; cursor: pointer; font-family: inherit; }
.tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }
.form-input { width: 100%; padding: 14px 16px; background: var(--bg-input); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-primary); font-family: inherit; font-size: 15px; outline: none; box-sizing: border-box; }
.form-input:focus { border-color: var(--primary); }
.user-result-card { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: var(--bg-input); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); cursor: pointer; margin-bottom: 8px; transition: border-color 0.2s; }
.user-result-card:hover { border-color: var(--primary); }
.select-text { color: var(--primary); font-weight: 600; font-size: 13px; white-space: nowrap; }
.result-details { padding: 16px; background: var(--bg-input); border-radius: var(--radius-md); }
.pin-dots { display: flex; justify-content: center; gap: 12px; }
.pin-dot { width: 16px; height: 16px; border-radius: 50%; background: var(--bg-input); border: 2px solid var(--border-default); transition: all 0.15s; }
.pin-dot.filled { background: var(--primary); border-color: var(--primary); }
.pin-dot.error { border-color: var(--danger); animation: shake 0.4s ease; }
@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
.numpad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 32px; max-width: 280px; margin-left: auto; margin-right: auto; }
.numpad-key { height: 56px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 600; background: var(--bg-input); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-primary); cursor: pointer; transition: all 0.1s; font-family: inherit; }
.numpad-key:active { transform: scale(0.95); background: var(--bg-elevated); }
.numpad-key.invisible { visibility: hidden; }
.warning-bar { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: var(--warning-light); border-radius: var(--radius-md); font-size: 13px; font-weight: 500; color: var(--warning); }
.toast-bar { position: fixed; top: 60px; left: 50%; transform: translateX(-50%); padding: 10px 24px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); z-index: 200; font-size: 14px; font-weight: 500; }
.px-16 { padding-left: 8px; padding-right: 8px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.toast-enter-active { animation: toastIn 0.3s ease; }
.toast-leave-active { animation: toastIn 0.3s ease reverse; }
@keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(-10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
</style>
