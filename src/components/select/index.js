/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import {Select} from "antd"
import PropTypes from "prop-types";
//本项目的模板页面

const {Option} = Select;

let defaultProps = {

}

const SelectPro = forwardRef((props,ref) => {

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
})

SelectPro.propTypes = {
  /** 数据源 */
  dataSource:PropTypes.array,
  /** 数据源的label字段 */
  label: PropTypes.string,
  /** 数据源的value字段 */
  labelValue: PropTypes.string,
  /** 用户切换select的回调，一般用于form (value) => {
    console.log(6677, value)
  }*/
  onChange: PropTypes.func,
  /** select组件的value */
  value: PropTypes.any,
  /** 禁用 */
  disabled:PropTypes.bool,
  /** antd文档的其他设置 */
  config: PropTypes.object,
  /** 判断是否需要禁用的值 (data)=>{return false}
   *
   * data就是当前选项的item
   */
  disabledFun:PropTypes.func,
  /** 数据在生成选项时的函数，返回一个修改后的数值 (data)=>{return data},因为有些数据源并不规则 */
  dataSet:PropTypes.func
};
SelectPro.defaultProps = {
  /** 数据源 */
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
  /** 数据源的label字段 */
  label: "label",
  /** 数据源的value字段 */
  labelValue: "value",
  /** 用户切换select的回调，一般用于form */
  onChange: (value) => {
    console.log(6677, value)
  },
  /** select组件的value */
  value: [],
  /** 禁用 */
  disabled:false,
  /** antd文档的其他设置 */
  config: {},
  /** 判断是否需要禁用的值 */
  disabledFun:(data)=>{
    return false
  },
  /** 数据在生成选项时的函数，返回一个修改后的数值 */
  dataSet:(data)=>{
    return data
  }
};
export default SelectPro;