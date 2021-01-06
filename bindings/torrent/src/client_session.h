/**
 * Copyright (c) 2019 Kylart <kylart.dev@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 */ 

#ifndef BINDINGS_TORRENT_SRC_CLIENT_SESSION_H_
#define BINDINGS_TORRENT_SRC_CLIENT_SESSION_H_

#include <napi.h>

#include <cstdlib>
#include <string>
#include <memory>
#include <vector>

#include <boost/version.hpp>

#include <libtorrent/session_stats.hpp>
#include <libtorrent/session.hpp>

#include <libtorrent/torrent_info.hpp>
#include <libtorrent/torrent_handle.hpp>
#include <libtorrent/torrent_status.hpp>
#include <libtorrent/torrent_flags.hpp>
#include <libtorrent/magnet_uri.hpp>

#include "utils.h"
#include "torrent.h"

namespace LtSession {

class Client : public Napi::ObjectWrap<Client> {
 public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports);
  Client(const Napi::CallbackInfo& info);

 private:
  static Napi::FunctionReference constructor;

  lt::session session;
  lt::session_proxy session_proxy;

  Napi::Value AddTorrent(const Napi::CallbackInfo& info);
  Napi::Value RemoveTorrent(const Napi::CallbackInfo& info);
  Napi::Value GetTorrents(const Napi::CallbackInfo &info);
  Napi::Value GetTorrent(const Napi::CallbackInfo &info);
  Napi::Value GetClientInfo(const Napi::CallbackInfo& info);
  Napi::Value HasTorrents(const Napi::CallbackInfo& info);
  Napi::Value IsDestroyed(const Napi::CallbackInfo& info);
};

}  // namespace LtSession

#endif  // BINDINGS_TORRENT_SRC_CLIENT_SESSION_H_
