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

#ifndef BINDINGS_SRC_TORRENT_WINDOWS_H_
#define BINDINGS_SRC_TORRENT_WINDOWS_H_

#if defined(WIN32) || defined(_WIN32) || defined(__WIN32) && !defined(__CYGWIN__)
// Windows 10, Needed by Boost
#define WINVER 0x0603
#define _WIN32_WINNT 0x0603
#endif

#endif  // BINDINGS_SRC_TORRENT_WINDOWS_H_
