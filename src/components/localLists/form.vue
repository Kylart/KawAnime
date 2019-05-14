<template lang="pug">
  v-container(fluid, grid-list-md, pa-1, pt-0)
    v-dialog(
      v-model='filter.show',
      width='60%',
      transition='dialog-transition',
      lazy, absolute
    )
      v-card
        v-card-title.grey--text.text-uppercase
          v-spacer
          span Advanced research
          v-spacer

        v-divider

        v-card-text
          v-container(grid-list-md)
            v-layout(row, wrap, justify-center, align-center)
              template(v-for='form in filterForm')
                v-flex(xs6)
                  component(:is='form.component', v-bind='form.props', v-model="filter.models[form.model]")

        v-divider

        v-card-actions
          v-spacer
          v-btn(@click='applyFilters') Apply
          v-btn.blue--text(flat, @click='filter.show = false') Cancel

    v-layout(justify-space-between, align-center)
      .actions
        v-btn(icon, @click="$emit('selectAll')")
          v-icon select_all

        v-menu(open-on-hover, transition='slide-x-transition')
          v-btn(slot='activator') Move to
          v-list
            v-list-tile(
              v-for='list in lists'
              :key='list.icon'
              @click="$emit('move', list.list)"
            )
              v-list-tile-avatar
                v-icon {{ list.icon }}
              v-list-tile-title {{ list.name }}

        v-btn(icon, color='red', @click="$emit('deleteSelected')")
          v-icon delete

        .label(xs12, sm3, md2, lg1) {{ nbElems }} {{ label }}

      div
        v-btn(@click='showFilterForm')
          v-icon filter_list
          span.pl-2 Filter
        v-btn(@click='showForm')
          v-icon add
          span.pl-2 Add
</template>

<script>
export default {
  name: 'List-Form',

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
