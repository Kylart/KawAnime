<template lang="pug">
  v-fade-transition
    #overlay
      .box-container
        .box-text Drop in a #[i video] or a #[i torrent file] to start watching it!
</template>

<script>
export default {
  computed: {
    isVisible () {
      return this.$store.state.overlay.show
    }
  }
}
</script>

<style lang="stylus" scoped>
  #overlay
    position absolute
    height 100%
    width 100%
    z-index 5
    background-color rgba(0, 0, 0, 0.7)
    display flex
    justify-content center
    align-items center

  .box-container
    background url('../../assets/images/overlay.jpg')
    background-size cover
    background-repeat no-repeat
    background-position center center
    width 50%
    height 40%
    position relative

  .box-text
    -webkit-text-stroke 0.02em rgba(30, 30, 30, 0.7)
    position absolute
    top 5%
    left 3%
    width 30%
    text-align center
    background-color rgba(30, 30, 30, 0.7)
    font-size 20px
    font-weight 400
    letter-spacing 0.02em
    padding 10px
    border-radius 3px
</style>
