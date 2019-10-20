#include <napi.h>

#include "torrent/bind.h"

#include <anitomy/anitomy.h>

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  Torrent::SetUp(env, exports);

  return exports;
}

NODE_API_MODULE(kawabinds, Init)
