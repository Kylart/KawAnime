/**
 * Created by Kylart on 14/03/2017.
 */

const self = this

const renderer = require('./renderer.js')

// Vue object to open the other pages
new Vue({
  el: '.mdl-navigation',
  methods: {
    getDownloader: function () {
      renderer.shutAllPages()

      renderer.downloader.downloader.show = true

      renderer.lastPage = "downloader"

      renderer.setDownloaderBackground()
    },
    getMainPage: function () {
      renderer.shutAllPages()

      renderer.releases.releases.show = true

      renderer.lastPage = "releases"

      renderer.disableDownloaderBackground()
    },
    getLocalPage: function () {
      renderer.shutAllPages()

      renderer.localPage.localPage.show = true

      renderer.lastPage = "local"

      renderer.disableDownloaderBackground()
    },
    getNewsPage: function () {

      renderer.shutAllPages()

      renderer.news.news.show = true

      renderer.lastPage = "news"

      renderer.disableDownloaderBackground()
    },
    getSeasonPage: function () {
      renderer.shutAllPages()

      renderer.season.season.show = true

      renderer.lastPage = "seasonInfo"

      renderer.disableDownloaderBackground()
    },
    getWatchListPage: function () {
      renderer.shutAllPages()

      renderer.watchList.watchList.show = true

      renderer.lastPage = "watchList"

      renderer.disableDownloaderBackground()
    }
  }
})