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
              v-model='formValues.name',
              autofocus,
              dark
            )
          v-flex.pt-3.pl-5.pr-5(xs7, @keydown.enter='next(2)',  @keydown.delete='previous(2)')
            v-text-field(
              name='from-ep-input',
              type='number',
              min='0',
              label='From episode...',
              v-model='formValues.fromEp',
              dark
            )
          v-flex.pt-3.pl-5.pr-5(xs7, @keydown.enter='next(3)', @keydown.delete='previous(3)')
            v-text-field(
              name='until-ep-input',
              type='number',
              label='Until episode..',
              v-model='formValues.untilEp',
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
              v-if='!$store.state.downloader.form.loading'
            ) Download!
            v-btn(dark, block, secondary, loading, v-else)
    v-snackbar(
      :timeout='timeout',
      :top="y === 'top'",
      :bottom="y === 'bottom'",
      :right="x === 'right'",
      :left="x === 'left'",
      v-model='snackbar'
    ) Please, enter a valid name (at least 3 letters...)
      v-btn.pink--text(flat, @click='snackbar = false') ok!
</template>

<script>
  export default {
    data () {
      return {
        modalText: '',
        snackbar: false,
        timeout: 4000,
        quality: this.$store.state.config.config.quality
      }
    },
    computed: {
      formValues () {
        return this.$store.state.downloader.form
      }
    },
    methods: {
      isDownloadable () {
        this.formValues.name.length >= 3
          ? this.download()
          : this.snackbar = true
      },
      download () {
        const quality = this.quality

        this.$store.dispatch('downloader/download')
          .then(() => {
            this.$store.commit('downloader/setQuality', quality)
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
</style>
