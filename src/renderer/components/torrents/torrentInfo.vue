<template lang="pug">
  v-menu(
    v-model='show',
    :close-on-content-click='false',
    :nudge-width='200',
    offset-x
  )
    template(
      v-slot:activator='{ on }'
    )
      v-btn(icon, large, v-on='on')
        v-icon(large) info

    v-card.info-container
      v-card-title.pa-2
        .title Torrent information
        v-spacer
        v-tooltip(top)
          template(v-slot:activator='{ on }')
            v-btn(icon, v-on='on', @click='copy')
              v-icon content_copy
          span Copy magnet to clipboard
      v-divider
      v-card-text
        v-layout(justify-space-around, align-center)
          .caption
            caption.grey--text.text-uppercase Peers
            .display-1.font-weight-black {{ torrent.numPeers }}

          .caption
            caption.grey--text.text-uppercase Files
            .display-1.font-weight-black {{ torrent.files.length }}

          .caption
            caption.grey--text.text-uppercase Size
            div
              span.display-1.font-weight-black {{ formattedLength.value }}
              strong {{ formattedLength.unit }}

          .caption
            caption.grey--text.text-uppercase Downloaded
            div
              span.display-1.font-weight-black {{ formatBytes(torrent.downloaded).value }}
              strong {{ formatBytes(torrent.downloaded).unit }}

          .caption
            caption.grey--text.text-uppercase Uploaded
            div
              span.display-1.font-weight-black {{ formatBytes(torrent.uploaded).value }}
              strong {{ formatBytes(torrent.uploaded).unit }}

        .files-container.pl-2.pr-2pt-2.mt-2
          .header Files

          v-divider

          template(v-for='file in torrent.files')
            .file(:key='file.path')
              v-tooltip(top)
                template(v-slot:activator='{ on }')
                  .file-title(v-on='on')
                    span.name {{ file.name }}
                    v-icon(:color='getFileStatus(file).color') {{ getFileStatus(file).icon }}

                span {{ file.path }}
</template>

<script>
export default {
  name: 'Torrent-Info',

  props: ['torrent'],

  data: () => ({
    show: false,
    sizes: ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  }),

  computed: {
    totalLength () {
      return this.torrent.files.reduce((acc, { length }) => (acc + length), 0)
    },
    formattedLength () {
      return this.formatBytes(this.totalLength)
    }
  },

  methods: {
    copy () {
      this.$electron.clipboard.writeText(this.torrent.magnetURI)
    },
    formatBytes (bytes) {
      // https://stackoverflow.com/questions/1590i88888340485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
      if (bytes === 0) return { value: 0, unit: 'Bytes' }

      const k = 1024
      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return {
        value: parseFloat((bytes / Math.pow(k, i)).toFixed(2)),
        unit: this.sizes[i]
      }
    },
    getFileStatus (file) {
      return {
        color: file.done ? 'success' : 'orange',
        icon: file.done ? 'done' : 'more_horiz'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .info-container
    min-width 350px

  .title
    font-size 22px

  .caption
    padding 0 12px
    display flex
    justify-content center
    align-items center
    flex-direction column

  .files-container
    font-size 20px
    font-weight 500
    letter-spacing 0.04em

    .header
      font-size 22px
      font-weight 500
      letter-spacing 0.03em
      padding 0 5%

    .file
      padding-top 8px

      .file-title
        padding 4px
        display flex
        justify-content space-between
        align-items center

        .name
          font-size 16px
          font-weight 300
          letter-spacing 0.02em
</style>
