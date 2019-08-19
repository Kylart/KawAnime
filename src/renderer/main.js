import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from './assets/vuetify'
import Helpers from '../vendor/helpers'

Vue.config.productionTip = false

Helpers(Vue)
const vuetify = Vuetify(Vue)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
