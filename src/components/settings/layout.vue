<template lang="pug">
  v-card
    v-toolbar(dense, color='indigo')
      v-spacer
      v-btn(icon, @click='close')
        v-icon close

    v-layout
      v-flex.pa-3(xs3)
        drawer(@routeUpdate='setRoute')
      v-flex.pa-5(xs9)
        transition(name='page', mode='out-in')
          component(:is='currentSectionComponent')
</template>

<script>
import Drawer from './drawer.vue'

import * as Sections from './sections'

export default {
  name: 'Config-Layout',

  components: {
    Drawer,
    ...Sections
  },

  data: () => ({
    route: 0
  }),

  computed: {
    sections: {
      get () {
        return this.$store.state.config.sections
      },
      set () {}
    },
    currentSectionComponent () {
      return Object.keys(Sections)[this.route]
    }
  },

  methods: {
    setRoute (val) {
      this.route = val
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="stylus">
  .section-title
    font-size 22px
    letter-spacing 0.04em
    font-weight 500

  .conditions
    font-size 14px
    font-style italic
    letter-spacing 0.02em
    font-weight 300
</style>
