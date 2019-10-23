#include "bind.h"

namespace NameParser {

void SetUp (Napi::Env env, Napi::Object exports) {
  exports.Set("parseName", Napi::Function::New(env, Parser::parse));
}

} // namespace NameParser