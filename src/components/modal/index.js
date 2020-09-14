/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, Component, PureComponent, useState, useImperativeHandle, forwardRef} from 'react';
import {Button, Input, Modal} from 'antd';

const {confirm} = Modal;

export let up_confirm = (ok, title = "确定删除？") => {
  confirm({
    title: '提示',
    content: title,
    okText: "是",
    maskClosable: true,
    okType: 'primary',
    cancelText: "否",
    onOk: ok
  });
}


const defaultProps = {
  content: "确定删除？",
  title: '提示',
  okText: "是",
  maskClosable: true,
  okType: 'primary',
  cancelText: "否",
  onOk: (close) => {
  },
  modalType: "confirm",
  className: ""
}

function Index(prop, ref) {
  // Declare a new state variable, which we'll call "count"
  let props = {
    ...defaultProps, ...prop
  }

  const {modalType, className} = props;
  let _props = {...props}
  _props.onOk = (close) => {
    props.onOk()
    return close()
  }

  let onShow = () => {
    Modal[modalType](_props);
  }

  return (
    <Fragment>
      <div className={className} onClick={onShow}>
        {props.children}
      </div>
    </Fragment>
  );
}

export default Index;


