<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
	<v-app id="app" class="grey lighten-1" top-toolbar left-sidebar>
		<v-toolbar class="dragable">
			<v-toolbar-side-icon class="non-dragable" @click.native.stop="sidebar = !sidebar"/>
			<v-toolbar-logo class="text-xs-right title" v-bind:style="title">
				<div style="width: 100%;">
					<div class="title-text">かわニメ</div>

					<div class="modals text-xs-center">
						<v-modal v-model="configModal" :style="configModalStyle" class="config-modal">
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
													<v-switch label="Pref magnets" dark primary v-model="$store.state.config.magnets"/>
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
								<v-card-row actions>
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
						</v-modal>
					</div>

					<div class="modals text-xs-center">
						<v-modal v-model="searchModal">
							<v-btn icon slot="activator">
								<v-icon>search</v-icon>
							</v-btn>
							<v-card class="secondary">
								<v-card-text>
									<h2 class="title">Which anime are you looking for?</h2>
								</v-card-text>
								<v-card-text class="subheading grey--text">
									Blabla
								</v-card-text>
								<v-card-row actions>
									<v-spacer></v-spacer>
									<v-btn flat v-on:click.native="searchModal = false" class="primary--text">Search!</v-btn>
								</v-card-row>
							</v-card>
						</v-modal>
					</div>
				</div>
			</v-toolbar-logo>
		</v-toolbar>
		<main>
			<v-sidebar v-model="sidebar" height="100vh" style="width: 260px" drawer class="sidebar">
				<div class="sidebar-title-container">
					<nuxt-link to="/">
						<img src="~static/images/sidebar-icon.png" height="70"/>
					</nuxt-link>

					<h1 class="title" v-bind:style="sidebarTitle">
						<strong>かわニメ - </strong>
						<a href="https://kawani.me">v0.3.0</a>
					</h1>

					<div class="links">
						<a href="https://github.com/Kylart/KawAnime" class="link">
							<img src="~static/images/github-icon.png" height="25"/>
						</a>
						<a href="#" class="link">
							<img src="~static/images/twitter-icon.png" height="25"/>
						</a>
						<a href="#" class="link">
							<img src="~static/images/fb-icon.png" height="25"/>
						</a>
						<a href="#" class="link">
							<img src="~static/images/mail-icon.png" height="25"/>
						</a>
					</div>
				</div>
				<v-list dense>
					<template v-for="item in itemGroup">
						<v-list-group v-if="item.items">
							<v-list-item slot="item">
								<v-list-tile ripple>
									<v-list-tile-title v-text="item.title"></v-list-tile-title>
									<v-list-tile-action>
										<v-icon>keyboard_arrow_down</v-icon>
									</v-list-tile-action>
								</v-list-tile>
							</v-list-item>
							<v-list-item v-for="subItem in item.items" :key="subItem.href">
								<v-list-tile ripple router nuxt v-bind:href="subItem.href">
									<v-list-tile-title v-text="subItem.title"></v-list-tile-title>
								</v-list-tile>
							</v-list-item>
						</v-list-group>
						<v-subheader v-else-if="item.header" v-text="item.header"></v-subheader>
						<v-divider v-else-if="item.divider" light/>
						<v-list-item v-else>
							<v-list-tile ripple>
								<v-list-tile-title v-text="item.title"/>
							</v-list-tile>
						</v-list-item>
					</template>
				</v-list>
			</v-sidebar>
			<v-content class="content secondary page">
				<nuxt/>
			</v-content>
		</main>

		<v-footer class="grey darken-4">
			<div class="text-xs-right">© 2016 - {{ (new Date()).getYear() + 1900 }} Kylart</div>
		</v-footer>
	</v-app>
</template>

<script>
  export default {
    data () {
      return {
        searchModal: false,
        configModal: false,
        sidebar: false,
        itemGroup: [
          {header: 'Core'},
          {
            title: 'Downloading',
            items: [
              {
                title: 'Downloader',
                href: '/downloader'
              },
              {
                title: 'Latest releases',
                href: '/'
              }
            ]
          },
          {
            title: 'News',
            items: [
              {
                title: 'Seasons',
                href: '/seasons'
              },
              {
                title: 'News',
                href: '/news'
              }
            ]
          },
          {divider: true},
          {header: 'Local'},
          {
            title: 'Anime related',
            items: [
              {
                title: 'Animes',
                href: '/localPage'
              },
              {
                title: 'Watch list',
                href: '/watchList'
              }
            ]
          },
          {
            title: 'Torrenting',
            items: [
              {title: 'Current downloads'},
              {title: 'Sourcing'},
              {title: 'Create torrents'}
            ]
          }
        ],
        sidebarTitle: {
          color: 'rgba(255, 255, 255, 0.8)'
        },
        configModalStyle: {
          minHeight: '90%'
        },
        fansubChoices: [
          'HorribleSubs',
          'exampleSubs'
        ],
        soundChoices: [
          'None',
          'Nyanpasu'
        ],
        config: {
          fansub: this.$store.state.config.fansub,
          quality: this.$store.state.config.quality,
          sound: this.$store.state.config.sound,
          localPath: this.configDir,
	        inside: this.$store.state.config.inside.toString(),
	        magnets: this.$store.state.config.magnets
        }
      }
    },
    computed: {
      title: function () {
        if (this.sidebar)
          return {
            marginLeft: '210px'
          }
      },
      configDir: function () {
        return this.$store.state.configDir
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
	/* ----------- CONFIG ----------- */
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

	/*noinspection ALL*/
	.with.top-toolbar main > .content
	{
		padding: 0;
	}

	.sidebar
	{
		padding-bottom: 0;
		background-image: url('~static/images/sidebar-background.png');
		background-position: left bottom;
		background-size: 75%;
	}

	.title
	{
		overflow: auto;
		padding-left: 20px;
		font-family: "Hiragino Mincho Pro", serif;
	}

	.title-text
	{
		text-align: left;
		float: left;
	}

	.modals
	{
		float: right;
		padding-right: 15px;
		padding-bottom: 5px;
		font-family: 'Roboto', sans-serif;
	}

	.modals h2
	{
		font-family: 'Roboto', sans-serif;
		line-height: 24px;
		color: rgba(255, 255, 255, 0.8);
	}

	.sidebar-title-container
	{
		margin-top: 20px;
		height: 150px;
		text-align: center;
		color: rgba(255, 255, 255, 0.8);
	}

	.sidebar-title-container h1
	{
		margin: 10px;
		padding: 0;
	}

	.sidebar-title-container a
	{
		color: rgba(255, 255, 255, 0.8);
		font-family: Roboto, serif;
	}

	.links
	{
		margin-top: 20px;
	}

	.link
	{
		margin: 0 3% 0 3%;
	}

	.modal-container .title
	{
		line-height: 25px;
	}
</style>
