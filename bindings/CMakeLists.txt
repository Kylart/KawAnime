cmake_minimum_required(VERSION 3.12.0 FATAL_ERROR)

# Name of the project (will be the name of the plugin)
project(kawabinds)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_BUILD_TYPE Release)

# Windows things...
if (MSVC_VERSION GREATER_EQUAL "1900")
  message("MSVC 19 detected (${MSVC_VERSION}), setting flags")
  include(CheckCXXCompilerFlag)
  CHECK_CXX_COMPILER_FLAG("/std:c++14" _cpp_14_flag_supported)
  if (_cpp_14_flag_supported)
    add_compile_options("/std:c++14")
  endif()
endif()

# LibGCrypt
list(APPEND CMAKE_MODULE_PATH ${CMAKE_CURRENT_SOURCE_DIR}/lib/libtorrent/cmake/Modules)

# Essential include files to build a node addon,
# you should add this line in every CMake.js based project.
include_directories(${CMAKE_JS_INC})

# Build a shared library named after the project from the files in `src/`
file(
  GLOB
  SOURCE_FILES
  "src/*.cc" "src/*.h"
  "src/torrent/*.cc" "src/torrent/*.h"
  "src/name_parser/*.cc" "src/name_parser/*.h"

  "lib/anitomy/anitomy/*.cpp" "lib/anitomy/anitomy/*.h"
)
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})

target_include_directories(${PROJECT_NAME} PRIVATE "lib/anitomy")

find_package(Boost)

target_include_directories(${PROJECT_NAME} PRIVATE ${Boost_INCLUDE_DIRS})
target_link_libraries(${PROJECT_NAME} ${Boost_LIBRARIES})

## Libtorrent
find_package(LibtorrentRasterbar 1.2 REQUIRED)

# TODO: Would be great to have libtorrent build with cmake dependancy.
# set(LIBTORRENT_DIR "lib/libtorrent")
# add_subdirectory(${LIBTORRENT_DIR})

find_path(LIBTORRENT_INCLUDE_PATH libtorrent)
find_library(LIBTORRENT_LIB torrent-rasterbar)

target_include_directories(${PROJECT_NAME} PRIVATE ${LIBTORRENT_INCLUDE_PATH})
target_link_libraries(${PROJECT_NAME} ${LIBTORRENT_LIB})

# Include N-API wrappers
execute_process(COMMAND node -p "require('node-addon-api').include"
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  OUTPUT_VARIABLE NODE_ADDON_API_DIR
)
string(REPLACE "\n" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
string(REPLACE "\"" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_ADDON_API_DIR})

# Gives our library file a .node extension without any "lib" prefix
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# Essential include files to build a node addon,
# You should add this line in every CMake.js based project
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC})

# Essential library files to link to a node addon
# You should add this line in every CMake.js based project
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})
