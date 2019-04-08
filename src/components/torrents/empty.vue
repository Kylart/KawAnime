<template lang="pug">
  .main
    .text Don't look at me like this!
    .text
      | Go #[router-link.please(to='/') watch some anime]
      | or
      | #[a(@click='openDialog') download some torrent!]
    .img-container
      video(muted, autoplay, loop)
        source(src='@/assets/images/local-empty.mp4', type='video/mp4')
</template>

<script>
export default {
  name: 'Empty-Torrent',

  methods: {
    openDialog () {
      this.$store.commit('torrents/showDialog', true)
    }
  }
}
</script>

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
