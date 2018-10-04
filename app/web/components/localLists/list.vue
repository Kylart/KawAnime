<template lang="pug">
  v-container(fluid, grid-list-md, pt-2)
    v-layout(row, wrap)
      v-flex(xs12)
        list-form(
          :name='name', :nb-elems='entries.length',
          @selectAll='selectAll', @move='move',
          @add='add', @deleteSelected='deleteSelected'
        )

      transition-group(name='list', tag='div', class='trans layout row wrap')
        template(v-for='entry in reduced')
          v-flex(
            :key='entry',
            xs12, sm6, md4, lg3, xl2
          )
            card(
              @clicked='select(entry)',
              @delete='remove(entry)',
              :name='entry',
              :selected='isSelected(entry)'
            )
</template>

<script>
// Components
import Card from 'components/localLists/card.vue'
import ListForm from 'components/localLists/form.vue'

// Mixins
import Reduced from 'mixins/global/reduced.js'

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
    isSelected (name) {
      return this.selected.includes(name)
    },
    add (name, target = null) {
      this.$store.commit('watchLists/addTo', {
        listName: target || this.name,
        entry: name
      })

      this.$store.dispatch('watchLists/save')
    },
    remove (name) {
      // We need to remove it from selected data
      this.unselect(name)

      // And from the actual list
      this.$store.commit('watchLists/removeFrom', {
        listName: this.name,
        entry: name
      })

      this.$store.dispatch('watchLists/save')
    },
    move (target) {
      // move can only be activated on selected items
      this.selected.forEach((name) => {
        this.remove(name)
        this.add(name, target)
      })

      this.selected = []
    },
    select (name) {
      this.isSelected(name)
        ? this.unselect(name)
        : this.selected.push(name)
    },
    unselect (name) {
      const index = this.selected.indexOf(name)
      index !== -1 && this.selected.splice(index, 1)
    },
    selectAll () {
      const allSelected = this.selected.length === this.entries.length

      this.selected = allSelected ? [] : this.entries
    },
    deleteSelected () {
      this.selected.forEach((name) => {
        this.remove(name)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .trans
    width 100%
</style>
