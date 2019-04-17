<template lang="pug">
  v-card.elevation-12
    v-card-title.section-title Information providers configuration
    v-divider
    v-card-text
      v-container(grid-list-lg, pa-0, pb-2)
        v-layout(row, wrap, justify-space-around, align-baseline)
          v-flex(xs12, sm6, md4, lg3, xl2)
            v-select(
              label='Search',
              :items='without(excludes.search)',
              v-model='search'
              persistent-hint,
              hint='Where does the anime information should be fetched.'
            )
          v-flex(xs12, sm6, md4, lg3)
            v-select(
              label='Information',
              :items='without(excludes.info)',
              v-model='info'
              persistent-hint,
              hint='Where does the anime information should be fetched.'
            )
          v-flex(xs12, sm6, md4, lg3)
            v-select(
              label='Episodes',
              :items='without(excludes.episodes)',
              v-model='episodes'
              persistent-hint,
              hint='Where does the anime information should be fetched.'
            )
          v-flex(xs12, sm6, md4, lg3)
            v-select(
              label='Seasonal information',
              :items='without(excludes.seasons)',
              v-model='seasons'
              persistent-hint,
              hint='Where does the anime information should be fetched.'
            )
          v-flex(xs12, sm6, md4, lg3)
            v-select(
              label='News',
              :items='without(excludes.news)',
              v-model='news'
              persistent-hint,
              hint='Where does the anime information should be fetched.'
            )
</template>

<script>
// Mixins
import Update from '@/mixins/config/update.js'

export default {
  name: 'Video-Section',

  mixins: [ Update ],

  data: () => ({
    excludes: {
      search: [ 'ann' ],
      info: [ 'ann' ],
      episodes: [ 'ann' ],
      news: [ 'kitsu' ],
      seasons: [ 'kitsu', 'ann' ]
    }
  }),

  computed: {
    providers: {
      get () {
        return this.$store.state.config.providers
      },
      set () {}
    },
    provider: {
      get () {
        return this.$store.state.config.config.infoProvider
      },
      set () {}
    },

    episodes: {
      get () {
        return this.provider.episodes
      },
      set (value) {
        this.setDeepValue('infoProvider.episodes', value)
      }
    },
    search: {
      get () {
        return this.provider.search
      },
      set (value) {
        this.setDeepValue('infoProvider.search', value)
      }
    },
    info: {
      get () {
        return this.provider.info
      },
      set (value) {
        this.setDeepValue('infoProvider.info', value)
      }
    },
    news: {
      get () {
        return this.provider.news
      },
      set (value) {
        this.setDeepValue('infoProvider.news', value)
      }
    },
    seasons: {
      get () {
        return this.provider.seasons
      },
      set (value) {
        this.setDeepValue('infoProvider.seasons', value)
      }
    }
  },

  methods: {
    without (providers) {
      return this.providers.filter(({ value }) => !providers.includes(value))
    }
  }
}
</script>
