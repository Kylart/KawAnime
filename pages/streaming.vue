<template lang="pug">
  v-container.container.pa-0(fluid, :class="{ 'fill-height': !current }")

    transition-group(name='container', tag='div', :class="{ 'fill-height': !current }").container.fluid.ma-0.pa-0

      v-layout(v-if='!current', row, wrap, align-content-start, key='list')
        v-flex.form(xs12)
          .term
            v-text-field(
              @keyup.enter='search',
              v-model='term',
              label='Looking for something to watch?'
            )

        v-flex(xs12, v-if='!$store.state.isConnected') You are offline :(
        v-flex(xs12, v-else-if='isSearching') Loading...
        v-flex(xs12, v-else-if='!animes.length && !term') What are you doing? Watch something!
        v-flex(xs12, v-else-if='!animes.length && term && !isSearching') No result.

        v-flex.anime(
          v-else,
          v-for='anime in visibleAnimes',
          :key='anime',
          xs12, sm6, md3
        )
          .entry.elevation-3
            .card-picture(@click='setCurrent(anime)')
              .picture
                img(v-if='hasInfo.includes(anime)', :src='hasInfo.includes(anime) && infos[anime].picture')
                v-progress-circular.loading(large, indeterminate, v-else)

              .card-actions
                v-btn(icon, large, @click.stop='setCurrent(anime)')
                  v-icon(large) play_circle_outline
                v-btn(icon, large, @click.stop='showQualityModal(anime)')
                  v-icon(large) file_download
                v-tooltip(top)
                  v-icon(slot='activator', @click.stop='') more
                  div {{ getLabel(anime) }} available.
            v-tooltip(top)
              .card-title.ellipsis.pl-2.pr-2(slot='activator') {{ removeSub(anime) }}
              div {{ removeSub(anime) }}

      v-layout(column, align-content-space-between, v-else, key='state')

        .back-button
          v-btn(icon, @click='setCurrent(\'\')')
            v-icon(color='primary', large) arrow_back

        v-flex.info-top(xs12)
          v-layout(justify-space-between, v-if='infos[current]')
            v-flex(xs12, sm4, lg2)
              img(max-height='100%', :src='currentInfo.picture')
            v-flex.pa-4
              v-layout(column, justify-center, align-content-space-around)
                v-flex.info-title.pl-2.pr-2(xs12) {{ currentInfo.title }} ({{ currentInfo.japaneseTitle }})
                v-divider
                v-flex.info-synopsis.pa-2(xs12) {{ currentInfo.synopsis }}

          v-layout(justify-space-between, v-else)
            v-flex(align-content-start, xs12, sm4, lg2)
              img(height='300', src='~static/images/error.jpg')
            v-flex.pa-4
              v-layout(column, justify-center, align-content-space-around)
                v-flex.info-title.pl-2.pr-2(xs12) {{ removeSub(current) }}
                v-divider
                v-flex.info-synopsis.pa-2(xs12) No synopsis loaded.
        v-flex(xs12)
          v-layout(column)
            v-flex.ep-container.pt-1.pl-1.pr-1(v-for='i in Object.keys(files[current]).reverse()', :key='files[current][i].name', xs12)
              v-layout.ep-container-layout(row, wrap)
                v-flex.ep-aired(xs2) {{ getEpAired(files[current][i]) }}
                v-flex.ep-title(xs6) {{ getEpisodeTitle(files[current][i]) }}
                v-flex.ep-number.ellipsis(xs1) Ep. {{ getEpNumber(files[current][i].name) }}
                v-flex.ep-quality(xs1)
                  v-select.pt-0(
                    v-model='qualityEp[files[current][i].name]',
                    :items='files[current][i].quality',
                    hint='Quality?',
                    persistent-hint
                  )
                v-flex.ep-actions(xs2)
                  v-btn(icon, large, @click="act('play', files[current][i])")
                    v-icon(large) play_circle_outline
                  v-btn(icon, large, @click="act('download', files[current][i])")
                    v-icon(large) file_download

    v-fade-transition
      .pagination-container(v-if='pageLength > 1 && !current')
        v-pagination(
          v-model='pageIndex',
          :length='pageLength',
          total-visible='7'
        )

    v-dialog(
      v-model='qualityModal',
      max-width='500px',
      transition='dialog-transition',
      lazy, absolute
    )
      v-card
        div.pa-5
          v-select(
            :items='qualityList'
            v-model='quality'
            label='Which quality should be downloaded?'
          )
        div.pr-2.pb-2.download-all-dialog
          v-btn(@click='downloadAll') Download
</template>

<script>
  import _ from 'lodash'
  import { mapGetters } from 'vuex'

  export default {
    mounted () {
      this.infos = this.$store.state.streaming.page.infos
      this.currentEps = this.$store.state.streaming.page.eps

      const { name } = this.$route.query

      if (name) this.term = name
    },

    beforeDestroy () {
      this.$store.commit('streaming/setInfos', this.infos)
      this.$store.commit('streaming/setEps', this.currentEps)
    },

    data: () => ({
      animePerPage: 8,
      isSearching: false,
      downloadAllName: '',
      qualityEp: {},
      quality: '',
      qualityModal: false,
      qualityList: [],
      pageIndex: 1,
      infos: {},
      currentEps: {},
      hasInfo: []
    }),

    computed: {
      ...mapGetters('streaming', [
        'files'
      ]),
      term: {
        set (val) {
          this.$store.commit('streaming/setTerm', val)
        },
        get () {
          return this.$store.state.streaming.page.term
        }
      },
      current: {
        set (val) {
          this.$store.commit('streaming/setCurrent', val)
        },
        get () {
          return this.$store.state.streaming.page.current
        }
      },
      animes () {
        return Object.keys(this.files)
      },
      pageLength () {
        return Math.ceil(this.animes.length / this.animePerPage)
      },
      fileRange () {
        const index = this.pageIndex - 1

        return {
          inf: index * this.animePerPage,
          sup: (index + 1) * this.animePerPage - 1
        }
      },
      visibleAnimes () {
        return this.animes.slice(this.fileRange.inf, this.fileRange.sup + 1)
      },
      currentInfo () {
        return (this.current && this.infos[this.current]) || {}
      }
    },

    methods: {
      async search () {
        if (!this.isSearching) {
          if (!this.$store.state.isConnected) return

          this.isSearching = true

          this.pageIndex = 1

          await this.$store.dispatch('streaming/watch', {
            name: this.term
          })

          this.isSearching = false
        }
      },
      getLabel (anime) {
        const len = this.$_.size(this.files[anime])
        const totalLen = (this.infos[anime] && this.infos[anime].episodes) || 'XX'

        return `${len} / ${totalLen} episode${len !== 1 ? 's' : ''}`
      },
      removeSub (name) {
        return name.split(']').slice(1).join('')
      },
      play ({link, name}) {
        this.$store.commit('streaming/play', {
          show: true,
          link: {
            link,
            name
          }
        })
      },
      setCurrent (anime = '') {
        this.current = anime
      },
      showQualityModal (anime) {
        const files = this.files[anime]
        this.qualityList = this.$_.map(files, (file) => file.quality)[0]
        const prefQuality = this.$store.state.config.config.video.quality

        this.downloadAllName = anime
        this.quality = this.qualityList.includes(prefQuality)
          ? prefQuality
          : this.qualityList[Math.floor(this.qualityList.length / 2)]

        this.qualityModal = true
      },
      downloadAll () {
        this.qualityModal = false
        const name = this.downloadAllName
        const quality = this.quality

        const torrents = this.$_.filter(this.$store.state.streaming.page.torrents.magnets, (file) => {
          return file.name.includes(name) && file.name.includes(quality)
        }).map(({link}) => link)

        torrents.forEach((link) => {
          this.$axios.get('openThis', {
            params: {
              type: 'link',
              link
            }
          })
        })
      },
      async getEps () {
        if (!this.currentEps[this.current]) {
          const { id, title: name } = this.currentInfo

          this.$log('Looking for episode information of', name)

          const { data } = await this.$axios.get('searchEpsOnMal', {
            params: {
              id, name
            }
          })

          this.$log('Received episode information of', name)

          this.currentEps[this.current] = data
        } else {
          this.$log('Cached episode information of', this.current)
        }
      },
      getEpisodeTitle ({name}) {
        const epNum = +name.split(' ').slice(-2, -1)[0] // nyanparser pls

        if (this.currentEps[this.current] && this.currentEps[this.current].length) {
          const info = this.currentEps[this.current].filter(({epNumber}) => epNumber === epNum)[0]

          return info
            ? `${info.title} ${info.japaneseTitle ? '/ ' + info.japaneseTitle : ''}`
            : 'No Data'
        }

        return 'No data.'
      },
      getEpNumber (name) {
        return name.split(' ').slice(-2, -1)[0] // nyanparser pls
      },
      getEpAired (ep) {
        if (this.currentEps[this.current] && this.currentEps[this.current].length) {
          const epNum = +ep.name.split(' ').slice(-2, -1)[0] // nyanparser pls

          const info = this.currentEps[this.current].filter(({epNumber}) => epNumber === epNum)[0]

          return info
            ? (info && info.aired) || 'N/A'
            : 'No data.'
        }

        return 'No data.'
      },
      act (action, { name: anime }) {
        const quality = this.qualityEp[anime]
        const ep = anime.split(' ').slice(-2, -1)[0] // nyanparser pls

        const { link, name } = this.$store.state.streaming.page.torrents.magnets.filter((magnet) => {
          return magnet.name.includes(this.current) && magnet.name.includes(ep) && magnet.name.includes(quality)
        })[0]

        if (action === 'play') {
          const text = name.split(' ').slice(1, -1).join(' ') // nyanparser pls

          this.$store.commit('streaming/play', {
            show: true,
            link: {
              link,
              name: text
            }
          })
        } else {
          this.$axios.get('openThis', {
            params: {
              type: 'link',
              link
            }
          })
        }
      }
    },

    watch: {
      term: _.debounce(async function () {
        this.term.length > 2 && await this.search()
      }, 750),
      visibleAnimes (animes) {
        animes.forEach(async (name) => {
          if (!this.hasInfo.includes(name)) {
            const term = name.split(' ').slice(1).join(' ')

            this.$log(`Looking for infos about ${term}.`)

            const { data } = await this.$axios.get(`getInfoFromMal`, {
              params: {term}
            })

            this.$log(`Received infos for ${term}.`)

            this.infos[name] = data
            this.hasInfo.push(name)
          }
        })
      },
      async current (val) {
        if (val) {
          // Setting quality models for all episodes
          const eps = this.$_.map(this.files[this.current], (ep, epNumber) => ep)
          const prefQuality = this.$store.state.config.config.video.quality

          eps.forEach((ep) => {
            this.qualityEp[ep.name] = ep.quality.includes(prefQuality)
              ? prefQuality
              : ep.quality[Math.floor(ep.quality.length / 2)]
          })

          await this.getEps()
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~stylus/functions'

  .container-enter-active
    transition all 1s

  .container-enter
    opacity 0
    transform translateY(-30px)

  .container-leave-active
    opacity 0

  .container
    min-height calc(100vh - 48px - 24px)
    position relative
    display inline-block

  .fill-height
    height 100%

  .layout
    height 100%

  .form
    text-align center
    height 80px

  .term
    display inline-block
    width 33%
    height 10%

  .layout > .flex
    display flex
    justify-content center

  .anime
    height 40%

  .entry
    display flex
    flex-direction column
    justify-content space-between
    width 90%
    padding-bottom 10px
    margin-bottom 10px
    background-color rgba(60, 60, 60, 0.3)
    border 1px solid rgba(30, 30, 30, 0.7)

    &:hover
      hover_background()

  .card-picture
    display flex
    align-items flex-start
    justify-content space-between
    height 85%
    border-bottom 0.02em solid rgba(255, 255 ,255, 0.7)

    img
      height 100%
      max-width 100%

    .picture
      height 100%
      width 60%
      position relative

      .loading
        position absolute
        bottom 40%
        left 40%

    .card-actions
      padding 5px
      height 100%
      width 40%
      display flex
      flex-direction column
      align-items center
      justify-content space-around
      justify-content space-evenly

      button
        margin 0

  .card-title
    font-size 20px
    line-height 1.25
    font-weight 300
    height 15%
    text-align center

  .back-button
    position absolute
    right 0

  .info-top
    background-color rgba(30, 30, 30, 0.3)
    border-bottom 0.02em solid rgba(255, 255, 255, 0.7)
    padding-bottom 1px

  .info-title
    font-size 24px
    font-weight 300
    line-height 1.25
    max-height 80px
    text-align center

  .info-synopsis
    height 80%
    text-align justify
    white-space pre-wrap
    overflow-y auto
    overflow-x hidden


  // Episode display
  .ep-container
    background-color rgba(30, 30, 30, 0.3)

    &:hover
      transition all 0.33s
      background-color rgba(60, 60, 60, 0.7)

  .ep-container-layout
    border-bottom 0.02em solid rgba(255, 255 ,255, 0.7)

  .ep-number, .ep-title, .ep-aired, .ep-quality, .ep-actions
    display flex
    align-items center
    justify-content center

  .ep-number
    font-size 18px

  .ep-title
    text-align center
    font-style italic

  .ep-aired
    font-size 16px

  .pagination-container
    width 100%
    position absolute
    text-align center
    bottom 5px

  .download-all-dialog
    text-align right
</style>
