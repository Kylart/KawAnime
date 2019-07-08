const { getEpisodesList } = require('mal-scraper')
const axios = require('axios')

const BEST_ANIME = {
  name: 'Sakura Trick',
  id: 20047
}

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
        .$('nav.toolbar > div > div:nth-child(4)').click()
        .pause(500)
        .$('input').getAttribute('aria-label').should.eventually.equal('Search')
        .$('input').hasFocus().should.eventually.be.true
        .saveScreenshot('test/screenshots/search_modal.png')
    })

    it('should make a research', function () {
      return this.app.client
        .$('input').addValue(BEST_ANIME.name)
        .pause(500)
        .waitUntilTextExists('.v-dialog .container > div:last-child > div:nth-child(1)', BEST_ANIME.name, 7500)
        .saveScreenshot('test/screenshots/search_modal_results.png')
    })

    it('should open the result into the modal and set it fullscreen', function () {
      return this.app.client
        .$('.v-dialog .container > div:last-child > div:nth-child(1)').click()
        .waitUntil(async () => this.app.client.$('.info-container').isExisting(), 10000)
        .pause(1000)
        .saveScreenshot('test/screenshots/search_modal_info.png')
    })

    it('should eventually have all the needed information', function () {
      return this.app.client
        .waitUntilTextExists('.info-container', this.sakuraTrick.title.native)
        .getText('.score').should.eventually.equal(`${this.sakuraTrick.averageScore} / 100`)
        .getText('.users').should.eventually.equal(this.sakuraTrick.stats.scoreDistribution.reduce((acc, { amount }) => (acc + amount), 0) + ' votes')
        .$('.v-image > div:nth-child(2)').getAttribute('style')
        .should.eventually.include(this.sakuraTrick.coverImage.extraLarge || this.sakuraTrick.coverImage.large)
        .$$('.characters-container > *').should.eventually.have.length(this.sakuraTrick.characters.edges.length + 1)
        .$$('.staff-container > *').should.eventually.have.length(this.sakuraTrick.staff.edges.length)
    })

    it('should eventually have all the episodes', function () {
      return this.app.client
        .waitUntil(async () => this.app.client.isVisible('.episodes-container'), 15000)
        .$$('.episodes-container > div > div').should.eventually.have.length(this.sakuraTrick.episodes.length)
        .$('.episodes-container > div > div:nth-child(1)')
        .getText().should.eventually.include(this.sakuraTrick.episodes.slice(-1)[0].title)
        .$(`.episodes-container > div > div:nth-child(${this.sakuraTrick.episodes.length})`)
        .getText().should.eventually.include(this.sakuraTrick.episodes[0].title)
    })

    it('should go back to results', function () {
      return this.app.client
        .$('.info-container > button').click()
        .pause(500)
        .waitUntilTextExists('.v-dialog .container > div:last-child > div:nth-child(1)', BEST_ANIME.name, 7500)
    })

    it('should exit on escape key press', function () {
      return this.app.client
        .$('input').hasFocus().should.eventually.be.true
        .keys([ 'Escape' ]).pause(750)
        .$('input[aria-label="Search"]').isVisible().should.eventually.be.false
        .$('.v-dialog').isVisible().should.eventually.be.false
    })
  })
}
