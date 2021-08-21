export const feeds = [{
  text: 'nyaa.si',
  value: 'si'
}, {
  text: 'pantsu',
  value: 'pantsu'
}]

export const fansubs = [
  'SubsPlease',
  'Erai-raws',
  'PuyaSubs!',
  'Fuyu',
  'DurandalSubs',
  'DefinitelyNotMe'
]

export const sounds = [
  'Nyanpasu',
  'Nico Nico Nii',
  'Cute Baka',
  'Poi',
  'None'
]

export const qualities = [
  '360p',
  '480p',
  '720p',
  '1080p'
]

export const subtitlesLanguages = {
  eng: 'English',
  ara: 'Arabic',
  ger: 'German',
  spa: 'Spanish',
  fre: 'French',
  ita: 'Italian',
  por: 'Portuguese',
  rus: 'Russian',
  jpn: 'Japanese',
  chn: 'Chinese',
  kor: 'Korean'
}

export const providers = [
  { value: 'mal', text: 'MyAnimeList.net' },
  { value: 'anilist', text: 'Anilist' },
  // { value: 'anidb', text: 'AniDB' },
  { value: 'kitsu', text: 'Kitsu.io' }
]

export const providersRequiredProperties = {
  mal: [
    { text: 'Username', value: 'username' }
    // { text: 'Password', value: 'password' }
  ],
  kitsu: [
    { text: 'Username', value: 'username' },
    { text: 'Email', value: 'email' },
    { text: 'Password', value: 'password' }
  ],
  anilist: [
    { text: 'Username', value: 'username' }
  ]
}

export const sections = [
  { name: 'Information Providers', value: 0, icon: 'search' },
  { name: 'Feed', value: 1, icon: 'access_time' },
  { name: 'Torrent', value: 2, icon: 'file_download' },
  { name: 'Local', value: 3, icon: 'folder_open' },
  { name: 'Accounts', value: 4, icon: 'supervisor_account' },
  { name: 'Video', value: 5, icon: 'play_circle_outline' },
  { name: 'Notifications', value: 6, icon: 'add_alert' },
  { name: 'System', value: 7, icon: 'build' }
]
