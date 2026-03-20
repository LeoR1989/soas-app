<template>
  <div class="mobile-container">
    <!-- Header -->
    <div class="withdraw-header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6" /></svg>
      </button>
      <h1 class="text-title">{{ $t('bd.withdrawTitle') }}</h1>
      <div style="width: 24px;"></div>
    </div>

    <!-- KYC CHECK -->
    <Transition name="fade">
      <div v-if="step === 'kyc'" class="overlay" @click.self="goBack">
        <div class="modal-card text-center">
          <div class="kyc-icon">🛡️</div>
          <h2 class="text-title" style="margin-top: 20px;">{{ $t('bd.verificationRequired') }}</h2>
          <p class="text-body text-secondary" style="margin-top: 12px; line-height: 1.6;">{{ $t('bd.verificationDesc') }}</p>
          <button class="btn btn-danger btn-block" style="margin-top: 24px;" @click="completeKyc">{{ $t('bd.verifyNow') }}</button>
          <button class="btn btn-ghost btn-block" style="margin-top: 8px;" @click="goBack">{{ $t('bd.cancel') }}</button>
        </div>
      </div>
    </Transition>

    <!-- PIN SETUP -->
    <div v-if="step === 'pin-setup'" class="step-content">
      <div class="card" style="margin: 0 24px; text-align: center; position: relative;">
        <button @click="closePinSetup" style="position: absolute; top: 12px; right: 16px; background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text-muted); line-height: 1; padding: 4px;">&times;</button>
        <div class="pin-icon" style="margin-top: 8px;">🔐</div>
        <h2 class="text-title" style="margin-top: 16px;">{{ $t('bd.setPaymentPin') }}</h2>
        <p class="text-body text-secondary" style="margin-top: 8px;">{{ $t('bd.setPinDesc') }}</p>
        <div class="pin-dots" style="margin-top: 24px;">
          <div v-for="i in 6" :key="i" class="pin-dot" :class="{ filled: pinInput.length >= i }"></div>
        </div>
        <div class="numpad">
          <button v-for="n in [1,2,3,4,5,6,7,8,9,null,0,'del']" :key="n" class="numpad-key" :class="{ invisible: n === null }" @click="handlePinKey(n)">
            <template v-if="n === 'del'"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/><path d="m18 9-6 6"/><path d="m12 9 6 6"/></svg></template>
            <template v-else>{{ n }}</template>
          </button>
        </div>
        <p v-if="pinSetupPhase === 'confirm'" class="text-caption text-primary" style="margin-top: 12px;">{{ $t('bd.reEnterPin') }}</p>
      </div>
    </div>

    <!-- AMOUNT INPUT -->
    <div v-if="step === 'amount'" class="step-content">
      <div class="balance-summary px-24">
        <div class="text-caption">{{ $t('bd.availableBalance') }}</div>
        <div class="flex items-center gap-8 mt-8">
          <span style="font-size: 20px;">💎</span>
          <span class="text-hero num" style="font-size: 32px;">{{ formatNumber(bdData.balance.available) }}</span>
        </div>
        <div class="text-caption text-success mt-8">≈ {{ diamondsToUSD(bdData.balance.available) }} USD</div>
      </div>
      <div class="amount-section px-24" style="margin-top: 32px;">
        <label class="text-subtitle">{{ $t('bd.withdrawAmount') }}</label>
        <div class="amount-input-wrap mt-16">
          <span class="dollar-sign">💎</span>
          <input v-model="amountInput" type="number" inputmode="numeric" :placeholder="$t('bd.enterAmount')" class="amount-input" />
          <button class="max-btn" @click="setMax">MAX</button>
        </div>
        <div v-if="convertedUSD" class="text-caption text-success mt-8">{{ $t('bd.converted', { amount: convertedUSD }) }}</div>
        <div class="text-caption text-muted mt-8">{{ $t('bd.minWithdraw', { amount: MIN_WITHDRAW_DIAMONDS.toLocaleString() }) }}</div>
        <div v-if="amountError" class="text-caption text-danger mt-8">{{ amountError }}</div>
        <button class="btn btn-primary btn-block" style="margin-top: 32px;" :disabled="!canProceed" @click="goToPaymentInfo">{{ $t('bd.confirm') }}</button>
      </div>
    </div>

    <!-- PAYMENT INFO -->
    <div v-if="step === 'payment-info'" class="step-content">
      <div class="px-24" style="padding-bottom: 32px;">
        <div class="text-subtitle" style="margin-bottom: 4px;">{{ $t('bd.paymentInfo') }}</div>
        <div class="text-caption text-muted" style="margin-bottom: 24px;">{{ $t('bd.paymentInfoDesc') }}</div>
        <div class="form-group">
          <label class="form-label">{{ $t('bd.country') }} <span class="text-danger">*</span></label>
          <div class="select-wrap">
            <select v-model="selectedCountry" class="form-select" @change="onCountryChange">
              <option value="">{{ $t('bd.selectCountry') }}</option>
              <option v-for="c in paymentCountries" :key="c.code" :value="c.code">{{ c.flag }} {{ c.name }}</option>
            </select>
          </div>
        </div>
        <div v-if="selectedCountry && countryConfig" class="form-group">
          <label class="form-label">{{ $t('bd.currency') }}</label>
          <div class="currency-badge">{{ countryConfig.currency }}</div>
        </div>
        <div v-if="selectedCountry && countryConfig && !selectedMethod">
          <label class="form-label">{{ $t('bd.paymentMethod') }} <span class="text-danger">*</span></label>
          <div class="method-card" v-for="m in countryConfig.methods" :key="m.id" @click="selectMethod(m)">
            <div class="method-card-icon">{{ m.icon }}</div>
            <div class="method-card-info">
              <div class="method-card-name">{{ m.name }}</div>
              <div class="method-card-desc">{{ getLocText(m.desc) }}</div>
            </div>
            <div class="method-card-action">{{ $t('bd.select') }}</div>
          </div>
        </div>
        <div v-if="selectedMethod">
          <label class="form-label">{{ $t('bd.paymentMethod') }} <span class="text-danger">*</span></label>
          <div class="method-card selected">
            <div class="method-card-icon">{{ selectedMethod.icon }}</div>
            <div class="method-card-info">
              <div class="method-card-name">{{ selectedMethod.name }}</div>
              <div class="method-card-desc">{{ getLocText(selectedMethod.desc) }}</div>
            </div>
            <div class="method-card-action change" @click="selectedMethod = null">{{ $t('bd.change') }}</div>
          </div>
          <div v-for="field in selectedMethod.fields" :key="field.key" class="form-group" style="margin-top: 20px;">
            <label class="form-label">{{ getLocText(field.label) }} <span v-if="field.required" class="text-danger">*</span></label>
            <div v-if="field.type === 'select'" class="select-wrap">
              <select v-model="formData[field.key]" class="form-select">
                <option value="">{{ $t('bd.pleaseSelect') }}</option>
                <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
            <input v-else v-model="formData[field.key]" type="text" class="form-input" />
          </div>
          <div class="payment-summary" style="margin-top: 24px;">
            <div class="flex justify-between items-center">
              <span class="text-body text-secondary">{{ $t('bd.amount') }}</span>
              <span class="text-body num font-bold">💎 {{ formatNumber(parseInt(amountInput)) }}</span>
            </div>
          </div>
          <button class="btn btn-primary btn-block" style="margin-top: 24px;" :disabled="!canSubmitPayment" @click="submitWithdraw">{{ $t('bd.submitWithdraw') }}</button>
        </div>
        <button class="btn btn-ghost btn-block" style="margin-top: 12px;" @click="step = 'amount'">{{ $t('bd.back') }}</button>
      </div>
    </div>

    <!-- PIN VERIFY -->
    <Transition name="fade">
      <div v-if="step === 'pin-verify'" class="overlay" @click.self="goBack">
        <div class="modal-card text-center" style="position: relative;">
          <button @click="goBack" style="position: absolute; top: 12px; right: 16px; background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text-muted); line-height: 1; padding: 4px;">&times;</button>
          <h2 class="text-title" style="margin-top: 8px;">{{ $t('bd.enterPin') }}</h2>
          <p class="text-body text-secondary" style="margin-top: 8px;">{{ $t('bd.enterPinDesc') }}</p>
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

    <!-- RESULT -->
    <Transition name="fade">
      <div v-if="step === 'result'" class="overlay" @click.self="resetWithdraw">
        <div class="modal-card text-center">
          <div class="result-icon">{{ resultSuccess ? '✅' : '❌' }}</div>
          <h2 class="text-title" style="margin-top: 16px;">{{ resultSuccess ? $t('bd.withdrawSubmitted') : $t('bd.withdrawFailed') }}</h2>
          <p class="text-body text-secondary" style="margin-top: 8px;">{{ resultSuccess ? $t('bd.withdrawProcessing') : $t('bd.somethingWrong') }}</p>
          <div v-if="resultSuccess && withdrawResult" class="result-details mt-16">
            <div class="result-row">
              <span class="text-body text-secondary">{{ $t('bd.diamondsDeducted') }}</span>
              <span class="text-body num font-bold">💎 {{ formatNumber(withdrawResult.diamondsDeducted) }}</span>
            </div>
            <div class="result-row">
              <span class="text-body text-secondary">{{ $t('bd.usdAmount') }}</span>
              <span class="text-body num font-bold text-success">{{ withdrawResult.usdAmount }} USD</span>
            </div>
          </div>
          <button class="btn btn-primary btn-block" style="margin-top: 24px;" @click="resetWithdraw">{{ $t('bd.ok') }}</button>
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
import { bdData, DIAMOND_RATE, MIN_WITHDRAW_DIAMONDS, MAX_PIN_ATTEMPTS } from '../../mock/data.js'
import { formatNumber, diamondsToUSD } from '../../utils.js'
import { paymentCountries, paymentMethods, getLocalizedText } from '../../config/paymentConfig.js'

const { t } = useI18n()
const router = useRouter()
const step = ref('loading')
const toast = ref('')
const pinInput = ref('')
const pinSetupPhase = ref('create')
const firstPin = ref('')
const amountInput = ref('')
const verifyInput = ref('')
const pinError = ref('')
const resultSuccess = ref(false)
const withdrawResult = ref(null)
const selectedCountry = ref(bdData.user.paymentInfo.country || '')
const selectedMethod = ref(null)
const formData = reactive({})

if (bdData.user.paymentInfo.country) {
  const saved = bdData.user.paymentInfo
  const cfg = paymentMethods[saved.country]
  if (cfg && saved.methodId) {
    const method = cfg.methods.find(m => m.id === saved.methodId)
    if (method) { selectedMethod.value = method; if (saved.formData) Object.assign(formData, saved.formData) }
  }
}

const countryConfig = computed(() => selectedCountry.value ? paymentMethods[selectedCountry.value] || null : null)
function getLocText(obj) { return getLocalizedText(obj, 'en') }
function onCountryChange() { selectedMethod.value = null; Object.keys(formData).forEach(k => delete formData[k]) }
function selectMethod(method) { selectedMethod.value = method; Object.keys(formData).forEach(k => delete formData[k]); method.fields.forEach(f => { formData[f.key] = '' }); const saved = bdData.user.paymentInfo; if (saved.country === selectedCountry.value && saved.methodId === method.id && saved.formData) Object.assign(formData, saved.formData) }
const canSubmitPayment = computed(() => { if (!selectedMethod.value) return false; return selectedMethod.value.fields.filter(f => f.required).every(f => formData[f.key] && String(formData[f.key]).trim()) })

function showToast(msg) { toast.value = msg; setTimeout(() => toast.value = '', 2500) }

onMounted(() => {
  if (!bdData.user.isKycVerified) step.value = 'kyc'
  else if (!bdData.user.hasPinSetup) step.value = 'pin-setup'
  else step.value = 'pin-verify'
})

function goBack() { router.push('/bd') }

function completeKyc() { bdData.user.isKycVerified = true; showToast(t('bd.kycVerified')); step.value = bdData.user.hasPinSetup ? 'pin-verify' : 'pin-setup' }

function handlePinKey(key) {
  if (key === null) return
  if (key === 'del') { pinInput.value = pinInput.value.slice(0, -1); return }
  if (pinInput.value.length >= 6) return
  pinInput.value += String(key)
  if (pinInput.value.length === 6) {
    if (pinSetupPhase.value === 'create') { firstPin.value = pinInput.value; pinInput.value = ''; pinSetupPhase.value = 'confirm' }
    else {
      if (pinInput.value === firstPin.value) { bdData.user.hasPinSetup = true; bdData.user.pin = pinInput.value; showToast(t('bd.pinSetSuccess')); step.value = 'amount' }
      else { showToast(t('bd.pinNoMatch')); pinInput.value = ''; pinSetupPhase.value = 'create'; firstPin.value = '' }
    }
  }
}

const convertedUSD = computed(() => { const val = parseInt(amountInput.value); return isNaN(val) || val <= 0 ? '' : (val / DIAMOND_RATE).toFixed(2) })
const amountError = computed(() => { const val = parseInt(amountInput.value); if (!amountInput.value) return ''; if (isNaN(val)) return t('bd.invalidAmount'); if (val < MIN_WITHDRAW_DIAMONDS) return t('bd.minimumAmount', { amount: MIN_WITHDRAW_DIAMONDS.toLocaleString() }); if (val > bdData.balance.available) return t('bd.insufficientBalance'); return '' })
const canProceed = computed(() => { const val = parseInt(amountInput.value); return !isNaN(val) && val >= MIN_WITHDRAW_DIAMONDS && val <= bdData.balance.available })
function setMax() { amountInput.value = String(bdData.balance.available) }

function handleVerifyKey(key) {
  if (key === null) return
  if (key === 'del') { verifyInput.value = verifyInput.value.slice(0, -1); pinError.value = ''; return }
  if (verifyInput.value.length >= 6) return
  verifyInput.value += String(key)
  if (verifyInput.value.length === 6) {
    if (verifyInput.value === bdData.user.pin) { step.value = 'amount'; verifyInput.value = '' }
    else {
      bdData.user.pinAttempts++
      if (bdData.user.pinAttempts >= MAX_PIN_ATTEMPTS) { pinError.value = t('bd.accountLocked'); setTimeout(() => { step.value = 'result'; resultSuccess.value = false }, 2000) }
      else { pinError.value = t('bd.wrongPin', { remaining: MAX_PIN_ATTEMPTS - bdData.user.pinAttempts }); verifyInput.value = '' }
    }
  }
}

function goToPaymentInfo() { step.value = 'payment-info' }

function submitWithdraw() {
  bdData.user.paymentInfo.country = selectedCountry.value; bdData.user.paymentInfo.methodId = selectedMethod.value?.id || ''; bdData.user.paymentInfo.formData = { ...formData }
  const amountDiamonds = parseInt(amountInput.value); const usdAmount = (amountDiamonds / DIAMOND_RATE).toFixed(2)
  withdrawResult.value = { diamondsDeducted: amountDiamonds, usdAmount }; bdData.balance.available -= amountDiamonds; resultSuccess.value = true; step.value = 'result'
}

function resetWithdraw() {
  amountInput.value = ''; verifyInput.value = ''; pinError.value = ''; resultSuccess.value = false; step.value = 'loading'
  setTimeout(() => { step.value = bdData.user.isKycVerified ? 'amount' : 'kyc' }, 500)
}

function closePinSetup() { bdData.user.hasPinSetup = false; bdData.user.pin = null; pinInput.value = ''; pinSetupPhase.value = 'create'; firstPin.value = ''; goBack() }
</script>

<style scoped>
.withdraw-header { display: flex; align-items: center; justify-content: space-between; padding: 56px 24px 16px; }
.back-btn { background: none; border: none; color: var(--text-primary); cursor: pointer; }
.step-content { padding-top: 16px; }
.kyc-icon, .pin-icon, .result-icon { font-size: 56px; }
.pin-dots { display: flex; justify-content: center; gap: 12px; }
.pin-dot { width: 16px; height: 16px; border-radius: 50%; background: var(--bg-input); border: 2px solid var(--border-default); transition: all 0.15s; }
.pin-dot.filled { background: var(--primary); border-color: var(--primary); }
.pin-dot.error { border-color: var(--danger); animation: shake 0.4s ease; }
@keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
.numpad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 32px; max-width: 280px; margin-left: auto; margin-right: auto; }
.numpad-key { height: 56px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 600; background: var(--bg-input); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-primary); cursor: pointer; transition: all 0.1s; font-family: inherit; }
.numpad-key:active { transform: scale(0.95); background: var(--bg-elevated); }
.numpad-key.invisible { visibility: hidden; }
.balance-summary { padding-top: 8px; }
.amount-input-wrap { display: flex; align-items: center; background: var(--bg-input); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 4px 4px 4px 0; overflow: hidden; }
.amount-input-wrap:focus-within { border-color: var(--primary); }
.dollar-sign { padding: 12px 0 12px 16px; font-size: 20px; font-weight: 700; color: var(--text-muted); }
.amount-input { flex: 1; padding: 12px; background: none; border: none; color: var(--text-primary); font-size: 20px; font-family: inherit; font-weight: 600; outline: none; -moz-appearance: textfield; appearance: textfield; }
.amount-input::-webkit-outer-spin-button, .amount-input::-webkit-inner-spin-button { -webkit-appearance: none; appearance: none; }
.max-btn { padding: 8px 16px; margin-right: 4px; background: var(--primary-light); border: none; border-radius: var(--radius-md); color: var(--primary); font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; }
.warning-bar { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: var(--warning-light); border-radius: var(--radius-md); font-size: 13px; font-weight: 500; color: var(--warning); }
.result-details { padding: 16px; background: var(--bg-input); border-radius: var(--radius-md); text-align: left; }
.result-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; }
.result-row + .result-row { border-top: 1px solid var(--border-subtle); }
.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px; }
.form-input { width: 100%; padding: 14px 16px; background: var(--bg-input); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-primary); font-family: inherit; font-size: 15px; outline: none; box-sizing: border-box; }
.form-input:focus { border-color: var(--primary); }
.select-wrap { position: relative; }
.form-select { width: 100%; padding: 14px 16px; background: var(--bg-input); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-primary); font-family: inherit; font-size: 15px; outline: none; appearance: none; cursor: pointer; }
.currency-badge { display: inline-block; padding: 8px 16px; background: var(--primary-light); border-radius: var(--radius-md); color: var(--primary); font-weight: 700; font-size: 14px; }
.method-card { display: flex; align-items: center; gap: 12px; padding: 16px; background: var(--bg-input); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); margin-bottom: 8px; cursor: pointer; transition: border-color 0.2s; }
.method-card:hover { border-color: var(--primary); }
.method-card.selected { border-color: var(--primary); background: rgba(0,216,201,0.05); }
.method-card-icon { font-size: 24px; }
.method-card-info { flex: 1; }
.method-card-name { font-weight: 600; font-size: 15px; }
.method-card-desc { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.method-card-action { color: var(--primary); font-weight: 600; font-size: 13px; }
.method-card-action.change { color: var(--text-muted); }
.payment-summary { padding: 16px; background: var(--bg-input); border-radius: var(--radius-md); }
.overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 24px; }
.modal-card { background: var(--bg-card); border-radius: var(--radius-lg); padding: 24px; width: 100%; max-width: 420px; border: 1px solid var(--border-subtle); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.toast { position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); padding: 12px 24px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); font-size: 14px; font-weight: 600; color: var(--text-primary); z-index: 200; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
.toast-enter-active { animation: toastIn 0.3s ease; }
.toast-leave-active { animation: toastIn 0.3s ease reverse; }
@keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
</style>
