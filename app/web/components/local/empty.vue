<template lang="pug">
  .main
    .text You do not have.. anything to watch?
    .text Let me help you... #[router-link.please(to='/') please.]
    .img-container
      video(muted, autoplay, loop)
        source(src='/static/images/local-empty.mp4', type='video/mp4')
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

  .please
    text-decoration none
    color #4DB6AC
</style>
