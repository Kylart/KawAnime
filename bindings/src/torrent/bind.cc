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

#include "bind.h"

namespace Torrent {

void SetUp(Napi::Env env, Napi::Object exports) {
  Napi::Object torrent = Napi::Object::New(env);

  LtSession::Client::Init(env, torrent);
  torrent.Set("version", LtVersion::Get(env));

  exports.Set("torrent", torrent);
}

}  // namespace Torrent
