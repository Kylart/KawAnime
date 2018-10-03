<template lang="pug">
  v-hover
    v-card.news(ripple, hover, slot-scope='{ hover }')
      v-container(fluid, fill-height, pa-0)
        v-layout(row, wrap)
          v-flex(xs4, pt-0)
            v-img(
              contain,
              position='left center'
              height='250',
              :src='pictureUrl',
              :lazy-src='pictureUrl'
            )
              v-expand-transition
                .overlay(
                  v-if='hover',
                  class='d-flex transition-fast-in-fast-out v-card--reveal display-3',
                  style='height: 100%;',
                  @click='open'
                )
                  div
                    v-btn(icon, large)
                      v-icon(large) open_in_new
          v-flex(xs8)
            v-container(fluid, fill-height, pa-0, pr-2, pb-2)
              v-layout(column)
                v-flex.entry-title(xs1) {{ info.title }}
                v-divider

                v-flex.entry-text(xs11, pt-2)
                  div {{ info.text }}
</template>

<script>
export default {
  name: 'News-Card',

  props: ['info'],

  data: () => ({
    overlay: false
  }),

  computed: {
    pictureUrl () {
      const url = this.info.image
      const sizeRegex = /\/r\/\d*x\d*/
      const parts = url.split('.')

      const completeUrl = parts.slice(0, -1).join('.').replace(sizeRegex, '') + '.jpeg'

      return completeUrl
    }
  },

  methods: {
    async open () {
      const { link } = this.info

      await this.$axios.get('openThis', {
        params: {
          type: 'link',
          link
        }
      })
    },
    showOverlay () {
      this.overlay = true
    },
    hideOverlay () {
      this.overlay = false
    }
  }
}
</script>

<style lang="stylus" scoped>
  .news
    height 250px

    .overlay
      background-color rgba(0, 0, 0, 0.3)
      align-items center
      justify-content center

      div
        text-align center

    .entry-title
      text-align center
      font-size 16px
      line-height 20px

    .entry-text
      text-align justify
      font-size 13px
      max-height 100%
      overflow-y auto

      div
        height 100%
        display flex
        align-items center
</style>
