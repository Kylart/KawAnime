<template lang="pug">
  .main
    .text It seems you do not have any account set up for {{ providerName }}.
    .text You can set it up on in the settings!
    .img-container
      video(muted, autoplay, loop)
        source(src='../../assets/images/local-empty.mp4', type='video/mp4')
</template>

<script>
export default {
  name: 'Service-Empty',

  computed: {
    provider () {
      return this.$route.params.provider
    },
    providerName () {
      const _provider = this.$store.state.config.providers.find(({ value }) => value === this.provider)

      return _provider ? _provider.text : ''
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
</style>
