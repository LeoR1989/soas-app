import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n, { loadTranslationsFromAPI } from './i18n/index.js'
import './styles/main.css'

// 启动时加载翻译
loadTranslationsFromAPI().catch(console.error)

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
