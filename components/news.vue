<template lang="pug">
  v-flex(xs12 v-ripple="true").elevation-3.elem
    v-layout(row wrap)
      v-flex(xs12)
        h3.title {{ item.title }}
      v-flex(md2, xs3, xl1, style="height: 220px;")
        lazy-component
          img(:src="item.image" onerror="this.src='static/images/error.jpg'").image
      v-flex(md10, xs9, xl11)
        v-layout(row wrap)
          v-flex(xs12)
            p.synopsis {{ item.text }}
          v-flex(xs12).link
            div.button-container
              v-btn(color='secondary', block, @click="open(item.link)") Open
</template>

<script>
export default {
  props: {
    item: Object
  },
  methods: {
    open (link) {
      this.$store.dispatch('news/openLink', link)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/functions'

  .elem
    position relative
    margin-bottom 15px
    padding 0
    background-color rgb(60, 60, 60)

  .elem:hover
    hover_background()

  .title
    line-height 24px !important
    margin-top 5px
    padding 5px 2%
    overflow hidden
    white-space nowrap
    text-overflow ellipsis

  .image
    height 220px
    max-width 100%

  .synopsis
    padding-top 2%
    height 150px

  .link
    height 50%
    width 100%
    text-align right
    display inline-block
    padding 0 5% 0 10%

  .button-container
    display inline-block
    width 15%
</style>
