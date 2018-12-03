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
        'text-shadow': this.shadow,
        'text-align': cue.textAlign,
        // We reduce the size a bit so that it's not too big on the screen :<
        'font-size': Math.round(0.80 * cue.fontSize * +this.size.height.replace('px', '')) + 'px'
      }
    },
    shadow () {
      let result = ''

      const { shadow, outline } = this.cue
      const containerHeight = +this.size.height.slice(0, -2) // Need to remove px

      const shadowDepth = shadow.thickness * 1.5 * containerHeight
      const outlineDepth = outline.thickness * containerHeight * 2

      // First, outline
      result = `0 0 ${1.8 * outlineDepth}px ${outline.color}, `.repeat(8).slice(0, -2)

      if (shadowDepth) {
        if (!outline.thickness) {
          // SSA specifies that if no outline is set, 1px outline must be forced.
          result = `1px 1px 1px ${shadow.color}, `.repeat(8).slice(0, -2)
        }

        result = `${shadowDepth}px ${shadowDepth}px ${shadowDepth}px ${shadow.color}, ${result}`
      }

      return result
    }
  }
}
</script>

<style lang="stylus">
  .cue
    background-color rgba(0, 0, 0, 0)
    -webkit-font-smoothing antialiased
    width 95%
    font-family "Open Sans", sans-serif
    font-weight 500
    line-height 1.25
</style>
