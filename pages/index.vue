<template xmlns:v-tooltip="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
	<v-container fluid class="container">
		<div v-if="$store.state.releases.length">
			<v-row style="margin: 0 1% 0 1%;">
				<v-col md3 sm4 xs12 class="time-container">
					<span class="update-time">Updated at: {{ lastUpdateTime }}</span>
				</v-col>
				<v-col md6 sm3 xs0></v-col>
				<!--<v-col md2 sm3 xs12>-->
				<!--<v-select-->
				<!--class="select"-->
				<!--v-bind:items="fansubList"-->
				<!--v-model="$store.state.releaseFansub"-->
				<!--label="Fansub"-->
				<!--dark-->
				<!--single-line-->
				<!--hint="Pick a fansub"-->
				<!--persistent-hint-->
				<!--/>-->
				<!--</v-col>-->
				<v-col md2 sm3 xs12>
					<v-select
									class="select"
									v-bind:items="qualityList"
									v-model="$store.state.releaseQuality"
									label="Quality"
									dark
									single-line
									hint="Which quality ?"
									persistent-hint
					/>
				</v-col>
				<v-col md1 sm1 xs12 class="refresh-button-container">
					<v-btn icon
					       class="refresh-button"
					       @click.native="refresh()">
						<v-icon large>refresh</v-icon>
					</v-btn>
				</v-col>
				<template v-for="item in $store.state.releases">
					<v-col xs12 md6 xl4
					       class="elem">
						<v-card class="elem-content elevation-3" v-ripple="true">
							<v-card-text class="elem-card">
								<v-container fluid style="padding: 0;">
									<v-row>
										<v-col class="elem-title" xs9 v-tooltip:top="{ html: item.name }">
											<h6>{{ item.name }}</h6>
										</v-col>
										<v-col v-tooltip:top="{ html: 'Episode ' + item.ep }" class="elem-ep text-xs-right" xs3>
											<h6>Ep {{ item.ep }}</h6>
										</v-col>
										<v-col class="elem-image"
										       xl5 lg4 md5 sm3 xs4>
											<img v-bind:src="item.picture" height="200" class="picture"/>
										</v-col>
										<v-col xl7 lg8 md7 sm9 xs8>
											<div class="elem-text-links">
												<div class="synopsis">
													<p>{{ item.synopsis }}</p>
												</div>
												<div class="links">
													<a :href="item.magnetLink" class="download-button">
														<v-btn dark flat
														       @click.native="print(item)"
														       class="btn--light-flat-pressed">
															Download
														</v-btn>
													</a>
													<v-menu transition="v-slide-x-transition">
														<v-btn flat dark slot="activator">
															More
														</v-btn>
														<v-list>
															<v-list-item>
																<v-list-tile>
																	<v-list-tile-title v-on:click.stop="openModal(item.name, item.fullSynopsis)">
																		Check synopsis
																	</v-list-tile-title>
																</v-list-tile>
															</v-list-item>
															<v-list-item>
																<v-list-tile>
																	<v-list-tile-title v-on:click.stop="downloadAll(item.name)">
																		Download all episodes
																	</v-list-tile-title>
																</v-list-tile>
															</v-list-item>
															<v-list-item>
																<v-list-tile>
																	<v-list-tile-title>Information</v-list-tile-title>
																</v-list-tile>
															</v-list-item>
															<v-list-item>
																<v-list-tile>
																	<v-list-tile-title>Add to my Watch list</v-list-tile-title>
																</v-list-tile>
															</v-list-item>
															<v-list-item>
																<v-list-tile>
																	<v-list-tile-title>Add to &laquo;Watching&raquo;</v-list-tile-title>
																</v-list-tile>
															</v-list-item>
														</v-list>
													</v-menu>
												</div>
											</div>
										</v-col>
									</v-row>
								</v-container>
							</v-card-text>
						</v-card>
					</v-col>
				</template>
			</v-row>
		</div>
		<loader v-else></loader>
		<div class="text-xs-center modal-container">
			<v-dialog v-model="modal" width="70%">
				<v-card class="secondary white--text">
					<v-card-text class="white--text">
						<h2 class="title">{{ modalTitle }}</h2>
					</v-card-text>
					<v-card-text class="subheading white--text">
						{{ modalText }}
					</v-card-text>
					<v-card-row actions>
						<v-spacer></v-spacer>
						<v-btn primary dark
						       style="width: 100px;"
						       v-on:click.native="modal = false">Thanks!
						</v-btn>
					</v-card-row>
				</v-card>
			</v-dialog>
		</div>
	</v-container>
</template>

<script>
  import axios from 'axios'
  import Loader from '~components/loader.vue'

  export default {
    data () {
      return {
        modal: false,
        modalTitle: '',
        modalText: '',
        fansubList: [
          'HorribleSubs',
          'PuyaSubs',
          'BakedFish',
          'DeadFish',
          'DefinitelyNotMe'
        ],
        qualityList: ['480p', '720p', '1080p']
      }
    },
    computed: {
      releases: function () {
        return this.$store.state.releases
      },
      lastUpdateTime: function () {
        return this.$store.state.releasesUpdateTime
      }
    },
    watch: {
      releases: function () {
        const newTime = (new Date()).toLocaleTimeString()
        this.$store.commit('setReleasesUpdateTime', newTime)
      }
    },
    components: {
      Loader
    },
    methods: {
      openModal(title, text) {
        console.log(`[${(new Date()).toLocaleTimeString()}]: Opening modal`)

        this.modalTitle = title
        this.modalText = text

        this.modal = true
      },
      downloadAll(name) {
        console.log(`[${(new Date()).toLocaleTimeString()}]: Sending a request to download all episodes of ${name}`)

        name = name.split(' ').slice(0, -2).join(' ')
        const quality = this.$store.state.releaseQuality

        axios.post('download', {
          name: name,
          quality: quality,
          fromEp: 0,
          untilEp: 20000
        }).then(({data}) => {
          console.log(`[${(new Date()).toLocaleTimeString()}]: Server responded!`)

          data.forEach((link) => {
            window.open(link)
          })
        }).catch((err) => {
          console.log(`[${(new Date()).toLocaleTimeString()}]: An error occurred... ${err}`)
          this.$store.commit('setErrorSnackbar', `An error occurred while getting ${name}.`)
        })
      },
      refresh() {
        this.$store.dispatch('refreshReleases')
      },
      print(item) {
        console.log(`[${(new Date()).toLocaleTimeString()}]: Downloading ${item.name}.`)
      }
    }
  }
</script>

<style scoped>
	p
	{
		margin-bottom: 0;
	}

	.select
	{
		margin: 10px 0 5px 0;
	}

	/* ----- Refresh button ----- */
	.refresh-button-container
	{
		display: inline-block;
		margin-top: 5px;
		margin-bottom: 2px;
		text-align: center;
		padding: 0;
		align-self: center;
	}

	.refresh-button
	{
		display: inline-block;
	}

	/* Needed */
	/*noinspection CssUnusedSymbol*/
	.icon--large
	{
		height: 2.5rem;
	}

	.time-container
	{
		align-self: center;
	}

	.update-time
	{
		padding-left: 20px;
		color: rgba(255, 255, 255, 0.8);
		font-weight: 600;
		font-size: 16px;
		font-style: italic;
	}

	.elem
	{
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 10px;
	}

	.elem-content
	{
		background-color: rgb(60, 60, 60);
		cursor: default;
	}

	.elem-content:hover
	{
		box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
	}

	.elem-card
	{
		padding: 0 10px 0 0;
	}

	.elem-title h6
	{
		padding-left: 10px;
		margin-top: 10px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		color: rgba(255, 255, 255, 0.8);
	}

	.elem-ep h6
	{
		margin-top: 10px;
		color: rgba(255, 255, 255, 0.8);
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
		max-width: 140px;
	}

	.elem-text-links
	{
		height: 100%;
		position: relative;
	}

	.synopsis
	{
		height: 75%;
		text-align: justify;
		padding-right: 10px;
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

	.modal-container .title
	{
		color: rgba(255, 255, 255, 0.8);
	}
</style>
