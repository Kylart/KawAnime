<template lang="pug">
  v-container(
    grid-list-lg, fluid, pt-2
  )
    v-row(justify='center', dense)
      v-col(cols='12')
        v-row(justify='space-between', align='center', no-gutters)
          v-col.d-flex.justify-center.time(cols='12', sm='4', md='3') Updated {{ time }}
          v-col(cols='12', sm='8', md='4')
            v-text-field(
              name='Search', ref='term',
              label='Looking for something?',
              v-model='config.term',
              hide-details,
              solo, clearable,
              :loading='isRefreshing',
              @keyup.enter='search'
            )
          v-col(cols='12', md='4')
            v-row(jutify='space-around', dense)
              v-col(cols='3')
                v-select(
                  label='Feed',
                  :items='feeds',
                  v-model='config.feed',
                  item-text='text',
                  item-value='value'
                )
              v-col(cols='6')
                v-combobox(
                  label='Fansub',
                  :items='fansubs',
                  v-model='config.fansub'
                )
              v-col(cols='3')
                v-select(
                  label='Quality',
                  :items='order(qualities)',
                  v-model='config.quality'
                )
      v-col(
        cols='12', sm='6', md='3', lg='3', xl='2',
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
// Components
import Card from '@/components/feed/card.vue'

// Mixins
import Order from '@/mixins/config/order.js'

export default {
  name: 'Entries',

  components: { Card },

  mixins: [Order],

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
    releases: {
      get () {
        return this.$store.state.releases.releases.current
      },
      set () {}
    },
    isOnline: {
      get () {
        return this.$store.state.isConnected
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
      if (!this.isOnline) {
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
