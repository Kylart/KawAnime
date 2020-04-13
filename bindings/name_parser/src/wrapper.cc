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

#include "wrapper.h"

namespace Wrapper {

void Wrapper::SetInput(Napi::String value, Napi::Env env) {
  this->input_ = ToWideString(value, env);
}

void Wrapper::Parse() {
  this->anitomy_.Parse(this->input_);
  this->parsed_ = this->anitomy_.elements();
}

anitomy::Elements Wrapper::Parsed() { return this->parsed_; }

Napi::Value Wrapper::ParsedResult(Napi::Env env) {
  Napi::Object result = Napi::Object::New(env);

  return BuildObject(this->parsed_, env);
}

// From https://stackoverflow.com/a/39018368/10611946
std::wstring Wrapper::ToWideString(Napi::String input, Napi::Env env) {
  std::wstring result;
  std::string _input = input.Utf8Value();

  try {
    std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
    return converter.from_bytes(_input);
  } catch(std::range_error& e) {
    (void)e;

    size_t length = _input.length();
    std::wstring result;

    result.reserve(length);

    for (size_t i = 0; i < length; i++) {
        result.push_back(_input[i] & 0xFF);
    }

    return result;
  }
}

std::string Wrapper::ToStr(anitomy::string_t str) {
  std::wstring ws_value(str.c_str());
  return std::string(ws_value.begin(), ws_value.end());
}

void Wrapper::SetEntry(
  Napi::Object object,
  Napi::Env env,
  const char *entry,
  anitomy::Elements elements,
  anitomy::ElementCategory pos
) {
  Napi::String entry_name = Napi::String::New(env, entry);

  switch (elements.count(pos)) {
  case 0:
    break;
  case 1:
    object.Set(entry_name.Utf8Value(), ToStr(elements.get(pos)).c_str());
    break;
  default:
    object.Set(entry_name, CategoryArray(elements, pos, env));
  }
}

Napi::Array Wrapper::CategoryArray(anitomy::Elements elements, anitomy::ElementCategory pos, Napi::Env env) {
  std::vector<anitomy::string_t> category_elements = elements.get_all(pos);
  Napi::Array output = Napi::Array::New(env);
  unsigned int index = 0;

  for (anitomy::string_t value : category_elements) {
    output.Set(index, Napi::String::New(env, ToStr(value).c_str()));
    index++;
  }

  return output;
}

Napi::Object Wrapper::BuildObject(anitomy::Elements elements, Napi::Env env) {
  Napi::Object result = Napi::Object::New(env);

  SetEntry(result, env, "anime_season", elements, anitomy::kElementAnimeSeason);
  SetEntry(result, env, "season_prefix", elements, anitomy::kElementAnimeSeasonPrefix);
  SetEntry(result, env, "anime_title", elements, anitomy::kElementAnimeTitle);
  SetEntry(result, env, "anime_type", elements, anitomy::kElementAnimeType);
  SetEntry(result, env, "anime_year", elements, anitomy::kElementAnimeYear);
  SetEntry(result, env, "audio_term", elements, anitomy::kElementAudioTerm);
  SetEntry(result, env, "device_compatibility", elements, anitomy::kElementDeviceCompatibility);
  SetEntry(result, env, "episode_number", elements, anitomy::kElementEpisodeNumber);
  SetEntry(result, env, "episode_number_alt", elements, anitomy::kElementEpisodeNumberAlt);
  SetEntry(result, env, "episode_prefix", elements, anitomy::kElementEpisodePrefix);
  SetEntry(result, env, "episode_title", elements, anitomy::kElementEpisodeTitle);
  SetEntry(result, env, "file_checksum", elements, anitomy::kElementFileChecksum);
  SetEntry(result, env, "file_extension", elements, anitomy::kElementFileExtension);
  SetEntry(result, env, "file_name", elements, anitomy::kElementFileName);
  SetEntry(result, env, "language", elements, anitomy::kElementLanguage);
  SetEntry(result, env, "other", elements, anitomy::kElementOther);
  SetEntry(result, env, "release_group", elements, anitomy::kElementReleaseGroup);
  SetEntry(result, env, "release_information", elements, anitomy::kElementReleaseInformation);
  SetEntry(result, env, "release_version", elements, anitomy::kElementReleaseVersion);
  SetEntry(result, env, "source", elements, anitomy::kElementSource);
  SetEntry(result, env, "subtitles", elements, anitomy::kElementSubtitles);
  SetEntry(result, env, "video_resolution", elements, anitomy::kElementVideoResolution);
  SetEntry(result, env, "video_term", elements, anitomy::kElementVideoTerm);
  SetEntry(result, env, "volume_number", elements, anitomy::kElementVolumeNumber);
  SetEntry(result, env, "volume_prefix", elements, anitomy::kElementVolumePrefix);
  SetEntry(result, env, "unknown", elements, anitomy::kElementUnknown);

  return result;
}
}  // namespace Wrapper
