<template lang="pug">
  div
    season-form

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
              template(v-for='entry in seasons[season]')
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

export default {
  name: 'Season',

  components: { Card, SeasonForm, Loader },

  data: () => ({
    active: null
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
    }
  }
}
</script>
