const { copyFileSync, existsSync } = require('fs')
const { join } = require('path')

const baseDir = ({
  'darwin': '/usr/local/lib',
  'win32': 'C:\\Windows\\system32'
}[process.platform]) || '/usr/lib'

const libFilename = ({
  'darwin': 'libmpv.1.dylib',
  'win32': 'mpv-1.dll'
}[process.platform]) || 'libmpv.so'

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
