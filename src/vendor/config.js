export default {
  anilist: {
    clientId: process.env.VUE_APP_ANILIST_CLIENT_ID
  },
  kitsu: {
    clientId: process.env.VUE_APP_KITSU_CLIENT_ID
  },
  kawanime: {
    url: process.env.VUE_APP_KAWANIME_API_URL,
    secret: process.env.VUE_APP_KAWANIME_SECRET,
    version: process.env.VUE_APP_KAWANIME_VERSION
  }
}
