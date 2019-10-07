<template lang="pug">
  div
    v-tabs(
      v-model='active',
      background-color='secondary',
      grow, icons-and-text
    )
      v-tab(
        v-for='list in __llListNames',
        :key='list.list',
        ripple
      ) {{ list.name }}
        v-icon {{ list.icon }}

    v-tabs-items(v-model='active')
      v-tab-item(
        v-for='list in __llListNames',
        :key='list.list'
      )
        list(:name='list.list')
</template>

<script>
// Helpers from store
import { localLists } from '@/store/helpers'

import List from '@/components/localLists/list.vue'

export default {
  name: 'Local-Lists',

  components: { List },

  data: () => ({
    active: 0
  }),

  computed: {
    // Brings __llListNames
    ...localLists.state
  }
}
</script>
