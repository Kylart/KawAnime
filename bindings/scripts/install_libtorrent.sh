export CURRENT_PATH=$(dirname $0)
export LIBTORRENT_PATH="${CURRENT_PATH}/../lib/libtorrent"

export IS_NINJA_INSTALLED=$(command -v ninja >/dev/null 2>&1)

if [[ -z IS_NINJA_INSTALLED ]]
then
  echo "Ninja is not installed. Trying to..."
  $CURRENT_PATH/install_ninja.sh || exit 0
fi

export IS_B2_INSTALLED=$(command -v b2 >/dev/null 2>&1)
export IS_CMAKE_INSTALLED=$(command -v cmake >/dev/null 2>&1)

cd $LIBTORRENT_PATH

if [[ IS_CMAKE_INSTALLED ]]
then
  mkdir build
  cd build

  cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_CXX_STANDARD=14 -G Ninja ..
  ninja
  ninja install

elif [[ IS_B2_INSTALLED ]]
then
  b2
  b2 install
fi
