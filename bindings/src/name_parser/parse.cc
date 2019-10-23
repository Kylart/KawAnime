#include "parse.h"

namespace Parser {

Napi::Value parse (const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  Napi::String name = info[0].As<Napi::String>();

  Wrapper::Wrapper anitomy_wrapper;
  anitomy_wrapper.SetInput(name, env);
  anitomy_wrapper.Parse();

  return anitomy_wrapper.ParsedResult(env);
}

} // namespace Parser