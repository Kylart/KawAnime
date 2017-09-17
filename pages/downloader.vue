<template lang="pug">
  v-container#downloader.container(fluid, fill-height)
    .cute-char.left-pic
    .cute-char.right-pic
    v-layout(row, wrap, justify-center, align-center)
      v-flex.form-container(xs8)
        v-layout(row, wrap, justify-center)
          v-flex(xs9)
          v-flex(xs3)
            v-switch#magnets-switch(
              label='Get Magnets',
              color='primary',
              v-model='$store.state.config.config.magnets',
              dark
            )
          v-flex.pt-3.pl-5.pr-5(xs7, @keydown.enter='next(1)')
            v-text-field#name-input(
              name='name-input',
              type='text',
              label='Name of the anime',
              v-model='$store.state.downloaderForm.name',
              autofocus,
              dark
            )
          v-flex.pt-3.pl-5.pr-5(xs7, @keydown.enter='next(2)',  @keydown.delete='previous(2)')
            v-text-field(
              name='from-ep-input',
              type='number',
              min='0',
              label='From episode...',
              v-model='$store.state.downloaderForm.fromEp',
              dark
            )
          v-flex.pt-3.pl-5.pr-5(xs7, @keydown.enter='next(3)', @keydown.delete='previous(3)')
            v-text-field(
              name='until-ep-input',
              type='number',
              label='Until episode..',
              v-model='$store.state.downloaderForm.untilEp',
              dark
            )
          v-flex.pt-4(xs12)
            v-radio-group(:isMandatory="true", row, v-model="quality")
              v-radio.radio.primary--text(label='480p', value='480p')
              v-radio.radio.primary--text(label='720p', value='720p')
              v-radio.radio.primary--text(label='1080p', value='1080p')
      v-flex.pt-4(xs12)
        v-layout(justify-center, align-center)
          v-flex(xs3)
            v-btn#download-btn(
              dark, block, secondary,
              @click='isDownloadable()',
              v-if='!$store.state.downloaderForm.loading'
            ) Download!
            v-btn(dark, block, secondary, loading, v-else)
    v-dialog.magnet-modal(v-model='magnetModal', lazy, absolute, width='800')
      v-card.secondary.white--text
        v-card-text.white--text
          h2.title.white--text
            | Magnets for #[strong {{ $store.state.downloaderModal.title }}]
        v-divider
        v-card-text.subheading.white--text
          v-layout(row, wrap, justify-center, align-center)
            v-flex.modal-icon-container(xs4, offset-xs6)
              v-btn(flat, icon, v-if='links', v-clipboard="links.join(eol)", @success='copiedSnackbar = true')
                v-icon.copy-icon content_copy
            v-flex.subheading.grey--text.modal-text(
              xs12,
              v-for='link in $store.state.downloaderModal.text',
              :key='link'
            ) {{ link.split('&')[0] }}
        v-card-actions
          v-spacer
          v-btn.blue--text.darken-1(flat, v-on:click.native='$store.state.downloaderModal.show = false')
            | Thanks!
    v-snackbar(
      :timeout='timeout',
      :top="y === 'top'",
      :bottom="y === 'bottom'",
      :right="x === 'right'",
      :left="x === 'left'",
      v-model='snackbar'
    ) Please, enter a valid name (at least 3 letters...)
      v-btn.pink--text(flat, @click='snackbar = false') ok!
    v-snackbar(
      :timeout='copiedTimeout',
      :top="y === 'top'",
      :bottom="y === 'bottom'",
      :right="x === 'right'",
      :left="x === 'left'",
      v-model='copiedSnackbar'
    ) All magnets were copied to clipboard!
      v-btn.pink--text(flat, @click='copiedSnackbar = false') Thanks!
</template>

<script>
  export default {
    data () {
      return {
        modalText: '',
        snackbar: false,
        timeout: 4000,
        x: '',
        y: 'top',
        copiedSnackbar: false,
        copiedTimeout: 2500,
        quality: this.$store.state.config.config.quality
      }
    },
    computed: {
      formValues () {
        return this.$store.state.downloaderForm
      },
      links () {
        return this.$store.state.downloaderModal.text
      },
      magnetModal () {
        return this.$store.state.downloaderModal.show
      },
      eol () {
        if (this.$store.state.platform === 'win32') {
          return '\r\n'
        } else {
          return '\n'
        }
      }
    },
    watch: {
      magnetModal () {
        this.magnetModal && this.$store.dispatch('playSound')
      }
    },
    methods: {
      isDownloadable () {
        if (this.$store.state.downloaderForm.name.length >= 3) { this.download() } else {
          this.snackbar = true
        }
      },
      download () {
        const quality = this.quality

        this.$store.commit('setQuality', quality)

        this.$store.dispatch('download')

        this.$store.commit('setDownloaderValues', {
          name: '',
          fromEp: '',
          untilEp: '',
          quality: quality,
          loading: true
        })
      },
      next (number) {
        switch (number) {
          case 1:
            document.getElementsByName('from-ep-input')[0].focus()
            break

          case 2:
            document.getElementsByName('until-ep-input')[0].focus()
            break

          case 3:
            document.getElementById('download-btn').click()
            document.getElementsByName('name-input')[0].focus()
            break

          default:
            break
        }
      },
      previous (number) {
        switch (number) {
          case 2:
            if (!this.formValues.fromEp) document.getElementsByName('name-input')[0].focus()
            break

          case 3:
            if (!this.formValues.untilEp) document.getElementsByName('from-ep-input')[0].focus()
            break

          default:
            break
        }
      }
    }
  }
</script>

<style scoped>
  .container
  {
    position: relative;
    height: 100%;
    width: 100%;
    background-image: url('~static/images/downloader-back.jpg');
    background-size: cover;
    background-repeat: no-repeat;
  }

  .cute-char
  {
    position: absolute;
    bottom: 0;
    height: 45%;
  }

  .right-pic
  {
    content: url(~static/images/downloader-char-right.png);
    right: 2%;
  }

  .left-pic
  {
    content: url(~static/images/downloader-char-left.png);
    left: 2%;
  }

  .form-container
  {
    background-color: rgba(0, 0, 0, 0.4);
    width: 65%;
    margin-top: 4%;
    padding-bottom: 4%;
    padding-top: 3%;
  }

  .radio
  {
    margin-left: 10%;
  }

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
