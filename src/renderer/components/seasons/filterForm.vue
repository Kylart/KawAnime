<template lang="pug">
  v-dialog(
    v-model='show',
    width='60%',
    transition='dialog-transition',
    absolute, persistent
  )
    v-card
      v-card-title.grey--text.text-uppercase
        v-spacer
        span Advanced search
        v-spacer

      v-divider

      v-card-text
        v-container
          v-row(dense, justify='center', align='center')
            template(v-for='form in filterForm')
              v-col(cols='6')
                component(:is='form.component', v-bind='form.props', v-model="filter.models[form.model]")

      v-divider

      v-card-actions
        v-spacer
        v-btn(@click='applyFilters') Apply
        v-btn.blue--text(text, @click='close') Cancel
</template>

<script>
// For some reason, they are not correctly imported and cannot
// be used dynamically by the usual import
import { VAutocomplete, VCombobox } from 'vuetify/lib'

export default {
  name: 'List-Form',

  components: { VAutocomplete, VCombobox },

  props: ['show', 'elems', 'filtered-elems'],

  data: () => ({
    term: '',
    filter: {
      models: {
        list: [],
        score: null,
        genres: [],
        producers: [],
        fromType: [],
        nbEp: []
      },
      keys: [
        'list',
        'score',
        'genres',
        'producers',
        'fromType',
        'nbEp'
      ]
    },
    displayListsNames: [
      { value: 0, text: 'Plan to watch' },
      { value: 1, text: 'Watching' },
      { value: 2, text: 'Completed' },
      { value: 3, text: 'Dropped' },
      { value: 4, text: 'On Hold' }
    ]
  }),

  computed: {
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
          list: [],
          score: [],
          genres: [],
          producers: [],
          fromType: [],
          nbEp: []
        }
      )

      // Custom sorting
      filters.nbEp.sort((a, b) => +b - +a)
      filters.score.sort((a, b) => b - a)

      return filters
    },

    filterForm () {
      return [{
        component: 'v-autocomplete',
        model: 'producers',
        props: {
          label: 'Producers',
          items: this.availableFilters.producers,
          multiple: true,
          'small-chips': true,
          'deletable-chips': true,
          disabled: !this.availableFilters.producers.length
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
        model: 'fromType',
        props: {
          label: 'From Source Type',
          items: this.availableFilters.fromType,
          multiple: true,
          'small-chips': true,
          'deletable-chips': true,
          disabled: !this.availableFilters.fromType.length
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
        model: 'nbEp',
        props: {
          label: 'Number of episodes',
          items: this.availableFilters.nbEp,
          multiple: true,
          'small-chips': true,
          'deletable-chips': true,
          disabled: !this.availableFilters.nbEp.length
        }
      }, {
        component: 'v-combobox',
        model: 'list',
        props: {
          label: 'In List',
          items: this.displayListsNames,
          multiple: true,
          'small-chips': true,
          'deletable-chips': true,
          'item-text': 'text',
          'item-value': 'value'
        }
      }]
    }
  },

  methods: {
    close () {
      this.$emit('close')
    },
    applyFilters () {
      this.$emit('filter', this.filter.models)
    }
  }
}
</script>
