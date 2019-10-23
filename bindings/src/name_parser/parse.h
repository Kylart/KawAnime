#include <napi.h>

#include <anitomy/anitomy.h>

#include <locale>
#include <codecvt>
#include <string>

#include "wrapper.h"

namespace Parser {

Napi::Value parse (const Napi::CallbackInfo& info);

} // namespace Parser
