<template lang="pug">
  v-container(
    grid-list-lg, fluid, pt-2
  )
    v-layout(row, wrap, justify-center)
      v-flex(xs12)
        v-layout(row, wrap, justify-space-between, align-center)
          v-flex.time(xs12, sm4, md3, d-flex, justify-center) Updated {{ time }}
          v-flex(xs12, sm8, md4)
            v-text-field(
              name='Search', ref='term',
              label='Looking for something?',
              v-model='config.term',
              hide-details,
              solo, clearable,
              :loading='isRefreshing',
              @keyup.enter='search'
            )
          v-flex(xs12, md4)
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
                v-combobox(
                  label='Fansub',
                  :items='fansubs',
                  v-model='config.fansub'
                )
              v-flex(xs3)
                v-select(
                  label='Quality',
                  :items='order(qualities)',
                  v-model='config.quality'
                )
      v-flex(
        xs12, sm6, md3, lg3, xl2,
        v-for='(entry, i) in entries',
        :key='entry.name'
      )
        card(:info='entry', :ref='entry.name')

    .pag-container
      v-pagination(
        v-if='nbPages > 1',
        v-model='page',
        :length='nbPages',
        total-visible='10'
      )
</template>

<script>
import { global } from '@/store/helpers'

// Components
import Card from '@/components/feed/card.vue'

// Mixins
import Order from '@/mixins/config/order.js'

export default {
  name: 'Entries',

  components: { Card },

  mixins: [ Order ],

  async mounted () {
    this.$nextTick(async () => {
      this.$refs.term.focus()

      if (this.$route.query.name) {
        this.config.term = this.$route.query.name
        this.$route.query.name = undefined
        await this.search()
      }

      this.updateTime()
    })

    setInterval(this.updateTime, 1000)
  },

  data: () => ({
    time: null,
    page: 1,
    entryPerPage: 12
  }),

  computed: {
    // Brings __Drawer, __IsConnected, __Platform and __NODE_ENV
    ...global.state,

    releases: {
      get () {
        return this.$store.state.releases.releases.current
      },
      set () {}
    },
    mainConfig: {
      get () {
        return this.$store.state.config.config
      },
      set () {}
    },
    isRefreshing: {
      get () {
        return this.$store.state.releases.isRefreshing
      },
      set () {}
    },
    qualities: {
      get () {
        return this.$store.state.config.qualities
      },
      set () {}
    },
    feeds: {
      get () {
        return this.$store.state.config.feeds
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
      return ['None', ...this.$store.state.config.fansubs]
    },
    nbPages () {
      return Math.ceil(this.releases.length / this.entryPerPage)
    },
    config () {
      return {
        quality: this.$store.state.releases.params.quality,
        fansub: this.$store.state.releases.params.fansub,
        feed: this.$store.state.releases.params.feed,
        term: this.$store.state.releases.params.term
      }
    }
  },

  methods: {
    updateTime () {
      this.time = this.$store.state.releases.updateTime.fromNow()
    },
    async search () {
      if (!this.__IsConnected) {
        this.$log('Offline, cancelling search.')
      }

      if (this.isRefreshing) return

      this.$store.commit('releases/setParams', this.config)
      await this.$store.dispatch('releases/refresh')

      this.updateTime()
      this.page = 1
    }
  }
}
</script>

<style lang="stylus" scoped>
  .time
    font-size 16px
    font-weight 400
    letter-spacing 0.02em

  .pag-container
    width 100%
    display flex
    justify-content center
</style>
