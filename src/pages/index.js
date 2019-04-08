import Releases from './releases.vue'

export default [
  {
    path: '/',
    name: 'feed',
    component: Releases
  }, {
    path: '/torrenting',
    name: 'torrenting',
    component: () => import(/* webpackChunkName: "torrent" */ './torrenting.vue')
  }, {
    path: '/localPage',
    name: 'localPage',
    component: () => import(/* webpackChunkName: "localPage" */ './localPage.vue')
  }, {
    path: '/news',
    name: 'news',
    component: () => import(/* webpackChunkName: "news" */ './news.vue')
  }, {
    path: '/watchList',
    name: 'watchList',
    component: () => import(/* webpackChunkName: "localLists" */ './watchList.vue')
  }, {
    path: '/malPage',
    name: 'malPage',
    component: () => import(/* webpackChunkName: "malPage" */ './malPage.vue')
  }, {
    path: '/seasons',
    name: 'seasons',
    component: () => import(/* webpackChunkName: "seasons" */ './seasons.vue')
  },
  // Global redirect for 404
  { path: '*', redirect: '/' } // TODO: make a custom 404 page
]
