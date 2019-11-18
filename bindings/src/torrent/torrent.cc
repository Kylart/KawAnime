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

#include "torrent.h"

namespace LtTorrent {

lt::torrent_handle _torrent;

Napi::FunctionReference Torrent::constructor;

Torrent::Torrent(const Napi::CallbackInfo &info) : Napi::ObjectWrap<Torrent>(info) {
  Napi::Env env = info.Env();
  Napi::HandleScope scope(env);

  this->torrent = _torrent;
}

Napi::Object Torrent::NewInstance(Napi::Env env, lt::torrent_handle torrent) {
  Napi::EscapableHandleScope scope(env);

  if (constructor == nullptr) {
    Napi::Function func = DefineClass(
        env,
        "Torrent",
        {InstanceMethod("info", &Torrent::Info),
         InstanceMethod("setLimit", &Torrent::SetLimit),
         InstanceMethod("pause", &Torrent::Pause),
         InstanceMethod("resume", &Torrent::Resume)});

    constructor = Napi::Persistent(func);
    constructor.SuppressDestruct();
  }

  _torrent = torrent;
  Napi::Object obj = constructor.New({});

  return scope.Escape(napi_value(obj)).ToObject();
}

Napi::Value Torrent::Pause(const Napi::CallbackInfo& info) {
  this->torrent.pause();

  return Napi::Boolean::New(info.Env(), true);
}

Napi::Value Torrent::Resume(const Napi::CallbackInfo& info) {
  this->torrent.resume();

  return Napi::Boolean::New(info.Env(), true);
}

Napi::Value Torrent::SetLimit(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  size_t argc = info.Length();
  if (argc < 2 && !info[0].IsNumber()) {
    Napi::TypeError::New(env, "Invalid argument.").ThrowAsJavaScriptException();
    return env.Null();
  }

  int64_t limit = info[0].As<Napi::Number>().Int64Value();
  std::string type = info[1].As<Napi::String>().Utf8Value();
  bool is_upload = type == "upload";

  if (is_upload)
    this->torrent.set_upload_limit(limit);
  else
    this->torrent.set_download_limit(limit);

  return Napi::Boolean::New(env, true);
}

Napi::Value Torrent::GetFiles(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::Array result = Napi::Array::New(env);

  std::vector<libtorrent::open_file_state> files = this->torrent.file_status();
  lt::torrent_status status = this->torrent.status();
  auto torrent_info = status.torrent_file.lock();

  if (!torrent_info->is_valid()) return result;

  unsigned int num_files = torrent_info->num_files();

  for (lt::file_index_t i(0); i != num_files; ++i) {
    Napi::Object entry = Napi::Object::New(env);

    lt::file_storage storage = torrent_info->files();

    entry.Set("size", Napi::Number::New(env, storage.file_size(i)));
    entry.Set("filename", Napi::String::New(env, storage.file_name(i).to_string().c_str()));
    entry.Set("path", Napi::String::New(env, storage.file_path(i).c_str()));

    result.Set(static_cast<int>(i), entry);
  }

  return result;
}

Napi::Value Torrent::Info(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::Object result = Napi::Object::New(env);

  lt::torrent_status status = this->torrent.status();

  static char const *state_str[] = {
      "Checking (q)",
      "Checking",
      "Metadata",
      "Downloading",
      "Finished",
      "Seeding",
      "Allocating",
      "Checking (r)"};

  result.Set("id", this->torrent.id());
  result.Set("downloadLimit", this->torrent.download_limit());
  result.Set("uploadLimit", this->torrent.upload_limit());

  result.Set("name", status.name.c_str());
  result.Set("progress", status.progress_ppm / 1000000.0);
  result.Set("done", status.is_finished);
  result.Set("totalSize", status.total);
  result.Set("magnetURI", lt::make_magnet_uri(this->torrent));
  result.Set("downloaded", status.total_done);
  result.Set("state", state_str[status.state]);
  result.Set("uploadRate", status.upload_rate);
  result.Set("downloadRate", status.download_rate);
  result.Set("path", status.save_path);
  result.Set("numPeers", status.num_peers);
  result.Set("isAutoManaged", static_cast<bool>(status.flags & lt::torrent_flags::auto_managed));
  result.Set("isPaused", static_cast<bool>(status.flags & lt::torrent_flags::paused));
  result.Set("savePath", status.save_path);
  result.Set(
      "timeRemaining",
      status.download_rate != 0 ? ((status.total - status.total_done) / status.download_rate) * 1000.0 : INT_MAX);

  result.Set("files", this->GetFiles(info));

  return result;
}

}  // namespace LtTorrent
