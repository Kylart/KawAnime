<template lang="pug">
  .main
    .text Now retrieving the latest news. Please stand by for a moment.
    .img-container
      img(src='@/assets/images/news-wait.gif')
</template>

<style lang="stylus" scoped>
  .main
    width 100%
    height 100%
    text-align center

  .text
    font-size 26px
    font-style italic
    font-weight 300
    letter-spacing 0.03em
    text-align center
    margin 32px 0

  .img-container
    display inline-block
</style>
