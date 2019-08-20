import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Helpers from 'vendor/helpers'
import Vuetify from '@/plugins/vuetify'

Vue.config.productionTip = false

Helpers(Vue)
const vuetify = Vuetify(Vue)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
