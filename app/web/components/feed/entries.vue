<template lang="pug">
  v-container(
    grid-list-lg, fluid, pt-2
  )
    magnets-modal
    v-layout(row, wrap, justify-center)
      v-flex(xs12)
        v-layout(justify-space-between, align-center)
          v-flex.time(xs3) Updated {{ time }}
          v-flex(xs4)
            v-text-field(
              name='Search', ref='term',
              label='Looking for something?',
              v-model='config.term',
              hide-details,
              solo, clearable,
              :loading='isRefreshing',
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
        xs3,
        v-for='(entry, i) in entries',
        :key='entry.name'
      )
        card(:info='entry', :ref='entry.parsedName.title')

    .pag-container
      v-pagination(
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
import MagnetsModal from 'components/magnets/modal.vue'

export default {
  name: 'Entries',

  components: { Card, MagnetsModal },

  async mounted () {
    this.$nextTick(async () => {
      this.$refs.term.focus()

      if (this.$route.query.name) {
        this.config.term = this.$route.query.name
        this.$route.query.name = undefined
        await this.search()
      }

      this.update()
    })
  },

  data: () => ({
    page: 1,
    entryPerPage: 12,
    releases: [],
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
    isRefreshing: {
      get () {
        return this.$store.state.releases.isRefreshing
      },
      set () {}
    },
    qualities: {
      get () {
        return this.$store.state.releases.qualities
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
        quality: this.$store.state.releases.params.quality,
        fansub: this.$store.state.releases.params.fansub,
        feed: this.$store.state.releases.params.feed,
        term: this.$store.state.releases.params.term
      }
    },
    time () {
      return this.$store.state.releases.updateTime.fromNow()
    }
  },

  methods: {
    update () {
      this.releases = this.$store.getters['releases/getReleases']
    },
    async search () {
      if (this.isRefreshing) return

      this.$store.commit('releases/setParams', this.config)
      await this.$store.dispatch('releases/refresh')

      this.page = 1
      this.$nextTick(this.update)
    },
    order (qualities) {
      // We have to clone qualities as the reverse method changes the original input,
      // which would cause an endless reversing loop and throws warning.
      const copy = Array.from(qualities)
      return copy.sort((a, b) => a.replace('p', '') - b.replace('p', '')).reverse()
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
