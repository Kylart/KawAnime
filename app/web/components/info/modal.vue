<template lang="pug">
  v-dialog(
    v-model='show',
    lazy, absolute,
    @keydown.esc='close',
    :fullscreen='current !== null',
    width='700'
  )
    v-btn(
      slot='activator',
      icon
    )
      v-icon search
    v-card(v-if='!searching && !current')
      v-container(grid-list-md)
        v-layout(row, wrap, justify-center)
          v-flex(xs6)
            v-text-field(
              ref='input',
              v-model='term',
              label='Search',
              hint='Looking for an anime?',
              @keyup.enter='search',
              clearable
            )

        v-divider(v-show='results.length')

        v-layout(row, wrap, justify-center, mt-2, v-if='results.length')
          template(v-for='entry in results')
            v-flex(xs3, @click='getInfo(entry)')
              v-card.entry.elevation-5(
                ripple)
                v-img(
                  :src='getPictureUrl(entry.image_url)',
                  :lazy-src='getPictureUrl(entry.image_url)',
                  height='150',
                  contain
                )
                .entry-title {{ entry.name }}

    v-card.loading(v-else-if='searching')
      p Grabbing those data...
      p Please bear with us for a moment.

    v-card(v-else)
      v-toolbar(dense, color='indigo')
        v-spacer
        v-btn(icon, @click='close')
          v-icon close
      layout(:current='current', :return-cb='back')
</template>

<script>
import Layout from 'components/info/layout.vue'

import { mapGetters } from 'vuex'
import { debounce } from 'lodash'

export default {
  name: 'Info-Modal',

  components: { Layout },

  data: () => ({
    timeout: null,
    searching: false,
    results: [],
    current: null
  }),

  computed: {
    ...mapGetters('info', {
      allInfo: 'getInfo'
    }),
    term: {
      get () {
        return this.$store.state.info.modal.term
      },
      set (val) {
        this.$store.commit('info/setTerm', val)
      }
    },
    show: {
      get () {
        return this.$store.state.info.modal.show
      },
      set (bool) {
        this.$store.commit('info/showModal', bool)
      }
    },
    isRemote: {
      get () {
        return this.$store.state.info.modal.isRemote
      },
      set (bool) {
        this.$store.commit('info/setRemote', bool)
      }
    }
  },

  methods: {
    close () {
      this.show = false
      this.current = null
      this.isRemote = false
    },
    back () {
      this.current = null
    },
    getPictureUrl (url) {
      const sizeRegex = /\/r\/\d*x\d*/
      const parts = url.split('.')

      const completeUrl = parts.slice(0, -1).join('.').replace(sizeRegex, '') + '.jpg'

      return completeUrl
    },
    search: debounce(async function () {
      if (this.term.length < 3) return

      const { data, status } = await this.$axios.get('searchTermOnMal', {
        params: {
          term: this.term
        }
      })

      if (status === 204) {
        this.$log('Error while getting pre-search results.')
        return
      }

      this.results = data

      // If this is started from a remote component, we shall set the first
      // result as current.
      this.isRemote && this.getInfo(this.results[0])
    }, 300),
    async getInfo (entry) {
      this.searching = true

      if (!this.allInfo.hasOwnProperty(entry.name)) {
        await this.$store.dispatch('info/get', entry)
      }

      this.current = {
        title: entry.name
      }

      this.searching = false
    }
  },

  watch: {
    term () {
      this.search()
    },
    show () {
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .entry
    cursor pointer
    height 100%

    .entry-title
      font-size 18px
      text-align center
      letter-spacing 0.04em
      font-weight 300
      padding 10px

  .loading
    min-height 150px
    text-align center
    padding 30px

    p
      font-size 28px
      letter-spacing 0.04em
      font-weight 300
      font-style italic
</style>
