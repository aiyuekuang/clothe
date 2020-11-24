/**
 * Created by zengtao on 2017/5/19.
 */
import React, {useEffect, useState} from 'react';
import {Select, Spin} from "antd"
import {arrLast, cloneop, isString} from "esn";
import debounce from 'lodash/debounce';
import {ajax} from "../utils/common";
//本项目的模板页面

const {Option} = Select;

let defaultProps = {
  ajax: ajax,
  url: null,
  label: "name",
  labelValue: "id",
  onChange: (value) => {
    console.log(6677, value)
  },
  value: [],
  disabled: false,
  //antd文档的其他设置
  config: {},
  field: "id",
  setData: (data) => {
    return data
  },
  //数据源的名称
  dataSourceKey: "label",
  //数据源对应的值的字段名
  dataSourceValue: "value",
  //是否多选
  multiple: true,
  values: {},
  //onchange的时候返回最后选择的值
  returnLastValue: false
}
let lastFetchId = 0;

export default function Index(prop) {
  // Declare a new state variable, which we'll call "count"

  let props = {
    ...defaultProps, ...prop
  }

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
}
