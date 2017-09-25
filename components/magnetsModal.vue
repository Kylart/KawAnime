<template lang="pug">
  div
    v-dialog.magnet-modal(v-model='values.show', lazy, absolute, width='800')
        v-card.secondary.white--text
          v-card-text
            h2.title.white--text Magnets for #[strong {{ values.title }}]
          v-divider
          v-card-text.subheading.white--text
            v-layout(row, wrap, justify-center, align-center)
              v-flex.modal-icon-container(xs4, offset-xs6)
                v-btn(flat, icon, v-if='magnets.length', v-clipboard="magnets.join(eol)", @success='snack = true')
                  v-icon.copy-icon content_copy
              v-flex.subheading.grey--text.modal-text(
                xs12,
                v-for='magnet in values.magnets',
                :key='magnet.link'
              ) {{ magnet.link.split('&')[0] }}
          v-card-actions
            v-spacer
            v-btn.blue--text.darken-1(flat, @click='values.show = false') Thanks!
    v-snackbar(
      :timeout='2500',
      top,
      v-model='snack'
    ) All magnets were copied to clipboard!
      v-btn.pink--text(flat, @click='snack = false') Thanks!
</template>

<script>
  export default {
    data () {
      return {
        snack: false,
        selected: []
      }
    },
    computed: {
      values () {
        return this.$store.state.downloader.modal
      },
      show () {
        return this.values.show
      },
      eol () {
        if (this.$store.state.platform === 'win32') {
          return '\r\n'
        } else {
          return '\n'
        }
      },
      magnets () {
        return this.values.magnets.map((magnet) => {
          return magnet.link
        })
      }
    },
    watch: {
      show () {
        this.show && this.$store.dispatch('player/play')
      }
    }
  }
</script>

<style scoped>
  .modal-text
  {
    white-space: pre-wrap;
    word-wrap: break-word;
    margin: 0;
    padding: 0;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .magnet-modal .title
  {
    padding: 0;
  }

  .magnet-modal .title h2
  {
    padding-bottom: 0;
  }

  .modal-icon-container
  {
    text-align: right;
  }

  .copy-icon
  {
    display: inline-block;
    cursor: copy;
  }
</style>

