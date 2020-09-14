/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, forwardRef, useImperativeHandle, useState, useEffect,Component} from 'react';
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
  Compnent:(props) => {
    return(
      <div>dd</div>
    )
  },
}

function index(prop, ref) {
  // Declare a new state variable, which we'll call "count"
  const [visible, setVisible] = useState(false);

  let props = {
    ...defaultProps, ...prop
  }

  const {title, className, config, open,close,Compnent} = props;

  useEffect(() => {
    console.log("重新加载了弹窗");
  }, []);


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
        {...config}
      >
        {/*<Comp visible={visible} setVisible={setVisible}/>*/}
        <Compnent visible={visible} setVisible={setVisible}/>
        {/*{compnent({visible, setVisible})}*/}
      </Modal>
    </Fragment>
  );
}

export default forwardRef(index)

/*
export default class Index extends Component{

  static defaultProps = {
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
    Compnent:(props) => {
      return(
        <div>dd</div>
      )
    },
  }

  constructor(props) {
    super(props);
    this.state={
      visible:false
    }
  }



  handleCancel = () => {
    this.props.close()
    this.setVisible(false)
  }

  onShow = () => {
    this.props.open();
    this.setVisible(true);
  }


  setVisible=(bool) => {
    this.setState({
      visible:bool
    })
  }
  render(){
    const {title, className, config, open,close,Compnent} = this.props;
    const {visible} = this.state;

    return(
      <Fragment>
        <div className={className} onClick={this.onShow}>
          {this.props.children}
        </div>
        <Modal
          title={title}
          visible={visible}
          footer={null}
          onCancel={this.handleCancel}
          {...config}
        >
          {/!*<Comp visible={visible} setVisible={setVisible}/>*!/}
          <Compnent visible={visible} setVisible={this.setVisible}/>
          {/!*{compnent({visible, setVisible})}*!/}
        </Modal>
      </Fragment>
    )
  }
}*/
