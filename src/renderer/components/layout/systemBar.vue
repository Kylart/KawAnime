<template lang="pug">
  v-system-bar.bar.dragable.pr-0(app)
    v-spacer
    .window-icon.non-dragable(v-if="__Platform !== 'darwin'")
      v-icon.not-close(@click="actOnWindow('minimize')") remove
      v-icon.not-close(@click="actOnWindow('maximize')") check_box_outline_blank
      v-icon.close(@click="actOnWindow('close')") close
</template>

<script>
import { global } from '@/store/helpers'

export default {
  name: 'System-Bar',

  computed: {
    ...global.state
  },

  methods: {
    actOnWindow (action) {
      const win = this.$electron.remote.getCurrentWindow()

      switch (action) {
        case 'maximize':
          win.isMaximized()
            ? win.unmaximize()
            : win.maximize()

          break

        default:
          win[action]()
      }
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
