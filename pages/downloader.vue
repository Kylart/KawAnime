<template lang="pug">
  v-container#downloader.container(fluid)
    .cute-char.left-pic
    .cute-char.right-pic
    .form-container
      v-layout(row, wrap, justify-center)
        v-flex(xs2, sm7, md9)
          // Dummy cell
        v-flex(xs10, sm5, md3)
          .choose-magnets
            v-card.z-depth-0
              v-card-text.switch
                v-switch#magnets-switch(
                  label='Get Magnets',
                  color='primary',
                  v-model='$store.state.config.magnets',
                  dark
                )
        v-flex(xs4)
        v-flex(xs4, @keydown.enter='next(1)')
          v-text-field#name-input(
            name='name-input',
            type='text',
            label='Name of the anime',
            v-model='$store.state.downloaderForm.name',
            autofocus,
            dark
          )
        v-flex(xs4)
        v-flex(xs4)
        v-flex(xs4, @keydown.enter='next(2)', @keydown.delete='previous(2)')
          v-text-field(
            name='from-ep-input',
            type='number',
            min='0',
            label='From episode...',
            v-model='$store.state.downloaderForm.fromEp',
            dark
          )
        v-flex(xs4)
        v-flex(xs4)
        v-flex(xs4, @keydown.enter='next(3)', @keydown.delete='previous(3)')
          v-text-field(
            name='until-ep-input',
            type='number',
            label='Until episode..',
            v-model='$store.state.downloaderForm.untilEp',
            dark
          )
        v-flex(xs4)
        v-flex.radio-container(xs12, sm6, md4)
          v-radio.radio.primary--text(label='480p', v-model='quality', value='480p', dark)
        v-flex(xs12, sm6, md4)
          v-radio.radio.primary--text(label='720p', v-model='quality', value='720p', dark)
        v-flex(xs12, sm6, md4)
          v-radio.radio.primary--text(label='1080p', v-model='quality', value='1080p', dark)
    .download-button-container
      .download-button
        v-btn#download-btn(
          dark, block, secondary,
          @click='isDownloadable()',
          v-if='!$store.state.downloaderForm.loading'
        ) Download!
        v-btn(dark, block, secondary, loading, v-else)
    v-dialog.magnet-modal(v-model='$store.state.downloaderModal.show', lazy, absolute, width='800')
      v-card.secondary.white--text
        v-card-text.white--text
          h2.title.white--text
            | Magnets for #[strong {{ $store.state.downloaderModal.title }}]
        v-divider
        v-card-text.subheading.white--text
          v-layout(row, wrap, justify-center, align-center)
            v-flex.modal-icon-container(xs4, offset-xs6)
              v-btn(flat, icon, v-if='links', v-clipboard="links.join('')", @success='copiedSnackbar = true')
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
        quality: this.$store.state.downloaderForm.quality
      }
    },
    computed: {
      formValues () {
        return this.$store.state.downloaderForm
      },
      links () {
        return this.$store.state.downloaderModal.text
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

        if (this.$store.state.downloaderForm.name) { this.$store.dispatch('download') }

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
  div.container
  {
    position: relative;
    height: 91vh;
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

  .container
  {
    height: 100%;
    width: 100%;
    align-content: center;
    background-image: url('~static/images/downloader-back.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    text-align: center;
  }

  .form-container
  {
    background-color: rgba(0, 0, 0, 0.4);
    width: 65%;
    display: inline-block;
    margin-top: 4%;
    padding-bottom: 4%;
    padding-top: 3%;
  }

  .switch
  {
    margin-top: 0;
    margin-bottom: -15px;
  }

  /* Needed! */
  .form-container .card
  {
    background-color: rgba(0, 0, 0, 0);
    box-shadow: none;
  }

  .radio-container
  {
    text-align: center;
  }

  .radio
  {
    margin-left: 35%;
  }

  .download-button-container
  {
    align-content: center;
  }

  .download-button
  {
    margin-top: 45px;
    display: inline-block;
    width: 20%;
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
