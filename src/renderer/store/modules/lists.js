export const feeds = [{
  text: 'nyaa.si',
  value: 'si'
}, {
  text: 'pantsu',
  value: 'pantsu'
}]

export const fansubs = [
  'HorribleSubs',
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

export const subtitlesLanguages = [
  { value: 'en', text: 'English' },
  { value: 'ar', text: 'Arabic' },
  { value: 'ge', text: 'German' },
  { value: 'sp', text: 'Spanish' },
  { value: 'fr', text: 'French' },
  { value: 'it', text: 'Italian' },
  { value: 'po', text: 'Portuguese' },
  { value: 'ru', text: 'Russian' }
]

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

export const listStatus = {
  anilist: [
    { text: 'Watching', value: 'CURRENT' },
    { text: 'Rewatching', value: 'REPEATING' },
    { text: 'Completed', value: 'COMPLETED' },
    { text: 'Paused', value: 'PAUSED' },
    { text: 'Dropped', value: 'DROPPED' },
    { text: 'Plan to watch', value: 'PLANNING' }
  ],
  kitsu: [
    { text: 'Current', value: 'current' },
    { text: 'Completed', value: 'completed' },
    { text: 'On Hold', value: 'on_hold' },
    { text: 'Dropped', value: 'dropped' },
    { text: 'Planned', value: 'planned' }
  ],
  mal: [
    { text: 'Watching', value: 1 },
    { text: 'Completed', value: 2 },
    { text: 'On Hold', value: 3 },
    { text: 'Dropped', value: 4 },
    { text: 'Plan to watch', value: 6 }
  ]
}
