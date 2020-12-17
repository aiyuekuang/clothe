/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, forwardRef, useImperativeHandle, useState, useEffect,Component} from 'react';
import {Modal} from "antd"
//本项目的模板页面


let defaultProps = {
  title: "提示",
  //弹窗中的内容
  className: "inlineBlock",
  //弹窗根据antd的其他设置
  config: {},
  //打开之后的回调
  open: () => {
  },
  //关闭之后的回调
  close: () => {
  },
  width:800,
  Component:({visible,setVisible}) => {
    return(
      <div>dd</div>
    )
  },
  //外部的显示与不显示来控制组件
  visible:null
}

function index(prop, ref) {
  // Declare a new state variable, which we'll call "count"
  const [visible, setVisible] = useState(false);

  let props = {
    ...defaultProps, ...prop
  }

  const {title, className, config, open,close,Component,width} = props;

  useEffect(() => {
    if(props.visible !== null){
      setVisible(props.visible)
    }
  }, [props.visible]);


  let handleCancel = () => {
    close()
    setVisible(false)
  }

  let onShow = () => {
    open();
    setVisible(true);
  }

  useImperativeHandle(ref, () => ({
    setVisible: (bool) => {
      return setVisible(bool);
    }
  }))

  return (
    <Fragment>
      <div className={className} onClick={onShow}>
        {props.children}
      </div>
      <Modal
        title={title}
        visible={visible}
        footer={null}
        onCancel={handleCancel}
        width={width}
        {...config}
      >
        {/*<Comp visible={visible} setVisible={setVisible}/>*/}
        <Component visible={visible} setVisible={setVisible}/>
        {/*{compnent({visible, setVisible})}*/}
      </Modal>
    </Fragment>
  );
}

export default forwardRef(index)

