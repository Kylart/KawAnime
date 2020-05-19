import Releases from './releases.vue'

export default [
  {
    path: '/',
    name: 'feed',
    component: Releases
  }, {
    path: '/torrent',
    name: 'torrent',
    component: () => import(/* webpackChunkName: "torrent" */ './torrent.vue')
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
    path: '/seasons',
    name: 'seasons',
    component: () => import(/* webpackChunkName: "seasons" */ './seasons.vue')
  }, {
    path: '/services/:provider',
    name: 'services',
    component: () => import(/* webpackChunkName: "seasons" */ './services.vue')
  },
  // Global redirect for 404
  { path: '*', redirect: '/' }
]
