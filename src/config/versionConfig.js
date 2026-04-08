import { reactive, computed } from 'vue'

// 版本列表
export const VERSIONS = [
  {
    code: 'v1.0.0',
    label: 'v1.0.0',
    description: '主播公会结算'
  },
  {
    code: 'v1.1.0',
    label: 'v1.1.0',
    description: 'BD+转账公会'
  },
  {
    code: 'v1.2.0',
    label: 'v1.2.0',
    description: '充值代理功能'
  }
]

// 从 localStorage 读取已保存的版本，默认 v1.2.0
const savedVersion = (typeof localStorage !== 'undefined' && localStorage.getItem('soas-version')) || 'v1.2.0'

// 响应式版本状态
export const versionState = reactive({
  current: savedVersion
})

// 切换版本
export function setVersion(versionCode) {
  versionState.current = versionCode
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('soas-version', versionCode)
  }
}

// 功能开关定义
const featureMap = {
  'v1.0.0': {
    showBD: false,           // 隐藏BD功能及入口
    showHostTransfer: false, // 隐藏主播给公会转账
    showBindBD: false,       // 隐藏公会长绑定BD入口
    showHostUnjoinedWallet: false, // 隐藏非公会用户钻石钱包和金币流水
    showRechargeAgent: false // 隐藏充值代理功能
  },
  'v1.1.0': {
    showBD: true,
    showHostTransfer: true,
    showBindBD: true,
    showHostUnjoinedWallet: true,
    showRechargeAgent: false
  },
  'v1.2.0': {
    showBD: true,
    showHostTransfer: true,
    showBindBD: true,
    showHostUnjoinedWallet: true,
    showRechargeAgent: true  // 充值代理功能
  }
}

// 获取当前版本的功能开关
export function useFeatureFlags() {
  const flags = computed(() => {
    return featureMap[versionState.current] || featureMap['v1.2.0']
  })
  return flags
}
