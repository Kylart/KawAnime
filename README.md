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
  <a href="https://travis-ci.com/Kylart/KawAnime?branch=dev" target="_blank">
    <img src="https://app.travis-ci.com/Kylart/KawAnime.svg?branch=dev"/>
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

<p align="center"><img width="80%" src="https://i.imgur.com/23jgsq5.png"/></p>

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

## Building

### Dependencies

* Be sure that Npm is installed. You can find how to install npm (node) [here](https://nodejs.org/en/).

* You will need CMake (v3.12 minimum) to build native dependencies as this project using cmake-js; you can download and install CMake [here](https://cmake.org/download/). Also, you will need a C++ compiler to build native libraries (Clang, GCC and MSVC are all supported).

* You will need to have Boost (version 1.65.0 minimum) installed on your system. You can find Boost [here](https://www.boost.org/users/download/).Only the `system` library is required by this project.

* This app uses MPV via [mpv.js](https://github.com/Kagami/mpv.js) but you will need libmpv on your machine. You can find instructions on how to install libmpv [here](https://github.com/Kagami/mpv.js#get-libmpv).

```bash
git clone --recursive https://github.com/Kylart/KawAnime
```

```bash
cd KawAnime/
```

```bash
npm install
```

If `postinstall` script fails, it probably means that you lack one of the requirements listed above. You should install them and retry.

## Run in dev

##### Build native bindings

```
npm run build:bindings
```

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

#### For Mac OS

```
npm run collect:dylibs
npm run dist:mac
```

#### For Linux OS

On Linux you'll need to install dependency packages first. Either from source or using your package manager (e.g. `apt` on Debian-like systems).

Here's the list of the dependencies:
* (Required) A C/C++ Compiler, `gcc` is recommended.
* (Required) [Boost](https://www.boost.org/) > 1.65.0 -- Used by Libtorrent, only the `system` component is required. You can install `libboost-dev` or `libboost-all-dev` using `apt`
* (Optional) [LibtorrentRasterbar](https://www.libtorrent.org/) > 1.2 -- If you don't have any valid version installed, the build command will install it for you.
* (Optional) [MPV](https://mpv.io/installation/) -- Only if you want to use the internal player. You can install `libmpv1` and `libavformat-dev` using `apt`

Once all those are installed, you can run the following commands. This will generate a `.snap` and a `.AppImage` in the `dist` folder that you can use. Alternatively you can
use the `kawanime` executable in the `dist/linux-unpacked` folder.

```
npm run postinstall
npm run dist:linux
```

#### For Windows OS

```
npm run dist:win

# Or, to have a portable version. This will give you a `KawAnime.exe`
# file that you can move around, e.g. on a USB key
npm run dist:portable
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
* [Libtorrent](https://libtorrent.org)
* [Anitomy](https://github.com/erengy/anitomy)
* [Mpv.js](https://github.com/Kagami/mpv.js/)
* [TorrentStream](https://github.com/mafintosh/torrent-stream)

## License

MIT License

Copyright (c) Kylart
