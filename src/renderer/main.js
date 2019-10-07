import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Helpers from 'vendor/helpers'
import Vuetify from '@/plugins/vuetify'

Vue.config.productionTip = false

Helpers(Vue)

new Vue({
  router,
  store,
  vuetify: Vuetify(Vue),
  render: h => h(App)
}).$mount('#app')
