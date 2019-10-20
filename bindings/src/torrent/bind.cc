#include "bind.h"

namespace Torrent {

void SetUp (Napi::Env env, Napi::Object exports) {
  Napi::Object torrent = Napi::Object::New(env);

  LtSession::Client::Init(env, torrent);

  exports.Set("torrent", torrent);
  exports.Set("version", LtVersion::Get(env));
}

} // namespace Torrent