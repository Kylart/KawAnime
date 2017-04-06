<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
	<v-app id="example-3" class="grey lighten-1" top-toolbar left-sidebar>
		<v-toolbar>
			<v-toolbar-side-icon class="" @click.native.stop="sidebar = !sidebar"/>
			<v-toolbar-logo class="text-xs-right title" v-bind:style="title">かわニメ</v-toolbar-logo>
		</v-toolbar>
		<main>
			<v-sidebar v-model="sidebar" height="auto" style="width: 280px" drawer class="sidebar">
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
			<div class="text-xs-right">© 2017 Kylart</div>
		</v-footer>
	</v-app>
</template>

<script>
  export default {
    data () {
      return {
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
        }
      }
    },
    computed: {
      title: function () {
        if (this.sidebar)
          return {
            marginLeft: '230px'
          }
      }
    }
  }
</script>

<style scoped>
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
		padding-left: 20px;
		font-family: "Hiragino Mincho Pro", serif;
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
</style>
