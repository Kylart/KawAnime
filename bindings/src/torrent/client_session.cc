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

#include "client_session.h"

namespace LtSession {

Napi::FunctionReference Client::constructor;

Napi::Object Client::Init(Napi::Env env, Napi::Object exports) {
  Napi::HandleScope scope(env);

  Napi::Function func = DefineClass(
    env,
    "Client",
    {
      InstanceMethod("destroy", &Client::Destroy),
      InstanceMethod("addTorrent", &Client::AddTorrent),
      InstanceMethod("removeTorrent", &Client::RemoveTorrent),
      InstanceMethod("pauseTorrent", &Client::PauseTorrent),
      InstanceMethod("resumeTorrent", &Client::ResumeTorrent),
      InstanceMethod("getTorrents", &Client::GetTorrentsList),
      InstanceMethod("getClientInfo", &Client::GetClientInfo),
      InstanceMethod("hasTorrents", &Client::HasTorrents),
      InstanceMethod("isDestroyed", &Client::IsDestroyed)
    });

  constructor = Napi::Persistent(func);
  constructor.SuppressDestruct();

  exports.Set("Client", func);
  return exports;
}

Client::Client(const Napi::CallbackInfo& info) : Napi::ObjectWrap<Client>(info) {
  Napi::Env env = info.Env();
  Napi::HandleScope scope(env);
}

Napi::Value Client::Destroy(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  this->session_proxy = this->session.abort();
  this->session.~session();
  this->session_proxy.~session_proxy();

  return Napi::Boolean::New(env, true);
}

Napi::Value Client::GetTorrentsList(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::Array result = Napi::Array::New(env);
  std::uint32_t index = 0;

  if (!this->session.is_valid()) {
    Napi::Error::New(env, "Client is destroyed.").ThrowAsJavaScriptException();
    return env.Null();
  }

  std::vector<lt::torrent_handle> torrents = this->session.get_torrents();

  for (auto const& torrent : torrents) {
    Napi::Object entry = LtUtils::formatTorrentInfo(env, torrent);

    result.Set(index, entry);
    ++index;
  }

  result.Set("length", torrents.size());

  return result;
}

Napi::Value Client::AddTorrent(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  int argc = info.Length();
  if (argc < 2 && !info[0].IsString() && !info[1].IsString()) {
    Napi::TypeError::New(env, "Not enough arguments provided.").ThrowAsJavaScriptException();
    return env.Null();
  }

  std::string save_path = info[0].As<Napi::String>().Utf8Value();
  std::string torrent = info[1].As<Napi::String>().Utf8Value();

  lt::add_torrent_params params;
  lt::error_code ec;

  params.save_path = save_path;

  if (torrent.substr(0, 8) == "magnet:?") {
    lt::parse_magnet_uri(torrent, params, ec);
  } else {
    params.ti = std::make_shared<lt::torrent_info>(torrent);
  }

  if (ec.failed()) {
    Napi::Error::New(env, "Invalid magnet link.").ThrowAsJavaScriptException();
    return env.Null();
  }

  lt::torrent_handle added_torrent = this->session.add_torrent(params);

  return Napi::Number::New(env, added_torrent.id());
}

Napi::Value Client::RemoveTorrent(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  int argc = info.Length();
  if (argc < 1 && !info[0].IsNumber()) {
    Napi::TypeError::New(env, "Not enough arguments provided.").ThrowAsJavaScriptException();
    return env.Null();
  }

  std::uint32_t to_find_id = info[0].As<Napi::Number>().Int32Value();
  lt::torrent_handle torrent = LtUtils::findTorrent(&this->session, to_find_id);

  if (torrent.is_valid()) {
    this->session.remove_torrent(torrent);

    return Napi::Boolean::New(env, true);
  }

  return env.Null();
}

Napi::Value Client::PauseTorrent(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  int argc = info.Length();
  if (argc < 1 && !info[0].IsNumber()) {
    Napi::TypeError::New(env, "Not enough arguments provided.").ThrowAsJavaScriptException();
    return env.Null();
  }

  std::uint32_t to_find_id = info[0].As<Napi::Number>().Int32Value();
  lt::torrent_handle torrent = LtUtils::findTorrent(&this->session, to_find_id);

  if (torrent.is_valid()) {
    torrent.pause();
    return Napi::Boolean::New(env, static_cast<bool>(torrent.flags() & lt::torrent_flags::paused));
  }

  return env.Null();
}

Napi::Value Client::ResumeTorrent(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  int argc = info.Length();
  if (argc < 1 && !info[0].IsNumber()) {
    Napi::TypeError::New(env, "Not enough arguments provided.").ThrowAsJavaScriptException();
    return env.Null();
  }

  std::uint32_t to_find_id = info[0].As<Napi::Number>().Int32Value();
  lt::torrent_handle torrent = LtUtils::findTorrent(&this->session, to_find_id);

  if (torrent.is_valid()) {
    torrent.resume();
    return Napi::Boolean::New(env, !static_cast<bool>(torrent.flags() & lt::torrent_flags::paused));
  }

  return env.Null();
}

Napi::Value Client::GetClientInfo(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::Object result = Napi::Object::New(env);

  std::vector<lt::torrent_handle> torrents = this->session.get_torrents();

  double download_rate = 0.0;
  double upload_rate = 0.0;
  float progress = 0;
  int nb_torrents = torrents.size();

  for (auto const& torrent : torrents) {
    lt::torrent_status status = torrent.status();

    download_rate += status.download_rate;
    upload_rate += status.upload_rate;
    progress += status.progress;
  }

  result.Set("downloadRate", download_rate);
  result.Set("uploadRate", upload_rate);
  result.Set("ratio", upload_rate / download_rate);
  result.Set("peers", lt::find_metric_idx("peer.num_peers_connected"));
  result.Set("progress", progress / static_cast<float>(nb_torrents));
  result.Set("nbTorrents", nb_torrents);

  return result;
}

Napi::Value Client::HasTorrents(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return Napi::Boolean::New(env, this->session.get_torrents().size() != 0);
}

Napi::Value Client::IsDestroyed(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return Napi::Boolean::New(env, !this->session.is_valid());
}

}  // namespace LtSession
