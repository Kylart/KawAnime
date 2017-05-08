<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
	<v-app id="app"
	       class="grey lighten-1"
	       top-toolbar left-sidebar>
		<v-toolbar class="dragable">
			<v-toolbar-side-icon class="non-dragable" @click.native.stop="sidebar = !sidebar"/>
			<v-toolbar-logo class="text-xs-right title" v-bind:style="title">
				<div style="width: 100%;">
					<div class="title-text">かわニメ</div>
					<settings></settings>

					<div class="modals text-xs-center">
						<v-dialog width="450" v-model="searchModal">
							<v-btn icon slot="activator">
								<v-icon>search</v-icon>
							</v-btn>
							<v-card class="secondary">
								<v-card-text>
									<h2 class="title">Which anime are you looking for?</h2>
								</v-card-text>
								<v-divider/>
								<v-card-text class="subheading grey--text">
									<v-row>
										<v-col xs2><!-- Dummy --></v-col>
										<v-col xs8>
											<v-text-field name="search-input" dark
											              v-model="searchInput"
											              label="Anime name">
											</v-text-field>
										</v-col>
										<v-col xs2><!-- Dummy --></v-col>
									</v-row>

								</v-card-text>
								<v-card-row actions style="padding: 0 20px 20px 0">
									<v-spacer></v-spacer>
									<v-btn dark primary
									       style="width: 100px"
									       v-on:click.native="searchModal = false">
										Search!
									</v-btn>
								</v-card-row>
							</v-card>
						</v-dialog>

						<v-btn icon
						       class="open-in-browser"
						       v-tooltip:left="{ html: 'Open KawAnime in your browser' }"
						       @click.native="$store.dispatch('openInBrowser')">
							<v-icon>open_in_new</v-icon>
						</v-btn>
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
						<a href="#">v0.4.0</a>
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
				<!-- Displayed if an error occurred -->
				<v-snackbar
								:timeout="5000"
								:top="true"
								:bottom="false"
								:right="false"
								:left="false"
								v-model="$store.state.errorSnackbar.show"
				>
					{{ $store.state.errorSnackbar.text }}
					<v-btn flat class="pink--text" @click.native="$store.state.errorSnackbar.show = false">Close</v-btn>
				</v-snackbar>
			</v-content>
		</main>

		<v-footer class="grey darken-4">
			<div class="text-xs-right">© 2016 - {{ (new Date()).getYear() + 1900 }} Kylart</div>
		</v-footer>
	</v-app>
</template>

<script>
  import Settings from '~components/settings.vue'

  export default {
    data () {
      return {
        searchModal: false,
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
//		        Too soon...
//          {
//            title: 'Torrenting',
//            items: [
//              {title: 'Current downloads'},
//              {title: 'Sourcing'},
//              {title: 'Create torrents'}
//            ]
//          }
        ],
        sidebarTitle: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      }
    },
    components: {
      Settings
    },
    computed: {
      title: function () {
        if (this.sidebar)
          return {
            marginLeft: '210px'
          }
      },
      searchInput: function () {
        return this.$store.state.searchInput
      }
    }
  }
</script>

<style scoped>
	/*noinspection ALL*/
	.with.top-toolbar main > .content
	{
		padding: 0;
	}

	/*noinspection CssUnusedSymbol*/
	.sidebar .list--group__container .list__tile--active .list__tile__title
	{
		color: #ff9800;
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

	.open-in-browser
	{
		margin-top: 6px !important;
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
