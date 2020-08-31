<template lang="pug">
  v-container.pt-0(fluid)
    list-form(
      :name='name',
      :elems='originalEntries',
      :filtered-elems='entries',
      @selectAll='selectAll',
      @move='move',
      @deleteSelected='deleteSelected',
      @filter='filterEntries'
    )

    //- Simulates `v-row(dense)`
    transition-group(name='list', tag='div', class='row row--dense')
      template(v-for='entry in reduced')
        v-col(
          :key='`${entry.key}-${entry.name}`',
          cols='12', sm='6', md='4', lg='3', xl='2'
        )
          card(
            @clicked='select(entry)',
            @delete='remove(entry)',
            :entry='entry',
            :selected='isSelected(entry)'
          )
</template>

<script>
// Components
import Card from '@/components/localLists/card.vue'
import ListForm from '@/components/localLists/form.vue'

// Mixins
import Reduced from '@/mixins/global/reduced.js'
import Filters from '@/mixins/global/filters.js'

export default {
  name: 'List',

  components: { ListForm, Card },

  mixins: [Filters, Reduced],

  props: ['name'],

  data: () => ({
    sup: 20,
    initSup: 20,
    selected: [],
    listFilters: {
      tags: [],
      genres: [],
      duration: [],
      progress: [],
      score: null,
      season: [],
      status: [],
      nbEp: []
    }
  }),

  computed: {
    originalEntries: {
      get () {
        return Array.from(this.$store.state.watchLists.lists[this.name])
          .sort((a, b) => a.name < b.name ? -1 : 1)
      },
      set () {}
    },
    // For entries from filters mixins
    filterModel () {
      return this.listFilters
    }
  },

  methods: {
    isSelected (entry) {
      return this.selected.findIndex(({ key }) => key === entry.key) > -1
    },
    add (entry, target = null) {
      this.$store.dispatch('watchLists/add', {
        ...entry,
        list: target || this.name
      })
    },
    remove (entry) {
      // We need to remove it from selected data
      this.unselect(entry)

      // And from the actual list
      this.$store.dispatch('watchLists/delete', entry)
    },
    move (target) {
      // move can only be activated on selected items
      this.selected.forEach((entry) => {
        this.remove(entry)
        this.add(entry, target)
      })

      this.selected = []
    },
    select (entry) {
      this.isSelected(entry)
        ? this.unselect(entry)
        : this.selected.push(entry)
    },
    unselect (entry) {
      const index = this.selected.findIndex(({ key }) => key === entry.key)
      index !== -1 && this.selected.splice(index, 1)
    },
    selectAll () {
      const allSelected = this.selected.length === this.entries.length

      this.selected = allSelected ? [] : this.entries
    },
    deleteSelected () {
      this.selected.forEach((entry) => {
        this.remove(entry)
      })
    },
    filterEntries (filters) {
      const filterKeys = Object.keys(filters)

      for (const key of filterKeys) {
        this.$set(this.listFilters, key, filters[key])
      }
    }
  }
}
</script>
