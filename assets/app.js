import Vue from 'vue'
import App from './App.vue'
import VueClipboards from 'vue-clipboards'
import VueLazyload from 'vue-lazyload'
// import Vuetify from './vuetify.js'  // waiting a-la-carte
import Vuetify from 'vuetify'

import Components from 'components/_index'

import { createStore } from 'store/index'
import { createRouter } from 'router/index'
import { sync } from 'vuex-router-sync'

// Vuetify(Vue)   // waiting a-la-carte
Vue.use(Vuetify)
Vue.use(VueClipboards)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: 'static/Hestia.gif',
  error: 'static/error.jpg',
  attempt: 1,
  lazyComponent: true
})

Object.keys(Components).forEach(key => {
  Vue.component(key, Components[key])
})

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp (ssrContext) {
  // create store and router instances
  const store = createStore()
  const router = createRouter()

  // App initialization
  store.dispatch('init')
  !['KawAnime-test', 'development'].includes(process.env.NODE_ENV) && store.dispatch('checkUpdate')

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router)

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    router,
    store,
    ssrContext,
    render: h => h(App)
  })

  return { app, router, store }
}
