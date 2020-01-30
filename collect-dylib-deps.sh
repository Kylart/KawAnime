#!/bin/bash

set -ex
# cd "$( dirname "${BASH_SOURCE[0]}" )"

copy_deps() {
  local dep=$1
  local dir=$2
  local depname=$(basename $dep)

  [[ -e $dir/$depname ]] || install -m755 $dep $dir

  otool -L $dep | awk '/@rpath\/.*\.dylib /{print $1}' | while read lib; do
    local libname=$(basename $lib)
    [[ $depname = $libname ]] && continue
    echo $libname
    install_name_tool -change $lib @loader_path/$libname $dir/$depname
    [[ -e $dir/$libname ]] && continue
    install -m755 /usr/local/lib/$libname $dir
    copy_deps $lib $dir
  done
}

if [[ $OSTYPE =~ darwin ]]
then
  echo "[KawAnime] Collecting dylibs"

  set +x
  copy_deps /usr/local/lib/libmpv.1.dylib public/mpv
  copy_deps bindings/build/Release/libtorrent-rasterbar.10.dylib public
  set -x

  # See <https://github.com/Kagami/boram/issues/11>.
  install_name_tool -change /System/Library/Frameworks/CoreImage.framework/Versions/A/CoreImage /System/Library/Frameworks/QuartzCore.framework/Versions/A/Frameworks/CoreImage.framework/Versions/A/CoreImage public/mpv/libavfilter.7.dylib
  install_name_tool -change /usr/local/opt/mpv/lib/libmpv.1.dylib '@loader_path/libmpv.1.dylib' ./public/mpv/mpvjs.node

  install_name_tool -change "@rpath/libtorrent-rasterbar.10.dylib" "@loader_path/libtorrent-rasterbar.10.dylib" bindings/build/Release/kawabinds.node
  install_name_tool -change "@rpath/libboost_system.dylib" "@loader_path/libboost_system.dylib" bindings/build/Release/kawabinds.node 
fi
