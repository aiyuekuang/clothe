/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, Component, PureComponent, useState, useImperativeHandle, forwardRef} from 'react';
import {Button, Input, Modal} from 'antd';
import PropTypes from "prop-types";

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

const ModalSimple = forwardRef((props,ref) => {


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
})

ModalSimple.propTypes = {
  /** Button label */
  children: PropTypes.node.isRequired,
  /** The color for the button */
  color: PropTypes.string,
  /** The size of the button */
  size: PropTypes.oneOf(['small', 'normal', 'large']),
  /** Disable button */
  disabled: PropTypes.bool,
  /** Gets called when the user clicks on the button */
  onClick: PropTypes.func,
};
ModalSimple.defaultProps = {
  color: '#333',
  size: 'normal',
  onClick: event => {
    // eslint-disable-next-line no-console
    console.log('You have clicked me!', event.target);
  },
};
export default ModalSimple;


