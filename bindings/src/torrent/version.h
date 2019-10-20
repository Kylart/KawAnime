#ifndef LIBTORRENT_NAPI_VERSION
#define LIBTORRENT_NAPI_VERSION

#include <napi.h>

#include <libtorrent/version.hpp>

namespace LtVersion {

Napi::Value Get (Napi::Env env);

} // namespace LtVersion

#endif
