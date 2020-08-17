<template lang="pug">
  .dev-label
    span Development mode
</template>

<style lang="stylus" scoped>
  .dev-label
    height 24px
    width 100%
    position fixed
    top 0
    z-index 1000
    text-align center
    pointer-events none

    span
      line-height 24px
      font-size 12px
      font-style italic
      font-weight 300
      letter-spacing 1px
</style>
