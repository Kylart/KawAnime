<template lang="pug">
  v-dialog(
    v-model='show',
    absolute,
    @keydown.esc='close',
    :fullscreen='current !== null',
    width='700'
  )
    template(v-slot:activator='{ on }')
      v-btn(
        v-on='on',
        icon
      )
        v-icon search
    v-card(v-if='!searching && !current')
      v-container
        v-row(justify='center')
          v-col(cols='6')
            v-text-field#info-search-input(
              ref='input',
              v-model='term',
              label='Search',
              hint='Looking for an anime?',
              @keyup.enter='search',
              clearable,
              :loading='loading'
            )

        v-divider(v-show='results.length')

        v-row.mt-2(justify='center', v-if='results.length')
          template(v-for='entry in results')
            v-col(cols='6', md='4', lg='3', @click='getInfo(entry)')
              v-card.entry(ripple)
                v-img(
                  :src='entry.img',
                  :lazy-src='entry.img',
                  height='150',
                  contain
                )
                .body-1.text-center.py-1 {{ entry.name }}

    v-card.loading.text-center(v-else-if='searching')
      //- Just for spacing purposes
      v-card-title

      v-card-text
        p Grabbing those data...
        p Please bear with us for a moment.

      v-divider

      v-card-actions
        v-spacer
        v-btn(@click='back') Cancel

    v-card(v-else)
      v-toolbar(dense, color='secondary')
        v-spacer
        v-btn(icon, @click='close')
          v-icon close
      layout(:current='current', :return-cb='back')
</template>

<script>
import Layout from '@/components/info/layout.vue'

import { mapGetters } from 'vuex'
import { debounce } from 'lodash'

export default {
  name: 'Info-Modal',

  components: { Layout },

  data: () => ({
    timeout: null,
    searching: false,
    results: [],
    current: null,
    loading: false
  }),

  mounted () {
    this.$ipc.on(this.$eventsList.search.term.success, this.ipcSearchSuccess)
    this.$ipc.on(this.$eventsList.search.term.error, this.ipcSearchError)
  },

  // I mean... you never know.
  beforeDestroy () {
    this.$ipc.removeListener(this.$eventsList.search.term.success, this.ipcSearchSuccess)
    this.$ipc.removeListener(this.$eventsList.search.term.error, this.ipcSearchError)
  },

  computed: {
    ...mapGetters('info', ['getEntryInfo']),
    provider: {
      get () {
        return this.$store.state.info.modal.overrideProvider || this.$store.state.config.config.infoProvider.search
      },
      set () {}
    },
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
    removeOverride () {
      this.$store.commit('info/overrideProvider', null)
    },
    close () {
      this.show = false
      this.current = null
      this.isRemote = false
      this.removeOverride()
    },
    back () {
      this.searching = false
      this.current = null

      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    search: debounce(function () {
      if (this.term && this.term.length < 3) return

      this.loading = true

      this.$ipc.send(this.$eventsList.search.term.main, {
        provider: this.provider,
        toSearch: this.term
      })
    }, 300),
    getInfo (entry) {
      this.searching = true

      if (!this.getEntryInfo(entry.name)) {
        const method = entry.next.url ? 'url' : 'name'
        this.$ipc.on(this.$eventsList.search[method].success, this.ipcSuccess)
        this.$ipc.on(this.$eventsList.search[method].error, this.ipcError)

        this.$store.dispatch('info/get', entry.next)
      } else {
        this.ipcSuccess(null, { info: this.getEntryInfo(entry.name), provider: this.provider })
      }
    },
    ipcSuccess (e, { name, info, provider }) {
      this.searching = false

      if (name) {
        const method = /https?:\/\//.test(name) ? 'url' : 'name'
        this.$store.commit('info/set', { name: info.title.en, info, provider })

        this.$ipc.removeListener(this.$eventsList.search[method].success, this.ipcSuccess)
        this.$ipc.removeListener(this.$eventsList.search[method].error, this.ipcError)
      }

      this.current = {
        title: info.title.en
      }

      this.searching = false
    },
    ipcError (e, { name, msg }) {
      this.$log(`Could not find any data for ${name}.`, msg)

      setTimeout(this.getInfo, 1000)
    },
    ipcSearchSuccess (e, { info }) {
      this.results = info
      this.loading = false

      // If this is started from a remote component, we shall set the first
      // result as current.
      this.isRemote && this.getInfo(this.results[0])
    },
    ipcSearchError (e, { msg }) {
      this.loading = false

      this.$store.commit('setInfoSnackbar', 'Could not find any result.')
      this.$log('Error while getting pre-search results.', msg)
    }
  },

  watch: {
    term () {
      this.search()
    },
    show (show) {
      if (show) {
        // Temporary fix
        // TODO: revert to nextTick
        setImmediate(() => this.$refs.input.focus())
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .entry
    cursor pointer
    height 100%

  .loading
    min-height 150px

    p
      font-size 28px
      letter-spacing 0.04em
      font-weight 300
      font-style italic
</style>
