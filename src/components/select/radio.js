/**
 * Created by zengtao on 2017/5/19.
 */
import React, {useEffect} from 'react';
import {Radio} from "antd"
import {uid} from "esn";
//本项目的模板页面

const {Button} = Radio;

let defaultProps = {
  dataSource: [
    {
      name: "11",
      id: 1
    },
    {
      name: "22",
      id: 2
    }
  ],
  label: "name",
  labelValue: "id",
  onChange: (value) => {
    console.log(6677, value)
  },
  value: [],
  //antd文档的其他设置
  config: {},
  //是否需要使用按钮样式
  isButton: false,
  size:"default",
  //需要禁用的选项进行判断
  disabledFun: (data) => {
    return false
  }
}

export default function Index(prop) {
  // Declare a new state variable, which we'll call "count"

  let props = {
    ...defaultProps, ...prop
  }
  const {dataSource, label, labelValue, value, config, isButton, disabledFun,size} = props;

  useEffect(() => {


    return () => {
    }
  }, [dataSource]);

  useEffect(() => {

    return () => {
    }
  }, [value]);

  function onChange(value) {
    props.onChange(value)
  }

  let children = dataSource.map((data, i) => {
    let View = Radio;
    if (isButton) {
      View = Button
    }
    return <View key={data[labelValue]} value={data[labelValue]} disabled={disabledFun(data)}>{data[label]}</View>;
  });

  return (
    <Radio.Group name={uid()} onChange={onChange} value={value} size={size} {...config}>
      {children}
    </Radio.Group>
  );
}
