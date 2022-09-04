import { createApp } from 'vue'
import '@vue/repl/style.css'
import 'uno.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from '@/App.vue'

// @ts-expect-error Custom window property
window.VUE_DEVTOOLS_CONFIG = {
  defaultSelectedAppId: 'repl',
}

const app = createApp(App)
app.mount('#app')
