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
        v-layout(row, wrap, justify-space-around, align-center)
          .grey--text.text-uppercase Download Path:
          v-tooltip(top)
            .path.ellipsis.pl-2(slot='activator') {{ currentPath }}
            span {{ currentPath }}
          v-btn(flat, color='blue', @click='openDirectoryDialog') Change
          v-btn(icon, flat, large)
            v-icon(large, color='blue', @click='addEntry') add_circle

        div.torrents-container
          template(v-for='(entry, index) in torrents')
            template(v-if='entry.show')
              v-layout(justify-space-between, align-center)
                v-text-field(v-model='entry.torrent', @paste='handlePaste')
                v-btn(icon)
                  v-icon(@click='removeEntry(index)') close
            template(v-else)
              v-layout.choice(justify-space-between, align-center)
                v-btn(@click='openDialog(index)') Open file
                v-btn(@click='showEntry(index)') Enter magnet

      v-divider

      v-card-actions
        v-spacer
        v-btn.blue--text(@click='close', flat) Close
        v-btn.indigo(@click='download') Download
</template>

<script>
export default {
  name: 'Torrent-Dialog',

  data: () => ({
    path: null,
    torrents: [{ torrent: '', show: false }]
  }),

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
    },
  },

  methods: {
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
    showEntry (index) {
      this.torrents[index].show = true
    },
    async openDirectoryDialog () {
      const { data: { path } } = await this.$axios.get('openThis', {
        params: {
          type: 'dialog'
        }
      })

      if (path) this.path = path
    },
    async openDialog (index) {
      const { data: { path } } = await this.$axios.get('openThis', {
        params: {
          type: 'dialog',
          properties: ['openFile', 'multiSelections'],
          filters: JSON.stringify([{ name: 'torrent', extensions: ['torrent'] }])
        }
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
      await Promise.all(this.torrents.map(async ({ torrent }) => {
        if (!torrent) return

        await this.$store.dispatch('torrents/add', {
          torrent,
          path: this.path || this.config.defaultPath
        })

        this.close()
      }))

      await this.$store.dispatch('torrents/getData')
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
