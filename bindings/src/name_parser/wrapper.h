#include <napi.h>

#include <string>
#include <vector>
#include <locale>
#include <codecvt>

#include <anitomy/anitomy.h>

namespace Wrapper {

class Wrapper {
public:
  void SetInput(Napi::String value, Napi::Env env);
  void Parse();

  anitomy::Elements Parsed();
  Napi::Value ParsedResult(Napi::Env env);

private:
  anitomy::Anitomy anitomy_;
  std::wstring input_;

  anitomy::Elements parsed_;

  std::wstring ToWideString(Napi::String str, Napi::Env env);
  std::string ToStr(anitomy::string_t str);

  Napi::Object BuildObject(anitomy::Elements &elements, Napi::Env env);
  void SetEntry(Napi::Object &object, Napi::Env env, const char *entry, anitomy::Elements &elements, anitomy::ElementCategory pos);
  Napi::Array CategoryArray(anitomy::Elements &elements, anitomy::ElementCategory pos, Napi::Env env);
};
} // namespace Wrapper