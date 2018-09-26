<template lang="pug">
  div(@scroll='handleScroll')
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

export default {
  name: 'Season',

  components: { Card, SeasonForm, Loader },

  mounted () {
    this.content = document.querySelector('.v-content__wrap')
    this.content.addEventListener('scroll', this.handleScroll)
  },

  beforeDestroy () {
    this.content.removeEventListener('scroll', this.handleScroll)
  },

  data: () => ({
    content: null,
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
    reduced () {
      const tab = this.tabs[this.active]
      const entries = this.seasons[tab]

      return entries.slice(0, this.sup)
    }
  },

  methods: {
    handleScroll (e) {
      const { scrollTop, scrollHeight } = this.content

      const tab = this.tabs[this.active]
      const max = this.seasons[tab].length

      const donePercent = scrollTop / scrollHeight
      const sup = Math.round((donePercent * max) + this.initSup)

      if (sup > this.sup) this.sup = sup
    },
    resetSup () {
      this.sup = this.initSup
    }
  },

  watch: {
    active () {
      this.sup = this.initSup
    }
  }
}
</script>
