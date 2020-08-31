<template lang="pug">
  v-card.elevation-12
    v-card-title.section-title Information providers configuration
    v-divider
    v-card-text
      v-container.pa-0.pb-2
        v-row(justify='space-around', align='baseline')
          v-col(cols='12', sm='6', md='4', lg='3', xl='2')
            v-select(
              label='Search',
              :items='without(excludes.search)',
              v-model='search'
              persistent-hint,
              hint='What search engine is the best for you?.'
            )
          v-col(cols='12', sm='6', md='4', lg='3')
            v-select(
              label='Information',
              :items='without(excludes.info)',
              v-model='info'
              persistent-hint,
              hint='Where does the core anime information should be fetched.'
            )
          v-col(cols='12', sm='6', md='4', lg='3')
            v-select(
              label='Episodes',
              :items='without(excludes.episodes)',
              v-model='episodes'
              persistent-hint,
              hint='Where the episodes information (names, date,...) come from.'
            )
          v-col(cols='12', sm='6', md='4', lg='3')
            v-select(
              label='Seasonal information',
              :items='without(excludes.seasons)',
              v-model='seasons'
              persistent-hint,
              hint='Which one gives the best seasonal chart?'
            )
          v-col(cols='12', sm='6', md='4', lg='3')
            v-select(
              label='News',
              :items='without(excludes.news)',
              v-model='news'
              persistent-hint,
              hint='Preferred news feed.'
            )
</template>

<script>
// Mixins
import Update from '@/mixins/config/update.js'

export default {
  name: 'Video-Section',

  mixins: [Update],

  data: () => ({
    excludes: {
      search: [],
      info: [],
      episodes: ['anilist'],
      news: ['kitsu', 'anilist'],
      seasons: ['kitsu']
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
