/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, Fragment, useEffect, useState} from 'react';
import {Modal} from "antd"
//本项目的模板页面


let defaultProps = {
  title: "日志",
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
  BtnComponent: (props) => {
    return (
      <div>dd</div>
    )
  },
  onOk: null
}

function index(prop, ref) {
  // Declare a new state variable, which we'll call "count"
  const [visible, setVisible] = useState(false);

  let props = {
    ...defaultProps,
    ...prop,
  };

  const {title, className, config, open, close, BtnComponent, onOk} = props;

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
        onCancel={handleCancel}
        {...(onOk ? {onOk:()=>{onOk(handleCancel)}} : {footer: null})}
        {...config}
      >
        {typeof props.children === "function" ? props.children({visible, setVisible}) : props.children}
      </Modal>
    </Fragment>
  );
}

export default forwardRef(index)


