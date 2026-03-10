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
        <button @click="closePinSetup"
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
          <span class="dollar-sign">💎</span>
          <input v-model="amountInput" type="number" inputmode="numeric" :placeholder="$t('hostWithdraw.enterAmount')"
            class="amount-input" />
          <button class="max-btn" @click="setMax">{{ $t('common.max') }}</button>
        </div>
        <div v-if="convertedUSD" class="text-caption text-success mt-8">
          {{ $t('hostWithdraw.convertedAmount') }}: {{ convertedUSD }} {{ $t('common.usd') }}
        </div>
        <div class="flex justify-between mt-8">
          <span class="text-caption">{{ $t('hostWithdraw.exchangeRate') }}</span>
        </div>
        <div class="text-caption text-muted mt-8">{{ $t('hostWithdraw.minimumLimit', {
          amount:
            MIN_WITHDRAW_DIAMONDS.toLocaleString() }) }}</div>

        <div v-if="amountError" class="text-caption text-danger mt-8">{{ amountError }}</div>

        <button class="btn btn-primary btn-block" style="margin-top: 32px;" :disabled="!canProceed"
          @click="goToPaymentInfo">
          {{ $t('hostWithdraw.confirmWithdraw') }}
        </button>
      </div>
    </div>

    <!-- ============ STEP: PAYMENT INFO ============ -->
    <div v-if="step === 'payment-info'" class="step-content">
      <div class="px-24" style="padding-bottom: 32px;">
        <div class="text-subtitle" style="margin-bottom: 4px;">{{ $t('hostWithdraw.paymentInfoTitle') }}</div>
        <div class="text-caption text-muted" style="margin-bottom: 24px;">{{ $t('hostWithdraw.paymentInfoDesc') }}</div>

        <!-- Country/Region Selector -->
        <div class="form-group">
          <label class="form-label">{{ $t('hostWithdraw.selectCountry') }} <span class="text-danger">*</span></label>
          <div class="select-wrap">
            <select v-model="selectedCountry" class="form-select" @change="onCountryChange">
              <option value="">{{ $t('hostWithdraw.selectCountryPlaceholder') }}</option>
              <option v-for="c in paymentCountries" :key="c.code" :value="c.code">
                {{ c.flag }} {{ locale === 'zh' ? c.nameZh : locale === 'ar' ? c.nameAr : c.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Currency Display (auto after country selected) -->
        <div v-if="selectedCountry && countryConfig" class="form-group">
          <label class="form-label">{{ $t('hostWithdraw.currency') }}</label>
          <div class="currency-badge">{{ countryConfig.currency }}</div>
        </div>

        <!-- Payment Methods List (when no method selected yet) -->
        <div v-if="selectedCountry && countryConfig && !selectedMethod">
          <label class="form-label">{{ $t('hostWithdraw.paymentMethod') }} <span class="text-danger">*</span></label>
          <div class="method-card" v-for="m in countryConfig.methods" :key="m.id" @click="selectMethod(m)">
            <div class="method-card-icon">{{ m.icon }}</div>
            <div class="method-card-info">
              <div class="method-card-name">{{ m.name }}</div>
              <div class="method-card-desc">{{ getLocText(m.desc) }}</div>
              <div class="method-card-time">{{ $t('hostWithdraw.arrivalTime') }}: {{ getLocText(m.arrivalTime) }}</div>
            </div>
            <div class="method-card-action">{{ $t('hostWithdraw.select') }}</div>
          </div>
        </div>

        <!-- Selected Method Card + Dynamic Form -->
        <div v-if="selectedMethod">
          <label class="form-label">{{ $t('hostWithdraw.paymentMethod') }} <span class="text-danger">*</span></label>
          <div class="method-card selected">
            <div class="method-card-icon">{{ selectedMethod.icon }}</div>
            <div class="method-card-info">
              <div class="method-card-name">{{ selectedMethod.name }}</div>
              <div class="method-card-desc">{{ getLocText(selectedMethod.desc) }}</div>
              <div class="method-card-time">{{ $t('hostWithdraw.arrivalTime') }}: {{ getLocText(selectedMethod.arrivalTime) }}</div>
            </div>
            <div class="method-card-action change" @click="selectedMethod = null">{{ $t('hostWithdraw.change') }}</div>
          </div>

          <!-- Dynamic Fields -->
          <div v-for="field in selectedMethod.fields" :key="field.key" class="form-group" style="margin-top: 20px;">
            <label class="form-label">
              {{ getLocText(field.label) }}
              <span v-if="field.required" class="text-danger">*</span>
            </label>
            <!-- Select type -->
            <div v-if="field.type === 'select'" class="select-wrap">
              <select v-model="formData[field.key]" class="form-select">
                <option value="">{{ $t('hostWithdraw.pleaseSelect') }}</option>
                <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
            <!-- Text type -->
            <input v-else v-model="formData[field.key]" type="text" class="form-input" />
            <div v-if="field.hint" class="form-hint">{{ getLocText(field.hint) }}</div>
          </div>

          <!-- Summary & Submit -->
          <div class="payment-summary" style="margin-top: 24px;">
            <div class="flex justify-between items-center">
              <span class="text-body text-secondary">{{ $t('hostWithdraw.withdrawAmount') }}</span>
              <span class="text-body num font-bold">${{ parseFloat(amountInput).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center" style="margin-top: 8px;">
              <span class="text-body text-secondary">{{ $t('hostWithdraw.currency') }}</span>
              <span class="text-body font-bold">{{ countryConfig.currency }}</span>
            </div>
          </div>

          <button class="btn btn-primary btn-block" style="margin-top: 24px;" :disabled="!canSubmitPayment"
            @click="showAgreement">
            {{ $t('hostWithdraw.submitWithdraw') }}
          </button>
        </div>

        <button class="btn btn-ghost btn-block" style="margin-top: 12px;" @click="step = 'amount'">
          {{ $t('common.back') }}
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
      <div v-if="step === 'result'" class="overlay" @click.self="resetWithdraw">
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
            <div class="text-title num text-success">{{ formatNumber(parseInt(amountInput)) }} 💎 (≈ {{ convertedUSD }} USD)</div>
          </div>
          <button class="btn btn-primary btn-block" style="margin-top: 24px;" @click="resetWithdraw">
            {{ $t('common.backToWithdraw') }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- ============ STEP: AGREEMENT MODAL ============ -->
    <Transition name="fade">
      <div v-if="showAgreementModal" class="overlay" @click.self="closeAgreement">
        <div class="modal-card">
          <h2 class="text-title" style="margin-top: 8px; text-align: center;">{{ $t('hostWithdraw.agreementTitle') }}</h2>
          <p class="text-body text-secondary" style="margin-top: 16px; line-height: 1.6; text-align: left;">
            {{ $t('hostWithdraw.agreementContent') }}
          </p>
          <div style="margin-top: 24px;">
            <button class="btn btn-primary btn-block" @click="confirmAgreement">
              {{ $t('hostWithdraw.agreeAndSubmit') }}
            </button>
            <button class="btn btn-ghost btn-block" style="margin-top: 8px;" @click="closeAgreement">
              {{ $t('common.cancel') }}
            </button>
          </div>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { hostData, DIAMOND_RATE, MIN_WITHDRAW_USD, MIN_WITHDRAW_DIAMONDS, MAX_PIN_ATTEMPTS } from '../../mock/data.js'
import { formatNumber, diamondsToUSD, delay } from '../../utils.js'
import { paymentCountries, paymentMethods, getLocalizedText } from '../../config/paymentConfig.js'

const router = useRouter()
const { t, locale } = useI18n({ useScope: 'global' })
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

// Payment info - country & method selection
const selectedCountry = ref(hostData.user.paymentInfo.country || '')
const selectedMethod = ref(null)
const formData = reactive({})

// Agreement Modal
const showAgreementModal = ref(false)

// Restore saved payment info
if (hostData.user.paymentInfo.country) {
  const saved = hostData.user.paymentInfo
  const cfg = paymentMethods[saved.country]
  if (cfg && saved.methodId) {
    const method = cfg.methods.find(m => m.id === saved.methodId)
    if (method) {
      selectedMethod.value = method
      // Restore saved form fields
      if (saved.formData) {
        Object.assign(formData, saved.formData)
      }
    }
  }
}

const countryConfig = computed(() => {
  if (!selectedCountry.value) return null
  return paymentMethods[selectedCountry.value] || null
})

function getLocText(obj) {
  return getLocalizedText(obj, locale.value)
}

function onCountryChange() {
  selectedMethod.value = null
  // Clear form data
  Object.keys(formData).forEach(k => delete formData[k])
}

function selectMethod(method) {
  selectedMethod.value = method
  // Initialize form fields
  Object.keys(formData).forEach(k => delete formData[k])
  method.fields.forEach(f => {
    formData[f.key] = ''
  })
  // Restore saved data if same method
  const saved = hostData.user.paymentInfo
  if (saved.country === selectedCountry.value && saved.methodId === method.id && saved.formData) {
    Object.assign(formData, saved.formData)
  }
}

const canSubmitPayment = computed(() => {
  if (!selectedMethod.value) return false
  return selectedMethod.value.fields
    .filter(f => f.required)
    .every(f => formData[f.key] && String(formData[f.key]).trim())
})

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

const convertedUSD = computed(() => {
  const val = parseInt(amountInput.value)
  if (isNaN(val) || val <= 0) return ''
  return (val / DIAMOND_RATE).toFixed(2)
})

const amountError = computed(() => {
  const val = parseInt(amountInput.value)
  if (!amountInput.value) return ''
  if (isNaN(val)) return t('hostWithdraw.invalidAmount')
  if (val < MIN_WITHDRAW_DIAMONDS) return t('hostWithdraw.minimumWithdraw', { amount: MIN_WITHDRAW_DIAMONDS.toLocaleString() })
  if (val > hostData.balance.available) return t('hostWithdraw.insufficientBalance')
  return ''
})

const canProceed = computed(() => {
  const val = parseInt(amountInput.value)
  return !isNaN(val) && val >= MIN_WITHDRAW_DIAMONDS && val <= hostData.balance.available
})

function setMax() {
  amountInput.value = String(hostData.balance.available)
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

function goToPaymentInfo() {
  step.value = 'payment-info'
}

function showAgreement() {
  showAgreementModal.value = true
}

function closeAgreement() {
  showAgreementModal.value = false
}

function confirmAgreement() {
  showAgreementModal.value = false
  submitWithdraw()
}

function submitWithdraw() {
  hostData.user.paymentInfo.country = selectedCountry.value
  hostData.user.paymentInfo.methodId = selectedMethod.value?.id || ''
  hostData.user.paymentInfo.formData = { ...formData }

  const amountDiamonds = parseInt(amountInput.value)
  hostData.balance.available -= amountDiamonds
  resultSuccess.value = true
  step.value = 'result'
}

function resetWithdraw() {
  amountInput.value = ''
  verifyInput.value = ''
  pinError.value = ''
  resultSuccess.value = false
  step.value = 'loading'
  // Trigger loading state again like initial mount
  setTimeout(() => {
    if (!hostData.user.isKycVerified) {
      step.value = 'kyc'
    } else {
      step.value = 'amount'
    }
  }, 500)
}

function closePinSetup() {
  // Req 7: if PIN setup not completed, reset to initial state
  hostData.user.hasPinSetup = false
  hostData.user.pin = null
  pinInput.value = ''
  pinSetupPhase.value = 'create'
  firstPin.value = ''
  goBack()
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

/* Payment Info Form */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: var(--primary);
}

.form-input::placeholder {
  color: var(--text-dim);
}

.select-wrap {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 14px 16px;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 15px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  transition: border-color 0.2s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}

.form-select:focus {
  border-color: var(--primary);
}

.form-select option {
  background: var(--bg-card);
  color: var(--text-primary);
}

.form-hint {
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-muted);
}

.currency-badge {
  display: inline-block;
  padding: 8px 20px;
  background: var(--primary-light);
  border: 1px solid var(--primary);
  border-radius: var(--radius-md);
  color: var(--primary);
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 1px;
}

/* Method Cards */
.method-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.method-card:hover {
  border-color: var(--primary);
  background: rgba(0, 216, 201, 0.05);
}

.method-card.selected {
  border-color: var(--primary);
  cursor: default;
}

.method-card-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 216, 201, 0.15);
  border-radius: 50%;
  font-size: 22px;
}

.method-card-info {
  flex: 1;
  min-width: 0;
}

.method-card-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.method-card-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 3px;
  line-height: 1.4;
}

.method-card-time {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

.method-card-action {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  white-space: nowrap;
}

.method-card-action.change {
  cursor: pointer;
}

.form-row {
  display: flex;
  gap: 12px;
}

.payment-summary {
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-top: 24px;
  border: 1px solid var(--border-subtle);
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
