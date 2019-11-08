<h1 align="center">KawAnime</h1>

<p align="center">
  <a href="http://forthebadge.com/" target="_blank">
    <img src="http://forthebadge.com/images/badges/built-with-love.svg"/>
  </a>
</p>

<p align="center">
  <a href="https://standardjs.com/" target="_blank">
    <img src="https://cdn.rawgit.com/feross/standard/master/badge.svg" />
  </a>
</p>

<p align="center">
  <a href="https://travis-ci.org/Kylart/KawAnime?branch=dev" target="_blank">
    <img src="https://travis-ci.org/Kylart/KawAnime.svg?branch=dev"/>
  </a>
  <a href="https://ci.appveyor.com/project/Kylart/kawanime" target="_blank">
    <img src="https://ci.appveyor.com/api/projects/status/sgvh8294bt0hlo83/branch/dev?svg=true"/>
  </a>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT" target="_blank">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
  </a>
  <a href="https://discord.gg/sdArN2Z" target="_blank">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289da.svg" alt="Chat">
  </a>
</p>

<p align="center"><img width="80%" src="https://imgur.com/OpSfhDn.png"/></p>

# Features
Disclaimer : KawAnime is built for otaku/anime-fans. The software will contain images and sounds sourced from anime. Do not try if you're not prepared.

Use KawAnime to:

* Manage your pirate anime life with a single software.
* Get updated on anime releases as soon as they are subbed (or not).
* Download or _Stream_ your torrents easily (in-app torrent client included!).
* Magnet links for all episodes can be generated through the Downloader.
* Get anime information, news, and seasonal information from your preferred anime information source (Anilist, Kitsu.io, MAL).
* Manage your anime files (watch and delete on click).
* Manage local watch lists as well as those from your preferred provider (Anilist, Kitsu.io, MAL).
* Auto track entry progress on Anilist and Kitsu.io.
* Keep track of what you watched with the History.
* Easily binge watch your local anime or while streaming.

Feel free to check the official website for [a demo of all the available features.](https://kawanime.com/#features)

## About OS
_KawAnime_ is completely cross-platform.

If you have any problems installing for your OS, you can contact me anytime in the `issues` section.

## Installation
Be sure that Npm is installed. You can find how to install npm (node) [here](https://nodejs.org/en/).

You will need to have Boost (version 1.65.0 minimum) installed on your system. You can find Boost [here](https://www.boost.org/users/download/).

```
git clone https://github.com/Kylart/KawAnime
```
```
cd KawAnime/
```
```
npm install
```

## Run in dev

##### Start app
```
npm run dev
```

##### Lint
```
npm run lint
```

#### Testing
To run tests, you have to build a production ready bundle:
```
npm run pack
```

then simply run
```
npm run test
```

## Generating distributable apps
This feature uses [electron-builder](https://github.com/electron-userland/electron-builder).

Find help to use it on your platform
[here](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build).

#### For every OS
```
npm run dist
```

#### For Mac OS only
```
npm run dist:mac
```

#### For Linux OS only
```
npm run dist:linux
```

#### For Windows OS only
```
npm run dist:win
```

Distributable will then be in the `dist` folder.

## Contributing
Any contribution is appreciated.

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request.

## Thanks
KawAnime is developed using the following technologies, many thanks to
* [Electron](https://electron.atom.io)
* [Vue.js](https://vuejs.org)
* [Vuetify](https://vuetifyjs.com)

## License
MIT License

Copyright (c) Kylart