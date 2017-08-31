<template lang="pug" xmlns:v-tooltip="http://www.w3.org/1999/xhtml">
  v-container#container.container.pa-0(fluid, grid-list-xs)
    transition(name='fade', v-if='releases.length')
      v-layout(row, wrap, justify-center, style='margin: 0 1% 0 1%;')
        v-flex.time-container(md4, sm4, xs8)
          span.update-time Updated {{ lastUpdateTime }}.
        v-flex(md4, sm1, hidden-xs-only)
        v-flex(md2, sm3, xs10)
          v-select.select(
            :items='fansubList',
            v-model='$store.state.releaseFansub',
            label='Fansub',
            dark, single-line,
            hint='Pick a fansub',
            persistent-hint
          )
        v-flex(md1, sm2, xs10)
          v-select.select(
            :items='qualityList',
            v-model='$store.state.releaseQuality',
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
          v-flex.elem(xs12, sm6, md4, :key='item.name')
            v-card.elem-content.elevation-3(v-ripple='true')
              v-card-text.elem-card
                v-container.pa-0(fluid)
                  v-layout(row, wrap)
                    v-flex.elem-title.pa-0(xs9, v-tooltip:top='{ html: item.rawName }')
                      h6.white--text {{ item.rawName }}
                    v-flex.elem-ep.text-xs-right.pa-0(v-tooltip:top="{ html: epLabel(item.ep, true) }", xs3)
                      h6.white--text {{ epLabel(item.ep) }}
                    v-flex.elem-image.pa-0(xl6, lg4, md5, xs4)
                      img.picture(
                        :src='item.picture',
                        onerror="this.src='static/images/error.jpg'",
                        height='200'
                      )
                    v-flex.pa-0(xl6, lg8, md7, xs8)
                      .elem-text-links
                        .synopsis {{ item.synopsis || 'No synopsis yet.' }}
                        .links
                          a.download-button(:href='item.magnetLink')
                            v-btn.btn--light-flat-pressed(dark, flat, @click='print(item)') Download
                          v-menu(open-on-hover, transition='slide-x-transition')
                            v-btn(flat, dark, slot='activator') More
                            v-list.dark
                              v-list-tile(@click='openModal(item.rawName, item.fullSynopsis)')
                                v-list-tile-action
                                  v-icon more
                                v-list-tile-title Check synopsis
                              v-list-tile(@click='downloadAll(item.rawName)')
                                v-list-tile-action
                                  v-icon file_download
                                v-list-tile-title Download all episodes
                              v-list-tile(@click='searchThis(item.rawName)')
                                v-list-tile-action
                                  v-icon info_outline
                                v-list-tile-title Information
                              v-list-tile(@click='showChoices(item.rawName)')
                                v-list-tile-action
                                  v-icon add_box
                                v-list-tile-title Add to
    loader(v-else)
    .text-xs-center.modal-container
      v-dialog(v-model='modal', width='70%')
        v-card.white--text
          v-card-text.white--text
            h2.white--text.headline {{ modalTitle }}
          v-card-text.subheading.white--text {{ modalText }}
          v-card-actions
            v-spacer
            v-btn.blue--text.darken-1(flat, v-on:click.native='modal = false') Thanks!
    choice-window(:entry='choiceTitle')
</template>

<script>
  import axios from 'axios'

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
        choiceTitle: '',
        modal: false,
        modalTitle: '',
        modalText: '',
        qualityList: ['480p', '720p', '1080p'],
        lastUpdateTime: 'a few seconds ago'
      }
    },
    computed: {
      releases () {
        return this.$store.state.releases
      },
      fansubList () {
        return this.$store.state.fansubList
      }
    },
    methods: {
      epLabel (ep, isTooltip = false) {
        // HorribleSubs specific atm
        return /\[[0-9]{3,4}p\]/.test(ep)
          ? 'Batch'
          : `${isTooltip ? 'Episode' : 'Ep'} ${ep}`
      },
      openModal (title, text) {
        this.modalTitle = title
        this.modalText = text

        this.modal = true
      },
      downloadAll (name) {
        console.log(`[${(new Date()).toLocaleTimeString()}]: Sending a request to download all episodes of ${name}.`)

        const quality = this.$store.state.releaseQuality
        const fansub = this.$store.state.releaseFansub

        axios.post('download', {
          name: name,
          quality: quality,
          fromEp: 0,
          untilEp: 20000,
          fansub: fansub,
          choice: 'si'
        }).then(({data}) => {
          console.log(`[${(new Date()).toLocaleTimeString()}]: Server responded!`)

          data.forEach((link) => {
            window.open(link)
          })
        }).catch((err) => {
          console.log(`[${(new Date()).toLocaleTimeString()}]: An error occurred... ${err}`)
          this.$store.commit('setInfoSnackbar', `An error occurred while getting ${name}.`)
        })
      },
      async refresh () {
        await this.$store.dispatch('refreshReleases')
        this.updateTime()
      },
      print (item) {
        console.log(`[${(new Date()).toLocaleTimeString()}]: Downloading ${item.name}.`)
      },
      showChoices (name) {
        this.choiceTitle = name
        this.$store.commit('setAddToChoice', true)
      },
      updateTime () {
        const updated = this.$store.state.releasesUpdateTime
        if (updated) {
          this.lastUpdateTime = updated.fromNow()
        }
      },
      searchThis (name) {
        this.$store.dispatch('searchInfoFromName', name)
      }
    }
  }
</script>

<style scoped>
  p
  {
    margin-bottom: 0;
  }

  div.input-group
  {
    padding-bottom: 5px !important;
    padding-top: 8px !important;
  }

  /* ----- Refresh button ----- */
  .refresh-button-container
  {
    display: inline-block;
    text-align: center;
    padding: 0;
    align-self: center;
  }

  .time-container
  {
    height: 70px;
    display: flex;
    align-items: center;
  }

  .update-time
  {
    padding-left: 20px;
    font-weight: 600;
    font-size: 16px;
    font-style: italic;
  }

  .elem
  {
    margin-bottom: 10px;
    display: inline-block;
    padding: 1px 5px !important;
  }

  .elem-content
  {
    background-color: rgb(60, 60, 60);
    cursor: default;
  }

  .elem-content:hover
  {
    transition: all 0.4s;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
  }

  .elem-card
  {
    padding: 0 10px 0 0;
  }

  .elem-title h6
  {
    padding-left: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    line-height: 26px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .elem-ep h6
  {
    margin-top: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .elem-image
  {
    height: 200px;
  }

  .picture
  {
    max-width: 100%;
  }

  .elem-text-links
  {
    height: 100%;
    position: relative;
  }

  .synopsis
  {
    text-align: justify;
    display: block;
    text-overflow: ellipsis;
    word-wrap: break-word;
    overflow: hidden;
    max-height: 9em;
    line-height: 1.5em;
  }

  .links
  {
    height: 25%;
    position: absolute;
    bottom: 5px;
    right: -2px;
    display: flex;
  }

  .download-button
  {
    text-decoration: none;
    margin-right: 0;
  }

  .subheading
  {
    padding: 30px;
    text-align: justify;
    text-align-last: center;
  }
</style>
