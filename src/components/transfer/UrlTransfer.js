/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, Fragment, useEffect, useState} from 'react';
import {Transfer} from "../index"
import {ajax} from "../utils/common";
import PropTypes from "prop-types";

const UrlTransfer = forwardRef((props,ref) => {

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
})

UrlTransfer.propTypes = {
  /** 请求数据用到的ajax封装 */
  ajax: PropTypes.func.isRequired,
  /** 请求数据的url */
  url:  PropTypes.string,
  /** 已选中数据 */
  value: PropTypes.array,
  /** 主键字段 */
  primaryKeyField: PropTypes.string,
  /** 请求接口用到的其他参数 */
  values: PropTypes.object,
  /** 数据请求到之后，写入数据的函数 (data) => {return data}*/
  setData: PropTypes.func,
  /** 组件数据变化时的回调 (data)=>{}*/
  onChange:PropTypes.func
};
UrlTransfer.defaultProps = {
  /** 请求数据用到的ajax封装 */
  ajax: ajax,
  /** 请求数据的url */
  url: null,
  /** 已选中数据 */
  value: [],
  /** 主键字段 */
  primaryKeyField: "id",
  /** 请求接口用到的其他参数 */
  values: {},
  /** 数据请求到之后，写入数据的函数 */
  setData: (data) => {
    return data
  },
  /** 组件数据变化时的回调 */
  onChange:(data)=>{

  }
};
export default UrlTransfer;
