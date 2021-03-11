/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, Fragment, useEffect, useState} from 'react';
import { ConfigProvider } from 'antd';
//本项目的模板页面



const ConfigProviderPro = forwardRef((props,ref) => {

    // Declare a new state variable, which we'll call "count"

    const {children} = props;


    return (
      <ConfigProvider {...props}>
          {children}
      </ConfigProvider>
    );
})
export default ConfigProviderPro;
