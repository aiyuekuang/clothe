/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, Fragment, useEffect, useState} from 'react';
import {Modal} from "antd"
import PropTypes from "prop-types";
//本项目的模板页面


let defaultProps = {

}

const ModalPro = forwardRef((props,ref) => {
  // Declare a new state variable, which we'll call "count"
  const [visible, setVisible] = useState(false);

  const {title, className, config, open, close, BtnComponent, onOk,width} = props;

  useEffect(() => {
  }, []);

  let handleCancel = () => {
    close();
    setVisible(false);
  };

  let onShow = () => {
    open();
    setVisible(true);
  };

  return (
    <Fragment>
      <div className={className} onClick={onShow}>
        <BtnComponent visible={visible} setVisible={setVisible}/>
      </div>
      <Modal
        title={title}
        visible={visible}
        width={width}
        onCancel={handleCancel}
        {...(onOk ? {onOk:()=>{onOk(handleCancel)}} : {footer: null})}
        {...config}
      >
        {typeof props.children === "function" ? props.children({visible, setVisible}) : props.children}
      </Modal>
    </Fragment>
  );
})

ModalPro.propTypes = {
  /** 弹窗上方的提示文字*/
  title: PropTypes.string,
  /** 弹窗的样式类名*/
  className: PropTypes.string,
  /** 弹窗根据antd的其他设置*/
  config: PropTypes.object,
  /** 打开之后的回调*/
  open: PropTypes.func,
  /** 关闭之后的回调*/
  close: PropTypes.func,
  /** 弹窗的宽度*/
  width: PropTypes.number,
  /** 按钮的组件(props) => {
    return (
        <div>dd</div>
    )
  }*/
  BtnComponent: PropTypes.elementType,
  /** 点击ok按钮后的回调(handleCancel) => {}
   *
   * handleCancel就是关闭弹窗的函数
   * */
  onOk: PropTypes.func
};
ModalPro.defaultProps = {
  /** 弹窗上方的提示文字*/
  title: "提示",
  /** 弹窗的样式类名*/
  className: "inlineBlock",
  /** 弹窗根据antd的其他设置*/
  config: {},
  /** 打开之后的回调*/
  open: () => {
  },
  /** 关闭之后的回调*/
  close: () => {
  },
  /** 弹窗的宽度*/
  width: 800,
  /** 按钮的组件*/
  BtnComponent: (props) => {
    return (
        <div>dd</div>
    )
  },
  /** 点击ok按钮后的回调*/
  onOk: null
};
export default ModalPro;



