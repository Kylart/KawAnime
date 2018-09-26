<template lang="pug">
  v-layout(row, wrap, justify-center)
    v-flex(xs12, d-flex, justify-center)
      span Now retrieving seasonal information. Please stand by for a moment.
    v-flex(xs6, d-flex, justify-center)
      img(src='~static/images/wait.gif')
</template>

<style lang="stylus" scoped>
  span
    font-size 26px
    font-style italic
    font-weight 300
    letter-spacing 0.03em
    text-align center
    padding 32px 0
</style>
