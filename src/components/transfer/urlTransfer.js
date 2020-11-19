/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, useEffect, useState} from 'react';
import {Button} from "antd"
import {Transfer} from "../index"
import {ajax} from "../utils/common";


let defaultProps = {
  //请求数据用到的ajax封装
  ajax: ajax,
  //请求数据的url
  url: null,
  //已选中数据
  value: [],
  //主键字段
  primaryKeyField: "id",
  //请求接口用到的其他参数
  values: {},
  //数据请求到之后，写入数据的函数
  setData: (data) => {
    return data
  },
  onChange:(data)=>{

  }
}

export default function Index(prop) {

  let props = {
    ...defaultProps, ...prop
  }
  const {ajax, setData, values, url} = props;

  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getData(values, url)
    return () => {
    }
  }, [values]);

  //获取表格数据
  let getData = (values = values, url = url) => {
    setLoading(true)
    ajax(url, {
      ...values
    }, (data) => {
      setDataSource(setData(data))
    }, () => {
      setLoading(false)
    })
  }


  return (
    <Transfer dataSource={dataSource} disabled={loading} {...props}/>
  );
}
