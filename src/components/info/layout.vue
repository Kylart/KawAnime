<template lang="pug">
  v-container.info-container(
    grid-list-md, fluid, pt-0, pl-0, pr-2
  )
    v-layout(row, wrap, fill-height, justify-center, align-center)
      v-flex(xs6, md3, pa-0)
        v-img(:src='sanitize(info.img)', contain, height='370', position='left top')
      v-flex(xs12, md9)
        v-layout.top-container(align-content-space-between, column)
          .info-title
            div {{ info.title.en }} (#[span.jap {{ info.title.jp }}]) [{{ info.type }}]
          //- TODO need to handle xs
          v-layout.synopsis-container.pa-2(row, wrap)
            v-flex(xs12, sm8, md10, d-flex, align-center)
              .synopsis {{ info.synopsis || 'No sysnopsis.' }}
            v-flex(xs12, sm4, md2)
              .status.bordered
                .sentence {{ info.sentence }}
                .score {{ info.score }} #[span / {{ info.scoreOutOf }}]
                .sentence.users {{ info.nbVotes }}
          v-divider
          v-layout.details-container.pt-0(row, wrap, align-center)
            v-flex(xs12, sm6, md6, lg8, d-flex, align-center)
              .genres.ellipsis Genres: #[i {{ info.genres.join(', ') }}]
            v-flex(xs12, sm3, md3, lg2, d-flex, align-center)
              .studios.ellipsis {{ info.studios }}
            v-flex(xs12, sm3, md3, lg2)
              .rating.ellipsis {{ info.rating }}

    v-divider

    template(v-if='info.characters.length')
      .section-title
        span Cast & Characters

      v-layout.characters-container(
        row, wrap, justify-center, align-center,
        @mouseenter='triggerDelay',
        @mouseleave='cancelDelay',
        :style='charHover.overflow',
        ref='chars'
      )
        v-btn.expand(icon, large, color='indigo', v-show='!charHover.show', @click='expandChar')
          v-icon(large) keyboard_arrow_down
        v-flex(v-for='char in info.characters', :key='char.link', xs12, sm6, md4, pt-0)
          v-layout(row, wrap)
            v-flex(xs3)
              v-img(contain, :src='sanitize(char.img)', :lazy-src='sanitize(char.img)', height='120')
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
                  v-layout(v-if='char.link', row, wrap, justify-center, align-center)
                    v-btn(icon, @click='openLink(char.link)')
                      v-icon open_in_new

            v-flex(xs3, d-flex, justify-start, v-if='char.seiyuu')
              v-layout(column, justify-space-between)
                v-flex.name.seiyuu(xs6, d-flex, align-center, justify-end) {{ char.seiyuu.name }}
                v-flex(xs6)
                  v-layout(v-if='char.seiyuu.link', row, wrap, justify-center)
                    v-btn(icon, @click='openLink(char.seiyuu.link)')
                      v-icon open_in_new

            v-flex(xs3, v-if='char.seiyuu')
              v-img(contain, :src='sanitize(char.seiyuu.img)', :lazy-src='sanitize(char.seiyuu.img)', height='120')
                v-layout(
                  slot='placeholder',
                  fill-height,
                  align-center,
                  justify-center,
                  ma-0
                )
                  v-progress-circular(indeterminate, color='grey lighten-5')

    template(v-if='info.staff.length')
      v-divider

      .section-title
        span Staff

      v-layout.staff-container.mt-2.mb-0(row, wrap, justify-space-between)
        v-flex(v-for='(member, index) in info.staff', :key='index', xs12, sm6, md3, pt-0)
          v-layout(row, wrap, justify-space-between)
            v-flex(xs6)
              v-img(contain, :src='sanitize(member.img)', :lazy-src='sanitize(member.img)', height='120')
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
                v-flex.name-container(xs8)
                  .name {{ member.name }}
                  v-btn.ma-1(v-if='member.link', icon, @click='openLink(member.link)')
                    v-icon open_in_new
                v-flex.name.role(xs4, d-flex, align-center) {{ member.role }}

    template(v-if='epLinks.magnets && epLinks.magnets.length')
      v-divider

      .section-title
        span Episode list

      .episodes-container
        v-layout(row, wrap)
          v-flex.link(v-for='ep in epsList', :key='ep', xs12)
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
                v-btn(large, icon, @click='watch(ep)')
                  v-icon(large) play_circle_outline
                v-btn(large, icon, @click='download(ep)')
                  v-icon(large) file_download

    //- Return button
    v-btn(
      color='primary',
      fixed, fab
      bottom, right,
      @click='returnCb'
    )
      v-icon chevron_left

    //- Action button
    v-speed-dial(
      v-model='actions.show',
      top, left, fixed,
      open-on-hover,
      direction='right',
      transition='slide-x-transition'
    )
      template(v-slot:activator)
        v-btn#info-actions(
          color='primary',
          v-model='actions.show',
          fab
        )
          v-icon account_circle
          v-icon close

      template(v-for='_provider in providers')
        v-tooltip(top)
          v-btn(fab, small, slot='activator', @click='addTo(_provider.value)')
            v-icon(v-if='_provider.action') {{ _provider.action }}
            .icon(v-else, :class='{ [`${_provider.value}-icon`]: true }')
          span Add to my {{ _provider.text }} list
</template>

<script>
import NotFoundImage from '../../../public/images/not-found.png'
import Episodes from '@/mixins/info/currentEps.js'

import { mapGetters } from 'vuex'

export default {
  name: 'Info-Displayer',

  mixins: [Episodes],

  props: ['current', 'return-cb'],

  mounted () {
    if (!this.info.hasOwnProperty('episodesInfo')) {
      this.$store.dispatch('info/getEps', {
        name: this.info.title.en,
        id: this.info.id,
        malId: this.info.malId
      })
    }
  },

  data: () => ({
    charHover: {
      timeout: null,
      delay: 750,
      overflow: {
        overflowY: 'hidden'
      }
    },
    actions: {
      show: false,
      exclude: {
        mal: [ 'kitsu', 'anilist' ],
        anilist: [ 'kitsu' ],
        kitsu: [ 'anilist' ]
      }
    }
  }),

  computed: {
    ...mapGetters('info', [ 'getEntryInfo' ]),
    title () {
      return (this.current.anime_title || this.current.title).replace(':', '')
    },
    info () {
      return this.getEntryInfo(this.title) || {}
    },
    episodesInfo () {
      const result = {}

      this.info.episodesInfo.forEach((info) => {
        result[info.epNumber] = info
      })

      return result
    },
    providers () {
      const excludedProviders = this.actions.exclude[this.provider]

      return [
        ...this.$store.state.config.providers
          .filter(({ value }) => !excludedProviders.includes(value)),
        { value: 'local', text: 'Local', action: 'sort_by_alpha' }
      ]
    },
    provider () {
      return this.$store.state.info.modal.overrideProvider || this.$store.state.config.config.infoProvider.info
    }
  },

  methods: {
    triggerDelay () {
      if (!this.charHover.show) {
        this.charHover.timeout = setTimeout(this.expandChar, this.charHover.delay)
      }
    },
    cancelDelay () {
      if (this.charHover.timeout) {
        clearTimeout(this.charHover.timeout)
      }
    },
    sanitize (link) {
      // This redirects unwanted picture links to fallback picture
      return /(questionmark|missing)/.test(link)
        ? NotFoundImage
        : link
    },
    openLink (link) {
      this.$electron.shell.openExternal(link)
    },
    getEpAired (epNumber) {
      return this.info.hasOwnProperty('episodesInfo')
        ? this.episodesInfo[epNumber]
          ? this.episodesInfo[epNumber].aired
          : 'N/A'
        : 'N/A'
    },
    getEpName (epNumber) {
      return this.info.hasOwnProperty('episodesInfo')
        ? this.episodesInfo[epNumber]
          ? this.episodesInfo[epNumber].title
          : 'Unknown title'
        : 'Unknown title'
    },
    expandChar () {
      this.charHover.show = true
      this.charHover.overflow.overflowY = 'auto'

      const elem = this.$refs.chars
      const { clientHeight } = elem

      // Shitty animation ?
      let currentStep = 0
      const step = 5
      const necessarySteps = clientHeight / step

      const scrollDown = () => {
        elem.scrollTop += step
      }

      const timer = setInterval(() => {
        scrollDown()
        currentStep++

        if (currentStep === necessarySteps) {
          clearInterval(timer)
        }
      }, 1000 / 90)
    },
    addTo (provider) {
      const isLocal = provider === 'local'

      if (isLocal) {
        this.$store.commit('watchLists/setEntry', {
          name: this.info.title.en,
          nbEp: this.info.nbEpisodes || '??'
        })
        this.$store.commit('watchLists/toggleForm', true)
      } else {
        this.$store.commit('services/setFormEntry', {
          service: provider,
          entry: {
            malId: +this.info.malId,
            mediaId: +this.info.id,
            title: this.info.title.en,
            nbEp: this.info.nbEpisodes || null
          }
        })
        this.$store.commit('services/showForm', { service: provider, bool: true })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .icon
    height 20px
    width 20px

  .info-container
    position relative

  .section-title
    display flex
    align-items center
    border-bottom 0.02em solid rgba(255, 255 ,255, 0.7)
    min-height 60px

    span
      width 100%
      padding-left 7.5%
      font-size 22px
      font-weight 400
      letter-spacing 0.05em

  .top-container
    height 370px

    .synopsis-container
      height 70%

    .info-title
      height 80px
      text-align center
      border-bottom 0.02em solid rgba(255, 255, 255, 0.4)
      padding 10px
      display flex
      align-items center
      justify-content center

      div
        font-size 28px
        line-height 30px
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

      &.bordered
        padding-left 10px
        border-left 0.02em solid rgba(255, 255, 255, 0.4)

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

    .details-container
      height 10%
      padding 5px

      .genres
        font-size 16px
        font-weight 300
        letter-spacing 0.03em

      .studios
        font-size 18px
        font-style italic
        letter-spacing 0.03em
        font-weight 400
        text-align right

      .rating
        padding-right 5%
        font-size 16px
        text-align right

  .characters-container
    height 245px
    overflow-x none
    overflow-y auto
    position relative

    .expand
      position absolute
      bottom 0
      left 50%
      transform translateX(-50%)

    .name
      font-size 15px
      letter-spacing 0.04em
      font-weight 400

      &.seiyuu
        text-align right

  .staff-container
    padding 0 5%

    .name-container
      display flex
      align-items center
      justify-content space-between

    .role
      text-align right
      font-size 12px

  .episodes-container
    width 100%
    padding-top 4px
    padding-left 2%
    padding-right 2%

    .link
      max-height 75px
      border-bottom 0.02em solid rgba(255, 255 ,255, 0.7)

      &:hover
        transition all 0.33s
        background-color rgba(60, 60, 60, 0.7)

    .number
      font-size 18px
      letter-spacing 0.04em
      text-align center
      padding 0 10px !important

    .name
      font-size 16px
      font-style italic
      letter-spacing 0.03em
      font-weight 300
      padding 0 8px !important
      text-align center

    .aired
      font-size 16px

    .actions
      display flex
      align-items center
      justify-content flex-start
</style>
