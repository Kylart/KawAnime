cmake_minimum_required(VERSION 3.12.0 FATAL_ERROR)

# Name of the project (will be the name of the plugin)
project(kawabinds)

set(CMAKE_CXX_STANDARD 17)

# Essential include files to build a node addon,
# you should add this line in every CMake.js based project.
include_directories(${CMAKE_JS_INC})

# Build a shared library named after the project from the files in `src/`
file(
  GLOB
  SOURCE_FILES
  "src/*.cc" "src/*.h"
  "src/torrent/*.cc" "src/torrent/*.h"
)
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})

set(ANITOMY_INCLUDE_DIR "lib/anitomy")
target_include_directories(${PROJECT_NAME} PRIVATE ${ANITOMY_INCLUDE_DIR})

## Libtorrent
# Checking Version
find_package(LibtorrentRasterbar 1.2 REQUIRED)

# Getting installed version of libtorrent
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
