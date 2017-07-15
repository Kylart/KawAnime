<template>
  <v-container fluid class="container" id="downloader">
    <script src="https://wzrd.in/standalone/copy-to-clipboard@latest" async></script>
    <div class="cute-char left-pic"></div>
    <div class="cute-char right-pic"></div>

    <div class="form-container">
      <v-layout row wrap justify-center>
        <v-flex xs2 sm7 md9>
          <!-- Dummy cell -->
        </v-flex>
        <v-flex xs10 sm5 md3>
          <div class="choose-magnets">
            <v-card class="z-depth-0">
              <v-card-text class="switch">
                <v-switch id="magnets-switch" label="Get Magnets" primary v-model="$store.state.config.magnets" dark/>
              </v-card-text>
            </v-card>
          </div>
        </v-flex>
        <v-flex xs4></v-flex>
        <v-flex xs4
               @keydown.enter="next(1)">
          <v-text-field name="name-input"
                        type="text"
                        id="name-input"
                        label="Name of the anime"
                        v-model="$store.state.downloaderForm.name"
                        dark>
          </v-text-field>
        </v-flex>
        <v-flex xs4></v-flex>
        <v-flex xs4></v-flex>
        <v-flex xs4
               @keydown.enter="next(2)"
               @keydown.delete="previous(2)">
          <v-text-field name="from-ep-input"
                        type="number" min="0"
                        label="From episode..."
                        v-model="$store.state.downloaderForm.fromEp"
                        dark>
          </v-text-field>
        </v-flex>
        <v-flex xs4></v-flex>
        <v-flex xs4></v-flex>
        <v-flex xs4
               @keydown.enter="next(3)"
               @keydown.delete="previous(3)">
          <v-text-field name="until-ep-input"
                        type="number"
                        label="Until episode.."
                        v-model="$store.state.downloaderForm.untilEp"
                        dark>
          </v-text-field>
        </v-flex>
        <v-flex xs4></v-flex>
        <v-flex xs12 sm6 md4 class="radio-container">
          <v-radio class="radio"
                   label="480p"
                   v-model="quality"
                   value="480p" dark/>
        </v-flex>
        <v-flex xs12 sm6 md4>
          <v-radio class="radio"
                   label="720p"
                   v-model="quality"
                   value="720p" dark/>
        </v-flex>
        <v-flex xs12 sm6 md4>
          <v-radio class="radio"
                   label="1080p"
                   v-model="quality"
                   value="1080p" dark/>
        </v-flex>
      </v-layout>
    </div>
    <div class="download-button-container">
      <div class="download-button">
        <v-btn dark block secondary
               id="download-btn"
               @click.native="isDownloadable()"
               v-if="!$store.state.downloaderForm.loading">
          Download!
        </v-btn>
        <v-btn dark block secondary loading v-else></v-btn>
      </div>
    </div>
    <v-dialog v-model="$store.state.downloaderModal.show"
              scrollable
              width="800"
              class="magnet-modal">
      <v-card class="secondary white--text">
        <v-card-text class="white--text">
          <h2 class="title">Magnets for <strong>{{ $store.state.downloaderModal.title }}</strong></h2>
        </v-card-text>
        <v-divider/>
        <v-card-text class="subheading white--text">
          <v-layout row wrap justify-center>
            <v-flex xs4></v-flex>
            <v-flex xs6 class="modal-icon-container">
              <v-icon class="copy-icon" @click.native="copy()">content_copy</v-icon>
            </v-flex>
            <v-flex xs2></v-flex>
            <v-flex xs12 v-for="link in $store.state.downloaderModal.text"
                   class="subheading grey--text modal-text" :key="link">{{ link.split('&')[0] }}
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat
                 class="blue--text darken-1"
                 v-on:click.native="$store.state.downloaderModal.show = false">
            Thanks!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar :timeout="timeout"
                :top="y === 'top'"
                :bottom="y === 'bottom'"
                :right="x === 'right'"
                :left="x === 'left'"
                v-model="snackbar">
      Please, enter a valid name (at least 3 letters...)
      <v-btn flat class="pink--text" @click.native="snackbar = false">ok!</v-btn>
    </v-snackbar>
    <v-snackbar :timeout="copiedTimeout"
                :top="y === 'top'"
                :bottom="y === 'bottom'"
                :right="x === 'right'"
                :left="x === 'left'"
                v-model="copiedSnackbar">
      All magnets were copied to clipboard!
      <v-btn flat class="pink--text" @click.native="copiedSnackbar = false">Thanks!</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
  export default {
    head () {
      return {
        title: 'Downloader',
        meta: [
          {hid: 'description', name: 'description', content: 'Download animes!'}
        ]
      }
    },
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
      formValues: function () {
        return this.$store.state.downloaderForm
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
      },
      copy () {
        const toCopy = this.$store.state.downloaderModal.text.join('\n')

        window.copyToClipboard(toCopy)

        this.copiedSnackbar = true
      }
    }
  }
</script>

<style scoped>
  *
  {
    color: rgba(255, 255, 255, 0.8);
  }

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
  /*noinspection CssUnusedSymbol*/
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
  }

  .magnet-modal .title
  {
    color: rgba(255, 255, 255, 0.8);
    padding: 0;
  }

  .magnet-modal .title h2
  {
    color: rgba(255, 255, 255, 0.8);
    padding-bottom: 0;
  }

  .magnet-modal .title strong
  {
    color: rgba(255, 255, 255, 0.8);
  }

  .modal-icon-container
  {
    text-align: right;
    width: 60%;
  }

  .copy-icon
  {
    display: inline-block;
    cursor: copy;
  }
</style>
