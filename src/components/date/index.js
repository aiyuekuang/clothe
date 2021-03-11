/**
 * Created by zengtao on 2017/5/19.
 */
/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, useEffect, useState} from 'react';
import {DatePicker} from 'antd';
import moment from "moment"
import {createMap} from "esn";
import PropTypes from "prop-types";

let dateFormat = createMap([{
  label: "date",
  format: "YYYY-MM-DD",
},{
  label: "day",
  format: "YYYY-MM-DD",
},{
  label: "month",
  format: "YYYY-MM",
},{
  label: "year",
  format: "YYYY",
},{
  label: "week",
  format: "YYYY-wo",
},{
  label: "quarter",
  format: "YYYY-QQ",
}],"label")


const DatePro = forwardRef((props,ref) => {
  const {onChange, picker} = props;

  let valueFormat =(value)=>{

    if (value === "" || !value) {
      return null
    }else {
      return moment(value, dateFormat.get(picker).format)
    }
  }

  const [value, setValue] = useState(valueFormat(props.value));



  useEffect(() => {
    onChange_(valueFormat(props.value),props.value)

    return () => {
    }
  }, [props.value]);

  let onChange_ = (date, dateString) => {
    setValue(date)
    onChange(dateString)
  }

  return (
    <React.Fragment>
      <DatePicker {...props} onChange={(date, dateString) => onChange_(date, dateString)} value={value}/>
    </React.Fragment>
  )
})

DatePro.propTypes = {
  /** 默认值*/
  defaultValue: PropTypes.any,
  /** 参考antd的方式*/
  picker: PropTypes.string
};
DatePro.defaultProps = {
  /** 默认值*/
  defaultValue: null,
  /** 参考antd的方式*/
  picker: "date"
};

export default DatePro;