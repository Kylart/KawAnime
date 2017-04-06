<template>
	<v-container fluid class="container" id="downloader">
		<div class="cute-char left-pic"></div>
		<div class="cute-char right-pic"></div>

		<div class="form-container">
			<v-row>
				<v-col xs2 sm7 md9>
					<!-- Dummy cell -->
				</v-col>
				<v-col xs10 sm5 md3>
					<div class="choose-magnets">
						<v-card class="z-depth-0">
							<v-card-text class="switch">
								<v-switch label="Get Magnets" primary v-model="$store.state.prefMagnets" dark/>
							</v-card-text>
						</v-card>
					</div>
				</v-col>
				<v-col xs4></v-col>
				<v-col xs4 @keydown.enter="next(1)">
					<v-text-field name="input-1" autofocus
					              type="text"
					              label="Name of the anime"
					              v-model="$store.state.downloaderForm.name"
					              dark>
					</v-text-field>
				</v-col>
				<v-col xs4></v-col>
				<v-col xs4></v-col>
				<v-col xs4
				       @keydown.enter="next(2)"
				       @keydown.delete="previous(2)">
					<v-text-field name="input-2"
					              type="number" min="0"
					              label="From episode..."
					              v-model="$store.state.downloaderForm.fromEp"
					              dark>
					</v-text-field>
				</v-col>
				<v-col xs4></v-col>
				<v-col xs4></v-col>
				<v-col xs4
				       @keydown.enter="next(3)"
				       @keydown.delete="previous(3)">
					<v-text-field name="input-3"
					              type="number"
					              label="Until episode.."
					              v-model="$store.state.downloaderForm.untilEp"
					              dark>
					</v-text-field>
				</v-col>
				<v-col xs4></v-col>
				<v-col xs12 sm6 md4 class="radio-container">
					<v-radio class="radio"
					         label="480p"
					         v-model="$store.state.downloaderForm.quality"
					         value="480p" primary dark/>
				</v-col>
				<v-col xs12 sm6 md4>
					<v-radio class="radio"
					         label="720p"
					         v-model="$store.state.downloaderForm.quality"
					         value="720p" primary dark/>
				</v-col>
				<v-col xs12 sm6 md4>
					<v-radio class="radio"
					         label="1080p"
					         v-model="$store.state.downloaderForm.quality"
					         value="1080p" primary dark/>
				</v-col>
			</v-row>
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
		<v-modal v-model="$store.state.downloaderModal.show" class="magnet-modal">
			<v-card class="secondary white--text">
				<v-card-text class="white--text">
					<h2 class="title">Magnets for <strong>{{ $store.state.downloaderModal.title }}</strong></h2>
				</v-card-text>
				<v-card-text class="subheading white--text">
					<v-row>
						<!-- TODO: add a 'copy to clipboard' method. important!-->
						<v-col xs12 v-for="link in $store.state.downloaderModal.text"
						       class="subheading grey--text modal-text" :key="link">{{ link }}
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-row actions>
					<v-spacer></v-spacer>
					<v-btn primary dark
					       v-on:click.native="$store.state.downloaderModal.show = false">
						Thanks!
					</v-btn>
				</v-card-row>
			</v-card>
		</v-modal>
		<v-snackbar :timeout="timeout"
								:top="y === 'top'"
								:bottom="y === 'bottom'"
								:right="x === 'right'"
								:left="x === 'left'"
								v-model="snackbar">
			Please, enter a valid name (at least 3 letters...)
			<v-btn flat class="pink--text" @click.native="snackbar = false">ok!</v-btn>
		</v-snackbar>
	</v-container>
</template>

<script>
  export default {
    data() {
      return {
        modalText: '',
	      snackbar: false,
	      timeout: 4000,
	      x: '',
	      y: 'top'
      }
    },
    computed: {
      formValues: function () {
        return this.$store.state.downloaderForm
      }
    },
    methods: {
      isDownloadable () {
        if (this.$store.state.downloaderForm.name.length >= 3)
          this.download()
        else
        {
					this.snackbar = true
        }
      },
      download() {
        if (this.$store.state.downloaderForm.name)
          this.$store.dispatch('download')

        this.$store.commit('setDownloaderValues', {
          name: '',
          fromEp: '',
          untilEp: '',
          quality: this.$store.state.downloaderForm.quality,
          loading: true
        })
      },
      next(number) {
        switch (number)
        {
          case 1:
            document.getElementsByName('input-2')[0].focus()
            break

          case 2:
            document.getElementsByName('input-3')[0].focus()
            break

          case 3:
            document.getElementById('download-btn').click();
            document.getElementsByName('input-1')[0].focus();
            break

          default:
            break
        }
      },
      previous(number) {
        switch (number)
        {
          case 2:
            if (!this.formValues.fromEp) document.getElementsByName('input-1')[0].focus()
            break

          case 3:
            if (!this.formValues.untilEp) document.getElementsByName('input-2')[0].focus()
            break

          default:
            break
        }
      }
    }
  }
</script>

<style scoped>
	*
	{
		color: rgba(255, 255, 255, 0.8);
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

	.magnet-modal .title strong
	{
		color: rgba(255, 255, 255, 0.8);
	}
</style>