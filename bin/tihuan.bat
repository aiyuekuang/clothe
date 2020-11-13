::rd /s/q D:\oppo\csc-ddp-ui-web\node_modules\clothe\dist

::rd /s/q D:\oppo\csc-ddp-ui-web\node_modules\clothe\lib

::mkdir D:\oppo\csc-ddp-ui-web\node_modules\clothe\dist

::mkdir D:\oppo\csc-ddp-ui-web\node_modules\clothe\lib


xcopy  D:\ku\clothe\dist  D:\auto\zhWeb\node_modules\clothe\dist /s /h /e /y /d
xcopy  D:\ku\clothe\lib  D:\auto\zhWeb\node_modules\clothe\lib /s /h /e /y /d

exit