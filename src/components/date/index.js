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

let dateFormat = createMap([{
  label: "date",
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
},])


let defaultProps = {
  defaultValue: null,
  picker: "date"
}

function Index(prop, ref) {

  let props = {
    ...defaultProps, ...prop
  }

  const [value, setValue] = useState(valueFormat(props.value));

  const {onChange, format, defaultValue,picker} = props;


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
      if(!picker){
        return moment(value, dateFormat.get("day"))
      }else {
        return moment(value, dateFormat.get(picker))
      }
    }
    if (value === "" || !value) {
      return null
    }
  }

  return (
    <React.Fragment>
      <DatePicker {...props} onChange={(date, dateString) => onChange_(date, dateString)} value={value}/>
    </React.Fragment>
  )
}

export default forwardRef(Index);