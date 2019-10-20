#ifndef LIBTORRENT_NAPI_UTILS
#define LIBTORRENT_NAPI_UTILS

#include <napi.h>

#include <libtorrent/session.hpp>
#include <libtorrent/torrent_handle.hpp>
#include <libtorrent/torrent_status.hpp>

namespace LtUtils {

Napi::Object formatTorrentInfo (Napi::Env env, lt::torrent_handle torrent);
lt::torrent_handle findTorrent (lt::session * session, std::uint32_t to_find_id);

} // namespace LtUtils

#endif
