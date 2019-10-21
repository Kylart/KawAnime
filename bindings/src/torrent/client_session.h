#ifndef LIBTORRENT_NAPI_SESSION
#define LIBTORRENT_NAPI_SESSION

#include <napi.h>

#include <cstdlib>

#include <libtorrent/session_stats.hpp>
#include <libtorrent/session.hpp>

#include <libtorrent/torrent_info.hpp>
#include <libtorrent/torrent_handle.hpp>
#include <libtorrent/torrent_status.hpp>
#include <libtorrent/torrent_flags.hpp>
#include <libtorrent/magnet_uri.hpp>

#include "utils.h"

namespace LtSession {

class Client : public Napi::ObjectWrap<Client> {
  public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    Client(const Napi::CallbackInfo& info);

  private:
    static Napi::FunctionReference constructor;

    lt::session session;
    lt::session_proxy session_proxy;

    Napi::Value Destroy (const Napi::CallbackInfo& info);
    Napi::Value AddTorrent(const Napi::CallbackInfo& info);
    Napi::Value RemoveTorrent (const Napi::CallbackInfo& info);
    Napi::Value PauseTorrent (const Napi::CallbackInfo& info);
    Napi::Value ResumeTorrent (const Napi::CallbackInfo& info);
    Napi::Value GetTorrentsList (const Napi::CallbackInfo& info);
    Napi::Value GetClientInfo (const Napi::CallbackInfo& info);
    Napi::Value HasTorrents (const Napi::CallbackInfo& info);
    Napi::Value IsDestroyed (const Napi::CallbackInfo& info);
};

}

#endif