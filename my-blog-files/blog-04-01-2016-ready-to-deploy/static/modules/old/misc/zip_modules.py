# Create zip archive with normal
# or byte-compiled modules for Blogfy
import os
from zipfile import ZipFile
from sys import argv, version_info
from shutil import copy, move, rmtree
from distutils.util import byte_compile

class SpeedyGreedy(object):
    def __init__(self):
        ms     = 'modules.zip'
        cwd    = os.getcwd()
        mso    = 'modules-orig.zip'
        ver    = version_info[0]
        pat    = os.path
        pyo_f  = ('blogfy.pyo', 'post_funcs.pyo', 'templates.pyo',
                  'strings_to_format.pyo','templates_not_included.py')
        pcache = '__pycache__'

        if int(argv[1]) != 1:
            copy(mso, ms)
        else:
            with ZipFile(mso, 'r') as ziP:
                ziP.extractall()

            py_f = [x[:-1] for x in pyo_f[:-1]]
            byte_compile(py_f, 2, True)

            if ver == 3:
                long_names = os.listdir(pcache)
                a = [pat.splitext(x)[0].split('.')[0] for x in long_names]
                b = ('.pyo '.join(a) + '.pyo').split()
                for x in long_names:
                    move(pat.join(cwd, pcache, x), pat.join(cwd, b[0]))
                    del b[0]

            with ZipFile(ms, 'a') as z:
                [z.write(pyo_f[x]) for x in range(4)]

            cwd_files = os.listdir(cwd)
            [os.remove(x) for x in pyo_f if x in cwd_files]
            [os.remove(x) for x in py_f]

            if pat.exists(pcache):
                rmtree(pcache)

        move(ms, pat.join(pat.split(cwd)[0], ms))

if __name__ == '__main__':
    SpeedyGreedy()