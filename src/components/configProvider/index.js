/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, useEffect , useState } from 'react';
import { ConfigProvider } from 'antd';
//本项目的模板页面


let defaultProps={}

export default function Index(prop) {
    // Declare a new state variable, which we'll call "count"

    let props={
        ...defaultProps,...prop
    }
    const {children} = props;


    return (
      <ConfigProvider {...props}>
          {children}
      </ConfigProvider>
    );
}
