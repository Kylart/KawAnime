project(kawatorrent)

# Essential include files to build a node addon,
# you should add this line in every CMake.js based project.
include_directories(${CMAKE_JS_INC})

# Build a shared library named after the project from the files in `src/`
file(
  GLOB
  SOURCE_FILES
  "src/*.cc" "src/*.h"
)

if (MSVC)
  list(APPEND SOURCE_FILES "../win_delay_load_hook.cc")
endif (MSVC)

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})

# LibGCrypt
list(APPEND CMAKE_MODULE_PATH lib/libtorrent/cmake/Modules)

# Libtorrent
find_package(LibtorrentRasterbar 1.2)

if (LibtorrentRasterbar_FOUND)
  target_include_directories(${PROJECT_NAME} PRIVATE ${libtorrent_INCLUDE_DIRS} ${Boost_INCLUDE_DIRS})
  target_link_libraries(${PROJECT_NAME} PUBLIC LibtorrentRasterbar::torrent-rasterbar ${Boost_LIBRARIES})

  add_definitions(${LibtorrentRasterbar_DEFINITIONS})
else()
  message("Could not find installed version of libtorrent, building one.")

  set(LIBTORRENT_DIR lib/libtorrent)
  add_subdirectory(${LIBTORRENT_DIR})

  target_include_directories(${PROJECT_NAME} PRIVATE ${LIBTORRENT_DIR}/include)
  target_link_libraries(${PROJECT_NAME} torrent-rasterbar)
endif()

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

if(MSVC)
  set_target_properties(${PROJECT_NAME} PROPERTIES LINK_FLAGS "/DELAYLOAD:node.exe" )
endif (MSVC)

# Essential include files to build a node addon,
# You should add this line in every CMake.js based project
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC})

# Essential library files to link to a node addon
# You should add this line in every CMake.js based project
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})
