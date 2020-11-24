/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import {Select} from "antd"
//本项目的模板页面

const {Option} = Select;

let defaultProps = {
  dataSource: [
    {
      label: "11",
      value: 1
    },
    {
      label: "22",
      value: 2
    }
  ],
  label: "label",
  labelValue: "value",
  onChange: (value) => {
    console.log(6677, value)
  },
  value: [],
  disabled:false,
  //antd文档的其他设置
  config: {},
  //判断是否需要禁用的值
  disabledFun:(data)=>{
    return false
  },
  //数据在生成选项时的函数，返回一个修改后的数值
  dataSet:(data)=>{
    return data
  }
}

function index(prop,ref) {
  // Declare a new state variable, which we'll call "count"

  let props = {
    ...defaultProps, ...prop
  }
  const {dataSource, label, labelValue, value, config,clotheLang,disabled,disabledFun,dataSet} = props;

  useEffect(() => {

    return () => {
    }
  }, [dataSource]);

  useEffect(() => {

    return () => {
    }
  }, [value]);


  function handleChange(value,option ) {
    props.onChange(value,option)
  }

  useImperativeHandle(ref, () => ({

  }))


  let children = dataSource.map((data, i) => {
    let _data = dataSet(data)
    return <Option key={_data[labelValue]} label={_data[label]} value={_data[labelValue]} disabled={disabledFun(_data)}>{_data[label]}</Option>;
  });


  return (
    <Select
      style={{width: "100%"}}
      showSearch
      onChange={handleChange}
      value={value}
      disabled={disabled}
      placeholder={clotheLang.form.pleaseSelect}
      filterOption={(inputValue, option)=>{
        return option.label.indexOf(inputValue) !== -1
      }}
      allowClear={true}
      {...config}
    >
      {children}
    </Select>
  );
}
export default forwardRef(index);