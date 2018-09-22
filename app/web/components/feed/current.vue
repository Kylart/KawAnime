<template lang="pug">
  v-container(
    grid-list-md, fluid, pa-0
  )
    v-layout(row, wrap, fill-height, justify-center, align-center)
      v-flex(xs6, md3, pa-0)
        v-img(:src='sanitize(info.picture)', contain, height='350', position='left top')
      v-flex(xs12, md9)
        v-layout.top-container(align-content-space-between, column)
          .info-title {{ info.title }} (#[span.jap {{ info.japaneseTitle }}]) [{{ info.type }}]
          v-divider
          //- TODO need to handle xs
          v-layout.synopsis-container.pa-2(row, wrap)
            v-flex(xs12, sm8, md10, d-flex, align-center)
              .synopsis {{ info.synopsis || 'No sysnopsis.' }}
            v-flex(xs12, sm4, md2)
              .status
                .sentence {{ statusSentence }}
                .score {{ info.score }} #[span / 10]

    v-divider

    v-layout.characters-container(row, wrap, justify-center, align-center)
      v-flex(v-for='char in info.characters', :key='char.name', xs12, sm6, md4, pt-0)
        v-layout(row, wrap, justify-space-between)
          v-flex(xs3)
            v-img(contain, :src='sanitize(char.picture)', :lazy-src='sanitize(char.picture)', height='120')
              v-layout(
                slot='placeholder',
                fill-height,
                align-center,
                justify-center,
                ma-0
              )
                v-progress-circular(indeterminate, color='grey lighten-5')
          v-flex(xs3, d-flex, justify-start)
            v-layout(column, justify-space-between)
              v-flex.name(xs6, d-flex, align-center) {{ char.name }}
              v-flex(xs6)
                v-layout(row, wrap, justify-center, align-center)
                  v-btn(icon, @click='openLink(char.link)')
                    v-icon open_in_new

          v-flex(xs3, d-flex, justify-start)
            v-layout(column, justify-space-between)
              v-flex.name.seiyuu(xs6, d-flex, align-center, justify-end) {{ char.seiyuu.name }}
              v-flex(xs6)
                v-layout(row, wrap, justify-center)
                  v-btn(icon, @click='openLink(char.link)')
                    v-icon open_in_new

          v-flex(xs3)
            v-img(contain, :src='sanitize(char.seiyuu.picture)', :lazy-src='sanitize(char.seiyuu.picture)', height='120')
              v-layout(
                slot='placeholder',
                fill-height,
                align-center,
                justify-center,
                ma-0
              )
                v-progress-circular(indeterminate, color='grey lighten-5')

    v-divider

    v-layout.staff-container.mt-2.mb-0(row, wrap, justify-space-between)
      v-flex(v-for='member in info.staff', :key='member.link', xs12, sm6, md3, pt-0)
        v-layout(row, wrap, justify-space-between)
          v-flex(xs6)
            v-img(contain, :src='sanitize(member.picture)', :lazy-src='sanitize(member.picture)', height='120')
              v-layout(
                slot='placeholder',
                fill-height,
                align-center,
                justify-center,
                ma-0
              )
                v-progress-circular(indeterminate, color='grey lighten-5')
          v-flex(xs6, d-flex, justify-start)
            v-layout(column, justify-space-between, align-content-space-between)
              v-flex(xs8, d-flex, justify-space-between, align-center)
                .name {{ member.name }}
                v-btn.ma-1(icon, @click='openLink(member.link)')
                  v-icon open_in_new
              v-flex.name.role(xs4, d-flex, align-center) {{ member.role }}

    v-divider

    .episodes-container
      v-layout(row, wrap)
        v-divider
        v-flex.section-title(xs12, d-flex, align-center)
          span Episode list
        v-flex.link(v-if="epLinks.magnets", v-for='ep in epsList', :key='ep', xs12)
          v-layout(row, wrap, align-center)
            v-flex.aired(xs2, d-flex, justify-center) {{ getEpAired(ep) }}
            v-flex.name(xs6, d-flex, justify-center) {{ getEpName(ep) }}
            v-flex.number(xs1) Ep. {{ ep }}
            v-flex.quality(xs1)
              v-select(
                :items='epQualities[ep]',
                v-model='epsQuality[ep]',
                label='Quality',
                hide-details
              )
            v-flex.actions(xs2)
              //- TODO ? Offer quality choice
              v-btn(large, icon, @click='watch(ep)')
                v-icon(large) play_circle_outline
              v-btn(large, icon, @click='download(ep)')
                v-icon(large) file_download
        v-flex.loading(v-else) Loading episodes...

    //- Return button
    v-btn(
      color='primary',
      fixed, fab
      bottom, right,
      @click='back'
    )
      v-icon chevron_left
</template>

<script>
import Episodes from 'mixins/feed/currentEps.js'

import { mapGetters } from 'vuex'

export default {
  name: 'Current',

  mixins: [Episodes],

  async mounted () {
    if (!this.info.hasOwnProperty('episodesInfo')) {
      await this.$store.dispatch('info/getEps', {
        name: this.current,
        id: this.info.id
      })
    }
  },

  computed: {
    ...mapGetters('info', {
      allInfo: 'getInfo'
    }),
    current: {
      get () {
        return this.$store.state.releases.current
      },
      set (val) {
        this.$store.commit('releases/setCurrent', val)
      }
    },
    info () {
      return this.allInfo[this.current] || {}
    },
    statusSentence () {
      const { status, premiered, source, episodes, duration } = this.info

      const nbEpisodes = episodes === 'Unknown'
        ? 'yet an unknown number of episodes'
        : `It's been announced with ${episodes} episodes`

      const _duration = duration === 'Unknown'
        ? 'of an unknown duration.'
        : `of ${duration.replace('per ep.', '')}`

      return `${status}, it premiered on ${premiered} and adapted from the ${source}. ${nbEpisodes} ${_duration}`
    }
  },

  methods: {
    back () {
      this.$store.commit('releases/setCurrent', '')
    },
    sanitize (link) {
      // This redirects unwanted picture links to fallback picture
      return /(questionmark)/.test(link)
        ? 'static/images/not-found.png'
        : link
    },
    async openLink (link) {
      await this.$axios.get('openThis', {
        params: {
          type: 'link',
          link
        }
      })
    },
    getEpAired (epNumber) {
      return this.info.hasOwnProperty('episodesInfo')
        ? this.info.episodesInfo[epNumber]
          ? this.info.episodesInfo[epNumber].aired
          : 'N/A'
        : 'N/A'
    },
    getEpName (epNumber) {
      return this.info.hasOwnProperty('episodesInfo')
        ? this.info.episodesInfo[epNumber]
          ? this.info.episodesInfo[epNumber].title
          : 'Unknown title'
        : 'Unknown title'
    }
  }
}
</script>

<style lang="stylus" scoped>
  .top-container
    height 350px

    .synopsis-container
      height 80%

    .info-title
      text-align center
      font-size 32px
      letter-spacing 0.04em
      font-weight 400

    .synopsis
      overflow-x hidden
      overflow-y auto
      white-space pre-wrap
      text-align center
      max-height 100%
      vertical-align middle

    .status
      height 100%
      display flex
      flex-direction column
      justify-content space-around
      align-items center

      .sentence
        font-size 14px
        font-weight 300
        letter-spacing 0.03em

      .score
        font-size 30px
        font-weight 400

        span
          font-size 18px
          font-weight 300

  .characters-container
    height 245px
    overflow-x none
    overflow-y auto

    .name
      font-size 15px
      letter-spacing 0.04em
      font-weight 400

      &.seiyuu
        text-align right

  .staff-container
    padding 0 5%

    .role
      text-align right
      font-size 12px

  .episodes-container
    width 100%
    padding-left 2%
    padding-right 2%

    .section-title
      border-bottom 0.02em solid rgba(255, 255 ,255, 0.7)
      min-height 50px

      span
        padding-left 5%
        font-size 22px
        font-weight 400
        letter-spacing 0.05em

    .link
      max-height 75px
      border-bottom 0.02em solid rgba(255, 255 ,255, 0.7)

      &:hover
        transition all 0.33s
        background-color rgba(60, 60, 60, 0.7)

    .number
      font-size 18px
      letter-spacing 0.04em

    .name
      font-size 16px
      font-style italic
      letter-spacing 0.03em
      font-weight 300

    .aired
      font-size 16px

    .actions
      display flex
      align-items center
      justify-content flex-start
</style>
