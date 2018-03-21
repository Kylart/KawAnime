<template lang="pug">
  v-container#container.pa-0(fluid, grid-list-xs)
    transition(name='fade', v-if='releases.length')
      v-layout(row, wrap, justify-center, style='margin: 0 1% 0 1%;')
        v-flex.time-container(md4, sm4, xs8)
          span.update-time Updated {{ lastUpdateTime }}.
          v-tooltip(top, v-if='notLoaded')
            span.update-time.pl-0(slot='activator') *
            span The list was not refreshed due to an error.
        v-flex(md4, sm1, hidden-xs-only)
        v-flex(md2, sm3, xs10)
          v-select.select(
            :items='fansubList',
            v-model='$store.state.releases.params.fansub',
            label='Fansub',
            dark, single-line,
            hint='Pick a fansub',
            persistent-hint
          )
        v-flex(md1, sm2, xs10)
          v-select.select(
            :items='qualityList',
            v-model='$store.state.releases.params.quality',
            label='Quality',
            dark,
            single-line,
            hint='Which quality ?',
            persistent-hint
          )
        v-flex.refresh-button-container(md1, sm1, xs12)
          v-btn.refresh-button(icon, @click='refresh()')
            v-icon(large) refresh
        template(v-for='item in releases')
          v-flex.elem(xs12, sm6, md4, xl3, :key='item.magnetLink')
            v-card.elem-content.elevation-3(ripple)
              v-card-text.elem-card
                v-container.pa-0(fluid)
                  v-layout.elem-card-layout(row, wrap)
                    v-flex.elem-title.pa-0(xs9)
                      v-tooltip(top)
                        h6.white--text(slot='activator') {{ item.rawName }}
                        span {{ item.rawName }}
                    v-flex.elem-ep.text-xs-right.pa-0(xs3)
                      v-tooltip(top)
                        h6.white--text(slot='activator') {{ epLabel(item.ep) }}
                        span {{ epLabel(item.ep, true) }}
                    v-flex.elem-image.pa-0(xl4, lg4, md5, xs4)
                      img.picture(
                        :src='item.picture',
                        onerror="this.src='static/images/error.jpg'",
                        height='200'
                      )
                    v-flex.pa-0(xl8, lg8, md7, xs8)
                      .elem-text-links
                        .synopsis.pl-1.pr-1.mb-1 {{ item.synopsis || 'No synopsis yet.' }}
                        div.text-xs-right(v-if='isFollowed(item.rawName)')
                          span.following-status.not-selectable {{ isFollowed(item.rawName) }}
                        .links
                          a.download-button(:href='item.magnetLink')
                            v-btn.btn--light-flat-pressed(dark, flat, @click.stop='print(item)') Download
                          v-menu(open-on-hover, transition='slide-x-transition')
                            v-btn(flat, dark, slot='activator') More
                            v-list.dark
                              v-list-tile(@click.stop='watch(item)')
                                v-list-tile-action
                                  v-icon tv
                                v-list-tile-title Watch
                              v-list-tile(@click.stop='downloadAll(item.rawName)')
                                v-list-tile-action
                                  v-icon file_download
                                v-list-tile-title Download all episodes
                              v-list-tile(@click.stop='searchThis(item)')
                                v-list-tile-action
                                  v-icon info_outline
                                v-list-tile-title Information
                              v-list-tile(@click.stop='showChoices(item.rawName)')
                                v-list-tile-action
                                  v-icon add_box
                                v-list-tile-title Add to
                              v-list-tile(@click.stop='showMal(item)')
                                v-list-tile-action
                                  span.mal-icon
                                v-list-tile-title MyAnimeList
    loader(v-else)
</template>

<script>
  export default {
    mounted () {
      if (this.releases.length) {
        this.updateTime()
      }

      setInterval(() => {
        if (this.releases.length) {
          this.updateTime()
        }
      }, 15 * 1000)
    },
    data () {
      return {
        modalTitle: '',
        modalText: '',
        qualityList: ['480p', '720p', '1080p'],
        lastUpdateTime: 'a few seconds ago'
      }
    },
    computed: {
      releases () {
        return this.$store.state.releases.releases
      },
      fansubList () {
        return this.$store.state.releases.fansubs
      },
      notLoaded () {
        return this.$store.state.releases.notLoaded
      }
    },
    methods: {
      epLabel (ep, isTooltip = false) {
        // HorribleSubs specific atm
        return /\[[0-9]{3,4}p\]/.test(ep)
          ? 'Batch'
          : `${isTooltip ? 'Episode' : 'Ep'} ${ep}`
      },
      downloadAll (name) {
        console.log(`[${(new Date()).toLocaleTimeString()}]: Sending a request to download all episodes of ${name}.`)

        const {quality, fansub} = this.$store.state.releases.params

        this.$store.dispatch('downloader/download', {
          name,
          quality,
          fansub,
          fromEp: 0,
          untilEp: 20000,
          choice: 'si'
        })
      },
      async refresh () {
        await this.$store.dispatch('releases/refresh')
        this.updateTime()
      },
      print (item) {
        console.log(`[${(new Date()).toLocaleTimeString()}]: Downloading ${item.rawName} ep. ${item.ep}.`)
      },
      showChoices (name) {
        this.$store.commit('setAddToChoiceTitle', name)
        this.$store.commit('setAddToChoice', true)
      },
      showMal (item) {
        const {url} = item

        item.id = +url.split('/').splice(-2, 1)[0]
        item.episodes = item.episodes

        this.$store.commit('mal/setEntry', item)
        this.$store.commit('mal/showForm', true)
      },
      updateTime () {
        const updated = this.$store.state.releases.updateTime
        if (updated) {
          this.lastUpdateTime = updated.fromNow()
        }
      },
      searchThis (item) {
        this.$store.commit('search/setInfo', item)
        this.$store.commit('search/setInfoLoading', false)
        this.$store.commit('search/showInfo', true)
      },
      isFollowed (name) {
        const malLists = this.$store.state.mal.watchLists
        const localLists = {
          watching: this.$store.state.watchLists.lists.watching,
          watchList: this.$store.state.watchLists.lists.watchList
        }

        const isWatching = localLists.watching.includes(name) || this.$_.find(malLists, (o) => o.anime_title === name && o.status === 1)
        const isPlanned = localLists.watchList.includes(name) || this.$_.find(malLists, (o) => o.anime_title === name && o.status === 2)

        // If it's in both, it should say `watching`
        if (isWatching && isPlanned) {
          return 'Watching'
        }

        return isPlanned
          ? 'Watch List'
          : isWatching
            ? 'Watching'
            : ''
      },
      watch (item) {
        this.$store.commit('videoPlayer/play', {
          show: true,
          link: {
            link: item.magnetLink
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~stylus/functions'

  p
    margin-bottom 0

  div.input-group
    padding-bottom 5px !important
    padding-top 8px !important

  /* ----- Refresh button ----- */
  .refresh-button-container
    display inline-block
    text-align center
    padding 0
    align-self center

  .time-container
    height 70px
    display flex
    align-items center

  .update-time
    padding-left 20px
    font-weight 600
    font-size 16px
    font-style italic

  .elem
    margin-bottom 10px
    display inline-block
    padding 1px 5px !important

  .elem-content
    background-color rgb(60, 60, 60)
    cursor default

  .elem-content:hover
    hover_background(0.4s)

  .elem-card
    padding 0 10px 0 0

  .elem-card-layout
    padding-left 1px

  .elem-title h6
    padding-left 10px
    margin-top 10px
    margin-bottom 10px
    line-height 26px
    white-space nowrap
    text-overflow ellipsis
    overflow hidden

  .elem-ep h6
    margin-top 10px
    white-space nowrap
    text-overflow ellipsis
    overflow hidden

  .elem-image
    height 200px

  .picture
    max-width 95%

  .elem-text-links
    height 100%
    position relative

  .synopsis
    text-align justify
    display block
    white-space pre-wrap
    overflow-y auto
    overflow-x hidden
    height 9.3em
    line-height 1.5em

  .following-status
    padding 2px 2px 2px 3px
    letter-spacing 1px
    font-size 13px
    border 1px solid rgba(255, 255, 255, 0.3)

  .links
    height 25%
    position absolute
    bottom 5px
    right -2px
    display flex

  .download-button
    text-decoration none
    margin-right 0

  .subheading
    padding 30px
    text-align justify
    text-align-last center
    white-space pre-wrap
</style>
