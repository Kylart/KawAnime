<template lang="pug">
  .cue(
    :class="cue.style.join(' ')",
    :style="style"
  )
    transition(
      v-if='cue.hasAnimation',
      name='cue-transition',
      :key='cue.masterId',
      @before-enter='cue.beforeEnter',
      @enter='cue.enter',
      @leave='cue.leave',
      :css='false'
    )
      span(
        v-if='cue.show',
        v-html='cue.text'
      )
    span(
      v-else
      :key='cue.masterId',
      v-html='cue.text'
    )
</template>

<script>
export default {
  name: 'Cue',

  props: [
    'cue',
    'size'
  ],

  computed: {
    style () {
      const { cue } = this

      return {
        [cue.vert]: cue.line + '%',
        [cue.horiz]: cue.position + '%',
        transform: `translate(${cue.align}%, ${cue.vAlign}%)${cue.rotate || ''}`,
        width: cue.width + '%',
        'text-align': cue.textAlign,
        // We reduce the size a bit so that it's not too big on the screen :<
        'font-size': Math.round(0.80 * cue.fontSize * +this.size.height.replace('px', '')) + 'px'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .cue
    background-color rgba(0, 0, 0, 0)
    -webkit-font-smoothing antialiased
    width 95%
    font-family "Open Sans", sans-serif
    font-weight 500
    line-height 1.25
</style>
