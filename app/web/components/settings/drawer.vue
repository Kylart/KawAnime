<template lang="pug">
  .sections-container.elevation-12.indigo
    v-list-tile(
      v-for='section in sections', :key='section.value',
      @click='setRoute(section.value)'
      ripple
    )
      v-list-tile-action
        v-icon {{ section.icon }}
      v-list-tile-content
        v-list-tile-title
          span {{ section.name }}
</template>

<script>
export default {
  name: 'Setting-Drawer',

  computed: {
    sections: {
      get () {
        return this.$store.state.config.sections
      },
      set () {}
    }
  },

  methods: {
    setRoute (val) {
      this.$emit('routeUpdate', val)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .sections-container
    width 100%
</style>
