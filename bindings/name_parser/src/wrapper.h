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
#ifndef BINDINGS_NAME_PARSER_SRC_WRAPPER_H_
#define BINDINGS_NAME_PARSER_SRC_WRAPPER_H_

#include <anitomy/anitomy.h>
#include <napi.h>

#include <string>
#include <vector>
#include <locale>
#include <codecvt>

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

  Napi::Object BuildObject(anitomy::Elements elements, Napi::Env env);
  Napi::Array CategoryArray(anitomy::Elements elements, anitomy::ElementCategory pos, Napi::Env env);
  void SetEntry(
    Napi::Object object,
    Napi::Env env,
    const char *entry,
    anitomy::Elements elements,
    anitomy::ElementCategory pos);
};

}  // namespace Wrapper

#endif  // BINDINGS_NAME_PARSER_SRC_WRAPPER_H_
