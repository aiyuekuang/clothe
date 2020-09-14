/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, Component, PureComponent} from 'react';
import {Button, Input, Modal, DatePicker} from 'antd';
import {cuns} from 'esn'

const {MonthPicker, RangePicker, WeekPicker} = DatePicker;
import moment from "moment"

export function disabledDate(current,disabledStart,disabledEnd,disabledRang,formatData) {
  // Can not select days before today and today
  let bool = []
  if(disabledStart){
    bool.push(current && current < moment(disabledStart,formatData).endOf('day'));
  }
  if(disabledEnd){
    bool.push(current && current > moment(disabledEnd,formatData).endOf('day'));
  }

  if(disabledRang){
    bool.push(current && current > moment(disabledRang[0],formatData).endOf('day') && current < moment(disabledRang[1],formatData).endOf('day'));
  }

  return bool.find((data,i)=>{
    return data
  });
}


export default class Index extends Component {

  static defaultProps = {
    format: "YYYY-MM-DD",
    string: true,
    showTime: true,
    //这个时间之前的时间不可选,字符串即可
    disabledStart: null,
    //这个时间之后的时间不能选
    disabledEnd: null,
    //这个时间范围内的不能选
    disabledRang: null,
    //只能选择几天
    limitNum: null
  }

  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    // if ('value' in nextProps) {
    // }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {

  }


  //移除
  componentWillUnmount() {
    //离开页面消除所有接口请求
    //window.requestCancel();
  }

  onChange_ = (date, dateString) => {
    const {onChange, value, string} = this.props;
    if (string) {
      let value_ = "";
      for (let i of dateString) {
        if (i) {
          value_ += (i + ",")
        }
      }
      onChange(value_)
    } else {
      onChange(dateString)
    }
  }

  render() {
    const {onChange, value, showTime, format,disabledStart,disabledEnd,disabledRang,limitNum} = this.props;
    const {} = this.state;


    let formatData = format

    if (showTime) {
      formatData += " HH:mm:ss"
    }

    let value_ = value

    if (value instanceof Array) {
      let arr = []
      for (let i of value) {
        if (i) {
          arr.push(moment(i, formatData))
        }
      }
      value_ = arr
    }

    if (typeof value == "string" && value !== "") {
      let arr = []
      for (let i of value.split(',')) {
        if (i) {
          arr.push(moment(i, formatData))
        }
      }
      value_ = arr
    }
    if (value === "") {
      value_ = [undefined, undefined]
    }




    function disabledDateTime() {
      return {
        disabledHours: () =>[0,0],
        disabledMinutes: () => [0,0],
        disabledSeconds: () => [0,0],
      };
    }

    return (
      <React.Fragment>
        <RangePicker {...this.props} onChange={(date, dateString) => this.onChange_(date, dateString)}
                     value={value_} disabledDate={(current)=>disabledDate(current,disabledStart,disabledEnd,disabledRang,formatData)} format={formatData}/>
      </React.Fragment>
    )
  }
}