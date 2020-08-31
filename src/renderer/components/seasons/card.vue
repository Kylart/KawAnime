<template lang="pug">
  v-col.entry(cols='12', sm='6', lg='4')
    v-hover
      v-card(slot-scope='{ hover }')
        v-row
          v-col.py-0(cols='4')
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
                    v-tooltip(top)
                      template(v-slot:activator='{ on }')
                        v-btn(
                          v-on='on',
                          @click='_addTo(list.list)',
                          :color="_isIn(list.list) ? 'success' : 'default'",
                          icon
                        )
                          v-icon {{ list.icon }}
                      span {{ _isIn(list.list) ? 'Remove from' : 'Add to' }} {{ list.name }}

          v-col.py-0(cols='8')
            v-card(flat)
              v-card-title.py-2
                  v-tooltip(top)
                    template(v-slot:activator='{ on }')
                      span.entry-title.ellipsis(v-on='on') {{ info.title }}
                    span {{ info.title }}

                  v-spacer

                  .nb-ep.ellipsis {{ episodeLabel }}

                  .source.ellipsis {{ info.fromType }}

                  v-spacer

                  v-tooltip(top)
                    template(v-slot:activator='{ on }')
                      span.genres.ellipsis(v-on='on') {{ info.genres.join(' / ') }}
                    span {{ info.genres.join(' / ') }}

              v-divider

              v-card-text.py-2.synopsis
                template(v-if="provider === 'anilist'")
                  div(v-html='info.synopsis')
                template(v-else)
                  div {{ info.synopsis }}

              v-divider

              v-card-actions
                .producers.ellipsis By {{ info.producers.join(' and ') }}

                v-spacer

                .rating {{ info.score }} #[span / {{ info.scoreOutOf || 10 }}]
</template>

<script>
import { mapState } from 'vuex'

import Status from '@/mixins/lists/status.js'

export default {
  name: 'Season-Card',

  mixins: [Status],

  props: ['info'],

  computed: {
    ...mapState('config', [
      'config'
    ]),
    ...mapState('watchLists', [
      'listNames'
    ]),

    provider () {
      return this.config.infoProvider.seasons
    },
    lists () {
      return this.listNames.filter(
        ({ list }) => ['watchList', 'watching', 'seen'].includes(list)
      )
    },

    name () {
      return this.info.title
    },
    pictureUrl () {
      if (this.provider !== 'mal') return this.info.picture

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
      justify-content space-around
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
