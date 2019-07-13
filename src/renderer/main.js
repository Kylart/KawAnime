import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from './assets/vuetify'
import Helpers from '../vendor/helpers'

Vue.config.productionTip = false

Helpers(Vue)
Vuetify(Vue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
