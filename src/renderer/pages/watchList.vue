<template lang="pug">
  v-container.pa-0.watch-list(fluid)
    v-tabs(
      v-model='active',
      background-color='secondary',
      grow,
      icons-and-text
    )
      v-tab(
        v-for='list in lists',
        :key='list.list',
        ripple
      ) {{ list.name }}
        v-icon {{ list.icon }}

    v-tabs-items(v-model='active')
      v-tab-item(
        v-for='list in lists',
        :key='list.list'
      )
        list(:name='list.list')
</template>

<script>
import List from '@/components/localLists/list.vue'

export default {
  name: 'Local-Lists',

  components: { List },

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
  .watch-list {
    overflow-x hidden
  }
</style>
