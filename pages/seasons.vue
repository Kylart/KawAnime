<template xmlns:v-tooltip="http://www.w3.org/1999/xhtml">
	<v-container fluid>
		<loader v-if="!season[1].items"></loader>

		<v-container fluid v-else>
			<v-row class="form-container">
				<v-col md1 xs0></v-col>
				<v-col md3 xs12 class="season-container">
					<v-select
									v-bind:items="seasonChoices"
									v-model="currentSeason"
									label="Season"
									dark
									item-text="name"
									item-value="value"/>
				</v-col>
				<v-col md3 xs12 class="year-container">
					<v-text-field name="input-year"
					              type="number" min="2000"
					              label="Year"
					              v-model="currentYear"
					              dark>
					</v-text-field>
				</v-col>
				<v-col md4 xs12 class="refresh-button">
					<v-btn secondary block dark @click.native="refreshSeason()">Refresh</v-btn>
				</v-col>
				<v-col md1 xs0></v-col>
			</v-row>

			<v-tabs id="tabs" grow>
				<v-tab-item v-for="i in 3"
				            :href="'#' + i"
				            :key="i"
				            slot="activators">
					{{ season[i].name }}
				</v-tab-item>
				<v-tab-content v-for="i in 3"
				               v-bind:id="`${i}`"
				               :key="i"
				               slot="content">
					<v-card>
						<v-row class="elems">
							<v-col md6 xs12 v-for="item in season[i].items" :key="item.title">
								<v-row class="elem elevation-3" v-ripple="true">
									<!-- Header of elem -->
									<v-col xs12 v-tooltip:bottom="{ html: item.title }">
										<h6 class="title ellipsis">
											{{ item.title }}
										</h6>
									</v-col>
									<v-col xs9 v-tooltip:bottom="{ html: item.genres.join(' ') }">
										<p class="genres ellipsis">{{ item.genres.join(' ') }}</p>
									</v-col>
									<v-col xs3 v-tooltip:bottom="{ html: item.fromType }">
										<p class="from-type ellipsis">
											{{ item.fromType }}
										</p>
									</v-col>
									<!-- Picture of elem -->
									<v-col xs4 class="image-container">
										<div class="image">
											<img :src="item.picture" height="220" max-width="170"/>
										</div>
									</v-col>
									<v-col xs8 class="bottom-right">
										<v-row>
											<v-col xs12 class="synopsis">
												{{ reduced(item.synopsis) }}
											</v-col>
											<v-col xs7 class="date">{{ getDate(item.releaseDate) }}</v-col>
											<v-col xs5 class="nb-ep">{{ item.nbEp }} {{ episode(item.npEp) }}</v-col>
											<v-col xs8 class="producers"><strong>{{ item.producers.join(' ') }}</strong></v-col>
											<v-col xs4 class="dropdown-container">
												<v-menu transition="v-slide-x-transition">
													<v-btn flat dark slot="activator">
														More
													</v-btn>
													<v-list>
														<v-list-item>
															<v-list-tile>
																<v-list-tile-title v-on:click.stop="openModal(item.title, item.synopsis)">
																	Check synopsis
																</v-list-tile-title>
															</v-list-tile>
														</v-list-item>
														<v-list-item>
															<v-list-tile>
																<v-list-tile-title v-on:click.stop="downloadAll(item.title)">
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
											</v-col>
										</v-row>
									</v-col>
								</v-row>
							</v-col>
						</v-row>
					</v-card>
				</v-tab-content>
			</v-tabs>
			<div class="text-xs-center modal-container">
				<v-modal v-model="modal">
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
							       v-on:click.native="modal = false">Thanks!
							</v-btn>
						</v-card-row>
					</v-card>
				</v-modal>
			</div>
		</v-container>
	</v-container>
</template>

<script>
  import axios from 'axios'
  import Loader from '~components/loader.vue'

  export default {
    data() {
      return {
        modalTitle: '',
        modalText: '',
        modal: false,
        seasonChoices: [
          {name: 'Winter', value: 'winter'},
          {name: 'Spring', value: 'spring'},
          {name: 'Summer', value: 'summer'},
          {name: 'Fall', value: 'fall'}
        ],
        currentSeason: this.getCurrentSeason().season,
        currentYear: 1900 + (new Date()).getYear()
      }
    },
    computed: {
      seasons: function () {
        return this.$store.state.seasons
      },
      stats: function () {
        return this.$store.state.seasonsStats
      },
      TVs: function () {
        return this.seasons.TV
      },
      OVAs: function () {
        return this.seasons.OVAs
      },
      Movies: function () {
        return this.seasons.Movies
      },
      season: function () {
        return ['',
          {name: 'TV', items: this.TVs},
          {name: 'OVA', items: this.OVAs},
          {name: 'Movies', items: this.Movies}
        ]
      }
    },
    components: {
      Loader
    },
    methods: {
      reduced(text) {
        return text.length > 270
            ? text.slice(0, 300) + '...'
            : text
      },
      getDate(string) {
        return string.split(' ').slice(0, 3).join(' ')
      },
      episode(nbEp) {
        return nbEp !== 1
            ? 'episodes'
            : 'episode'
      },
      refreshSeason() {
        const year = this.currentYear
        const season = this.currentSeason.value

        console.log(year + season)

        this.$store.commit('setCurrentSeason', {
          year: year,
          season: season
        })

        this.$store.dispatch('refreshSeasons')
      },
      openModal(title, text) {
        console.log(`Opening modal for ${title}`)

        this.modalTitle = title
        this.modalText = text

        this.modal = true
      },
      getCurrentSeason() {
        const date = new Date()

        // Get current year
        const year = 1900 + date.getYear()

        // Get current month
        const month = 1 + date.getMonth()   // I am a weak person that like 1-indexed things

        if (0 < month && month < 4)  // Winter
          return {season: 'winter', year: year}
        else if (3 < month && month < 7)  // Spring
          return {season: 'spring', year: year}
        else if (6 < month && month < 10)  // Summer
          return {season: 'summer', year: year}
        else if (9 < month && month < 13)  // Fall
          return {season: 'fall', year: year}
      },
      downloadAll(name) {
        console.log(`Sending a request to download all episodes of ${name}`)

        axios.get(`/download?name=${name}`).then((resp) => {
          console.log('Server responded!')

          const links = resp.data.links

          links.forEach((link) => {
            window.open(link)
          })
        })
      }
    }
  }
</script>

<style scoped>
	h6
	{
		margin: 0;
	}

	/* ----------- FORM ---------- */
	.form-container
	{
		padding-top: 1.5%;
		padding-left: 50px;
		padding-right: 0;
	}

	.year-container
	{
		padding-left: 2.5%;
	}

	.season-container
	{
		padding-right: 1.5%;
	}

	.refresh-button
	{
		padding-top: 1%;
		padding-left: 6%;
		padding-right: 3%;
	}

	/* ----------- ELEM ---------- */
	.ellipsis
	{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.elems
	{
		padding: 1% 1% 2% 1%;
	}

	.elem
	{
		position: relative;
		margin: 5px 0 10px 0;
		background-color: rgb(60, 60, 60);
		color: rgba(255, 255, 255, 0.8);
	}

	.elem:hover
	{
		box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
	}

	.title
	{
		margin-top: 10px;
		margin-bottom: 10px;
		padding-left: 10px;
		color: rgba(255, 255, 255, 0.8);
	}

	.from-type
	{
		margin-bottom: 5px;
		text-align: right;
		font-weight: 700;
		font-size: 120%;
	}

	.image-container
	{
		padding: 0;
	}

	.image
	{
		height: 220px;
		max-width: 170px;
	}

	.bottom-right
	{
		position: relative;
	}

	.synopsis
	{
		padding-left: 15px;
		padding-right: 15px;
		text-align: justify;
		min-height: 130px;
	}

	.date
	{
		margin-top: 5%;
	}

	.nb-ep
	{
		text-align: right;
		margin-top: 5%;
		padding-right: 20px;
	}

	.producers
	{
		margin-top: 4%;
	}
</style>