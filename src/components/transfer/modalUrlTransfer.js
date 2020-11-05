/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, useEffect, useState} from 'react';
import {Button} from "antd"
import {UrlTransfer, ModalWarp} from "../index"
import {ajax} from "../utils/common";


let defaultProps = {
  //请求数据用到的ajax封装
  ajax: ajax,
  //弹窗上的标题
  title: "选择",
  //弹窗的其他设置
  modalConfig: {},
  //请求接口型穿梭框的设置
  urlTransferSet: {},
  //数据变化时的回调，使用提交按钮提交接口时
  onChange: (data)=>{},
  //选中的数据
  value: [],
  //提交按钮的ajax请求的url
  url: null,
  //提交按钮的其他参数
  values: {},
  //提交时，选中数据提交的字段
  id: "id",
  //打开弹窗时的回调
  open: () => {

  },
  addFormSubmitCallback:()=>{

  }
}

export default function Index(prop) {

  let props = {
    ...defaultProps, ...prop
  }
  const {title, urlTransferSet, children, modalConfig, onChange, value, url, ajax, values, id, open,addFormSubmitCallback} = props;
  const [val, setVal] = useState(value);
  const [none, setNone] = useState(false)

  let closeMask = () => {
  }

  useEffect(() => {
    setVal(value)
    return () => {
    }
  }, [value]);


  return (
    <ModalWarp
      title={title}
      config={
        {
          width: 900,
          footer: [<Button key={1} type="primary" onClick={() => {
            if (!url) {
              onChange(val)
            } else {
              let parm = {...values};
              parm[id] = val
              setNone(true)
              ajax(url, parm, (data) => {
                closeMask(false)
                setNone(false)
                addFormSubmitCallback(parm,data)
              })
            }
          }}
          disabled={none}
          >确定</Button>],
          ...modalConfig
        }
      }
      open={open}
      Component={(props) => {
        closeMask = props.setVisible;
        return <UrlTransfer value={val} {...urlTransferSet} onChange={(value) => {
          setVal(value)
        }}/>
      }}
    >
      {children}
    </ModalWarp>
  );
}
