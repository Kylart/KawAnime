<template lang="pug">
  v-container(fluid, grid-list-md, pa-1, pt-0)
    v-layout(row, wrap, justify-space-between, align-center)
      v-flex.actions(xs12, sm5, md3, lg2)
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
      v-flex.label(xs12, sm3, md2, lg1) {{ nbElems }} {{ label }}
      v-flex(xs12, sm4, md3, offset-md3, lg2, offset-lg7)
        v-btn(large, icon, @click='showForm')
          v-icon(large) add
</template>

<script>
export default {
  name: 'List-Form',

  props: ['name', 'nbElems'],

  data: () => ({
    term: ''
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
    }
  },

  methods: {
    showForm () {
      this.$store.commit('watchLists/toggleForm', true)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .actions
    display flex
    justify-content space-around

  .label
    font-size 18px
    letter-spacing 0.05em
    font-weight 300
</style>
