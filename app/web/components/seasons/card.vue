<template lang="pug">
  v-flex.entry(xs12, sm6, lg4)
    v-hover
      v-card(ripple, slot-scope='{ hover }')
        v-layout(row, wrap)
          v-flex.pt-0.pb-0(xs4)
            v-img(
              :src='pictureUrl'
              :lazy-src='pictureUrl',
              height='260'
            )
              transition(name='fade')
                .overlay(
                  v-if='hover',
                  class='d-flex transition-fast-in-fast-out darken-2 v-card--reveal display-3',
                  style='height: 100%;'
                )
                  template(v-for='list in lists')
                    v-tooltip(top, lazy)
                      v-btn(
                        slot='activator',
                        @click='_addTo(list.list)',
                        :color="_isIn(list.list) ? '#66BB6A' : 'default'",
                        icon
                      )
                        v-icon {{ list.icon }}
                      span {{ _isIn(list.list) ? 'Remove from' : 'Add to' }} {{ list.name }}
          v-flex.pa-2.pr-3(xs8)
            v-layout(row, wrap, column)
              v-flex(xs2, d-flex, justify-space-between)
                v-tooltip.entry-title.ellipsis(top, lazy)
                  span(slot='activator') {{ info.title }}
                  span {{ info.title }}
                .nb-ep.ellipsis {{ episodeLabel }}
              v-flex(xs2, d-flex, justify-space-between)
                .source.ellipsis {{ info.fromType }}
                v-tooltip.genres.ellipsis(lazy, top)
                  span(slot='activator') {{ info.genres.join(' / ') }}
                  span {{ info.genres.join(' / ') }}
              v-divider
              v-flex(xs7)
                .synopsis {{ info.synopsis }}
              v-flex(xs1, d-flex, justify-space-between, align-end)
                .producers.ellipsis By {{ info.producers.join(' and ') }}
                .rating {{ info.score }} #[span / 10]
</template>

<script>
import Status from 'mixins/lists/status.js'

export default {
  name: 'Season-Card',

  mixins: [ Status ],

  props: ['info'],

  computed: {
    lists: {
      get () {
        return this.$store.state.watchLists.listNames.filter(
          ({ list }) => ['watchList', 'watching', 'seen'].includes(list)
        )
      },
      set () {}
    },
    pictureUrl () {
      const url = this.info.picture
      const sizeRegex = /\/r\/\d*x\d*/
      const parts = url.split('.')

      const completeUrl = parts.slice(0, -1).join('.').replace(sizeRegex, '') + '.jpg'

      return completeUrl
    },
    episodeLabel () {
      return this.info.nbEp === '1'
        ? 'episode'
        : this.info.nbEp !== '?'
          ? this.info.nbEp + ' eps'
          : ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  .entry
    height 270px

    .overlay
      padding 32px 0
      background-color rgba(0, 0, 0, 0.4)
      align-items center
      justify-content center
      flex-direction column

      div
        text-align center

    .entry-title
      line-height 25px
      max-width 80%
      font-size 22px
      letter-spacing 0.02em
      font-weight 300

    .nb-ep
      line-height 25px
      max-width 20%
      text-align right
      font-size 20px
      letter-spacing 0.02em
      font-weight 300

    .source
      line-height 25px
      max-width 30%
      font-size 16px
      letter-spacing 0.02em
      font-weight 300

    .genres
      line-height 25px
      max-width 70%
      text-align right
      font-size 16px
      letter-spacing 0.02em
      font-weight 300

    .synopsis
      height 145px
      overflow-x hidden
      overflow-y auto

    .producers
      line-height 25px
      height 25px
      max-width 70%
      font-style italic
      font-size 16px
      font-weight 300
      letter-spacing 0.03em

    .rating
      line-height 25px
      height 25px
      max-width 30%
      text-align right
      font-size 22px
      font-weight 400
      letter-spacing 0.04em

      span
        font-size 16px
        font-weight 300
</style>
