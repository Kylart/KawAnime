/**
 * Careful, the order is important!
 *
 * We use the order to use the components. So the
 * order here must be the same as the one specified
 * in the section list specified in store/modules/lists.js[sections]
 */
export { default as Providers } from './providers.vue'
export { default as Feed } from './feed.vue'
export { default as Torrent } from './torrent.vue'
export { default as Local } from './local.vue'
export { default as Accounts } from './accounts.vue'
export { default as Video } from './video.vue'
export { default as Notifications } from './notifications.vue'
export { default as System } from './system.vue'
