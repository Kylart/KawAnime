<template>
	<div class="modals text-xs-center">
		<v-dialog v-model="configModal"
		          width="700"
		          :style="configModalStyle"
		          class="config-modal">
			<v-btn icon slot="activator">
				<v-icon>settings</v-icon>
			</v-btn>
			<v-card class="secondary white--text">
				<v-card-text class="white--text">
					<h2 class="title">Settings</h2>
				</v-card-text>
				<v-divider/>
				<v-card-text class="subheading white--text">
					<div class="section">
						<h5 class="section-title">Download</h5>
						<v-row class="section-content">
							<v-col xs4 class="fansub-selector">
								<p class="subsection-title">Preferred Fansub</p>
								<v-select v-bind:items="fansubChoices"
								          v-model="config.fansub"
								          dark
								          disabled
								          single-line
								          auto/>
							</v-col>
							<v-col xs1></v-col>
							<v-col xs7>
								<p class="subsection-title">Quality</p>
								<v-row>
									<v-col xs4>
										<v-radio class="radio"
										         label="480p"
										         v-model="config.quality"
										         value="480p" primary dark/>
									</v-col>
									<v-col xs4>
										<v-radio class="radio"
										         label="720p"
										         v-model="config.quality"
										         value="720p" primary dark/>
									</v-col>
									<v-col xs4>
										<v-radio class="radio"
										         label="1080p"
										         v-model="config.quality"
										         value="1080p" primary dark/>
									</v-col>
								</v-row>
							</v-col>
							<v-col xs1><!-- Dummy cell --></v-col>
							<v-col xs4>
								<v-card-text class="switch">
									<v-switch label="Pref magnets" dark primary v-model="config.magnets"/>
								</v-card-text>
							</v-col>
							<v-col xs5>
								<p class="subsection-title">Sound on magnet downloads</p>
								<v-select v-bind:items="soundChoices"
								          v-model="config.sound"
								          item-value="config.sound"
								          dark
								          single-line
								          auto/>
							</v-col>
							<v-col xs2><!-- Dummy cell --></v-col>
						</v-row>
					</div>
					<div class="section">
						<h5 class="section-title">Local</h5>
						<v-row class="section-content">
							<v-col xs4>
								<p class="subsection-title">
									Preferred directory
								</p>
								<div class="choose-button">
									<v-btn dark flat @click.native="changeConfigPath()">Choose</v-btn>
								</div>
							</v-col>
							<v-col
											xs8><span class="">Current: </span>
								<!-- TODO Add a "last one" option-->
								<p class="config-dir">
									{{ configDir }}
								</p>
							</v-col>
						</v-row>
					</div>
					<div class="section">
						<h5 class="section-title">News</h5>
						<v-row class="section-content">
							<v-col xs12>
								<p class="subsection-title">
									Display news
								</p>
							</v-col>
							<v-col xs1></v-col>
							<v-col xs4>
								<v-radio class="radio"
								         label="Inside"
								         v-model="config.inside"
								         value="true" primary dark/>
							</v-col>
							<v-col xs4>
								<v-radio class="radio"
								         label="Outside"
								         v-model="config.inside"
								         value="false" primary dark/>
							</v-col>
						</v-row>
					</div>
				</v-card-text>
				<v-divider/>
				<v-card-row actions style="padding: 10px 20px 20px 0">
					<v-spacer></v-spacer>
					<v-btn dark primary
					       v-on:click.native="save()">
						Save
					</v-btn>
					<v-btn dark primary
					       v-on:click.native="saveAndClose()">
						Save and close
					</v-btn>
				</v-card-row>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
  export default{
    data() {
      return {
        configModal: false,
        configModalStyle: {
          minHeight: '90%'
        },
        fansubChoices: [
          'HorribleSubs',
          'PuyaSubs',
          'BakedFish',
          'DeadFish',
          'DefinitelyNotMe'
        ],
        soundChoices: [
          'None',
          'Nyanpasu'
        ]
      }
    },
    computed: {
      configDir: function () {
        return this.$store.state.configDir
      },
      config: function () {
        return this.$store.state.config
      }
    },
    methods: {
      changeConfigPath() {
        this.$store.dispatch('changePathWithConfig')
      },
      save() {
        this.$store.commit('setConfig', this.config)
        const toSave = {...this.config}
        toSave.inside = this.config.inside === 'true'
        toSave.localPath = this.$store.state.configDir

        // Here we save to config
        this.$store.dispatch('saveConfig', toSave)
      },
      saveAndClose() {
        this.save()
        this.configModal = false
      }
    }
  }
</script>

<style scoped>
	h2
	{
		color: rgba(255, 255, 255, 0.8);
	}

	.section
	{
		padding: 2% 2% 2% 2%;
		margin-bottom: 20px;
		background-color: rgb(60, 60, 60);
		text-align: left;
	}

	.section-title
	{
		padding-left: 25px;
		color: rgba(255, 255, 255, 0.8);
		text-align: left;
		min-width: 700px;
	}

	.subsection-title
	{
		font-weight: 700;
		font-size: 16px;
		padding-left: 10px;
	}

	.choose-button
	{
		padding-left: 25%;
	}

	.config-dir
	{
		padding-left: 10%;
		margin-top: 20px;
	}

</style>