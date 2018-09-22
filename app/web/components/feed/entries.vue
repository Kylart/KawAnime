<template lang="pug">
  v-container(
    grid-list-lg, fluid
  )
    v-layout(row, wrap, justify-center)
      v-flex(xs12)
        v-layout(justify-space-between, align-center)
          v-flex.time(xs3) Updated {{ time }}
          v-flex(xs4)
            v-text-field(
              name='Search'
              label='Looking for something?'
              v-model='config.term',
              hide-details,
              solo,
              @keyup.enter='search'
            )
          v-flex(xs4)
            v-layout(justify-space-around)
              v-flex(xs3)
                v-select(
                  label='Feed',
                  :items='feeds',
                  v-model='config.feed',
                  item-text='text',
                  item-value='value'
                )
              v-flex(xs6)
                v-autocomplete(
                  label='Fansub',
                  :items='fansubs',
                  v-model='config.fansub'
                )
              v-flex(xs3)
                v-select(
                  label='Quality',
                  :items='qualities',
                  v-model='config.quality'
                )
      v-flex(
        xs3,
        v-for='(entry, i) in entries',
        :key='entry.name'
      )
        card(:info='entry', :ref='entry.parsedName.title')

      v-pagination(
        xs12,
        v-if='nbPages > 1',
        v-model='page',
        :length='nbPages',
        total-visible='10'
      )
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import Card from 'components/feed/card.vue'

export default {
  name: 'Entries',

  components: { Card },

  data: () => ({
    page: 1,
    entryPerPage: 12,
    qualities: ['480p', '720p', '1080p'],
    feeds: [{
      text: 'nyaa.si',
      value: 'si'
    }, {
      text: 'pantsu',
      value: 'pantsu'
    }]
  }),

  computed: {
    ...mapGetters('info', {
      allInfo: 'getInfo'
    }),
    mainConfig: {
      get () {
        return this.$store.state.config.config
      },
      set () {}
    },
    releases: {
      get () {
        const { fansub, quality, feed } = this.config
        return this.$store.state.releases.releases[feed][fansub][quality]
      },
      set () {}
    },
    fileRange () {
      const index = this.page - 1

      return {
        inf: index * this.entryPerPage,
        sup: (index + 1) * this.entryPerPage - 1
      }
    },
    entries () {
      return this.releases.slice(this.fileRange.inf, this.fileRange.sup + 1)
    },
    fansubs () {
      return ['None', ...this.$store.state.releases.fansubs]
    },
    nbPages () {
      return Math.ceil(this.releases.length / this.entryPerPage)
    },
    config () {
      return {
        quality: this.mainConfig.quality,
        fansub: this.mainConfig.fansub,
        feed: this.$store.state.releases.params.feed,
        term: this.$store.state.releases.params.term
      }
    },
    time () {
      return this.$store.state.releases.updateTime.fromNow()
    }
  },

  methods: {
    async search () {
      this.$store.commit('releases/setParams', this.config)
      await this.$store.dispatch('releases/refresh')
    }
  }
}
</script>

<style lang="stylus" scoped>
  .time
    font-size 16px
    font-weight 400
    letter-spacing 0.02em
</style>
