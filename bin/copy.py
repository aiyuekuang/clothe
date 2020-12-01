import os
import shutil
import stat
from utils import copy_dir

source_dist = r"D:\ku\clothe\dist"
source_lib = r"D:\ku\clothe\lib"


class Path(object):
    def __init__(self,path):
        self.dist = path +"/dist"
        self.lib = path +"/lib"


arr = [Path('D:/oppo_pro/esa-admin/node_modules/clothe')]



for i in arr:
    #del_dir(i.dist)
    copy_dir(source_dist,i.dist)
    #del_dir(i.lib)
    copy_dir(source_lib,i.lib)
