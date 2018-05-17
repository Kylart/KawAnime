<template lang="pug">
  v-container#container(fluid)

    v-fade-transition

      v-layout(row, wrap, align-content-start)
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
          .entry
            v-fade-transition
              .card-picture
                .picture
                  img(v-if='hasInfo.includes(anime)', :src='infos[anime] && infos[anime].picture')
                  v-progress-circular.loading(large, indeterminate, v-else)

                .card-actions
                  v-btn(icon, large)
                    v-icon(large) play_circle_outline
                  v-btn(icon, large, @click='showQualityModal(anime)')
                    v-icon(large) file_download
                  v-tooltip(top)
                    v-icon(slot='activator') more
                    div {{ getLabel(anime) }} available.
            v-tooltip(top)
              .card-title.ellipsis(slot='activator') {{ removeSub(anime) }}
              div {{ removeSub(anime) }}

    v-fade-transition
      .pagination-container(v-if='pageLength > 1')
        v-pagination(
          v-model='pageIndex',
          :length='pageLength',
          total-visible='7'
        )

    v-dialog(
      v-model='qualityModal'
      max-width='500px'
      transition='dialog-transition'
    )
      div.ma-5
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
    data: () => ({
      isSearching: false,
      downloadAllName: '',
      quality: '',
      qualityModal: false,
      qualityList: [],
      pageIndex: 1,
      infos: {},
      hasInfo: [],
      current: ''
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
      animes () {
        return Object.keys(this.files)
      },
      pageLength () {
        return Math.ceil(this.animes.length / 6)
      },
      fileRange () {
        const index = this.pageIndex - 1

        return {
          inf: index * 8,
          sup: (index + 1) * 8 - 1
        }
      },
      visibleAnimes () {
        return this.animes.slice(this.fileRange.inf, this.fileRange.sup + 1)
      }
    },

    methods: {
      async search () {
        if (!this.isSearching) {
          if (!this.$store.state.isConnected) return

          this.isSearching = true

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
      showQualityModal (anime) {
        const files = this.files[anime]
        this.qualityList = this.$_.map(files, (file) => file.quality)[0]

        this.downloadAllName = anime
        this.quality = this.qualityList[Math.floor(this.qualityList.length / 2)]

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
      }
    },

    watch: {
      term: _.debounce(async function () {
        this.term.length > 2 && await this.search()
      }, 1000),
      visibleAnimes (animes) {
        animes.forEach(async (name) => {
          if (!this.hasInfo.includes(name)) {
            const term = name.split(' ').slice(1).join(' ')

            this.$log(`Looking for infos about ${term}.`)

            const { data } = await this.$axios.get(`getInfoFromMal`, {
              params: {term}
            })

            this.infos[name] = data
            this.hasInfo.push(name)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~stylus/functions'

  #container
    height 100%
    min-height calc(100vh - 48px - 24px)
    position relative

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
    width 90%
    padding-bottom 10px
    margin-bottom 10px
    border 1px solid rgba(30, 30, 30, 0.7)

    &:hover
      hover_background()

  .card-picture
    display flex
    align-items flex-start
    justify-content space-between
    height 85%

    img
      height 100%

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
    font-size 22px
    line-height 1.25
    font-weight 300
    height 15%
    display flex
    align-items flex-end
    justify-content center

  .pagination-container
    width 100%
    position absolute
    text-align center
    bottom 5px

  .download-all-dialog
    text-align right
</style>
