<template lang="pug">
  v-navigation-drawer.drawer(
    dark,
    fixed,
    permanent,
    app,
    clipped,
    mini-variant-width='68',
    :mini-variant.sync='mini',
    v-model='show'
  )
    v-list(dense, nav)
      template(v-for='item in itemGroup')
        v-subheader(v-if='item.header') {{ item.header }}

        v-divider(v-else-if='item.divider')

        v-list-item(
          v-else,
          :to='item.href',
          :disabled='item.disabled',
          link
        )
          v-list-item-action
            v-icon(v-if='!item.custom') {{ item.action }}
            div(v-else, :class='item.custom')
          v-list-item-content
            v-list-item-title
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
        href: '/torrent'
      },
      { divider: true },
      { header: 'Library' },
      {
        title: 'Anime',
        action: 'tv',
        href: '/localPage'
      },
      { divider: true },
      { header: 'Anime' },
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
      { header: 'Lists' },
      {
        title: 'Local lists',
        action: 'sort_by_alpha',
        href: '/watchList'
      }, {
        custom: { 'provider-icon': true, 'mal-icon': true },
        title: 'MyAnimeList.net',
        href: '/services/mal'
      }, {
        custom: { 'provider-icon': true, 'kitsu-icon': true },
        title: 'Kitsu.io',
        href: '/services/kitsu'
      }, {
        custom: { 'provider-icon': true, 'anilist-icon': true },
        title: 'Anilist',
        href: '/services/anilist'
      },
      { divider: true }
    ]
  }),

  computed: {
    mini: {
      get () {
        return this.$store.state.drawer.mini
      },
      set () {}
    },
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
