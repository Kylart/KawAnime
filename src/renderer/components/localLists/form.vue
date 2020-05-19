<template lang="pug">
  v-container(fluid, pa-0)
    v-dialog(
      v-model='filter.show',
      width='60%',
      transition='dialog-transition',
      absolute
    )
      v-card
        v-card-title.grey--text.text-uppercase
          v-spacer
          span Advanced research
          v-spacer

        v-divider

        v-card-text
          v-container(grid-list-md)
            v-row(justify='center', align='center')
              template(v-for='form in filterForm')
                v-col(cols='6')
                  component(:is='form.component', v-bind='form.props', v-model="filter.models[form.model]")

        v-divider

        v-card-actions
          v-spacer
          v-btn(@click='applyFilters') Apply
          v-btn.blue--text(text, @click='filter.show = false') Cancel

    v-row.px-4(justify='space-between')
      v-col(cols='12', sm='6' md='4', lg='3')
        v-row(align='center', justify='space-around')
          .d-flex.justify-center
            v-btn(icon, @click="$emit('selectAll')")
              v-icon select_all

          .d-flex.justify-center
            v-menu(open-on-hover, transition='slide-x-transition')
              template(v-slot:activator='{ on }')
                v-btn(v-on='on') Move to
              v-list
                v-list-item(
                  v-for='list in lists'
                  :key='list.icon'
                  @click="$emit('move', list.list)"
                )
                  v-list-item-avatar
                    v-icon {{ list.icon }}
                  v-list-item-title {{ list.name }}

          .d-flex.justify-center
            v-btn(icon, color='red', @click="$emit('deleteSelected')")
              v-icon delete

          .d-flex.justify-center
            .label(xs12, sm3, md2, lg1) {{ nbElems }} {{ label }}

      v-col(cols='12', sm='4', md='3', lg='2')
        v-row(justify='space-around')
          .d-flex.justify-center
            v-btn(@click='showFilterForm')
              v-icon filter_list
              span.pl-2 Filter

          .d-flex.justify-center
            v-btn(@click='showForm')
              v-icon add
              span.pl-2 Add
</template>

<script>
// For some reason, they are not correctly imported and cannot
// be used dynamically by the usual import
import { VAutocomplete, VCombobox } from 'vuetify/lib'

export default {
  name: 'List-Form',

  components: { VAutocomplete, VCombobox },

  props: ['name', 'elems', 'filtered-elems'],

  data: () => ({
    term: '',
    filter: {
      show: false,
      models: {
        tags: [],
        genres: [],
        duration: [],
        progress: [],
        score: null,
        season: [],
        status: [],
        nbEp: []
      },
      keys: [
        'tags',
        'genres',
        'duration',
        'progress',
        'score',
        'season',
        'status',
        'nbEp'
      ]
    }
  }),

  computed: {
    lists: {
      get () {
        return this.$store.state.watchLists.listNames.filter((list) => list.list !== this.name)
      },
      set () {}
    },
    label () {
      return this.nbElems === 1
        ? 'entry'
        : 'entries'
    },
    nbElems () {
      return this.filteredElems.length
    },
    availableFilters () {
      const filters = this.elems.reduce(
        (acc, entry) => {
          for (const key of this.filter.keys) {
            const value = entry[key]

            if (!value) continue

            if (Array.isArray(value)) {
              acc[key] = [
                ...acc[key],
                ...value.filter((val) => !acc[key].includes(val))
              ]
            } else {
              !acc[key].includes(value) && acc[key].push(value)
            }
          }

          return acc
        }, {
          tags: [],
          genres: [],
          duration: [],
          progress: [],
          score: [],
          season: [],
          status: [],
          nbEp: []
        }
      )

      // Custom sorting
      filters.duration.sort((a, b) => b - a)
      filters.season.sort()
      filters.nbEp.sort((a, b) => b - a)
      filters.score.sort((a, b) => b - a)

      return filters
    },
    filterForm () {
      return [{
        component: 'v-autocomplete',
        model: 'tags',
        props: {
          label: 'Tags',
          items: this.availableFilters.tags,
          multiple: true,
          'small-chips': true,
          'deletable-chips': true,
          disabled: !this.availableFilters.tags.length
        }
      }, {
        component: 'v-autocomplete',
        model: 'genres',
        props: {
          label: 'Genres',
          items: this.availableFilters.genres,
          multiple: true,
          'small-chips': true,
          'deletable-chips': true,
          disabled: !this.availableFilters.genres.length
        }
      }, {
        component: 'v-autocomplete',
        model: 'duration',
        props: {
          label: 'Duration',
          items: this.availableFilters.duration,
          multiple: true,
          'small-chips': true,
          'deletable-chips': true,
          disabled: !this.availableFilters.duration.length
        }
      }, {
        component: 'v-autocomplete',
        model: 'progress',
        props: {
          label: 'Progress',
          items: this.availableFilters.progress,
          multiple: true,
          'small-chips': true,
          'deletable-chips': true,
          disabled: !this.availableFilters.progress.length
        }
      }, {
        component: 'v-autocomplete',
        model: 'season',
        props: {
          label: 'Season',
          items: this.availableFilters.season,
          multiple: true,
          'small-chips': true,
          'deletable-chips': true,
          disabled: !this.availableFilters.season.length
        }
      }, {
        component: 'v-combobox',
        model: 'score',
        props: {
          label: 'Score',
          items: this.availableFilters.score,
          type: 'number'
        }
      }, {
        component: 'v-autocomplete',
        model: 'status',
        props: {
          label: 'Status',
          items: this.availableFilters.status,
          multiple: true,
          'small-chips': true,
          'deletable-chips': true,
          disabled: !this.availableFilters.status.length
        }
      }, {
        component: 'v-autocomplete',
        model: 'nbEp',
        props: {
          label: 'Number of episodes',
          items: this.availableFilters.nbEp,
          multiple: true,
          'small-chips': true,
          'deletable-chips': true,
          disabled: !this.availableFilters.nbEp.length
        }
      }]
    }
  },

  methods: {
    showForm () {
      this.$store.commit('watchLists/toggleForm', true)
    },
    showFilterForm () {
      this.filter.show = true
    },
    applyFilters () {
      this.$emit('filter', this.filter.models)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .actions
    display flex
    justify-content space-around
    align-items center

  .label
    font-size 18px
    letter-spacing 0.05em
    font-weight 300
    padding 0 8px
</style>
