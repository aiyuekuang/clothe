/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, useEffect, useState} from 'react';
import {Select, Spin} from "antd"
import {arrLast, cloneop, isString} from "esn";
import debounce from 'lodash/debounce';
import {ajax} from "../utils/common";
import PropTypes from "prop-types";
//本项目的模板页面

const {Option} = Select;

let defaultProps = {

}
let lastFetchId = 0;

const RemoteSearch = forwardRef((props,ref) => {


  const {label, labelValue, value, values, config, clotheLang, disabled, ajax, url, field, setData, dataSourceKey, dataSourceValue, multiple, returnLastValue} = props;

  const [dataSource, setDataSource] = useState([])
  const [fetching, setFetching] = useState(false)

  let searchValue = ""
  const fetchUser = debounce(fetchUsers, 800);

  useEffect(() => {
    // console.log(1111, value, values)
    fetchUser(searchValue)
    return () => {
    }
  }, [values]);


  function handleChange(value) {
    let _value = !multiple ? value : [...value];
    if (returnLastValue && multiple) {
      _value = arrLast(value)
    }
    props.onChange(_value)
  }


  function fetchUsers(value) {
    console.log('fetching user', value);
    searchValue = value
    lastFetchId += 1;
    const fetchId = lastFetchId;
    setDataSource([])
    setFetching(true)
    let param = {...values}
    param[field] = value
    ajax(url, param, (body) => {
      if (fetchId !== lastFetchId) {
        // for fetch callback order
        return;
      }
      const data = setData(body) ? setData(body).map(user => ({
        label: user[dataSourceKey],
        value: user[dataSourceValue]
      })) : [];
      setDataSource(data)
    }, () => {
      setFetching(false)
    })
  };



  return (
    <Select
      mode={multiple ? "multiple" : null}
      showSearch={!multiple}
      value={value}
      placeholder={clotheLang.form.pleaseSelect}
      notFoundContent={fetching ? <Spin size="small"/> : null}
      filterOption={false}
      onSearch={fetchUser}
      onChange={handleChange}
      style={{width: '100%'}}
      disabled={disabled}
      allowClear={true}
      {...config}
    >
      {dataSource && dataSource.map(d => (
        <Option key={d.value} value={d.value}>{d.label}</Option>
      ))}
    </Select>
  );
})

RemoteSearch.propTypes = {
  /** ajax的实现函数 */
  ajax: PropTypes.func,
  /** url地址 */
  url: PropTypes.string,
  /** 改变后的回调 */
  onChange:PropTypes.func,
  /** 组件的value值 */
  value:PropTypes.any,
  /** 组件的禁用 */
  disabled: PropTypes.bool,
  /** antd文档的其他设置 */
  config: PropTypes.object,
  /** 主键的字段 */
  field: PropTypes.string,
  /** 获取数据之后返回数据源数据的函数 (data) => {return data},data就是ajax后返回的值*/
  setData: PropTypes.func,
  /** 数据源对应的label的字段 */
  dataSourceKey: PropTypes.string,
  /** 数据源对应的value的字段 */
  dataSourceValue: PropTypes.string,
  /** 是否多选 */
  multiple: PropTypes.bool,
  /** 其他ajax时的参数 */
  values: PropTypes.object,
  /** onchange的时候是否需要返回最后选择的值 */
  returnLastValue: PropTypes.bool
};
RemoteSearch.defaultProps = {
  /** ajax的实现函数 */
  ajax: ajax,
  /** url地址 */
  url: null,
  /** 改变后的回调 */
  onChange: (value) => {
    console.log(6677, value)
  },
  /** 组件的value值 */
  value: [],
  /** 组件的禁用 */
  disabled: false,
  /** antd文档的其他设置 */
  config: {},
  /** 主键的字段 */
  field: "id",
  /** 获取数据之后返回数据源数据的函数 */
  setData: (data) => {
    return data
  },
  /** 数据源对应的label的字段 */
  dataSourceKey: "label",
  /** 数据源对应的value的字段 */
  dataSourceValue: "value",
  /** 是否多选 */
  multiple: true,
  /** 其他ajax时的参数 */
  values: {},
  /** onchange的时候是否需要返回最后选择的值 */
  returnLastValue: false
};
export default RemoteSearch;
