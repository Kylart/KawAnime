#include <napi.h>

#include "torrent/bind.h"
#include "name_parser/bind.h"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  Torrent::SetUp(env, exports);
  NameParser::SetUp(env, exports);

  return exports;
}

NODE_API_MODULE(kawabinds, Init)
