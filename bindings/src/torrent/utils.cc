#include "utils.h"

namespace LtUtils {

Napi::Object formatTorrentInfo(Napi::Env env, lt::torrent_handle torrent) {
  Napi::Object result = Napi::Object::New(env);

  lt::torrent_status status = torrent.status();

  static char const* state_str[] = {
    "Checking (q)",
    "Checking",
    "Metadata",
    "Downloading",
    "Finished",
    "Seeding",
    "Allocating",
    "Checking (r)"
  };

  result.Set("id", torrent.id());

  result.Set("name", status.name.c_str());
  result.Set("progress", status.progress_ppm / 1000000.0);
  result.Set("done", status.is_finished);
  result.Set("totalSize", status.total);
  result.Set("downloaded", status.total_done);
  result.Set("state", state_str[status.state]);
  result.Set("uploadRate", status.upload_rate);
  result.Set("downloadRate", status.download_rate);
  result.Set("path", status.save_path);
  result.Set("numPeers", status.num_peers);
  result.Set("isAutoManaged", (bool)(status.flags & lt::torrent_flags::auto_managed));
  result.Set("isPaused", (bool)(status.flags & lt::torrent_flags::paused));

  return result;
}

lt::torrent_handle findTorrent (lt::session * session, std::uint32_t to_find_id) {
  std::vector<lt::torrent_handle> torrents = session->get_torrents();

  for (auto const& torrent: torrents) {
    std::uint32_t id = torrent.id();

    if (id == to_find_id) return torrent;
  }

  lt::torrent_handle none;
  return none;
}

} // namespace LtUtils
