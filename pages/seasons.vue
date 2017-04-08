<template>
	<v-container fluid>
		<!--<div>-->
		<!--<h1>Welcome!</h1>-->
		<!--<button v-on:click="refreshSeasons()">Click me!</button>-->
		<!--<nuxt-link to="/about">About page</nuxt-link>-->
		<!--<ul v-if="$store.state.seasons.length">-->
		<!--<li v-for="item in $store.state.seasons">title : {{item.title}}</li>-->
		<!--</ul>-->
		<!--<div v-else>-->
		<!--<p>mal-scraper is on fetching data... please wait..</p>-->
		<!--</div>-->
		<!--</div>-->

		<div class="loading" v-if="!seasons.length">
			<h3>Loading</h3>
		</div>

		<v-container fluid v-else>
			<v-tabs id="tabs" grow>
				<v-tab-item v-bind:href="'#tabs-' + i"
				            slot="activators">
					TV
				</v-tab-item>
				<v-tab-item v-bind:href="'#tabs-' + i"
				            slot="activators">
					ONA
				</v-tab-item>
				<v-tab-item v-bind:href="'#tabs-' + i"
				            slot="activators">
					TV
				</v-tab-item>
				<v-tab-item v-bind:href="'#tabs-' + i"
				            slot="activators">
					TV
				</v-tab-item>
				<v-tab-item v-bind:href="'#tabs-' + i"
				            slot="activators">
					TV
				</v-tab-item>
				<v-tab-content v-bind:id="'tabs-' + i"
				               slot="content">
					<v-card>
						<v-card-text>Hello</v-card-text>
					</v-card>
				</v-tab-content>
			</v-tabs>
		</v-container>
	</v-container>
</template>

<script>
  export default {
    data() {
      return {
        active: ''
      }
    },
    computed: {
      seasons: function () {
        return this.$store.state.seasons
      },
      stats: function () {
        return this.$store.state.seasonsStats
      },
      seasonDisplayer: function () {
        let result = [
          {name: 'TV', items: []},
          {name: 'ONAs', items: []},
          {name: 'OVAs', items: []},
          {name: 'Movies', items: []},
          {name: 'Specials', items: []}
        ]

        this.seasons.forEach((elem) => {
          console.log('Pushing ' + elem)
          switch (elem.type)
          {
            case 'TV':
              result[0].items.push(elem)
              break

            case 'ONA':
              result[1].items.push(elem)
              break

            case 'OVA':
              result[2].items.push(elem)
              break

            case 'Movie':
              result[3].items.push(elem)
              break

            case 'Special':
              result[4].items.push(elem)
              break

            default:
              break
          }
        })

        return result
      }
    },
    methods: {
      refreshSeasons() {
        this.$store.dispatch('refreshSeasons')
      }
    },
    mounted: function () {
      console.log(this.seasonDisplayer)
    }
  }
</script>

<style scoped>
	*
	{
		color: rgba(255, 255, 255, 0.8);
	}

	.container
	{
		width: 100%;
		margin: 0;
		padding: 0;
	}
</style>