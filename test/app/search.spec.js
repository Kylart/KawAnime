const { getEpisodesList } = require('mal-scraper')
const axios = require('axios')

const BEST_ANIME = {
  name: 'Sakura Trick',
  id: 20047
}

const SEARCH_INPUT = 'input#info-search-input'

module.exports = function () {
  describe('Search modal', function () {
    before(function (done) {
      this.timeout(30000)
      Promise.all([
        axios.post('https://graphql.anilist.co', {
          query: `query ($name: String) {
            Media(search: $name) {
              title {
                english
                romaji
                userPreferred
                native
              }
              coverImage {
                extraLarge
                large
              }
              format
              averageScore
              source
              description (asHtml: false)
              genres
              stats {
                scoreDistribution {
                  amount
                }
              }
              staff (perPage: 4) {
                edges {
                  node {
                    name {
                      first
                      last
                    }
                    siteUrl
                    image {
                      large
                    }
                  }
                  role
                }
              }
              characters {
                edges {
                  node {
                    name {
                      first
                      last
                    }
                    siteUrl
                    image {
                      large
                    }
                  }
                  voiceActors(language: JAPANESE) {
                    name {
                      first
                      last
                      native
                    }
                    siteUrl
                    image {
                      large
                    }
                  }
                }
              }
            }
          }`,
          variables: { name: BEST_ANIME.name }
        }),

        // Default episode information provider is MyAnimeList
        getEpisodesList(BEST_ANIME)
      ])
        .then(([{ data }, eps]) => {
          this.sakuraTrick = data.data.Media
          this.sakuraTrick.episodes = eps

          done()
        })
        .catch(done)
    })

    it('should open on click', function () {
      return this.app.client
        .$('.toolbar > div > *:nth-child(5)').click()
        .pause(500)
        .$(SEARCH_INPUT).hasFocus().should.eventually.be.true
        .saveScreenshot('test/screenshots/search_modal.png')
    })

    it('should make a research', function () {
      return this.app.client
        .$(SEARCH_INPUT).addValue(BEST_ANIME.name)
        .pause(500)
        .waitUntilTextExists('.v-dialog .container > div:last-child > div:nth-child(1)', BEST_ANIME.name, 7500)
        .saveScreenshot('test/screenshots/search_modal_results.png')
    })

    it('should open the result into the modal and set it fullscreen', function () {
      return this.app.client
        .$('.v-dialog .container > div:last-child > div:nth-child(1) > .entry').click()
        .waitUntil(async () => this.app.client.$('.info-container').isExisting(), 10000)
        .pause(1000)
        .saveScreenshot('test/screenshots/search_modal_info.png')
    })

    it('should eventually show information', function () {
      return this.app.client
        .waitUntilTextExists('.info-container', this.sakuraTrick.title.native)
        .$('.info-container .v-image > div:nth-child(2)').getAttribute('style')
        .should.eventually.include(this.sakuraTrick.coverImage.extraLarge || this.sakuraTrick.coverImage.large)
        .$$('.characters-container > *').should.eventually.have.length(this.sakuraTrick.characters.edges.length)
    })

    it('should go back to results', function () {
      return this.app.client
        .$('.actions-container > button').click()
        .pause(500)
        .waitUntilTextExists('.v-dialog .container > div:last-child > div:nth-child(1)', BEST_ANIME.name, 7500)
    })

    it('should exit on escape key press', function () {
      return this.app.client
        .$(SEARCH_INPUT).hasFocus().should.eventually.be.true
        .keys([ 'Escape' ]).pause(750)
        .$('.v-dialog').isVisible().should.eventually.be.false
    })
  })
}
