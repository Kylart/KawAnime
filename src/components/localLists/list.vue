<template lang="pug">
  v-container(fluid, grid-list-md, pt-2)
    v-layout(row, wrap)
      v-flex(xs12)
        list-form(
          :name='name', :nb-elems='entries.length',
          @selectAll='selectAll', @move='move',
          @deleteSelected='deleteSelected'
        )

      transition-group(name='list', tag='div', class='trans layout row wrap')
        template(v-for='entry in reduced')
          v-flex(
            :key='entry.key',
            xs12, sm6, md4, lg3, xl2
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

export default {
  name: 'List',

  components: { ListForm, Card },

  mixins: [ Reduced ],

  props: ['name'],

  data: () => ({
    sup: 80,
    initSup: 80,
    selected: []
  }),

  computed: {
    entries: {
      get () {
        return this.$store.state.watchLists.lists[this.name]
      },
      set () {}
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
    }
  }
}
</script>

<style lang="stylus" scoped>
  .trans
    width 100%
</style>
