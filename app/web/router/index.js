import Vue from 'vue'
import Router from 'vue-router'

// The meta data for your routes
const meta = require('./meta.js')

// Function to create routes
// Is default lazy but can be changed
function route (path, view) {
  return {
    path: path,
    meta: meta[path],
    component: resolve => import(`pages/${view}.vue`).then(resolve)
  }
}

Vue.use(Router)

export function createRouter () {
  return new Router({
    base: __dirname,
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      route('/', 'releases'),
      route('/torrenting', 'torrenting'),
      route('/seasons', 'seasons'),
      route('/news', 'news'),
      route('/localPage', 'localPage'),
      route('/watchList', 'watchList'),
      route('/malPage', 'malPage'),
      // Global redirect for 404
      { path: '*', redirect: '/' } // TODO: make a custom 404 page
    ]
  })
}
