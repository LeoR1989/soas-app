<template>
  <div class="mobile-container">
    <!-- Header -->
    <div class="withdraw-header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <h1 class="text-title">{{ $t('hostWithdraw.title') }}</h1>
      <div style="width: 24px;"></div>
    </div>

    <!-- ============ STEP 1: KYC CHECK ============ -->
    <Transition name="fade">
      <div v-if="step === 'kyc'" class="overlay" @click.self="goBack">
        <div class="modal-card text-center">
          <div class="kyc-icon">🛡️</div>
          <h2 class="text-title" style="margin-top: 20px;">{{ $t('hostWithdraw.verificationRequired') }}</h2>
          <p class="text-body text-secondary" style="margin-top: 12px; line-height: 1.6;">
            {{ $t('hostWithdraw.verificationDesc') }}
          </p>
          <button class="btn btn-danger btn-block" style="margin-top: 24px;" @click="completeKyc">
            {{ $t('hostWithdraw.verifyNow') }}
          </button>
          <button class="btn btn-ghost btn-block" style="margin-top: 8px;" @click="goBack">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- ============ STEP 2: PIN SETUP ============ -->
    <div v-if="step === 'pin-setup'" class="step-content">
      <div class="card" style="margin: 0 24px; text-align: center; position: relative;">
        <button @click="goBack"
          style="position: absolute; top: 12px; right: 16px; background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text-muted); line-height: 1; padding: 4px;">&times;</button>
        <div class="pin-icon" style="margin-top: 8px;">🔐</div>
        <h2 class="text-title" style="margin-top: 16px;">{{ $t('hostWithdraw.setPinTitle') }}</h2>
        <p class="text-body text-secondary" style="margin-top: 8px;">
          {{ $t('hostWithdraw.setPinDesc') }}
        </p>

        <div class="pin-dots" style="margin-top: 24px;">
          <div v-for="i in 6" :key="i" class="pin-dot" :class="{ filled: pinInput.length >= i }"></div>
        </div>

        <div class="numpad">
          <button v-for="n in [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del']" :key="n" class="numpad-key"
            :class="{ invisible: n === null }" @click="handlePinKey(n)">
            <template v-if="n === 'del'">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" />
                <path d="m18 9-6 6" />
                <path d="m12 9 6 6" />
              </svg>
            </template>
            <template v-else>{{ n }}</template>
          </button>
        </div>

        <p v-if="pinSetupPhase === 'confirm'" class="text-caption text-primary" style="margin-top: 12px;">
          {{ $t('hostWithdraw.reEnterPin') }}
        </p>
      </div>
    </div>

    <!-- ============ STEP 3: AMOUNT INPUT ============ -->
    <div v-if="step === 'amount'" class="step-content">
      <div class="balance-summary px-24">
        <div class="text-caption">{{ $t('hostWithdraw.availableBalance') }}</div>
        <div class="flex items-center gap-8 mt-8">
          <span style="font-size: 20px;">💎</span>
          <span class="text-hero num" style="font-size: 32px;">{{ formatNumber(hostData.balance.available) }}</span>
        </div>
        <div class="text-caption text-success mt-8">≈ {{ diamondsToUSD(hostData.balance.available) }} {{
          $t('common.usd') }}
        </div>
      </div>

      <div class="amount-section px-24" style="margin-top: 32px;">
        <label class="text-subtitle">{{ $t('hostWithdraw.withdrawAmount') }}</label>
        <div class="amount-input-wrap mt-16">
          <span class="dollar-sign">$</span>
          <input v-model="amountInput" type="number" inputmode="decimal" :placeholder="$t('hostWithdraw.enterAmount')"
            class="amount-input" step="0.01" />
          <button class="max-btn" @click="setMax">{{ $t('common.max') }}</button>
        </div>
        <div class="flex justify-between mt-8">
          <span class="text-caption">{{ $t('hostWithdraw.exchangeRate') }}</span>
        </div>
        <div class="text-caption text-muted mt-8">{{ $t('hostWithdraw.minimumLimit', {
          amount: '$' +
            MIN_WITHDRAW_USD.toFixed(2) }) }}</div>

        <div v-if="amountError" class="text-caption text-danger mt-8">{{ amountError }}</div>

        <button class="btn btn-primary btn-block" style="margin-top: 32px;" :disabled="!canProceed"
          @click="submitWithdraw">
          {{ $t('hostWithdraw.confirmWithdraw') }}
        </button>
      </div>
    </div>

    <!-- ============ STEP 4: PIN VERIFY ============ -->
    <Transition name="fade">
      <div v-if="step === 'pin-verify'" class="overlay" @click.self="goBack">
        <div class="modal-card text-center" style="position: relative;">
          <button @click="goBack"
            style="position: absolute; top: 12px; right: 16px; background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text-muted); line-height: 1; padding: 4px;">&times;</button>
          <h2 class="text-title" style="margin-top: 8px;">{{ $t('hostWithdraw.enterPassword') }}</h2>
          <p class="text-body text-secondary" style="margin-top: 8px;">
            {{ $t('hostWithdraw.enterPinDesc') }}
          </p>

          <div class="pin-dots" style="margin-top: 24px;">
            <div v-for="i in 6" :key="i" class="pin-dot" :class="{ filled: verifyInput.length >= i, error: pinError }">
            </div>
          </div>

          <div class="numpad" style="margin-top: 24px;">
            <button v-for="n in [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del']" :key="n" class="numpad-key"
              :class="{ invisible: n === null }" @click="handleVerifyKey(n)">
              <template v-if="n === 'del'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" />
                  <path d="m18 9-6 6" />
                  <path d="m12 9 6 6" />
                </svg>
              </template>
              <template v-else>{{ n }}</template>
            </button>
          </div>

          <div v-if="pinError" class="warning-bar mt-16">
            <span>⚠️</span>
            <span>{{ pinError }}</span>
          </div>

          <div class="warning-bar" style="margin-top: 12px; background: var(--danger-light);">
            <span style="color: var(--danger);">⚠️</span>
            <span style="color: var(--danger); font-size: 12px;">{{ $t('hostWithdraw.wrongAttempts') }}</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ============ STEP 5: RESULT ============ -->
    <Transition name="fade">
      <div v-if="step === 'result'" class="overlay">
        <div class="modal-card text-center">
          <div class="result-icon">{{ resultSuccess ? '✅' : '❌' }}</div>
          <h2 class="text-title" style="margin-top: 16px;">
            {{ resultSuccess ? $t('hostWithdraw.withdrawSubmitted') : $t('hostWithdraw.withdrawFailed') }}
          </h2>
          <p class="text-body text-secondary" style="margin-top: 8px;">
            {{ resultSuccess ? $t('hostWithdraw.withdrawSuccessDesc') : $t('hostWithdraw.withdrawFailDesc') }}
          </p>
          <div v-if="resultSuccess" class="result-amount mt-16">
            <div class="text-caption">{{ $t('common.amount') }}</div>
            <div class="text-title num text-success">${{ parseFloat(amountInput).toFixed(2) }}</div>
          </div>
          <button class="btn btn-primary btn-block" style="margin-top: 24px;" @click="$router.push('/host/dashboard')">
            {{ $t('common.backToDashboard') }}
          </button>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { hostData, DIAMOND_RATE, MIN_WITHDRAW_USD, MIN_WITHDRAW_DIAMONDS, MAX_PIN_ATTEMPTS } from '../../mock/data.js'
import { formatNumber, diamondsToUSD, delay } from '../../utils.js'

const router = useRouter()
const { t } = useI18n()
const step = ref('loading')
const toast = ref('')

// PIN setup
const pinInput = ref('')
const pinSetupPhase = ref('create')
const firstPin = ref('')

// Amount
const amountInput = ref('')

// PIN verify
const verifyInput = ref('')
const pinError = ref('')
const resultSuccess = ref(false)

function showToast(msg) {
  toast.value = msg
  setTimeout(() => toast.value = '', 2500)
}

onMounted(() => {
  if (!hostData.user.isKycVerified) {
    step.value = 'kyc'
  } else if (!hostData.user.hasPinSetup) {
    step.value = 'pin-setup'
  } else {
    step.value = 'pin-verify'
  }
})

function goBack() {
  router.push('/host/dashboard')
}

function completeKyc() {
  hostData.user.isKycVerified = true
  showToast(t('hostWithdraw.kycVerified'))
  if (!hostData.user.hasPinSetup) {
    step.value = 'pin-setup'
  } else {
    step.value = 'pin-verify'
  }
}

function handlePinKey(key) {
  if (key === null) return
  if (key === 'del') {
    pinInput.value = pinInput.value.slice(0, -1)
    return
  }
  if (pinInput.value.length >= 6) return
  pinInput.value += String(key)

  if (pinInput.value.length === 6) {
    if (pinSetupPhase.value === 'create') {
      firstPin.value = pinInput.value
      pinInput.value = ''
      pinSetupPhase.value = 'confirm'
    } else {
      if (pinInput.value === firstPin.value) {
        hostData.user.hasPinSetup = true
        hostData.user.pin = pinInput.value
        showToast(t('hostWithdraw.pinSetSuccess'))
        step.value = 'amount'
      } else {
        showToast(t('hostWithdraw.pinNoMatch'))
        pinInput.value = ''
        pinSetupPhase.value = 'create'
        firstPin.value = ''
      }
    }
  }
}

const maxUSD = computed(() => hostData.balance.available / DIAMOND_RATE)

const amountError = computed(() => {
  const val = parseFloat(amountInput.value)
  if (!amountInput.value) return ''
  if (isNaN(val)) return t('hostWithdraw.invalidAmount')
  if (val < MIN_WITHDRAW_USD) return t('hostWithdraw.minimumWithdraw', { amount: '$' + MIN_WITHDRAW_USD.toFixed(2) })
  if (val > maxUSD.value) return t('hostWithdraw.insufficientBalance')
  return ''
})

const canProceed = computed(() => {
  const val = parseFloat(amountInput.value)
  return !isNaN(val) && val >= MIN_WITHDRAW_USD && val <= maxUSD.value
})

function setMax() {
  amountInput.value = (Math.floor(maxUSD.value * 100) / 100).toFixed(2)
}

function handleVerifyKey(key) {
  if (key === null) return
  if (key === 'del') {
    verifyInput.value = verifyInput.value.slice(0, -1)
    pinError.value = ''
    return
  }
  if (verifyInput.value.length >= 6) return
  verifyInput.value += String(key)

  if (verifyInput.value.length === 6) {
    if (verifyInput.value === hostData.user.pin) {
      step.value = 'amount'
      verifyInput.value = ''
    } else {
      hostData.user.pinAttempts++
      if (hostData.user.pinAttempts >= MAX_PIN_ATTEMPTS) {
        pinError.value = t('hostWithdraw.accountLocked')
        hostData.user.pinLockedUntil = Date.now() + 24 * 60 * 60 * 1000
        setTimeout(() => {
          step.value = 'result'
          resultSuccess.value = false
        }, 2000)
      } else {
        pinError.value = t('hostWithdraw.wrongPin', { remaining: MAX_PIN_ATTEMPTS - hostData.user.pinAttempts })
        verifyInput.value = ''
      }
    }
  }
}

function submitWithdraw() {
  const amountDiamonds = parseFloat(amountInput.value) * DIAMOND_RATE
  hostData.balance.available -= amountDiamonds
  resultSuccess.value = true
  step.value = 'result'
}
</script>

<style scoped>
.withdraw-header {
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

.step-content {
  padding-top: 16px;
}

.kyc-icon,
.pin-icon,
.result-icon {
  font-size: 56px;
}

.pin-dots {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.pin-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--bg-input);
  border: 2px solid var(--border-default);
  transition: all 0.15s;
}

.pin-dot.filled {
  background: var(--primary);
  border-color: var(--primary);
}

.pin-dot.error {
  border-color: var(--danger);
  animation: shake 0.4s ease;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-4px);
  }

  75% {
    transform: translateX(4px);
  }
}

.numpad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 32px;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
}

.numpad-key {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.1s;
  font-family: inherit;
}

.numpad-key:active {
  transform: scale(0.95);
  background: var(--bg-elevated);
}

.numpad-key.invisible {
  visibility: hidden;
}

.balance-summary {
  padding-top: 8px;
}

.amount-input-wrap {
  display: flex;
  align-items: center;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 4px 4px 4px 0;
  overflow: hidden;
}

.amount-input-wrap:focus-within {
  border-color: var(--primary);
}

.dollar-sign {
  padding: 12px 0 12px 16px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-muted);
}

.amount-input {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 20px;
  font-family: inherit;
  font-weight: 600;
  outline: none;
  -moz-appearance: textfield;
  appearance: textfield;
}

.amount-input::-webkit-outer-spin-button,
.amount-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
}

.amount-input::placeholder {
  color: var(--text-dim);
  font-weight: 400;
}

.max-btn {
  padding: 8px 16px;
  margin-right: 4px;
  background: var(--primary-light);
  border: none;
  border-radius: var(--radius-md);
  color: var(--primary);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  font-family: inherit;
}

.max-btn:active {
  transform: scale(0.95);
}

.warning-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--warning-light);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  color: var(--warning);
}

.result-amount {
  padding: 16px;
  background: var(--bg-input);
  border-radius: var(--radius-md);
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
</style>
