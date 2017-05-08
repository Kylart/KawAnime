# Current situation

As you may know, nyaa.se is down for the moment (and maybe forever). _KawAnime_ was mostly based on nyaa so 
its behaviour had to change a bit.

_KawAnime_ is at the moment __fully based__ on HorribleSubs as for its downloading features. Some other fansub might be 
implemented in the feature to offer more choices.

# _KawAnime_  
[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Disclaimer : This is a software for otaku/anime-fans. Do not try if you're not prepared.

This software allows one to: 
* Be aware of the latest anime release.
* Download an anime (from ep X to ep Y) via Torrent (one would need a torrent client atm). One can also only get a 
list of torrent magnets to paste in a torrent client on a distant server.
* Get information from any anime (those come from myanimelist.net).
* Get anime-related news from MyAnimeList.net.
* Get seasonal releases information.
* Manage watch lists.
* More features are to come.

This is a software developed with Electron framework. It is still in development. 

## About OS
_KawAnime_ is completely cross-platform

Yet, if you find any problem, you can tell me anytime in the `issues` section.

## Installation
Be sure that you have Npm installed. You can find how to install npm (node) [here](https://nodejs.org/en/).
```
git clone https://github.com/Kylart/KawAnime
```
```
cd KawAnime/
```
```
npm install && npm run build
```

## Start
```
npm start
```

## Run in dev
```
npm run dev
```


## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request.

## TODOs
* Implement torrents with WebTorrent module.

## Thanks
Many thanks to 
* [Electron](https://electron.atom.io)
* [Nuxt](https://nuxtjs.org)
* [Vuetify](https://vuetifyjs.com)

## License
MIT License

Copyright (c) Kylart

