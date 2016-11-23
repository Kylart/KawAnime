import sys
import os
from time import sleep

if __name__ == '__main__':
    for root, dirs, files in os.walk(sys.argv[1]):
        for currentFile in files:
            print("processing file: %s" % currentFile)
            exts = ('.torrent')
            if any(currentFile.lower().endswith(ext) for ext in exts):
                os.remove(os.path.join(root, currentFile))

    sleep(1.5)
    plat = sys.platform
    arg = sys.argv[1]
    if plat == 'darwin':
        os.system('open %s*.torrent' % arg)
    elif plat == 'win32':
        os.system('%s*.torrent' % arg)
    elif plat == 'linux':
        os.system('xdg-open %s*.torrent' % arg)
