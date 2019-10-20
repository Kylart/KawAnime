#include <napi.h>

#include "version.h"

namespace LtVersion {

Napi::Value Get (Napi::Env env) {
  return Napi::String::New(env, lt::version());
}

} // namespace LtVersion
