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

#ifndef BINDINGS_TORRENT_SRC_TORRENT_H_
#define BINDINGS_TORRENT_SRC_TORRENT_H_

#include <napi.h>

#include <cstdlib>
#include <string>
#include <memory>
#include <vector>

#include <libtorrent/session_stats.hpp>
#include <libtorrent/session.hpp>

#include <libtorrent/torrent_info.hpp>
#include <libtorrent/torrent_handle.hpp>
#include <libtorrent/torrent_status.hpp>

#include <libtorrent/magnet_uri.hpp>

#include <libtorrent/file.hpp>
#include <libtorrent/file_storage.hpp>

#include "utils.h"

namespace LtTorrent {

class Torrent : public Napi::ObjectWrap<Torrent> {
 public:
  static Napi::Object NewInstance(Napi::Env env, lt::torrent_handle torrent);
  Torrent(const Napi::CallbackInfo &info);

  Napi::Object obj;

 private:
  static Napi::FunctionReference constructor;
  lt::torrent_handle torrent;

  Napi::Value Pause(const Napi::CallbackInfo& info);
  Napi::Value Resume(const Napi::CallbackInfo& info);
  Napi::Value SetLimit(const Napi::CallbackInfo& info);
  Napi::Value GetFiles(const Napi::CallbackInfo& info);
  Napi::Value Info(const Napi::CallbackInfo& info);
};

}  // namespace LtTorrent

#endif  // BINDINGS_TORRENT_SRC_TORRENT_H_
