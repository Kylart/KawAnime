<template lang="pug">
  div
    season-form(@refresh='resetSup')

    filter-form(
      :show='filter.show',
      :elems='originalEntries',
      :filtered-entries='entries',
      @close='toggleFilterForm',
      @filter='setFilters'
    )

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
            fluid, grid-list-md, pt-0
          )
            v-layout(justify-space-between, align-center, pa-3)
              .label {{ entries.length }} {{ label }}

              .filters-container
                v-text-field(
                  label='Search'
                  v-model='term',
                  clearable
                )

                v-btn.ml-4(@click='toggleFilterForm')
                  v-icon filter_list
                  span.pl-2 Filter

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
import Card from '@/components/seasons/card.vue'
import SeasonForm from '@/components/seasons/form.vue'
import Loader from '@/components/seasons/loader.vue'
import FilterForm from '@/components/seasons/filterForm.vue'

// Allows fancy lazy loading of entries
import Reduced from '@/mixins/global/reduced.js'
import Filters from '@/mixins/global/filters.js'

export default {
  name: 'Season',

  components: { Card, SeasonForm, Loader, FilterForm },

  mixins: [ Filters, Reduced ],

  data: () => ({
    active: 0,
    sup: 8,
    initSup: 8,
    term: '',
    filter: {
      show: false,
      form: {
        list: [],
        genres: [],
        producers: [],
        fromType: [],
        nbEp: []
      }
    }
  }),

  computed: {
    seasons () {
      return this.$store.state.seasons.seasons
    },
    tabs () {
      return Object.keys(this.seasons).sort((a, b) => a.length - b.length)
    },
    refreshing: {
      get () {
        return this.$store.state.seasons.isRefreshing
      },
      set () {}
    },
    originalEntries () {
      const tab = this.tabs[this.active]
      const entries = (this.seasons[tab] || [])
        .filter(({ title }) => title.toLowerCase().includes(this.term.toLowerCase()))

      return entries
    },
    label () {
      return this.entries.length === 1
        ? 'entry'
        : 'entries'
    },
    // For entries from filters mixins
    filterModel () {
      return this.filter.form
    }
  },

  methods: {
    setFilters (models) {
      this.filter.form = models
      this.toggleFilterForm()
    },
    toggleFilterForm () {
      this.$set(this.filter, 'show', !this.filter.show)
    }
  },

  watch: {
    active () {
      this.sup = this.initSup
    }
  }
}
</script>

<style lang="stylus" scoped>
  .filters-container
    display flex
    justify-content space-between
    align-items center
    min-width 30%

  .label
    font-size 18px
    letter-spacing 0.05em
    font-weight 300
    padding 0 8px
</style>
