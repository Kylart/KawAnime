<template lang="pug">
  .sections-container.elevation-12.secondary.pt-2.pb-2
    v-list-item(
      v-for='section in sections', :key='section.value',
      @click='setRoute(section.value)',
      :color='getColor(section.value)',
      ripple
    )
      v-list-item-action
        v-icon(:color='getColor(section.value)') {{ section.icon }}
      v-list-item-content
        v-list-item-title
          span {{ section.name }}
</template>

<script>
export default {
  name: 'Setting-Drawer',

  props: ['indexKey'],

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
    },
    getColor (val) {
      return this.indexKey === val
        ? 'primary'
        : 'default'
    }
  }
}
</script>

<style lang="stylus" scoped>
  .sections-container
    width 100%
</style>
