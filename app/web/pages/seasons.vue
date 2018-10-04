<template lang="pug">
  div
    season-form(@refresh='resetSup')

    v-tabs(
      v-model='active',
      color='indigo',
      grow
    )
      v-tab(
        v-for='season in tabs',
        :key='season',
        ripple
      ) {{ season }}

      v-tab-item(
        v-for='season in tabs',
        :key='season', lazy
      )
        transition(name='fade', mode='out-in')
          v-container(
            key='season', v-if='!refreshing',
            fluid, grid-list-md
          )
            v-layout(row, wrap)
              template(v-for='entry in reduced')
                card(:info='entry')

          v-container(
            key='loading', v-else,
            fluid, fill-height
          )
            loader
</template>

<script>
import Card from 'components/seasons/card.vue'
import SeasonForm from 'components/seasons/form.vue'
import Loader from 'components/seasons/loader.vue'

// Allows fancy lazy loading of entries
import Reduced from 'mixins/global/reduced.js'

export default {
  name: 'Season',

  components: { Card, SeasonForm, Loader },

  mixins: [ Reduced ],

  data: () => ({
    active: 0,
    sup: 8,
    initSup: 8
  }),

  computed: {
    seasons () {
      return this.$store.state.seasons.seasons
    },
    tabs () {
      return Object.keys(this.seasons)
    },
    refreshing: {
      get () {
        return this.$store.state.seasons.isRefreshing
      },
      set () {}
    },
    entries () {
      const tab = this.tabs[this.active]
      const entries = this.seasons[tab]

      return entries
    }
  },

  watch: {
    active () {
      this.sup = this.initSup
    }
  }
}
</script>
