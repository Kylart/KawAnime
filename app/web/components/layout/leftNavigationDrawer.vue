<template lang="pug">
  v-navigation-drawer.drawer(app, fixed, disable-resize-watcher,v-model='show')
      v-list
        template(v-for='item in itemGroup')
          v-list-group(
            v-if='item.items',
            :group='item.group',
            :prepend-icon='item.action',
            no-action
          )
            v-list-tile(slot='activator', ripple)
              v-list-tile-content
                v-list-tile-title {{ item.title }}
            template(v-for='(subItem, i) in item.items')
              v-list-tile(
                :key='i',
                :to='subItem.href',
                :disabled='subItem.disabled',
                ripple
              )
                v-list-tile-action
                  v-icon {{ subItem.action }}
                v-list-tile-content
                  v-list-tile-title
                    span {{ subItem.title }}

          v-subheader.white--text(v-else-if='item.header') {{ item.header }}
          v-divider(v-else-if='item.divider')

          v-list-tile(
            v-else,
            :to='item.href',
            :disabled='item.disabled',
            ripple
          )
            v-list-tile-action
              v-icon {{ item.action }}
            v-list-tile-content
              v-list-tile-title
                span {{ item.title }}
</template>

<script>
export default {
  name: 'Left-Drawer',

  data: () => ({
    itemGroup: [
      { divider: true },
      { header: 'Core' },
      {
        title: 'Releases',
        action: 'access_time',
        href: '/'
      }, {
        title: 'Torrent',
        action: 'file_download',
        href: '/torrenting'
      },
      { divider: true },
      { header: 'Anime world' },
      {
        title: 'Seasons',
        action: 'hourglass_empty',
        href: '/seasons'
      },
      {
        title: 'News',
        action: 'more',
        href: '/news'
      },
      { divider: true },
      { header: 'Local' },
      {
        title: 'Anime related',
        action: 'folder_open',
        group: 'local',
        items: [
          {
            title: 'Animes',
            action: 'tv',
            href: '/localPage'
          }, {
            title: 'Watch list',
            action: 'sort_by_alpha',
            href: '/watchList'
          }, {
            title: 'MyAnimeList',
            action: 'web',
            href: '/malPage'
          }
        ]
      },
      { divider: true }
    ]
  }),

  computed: {
    show: {
      get () {
        return this.$store.state.drawer.left
      },
      set (val) {
        this.$store.commit('setLeftDrawer', val)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .drawer
    padding-top 64px
</style>
