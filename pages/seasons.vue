<template xmlns:v-on="http://www.w3.org/1999/xhtml">
	<div>
		<h1>Welcome!</h1>
		<button v-on:click="refreshSeasons()">Click me!</button>
		<nuxt-link to="/about">About page</nuxt-link>
		<ul v-if="$store.state.seasons.length">
			<li v-for="item in $store.state.seasons">title : {{item.title}}</li>
		</ul>
		<div v-else>
			<p>mal-scraper is on fetching data... please wait..</p>
		</div>
	</div>

	<!--<v-tabs id="mobile-tabs-1"-->
	        <!--grow-->
	        <!--scroll-bars-->
	        <!--v-bind:model="active">-->
		<!--<v-tab-item v-for="i in 5"-->
		            <!--v-bind:href="'#mobile-tabs-1-' + i"-->
		            <!--ripple :key="i"-->
		            <!--slot="activators">-->
			<!--{{ seasons[i].name }}-->
		<!--</v-tab-item>-->
		<!--<v-tab-content v-for="i in 3"-->
		               <!--v-bind:id="'mobile-tabs-1-' + i"-->
		               <!--slot="content"-->
		               <!--:key="i">-->
			<!--<v-card>-->
				<!--<v-card-text>Hello</v-card-text>-->
			<!--</v-card>-->
		<!--</v-tab-content>-->
	<!--</v-tabs>-->
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {
      refreshSeasons() {
        this.$store.dispatch('refreshSeasons')
      }
    }
  }
</script>

<style scoped>
	*
	{
		color: rgba(255, 255, 255, 0.8);
	}
</style>