/**
 * Created by zengtao on 2017/5/19.
 */
/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, useEffect, useState} from 'react';
import {DatePicker} from 'antd';
import moment from "moment"
import PropTypes from "prop-types";

const {MonthPicker, RangePicker, WeekPicker} = DatePicker;

const MonthSelect = forwardRef((props,ref) => {

  const [value, setValue] = useState(valueFormat(props.value));

  const {onChange, format, defaultValue} = props;

  // useEffect(() => {
  //   if (defaultValue) {
  //     setValue(valueFormat(defaultValue))
  //   }
  //   return () => {
  //   }
  // }, [defaultValue]);

  useEffect(() => {
    setValue(valueFormat(props.value))
    return () => {
    }
  }, [props.value]);

  let onChange_ = (date, dateString) => {
    setValue(date)
    onChange(dateString)
  }

  function valueFormat(value) {
    if (typeof value == "string" && value !== "") {
      return moment(value, format)
    }
    if (value === "" || !value) {
      return null
    }
  }


  return (
    <React.Fragment>
      <MonthPicker {...props} onChange={(date, dateString) => onChange_(date, dateString)} value={value}/>
    </React.Fragment>
  )
})

MonthSelect.propTypes = {
  /** 默认值*/
  defaultValue: PropTypes.any,
  /** 参考antd的方式*/
  format: PropTypes.string
};
MonthSelect.defaultProps = {
  /** 默认值*/
  defaultValue: null,
  /** 格式化*/
  format: "YYYY-MM",
};
export default MonthSelect;