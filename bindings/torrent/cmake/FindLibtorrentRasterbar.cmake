# Taken from https://github.com/arvidn/libtorrent/blob/RC_1_2/examples/cmake/FindLibtorrentRasterbar.cmake
#
# - Try to find libtorrent-rasterbar
#
# This module tries to locate libtorrent-rasterbar Config.cmake files and uses pkg-config if available
# and the config file could not be found.
# If that does not work, you can pre-set LibtorrentRasterbar_CUSTOM_DEFINITIONS
# for definitions unrelated to Boost's separate compilation (which are already
# decided by the LibtorrentRasterbar_USE_STATIC_LIBS variable).
#
# Once done this will define
#  LibtorrentRasterbar_FOUND - System has libtorrent-rasterbar
#  LibtorrentRasterbar_INCLUDE_DIRS - The libtorrent-rasterbar include directories
#  LibtorrentRasterbar_LIBRARIES - The libraries needed to use libtorrent-rasterbar
#  LibtorrentRasterbar_DEFINITIONS - Compiler switches required for using libtorrent-rasterbar
#  LibtorrentRasterbar_OPENSSL_ENABLED - libtorrent-rasterbar uses and links against OpenSSL
#  LibtorrentRasterbar::torrent-rasterbar imported target will be created

# Let's begin with the config mode

set(_exactKeyword "")
if (${${CMAKE_FIND_PACKAGE_NAME}_FIND_VERSION_EXACT})
	set(_exactKeyword "EXACT")
endif()

find_package(LibtorrentRasterbar ${${CMAKE_FIND_PACKAGE_NAME}_FIND_VERSION} ${_exactKeyword} CONFIG)

if (LibtorrentRasterbar_FOUND)
	if (NOT ${CMAKE_FIND_PACKAGE_NAME}_FIND_QUIETLY)
		message(STATUS "LibtorrentRasterbar package found in ${LibtorrentRasterbar_DIR}")
		message(STATUS "LibtorrentRasterbar version: ${LibtorrentRasterbar_VERSION}")
	endif()
	# Extract target properties into this module variables
	get_target_property(LibtorrentRasterbar_INCLUDE_DIRS LibtorrentRasterbar::torrent-rasterbar INTERFACE_INCLUDE_DIRECTORIES)
	get_target_property(LibtorrentRasterbar_LIBRARIES LibtorrentRasterbar::torrent-rasterbar IMPORTED_LOCATION)
	get_target_property(_iface_link_libs LibtorrentRasterbar::torrent-rasterbar INTERFACE_LINK_LIBRARIES)
	list(APPEND LibtorrentRasterbar_LIBRARIES ${_iface_link_libs})
	get_target_property(LibtorrentRasterbar_DEFINITIONS LibtorrentRasterbar::torrent-rasterbar INTERFACE_COMPILE_DEFINITIONS)
	get_target_property(_iface_compile_options LibtorrentRasterbar::torrent-rasterbar INTERFACE_COMPILE_OPTIONS)
	list(APPEND LibtorrentRasterbar_DEFINITIONS ${_iface_compile_options})
	list(FIND _iface_link_libs "OpenSSL::SSL" _openssl_lib_index)
	if (_openssl_lib_index GREATER -1)
		set(LibtorrentRasterbar_OPENSSL_ENABLED TRUE)
	else()
		set(LibtorrentRasterbar_OPENSSL_ENABLED FALSE)
	endif()
endif()
