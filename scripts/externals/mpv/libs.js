const { copyFileSync, existsSync } = require('fs')
const { join } = require('path')

const IS_LINUX = !['win32', 'darwin'].includes(process.platform)

if (!IS_LINUX) {
  const baseDir = ({
    'darwin': '/usr/local/lib',
    'win32': 'C:\\Windows\\system32'
  }[process.platform])

  const libFilename = ({
    'darwin': 'libmpv.1.dylib',
    'win32': 'mpv-1.dll'
  }[process.platform])

  const libPath = join(baseDir, libFilename)

  if (!existsSync(libPath)) {
    console.warn('KawAnime [PostInstall] -- Could not find libmpv library file. Please install it and put it in `public/mpv`')
  } else {
    console.log(`KawAnime [PostInstall] -- Found libmpv at ${libPath}`)

    copyFileSync(
      libPath,
      join(__dirname, '..', '..', '..', 'public', 'mpv', libFilename)
    )
  }
}
