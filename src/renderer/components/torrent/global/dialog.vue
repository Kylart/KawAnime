<template lang="pug">
  v-dialog(
    v-model='show',
    width='600'
  )
    v-card
      v-card-title.grey--text.text-uppercase
        v-spacer
        div Add a torrent
        v-spacer

      v-divider

      v-card-text.pt-0
        v-row(justify='space-around', align='center')
          .grey--text.text-uppercase Download Path:
          v-tooltip(top)
            template(v-slot:activator='{ on }')
              .path.ellipsis.pl-2(v-on='on') {{ currentPath }}
            span {{ currentPath }}
          v-btn(text, color='blue', @click='openDirectoryDialog') Change
          v-btn(icon, text, large)
            v-icon(large, color='blue', @click='addEntry') add_circle

        .torrents-container
          template(v-for='(entry, index) in torrents')
            template(v-if='entry.show')
              v-row(justify='space-between', align='center')
                v-text-field(v-model='entry.torrent', @paste='handlePaste')
                v-btn(icon)
                  v-icon(@click='removeEntry(index)') close
                v-btn(icon)
                  v-icon(@click='playEntry(index)') play_circle_outline
            template(v-else)
              v-row.choice(justify='space-between', align='center')
                v-btn(@click='openDialog(index)') Open file
                v-btn(@click='showEntry(index)') Enter magnet

      v-divider

      v-card-actions
        v-spacer
        v-btn.blue--text(@click='close', text) Close
        v-btn.secondary(@click='download') Download
</template>

<script>
export default {
  name: 'Torrent-Dialog',

  data: () => ({
    path: null,
    torrents: [{ torrent: '', show: false }]
  }),

  created () {
    this.$ipc.on(this.$eventsList.externalOpen.success, (e, args) => {
      const toAdd = args.filter(
        (e) => ['magnet:', '.torrent'].some((id) => e.includes(id))
      )

      if (toAdd.length) {
        this.$log('External torrents opening', toAdd)
        this.addTorrentsFromPath(toAdd)
        this.show = true
      }
    })
  },

  computed: {
    config: {
      get () {
        return this.$store.state.config.config.torrentClient
      },
      set () {}
    },
    show: {
      get () {
        return this.$store.state.torrents.dialog.show
      },
      set (val) {
        this.$store.commit('torrents/showDialog', val)
      }
    },
    links () {
      return this.torrents.map(({ torrent }) => torrent).filter(Boolean)
    },
    entries () {
      return this.torrents.length
    },
    currentPath () {
      return this.path || this.config.defaultPath || ''
    },
    eol () {
      return this.$store.state.platform === 'win32'
        ? '\r\n'
        : '\n'
    }
  },

  methods: {
    addTorrentsFromPath (torrents) {
      if (!this.torrents[0].torrent) {
        // Means it's a first open
        this.torrents = torrents.map((torrent) => ({
          show: true,
          torrent
        }))
      } else {
        // Meaning some magnets are already there and we probably should not remove them
        torrents.forEach((torrent) => {
          !this.links.includes(torrent) && this.torrents.push({
            torrent,
            show: true
          })
        })
      }
    },
    close () {
      this.show = false
    },
    addEntry () {
      if (this.torrents[this.entries - 1].torrent) this.torrents.push({ torrent: '', show: false })
    },
    removeEntry (index) {
      this.torrents.splice(index, 1)

      this.$nextTick(() => {
        if (this.entries === 0) this.torrents = [{ torrent: '', show: false }]
      })
    },
    playEntry (index) {
      const torrent = this.torrents[index].torrent

      if (torrent) {
        this.$store.dispatch('streaming/play', {
          link: torrent,
          isTorrent: true
        })

        this.close()
      }
    },
    showEntry (index) {
      this.torrents[index].show = true
    },
    async openDirectoryDialog () {
      const path = await this.$openDialog()

      if (path) this.path = path
    },
    async openDialog (index) {
      const path = await this.$openDialog({
        properties: ['openFile', 'multiSelections'],
        filters: JSON.stringify([{ name: 'torrent', extensions: ['torrent'] }])
      })

      if (path) {
        if (Array.isArray(path)) {
          this.torrents.pop()

          path.forEach((torrent) => {
            this.torrents.push({
              show: true,
              torrent
            })
          })
        } else {
          this.torrents[index].show = true
          this.torrents[index].torrent = path
        }
      }
    },
    async download () {
      await Promise.all(this.links.map(async (torrent) => {
        await this.$store.dispatch('torrents/add', {
          torrent,
          path: this.path || this.config.defaultPath
        })

        this.close()
      }))

      await this.$store.dispatch('torrents/get')

      this.torrents = [{ torrent: '', show: false }]
    },
    handlePaste (e) {
      const text = e.clipboardData.getData('text')

      if (text.includes(this.eol)) {
        e.preventDefault()

        this.torrents.pop()

        text.split(this.eol).forEach((magnet) => {
          this.torrents.push({ torrent: magnet, show: true })
        })
      }
    }
  },

  watch: {
    '$route.query.torrents': function (torrents) {
      if (torrents && torrents.length) {
        this.addTorrentsFromPath(torrents)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .path
    font-size 16px
    letter-spacing 0.03em
    font-weight 300

  .torrents-container
    padding 0 10%

    .choice
      padding 0 15%
</style>
