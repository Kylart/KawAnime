<template xmlns:v-tooltip="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
	<v-container fluid class="container">
		<div v-if="$store.state.releases.length">
			<v-row style="margin: 0 1% 0 1%;">
				<template v-for="item in $store.state.releases">
					<v-col xs12="xs12" sm12="sm12" md6="md6" lg4="lg4" xl4="xl4" class="elem">
						<v-card class="elem-content">
							<v-card-text class="elem-card">
								<v-container fluid style="padding: 0;">
									<v-row>
										<v-col class="elem-title" xs10="xs10" v-tooltip:top="{ html: item.name }">
											<h6>{{ item.name }}</h6>
										</v-col>
										<v-col v-tooltip:top="{ html: 'Episode ' + item.ep }" class="elem-ep text-xs-right" xs2="xs2">
											<h6>Ep {{ item.ep }}</h6>
										</v-col>
										<v-col class="elem-image" sm5="sm5" xs4="xs4">
											<img v-bind:src="item.picture" height="200" class="picture"/>
										</v-col>
										<v-col sm7="sm7" xs8="xs8">
											<div class="elem-text-links">
												<div class="synopsis">
													<p>{{ item.synopsis }}</p>
												</div>
												<div class="links">
													<a :href="item.magnetLink" class="download-button">
														<v-btn dark flat class="btn--light-flat-pressed">
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
																	<v-list-tile-title>Download all episodes</v-list-tile-title>
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
		<div v-else>
			Loading...
		</div>
		<div class="text-xs-center">
			<v-modal v-model="modal">
				<v-card>
					<v-card-text>
						<h2 class="title">{{ modalTitle }}</h2>
					</v-card-text>
					<v-card-text class="subheading grey--text">
						{{ modalText }}
					</v-card-text>
					<v-card-row actions>
						<v-spacer></v-spacer>
						<v-btn flat v-on:click.native="modal = false" class="primary--text">Thanks!</v-btn>
					</v-card-row>
				</v-card>
			</v-modal>
		</div>
	</v-container>
</template>

<script>
  export default {
    data () {
      return {
        modal: false,
	      modalTitle: '',
	      modalText: ''
      }
    },
	  methods: {
      openModal(title, text) {
        console.log('Opening modal')

        this.modalTitle = title
	      this.modalText = text

	      this.modal = true
      }
	  }
  }
</script>

<style scoped>
	.container
	{
		padding-top: 15px;
	}

	.elem
	{
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 10px;
	}

	.elem-content
	{
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
		background-color: rgb(60, 60, 60);
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
		max-width: 160px;
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
		right: 5px;
		display: flex;
	}

	.download-button
	{
		text-decoration: none;
	}
</style>
