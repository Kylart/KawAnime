<template lang="pug">
  div
    magnets
    v-tabs(
      v-model='active',
      color='indigo',
      grow, icons-and-text
    )
      v-tab(
        v-for='list in lists',
        :key='list.list',
        ripple
      ) {{ list.name }}
        v-icon {{ list.icon }}

      v-tab-item(
        v-for='list in lists',
        :key='list.list', lazy
      )
        list(:name='list.list')
</template>

<script>
import Magnets from 'components/magnets/modal.vue'
import List from 'components/localLists/list.vue'

export default {
  name: 'Local-Lists',

  components: { List, Magnets },

  data: () => ({
    active: 0
  }),

  computed: {
    lists: {
      get () {
        return this.$store.state.watchLists.listNames
      },
      set () {}
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
