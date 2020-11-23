import os
import shutil
import stat

source_path = r"D:\ku\clothe\lib"


class Path(object):
    def __init__(self,path):
        self.dist = path +"/dist"
        self.lib = path +"/lib"


arr = [Path('D:/oppo_pro/esa-admin/node_modules/clothe')]

#filePath:文件夹路径
def del_dir(dir_path):
    """
    删除文件夹及内容
    :param dir_path:
    :return:
    """
    try:
        shutil.rmtree(dir_path)
    except Exception as err:
        print(err)



def copy_dir(olddir_path,newdir_path):
    """
    复制文件夹，olddir和newdir都只能是文件夹，且newdir必须不存在
    :return:
    """
    if os.path.exists(newdir_path):
        shutil.rmtree(newdir_path)

    shutil.copytree(olddir_path, newdir_path)

for i in arr:
    del_dir(i.dist)
    del_dir(i.lib)
    copy_dir(source_path,i.dist)
    copy_dir(source_path,i.lib)
