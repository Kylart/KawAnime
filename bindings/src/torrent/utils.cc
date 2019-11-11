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

#include "utils.h"

namespace LtUtils {

lt::torrent_handle findTorrent(lt::session * session, std::uint32_t to_find_id) {
  std::vector<lt::torrent_handle> torrents = session->get_torrents();

  for (auto const& torrent : torrents) {
    std::uint32_t id = torrent.id();

    if (id == to_find_id) return torrent;
  }

  lt::torrent_handle none;
  return none;
}

}  // namespace LtUtils
