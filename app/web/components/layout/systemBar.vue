<template lang="pug">
  v-system-bar.bar.dragable.pr-0(app)
    v-spacer
    .window-icon.non-dragable(v-if="!isBrowser && $store.state.platform !== 'darwin'")
      v-icon.not-close(@click="actOnWindow('minimize')") remove
      v-icon.not-close(@click="actOnWindow('maximize')") check_box_outline_blank
      v-icon.close(@click="actOnWindow('close')") close
</template>

<script>
export default {
  name: 'System-Bar',

  mounted () {
    this.isBrowser = !window.navigator.appVersion.includes('Electron')
  },

  data: () => ({
    isBrowser: false
  }),

  methods: {
    actOnWindow (action) {
      this.$axios.get('/_win', {
        params: {
          action
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .bar
    background-color rgb(30, 30, 30)

  .window-icon
    cursor pointer
    height 100%

  .close, .not-close
    text-align center
    margin 0
    height 100%
    width 25px

  .not-close
    padding-top 4px
    font-size 17px

    &:hover
      background-color rgba(255, 255, 255, 0.25)

  .close
    padding-top 2px
    font-size 18px

    &:hover
      background-color rgba(240, 71, 71, 0.7)
</style>
