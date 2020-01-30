#!/bin/bash

set -ex
# cd "$( dirname "${BASH_SOURCE[0]}" )"

copy_deps() {
  local dep=$1
  local dir=$2
  local depname=$(basename $dep)

  [[ -e $dir/$depname ]] || install -m755 $dep $dir

  otool -L $dep | awk '/\/usr\/local.*\.dylib /{print $1}' | while read lib; do
    local libname=$(basename $lib)
    [[ $depname = $libname ]] && continue
    echo $libname
    install_name_tool -change $lib @loader_path/$libname $dir/$depname
    [[ -e $dir/$libname ]] && continue
    install -m755 $lib $dir
    copy_deps $lib $dir
  done
}

set +x
copy_deps /usr/local/lib/libmpv.1.dylib public/mpv
copy_deps bindings/build/Release/libtorrent-rasterbar.dylib public/kawabinds
copy_deps bindings/build/Release/libtorrent-rasterbar.10.dylib public/kawabinds
copy_deps bindings/build/Release/libtorrent-rasterbar.1.2.3.dylib public/kawabinds

copy_deps bindings/build/Release/kawabinds.node public/kawabinds
set -x

# See <https://github.com/Kagami/boram/issues/11>.
install_name_tool -change /System/Library/Frameworks/CoreImage.framework/Versions/A/CoreImage /System/Library/Frameworks/QuartzCore.framework/Versions/A/Frameworks/CoreImage.framework/Versions/A/CoreImage public/mpv/libavfilter.7.dylib
install_name_tool -change /usr/local/opt/mpv/lib/libmpv.1.dylib '@loader_path/libmpv.1.dylib' ./public/mpv/mpvjs.node

# libtorrent-rasterbar.dylib
install_name_tool -change @rpath/libtorrent-rasterbar.10.dylib '@loader_path/libtorrent-rasterbar.10.dylib' ./public/kawabinds/libtorrent-rasterbar.dylib
install_name_tool -change /usr/local/opt/boost/lib/libboost_system.dylib '@loader_path/libboost_system.dylib' ./public/kawabinds/libtorrent-rasterbar.dylib
install_name_tool -change /usr/local/opt/gcc/lib/gcc/9/libstdc++.6.dylib '@loader_path/libstdc++.6.dylib' ./public/kawabinds/libtorrent-rasterbar.dylib

# libtorrent-rasterbar.10.dylib
install_name_tool -change @rpath/libtorrent-rasterbar.10.dylib '@loader_path/libtorrent-rasterbar.10.dylib' ./public/kawabinds/libtorrent-rasterbar.dylib
install_name_tool -change /usr/local/opt/boost/lib/libboost_system.dylib '@loader_path/libboost_system.dylib' ./public/kawabinds/libtorrent-rasterbar.dylib
install_name_tool -change /usr/local/opt/gcc/lib/gcc/9/libstdc++.6.dylib '@loader_path/libstdc++.6.dylib' ./public/kawabinds/libtorrent-rasterbar.dylib

# libtorrent-rasterbar.1.2.3.dylib
install_name_tool -change @rpath/libtorrent-rasterbar.10.dylib '@loader_path/libtorrent-rasterbar.10.dylib' ./public/kawabinds/libtorrent-rasterbar.dylib
install_name_tool -change /usr/local/opt/boost/lib/libboost_system.dylib '@loader_path/libboost_system.dylib' ./public/kawabinds/libtorrent-rasterbar.dylib
install_name_tool -change /usr/local/opt/gcc/lib/gcc/9/libstdc++.6.dylib '@loader_path/libstdc++.6.dylib' ./public/kawabinds/libtorrent-rasterbar.dylib

# kawabinds.node
install_name_tool -change @rpath/kawabinds.node '@loader_path/kawabinds.node' ./public/kawabinds/kawabinds.node
install_name_tool -change @rpath/libtorrent-rasterbar.10.dylib '@loader_path/libtorrent-rasterbar.10.dylib' ./public/kawabinds/kawabinds.node
install_name_tool -change /usr/local/opt/boost/lib/libboost_system.dylib '@loader_path/libstdc++.6.dylib' ./public/kawabinds/kawabinds.node
install_name_tool -change /usr/local/opt/gcc/lib/gcc/9/libstdc++.6.dylib '@loader_path/libboost_system.dylib' ./public/kawabinds/kawabinds.node
