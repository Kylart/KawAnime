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
      background-color='secondary',
      grow
    )
      v-tab(
        v-model='active',
        v-for='season in tabs',
        :key='season',
        ripple
      ) {{ season }}

    v-tabs-items(v-model='active')
      v-tab-item(v-for='season in tabs', :key='season')
        transition(name='fade', mode='out-in')
          v-container(
            v-if='!refreshing',
            key='season',
            fluid
          )
            v-row.px-3(justify='space-between', align='center')
              .title.font-weight-light {{ entries.length }} {{ label }}

              .d-flex.align-center.justify-space-between
                v-text-field(
                  label='Search'
                  v-model='term',
                  clearable
                )

                v-btn.ml-4(@click='toggleFilterForm')
                  v-icon filter_list
                  span.pl-2 Filter

            v-row(justify='center', dense)
              template(v-for='entry in reduced')
                card(:info='entry')

          v-container(
            key='loading', v-else,
            fluid, fill-height
          )
            loader
</template>

<script>
import { mapState } from 'vuex'

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

  mixins: [Filters, Reduced],

  data: () => ({
    active: 0,
    term: '',

    // Reduced mixin
    sup: 8,
    initSup: 8,

    filter: {
      show: false,
      // Filter mixin
      form: {
        list: [],
        score: null,
        genres: [],
        producers: [],
        fromType: [],
        nbEp: []
      }
    }
  }),

  computed: {
    ...mapState('seasons', {
      seasons: 'seasons',
      refreshing: 'isRefreshing'
    }),

    tabs () {
      return Object.keys(this.seasons).sort((a, b) => a.length - b.length)
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
