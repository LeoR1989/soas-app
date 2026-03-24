<template>
  <div class="page-container">
    <div class="withdraw-header px-24">
      <button class="back-btn" @click="$router.back()">‹</button>
      <h1 class="text-title">{{ $t('agencyAgreement.title') }}</h1>
      <div style="width: 28px;"></div>
    </div>
    <div class="agreement-body px-24 mt-24">
      <div class="agreement-section" v-for="i in 5" :key="i">
        <p>{{ $t(`agencyAgreement.item${i}`) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  max-width: 500px;
  margin: 0 auto;
}
.withdraw-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
}
.back-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0;
  width: 28px;
  line-height: 1;
}
.agreement-body {
  padding-bottom: 40px;
}
.agreement-section p {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0 0 16px;
}
</style>
