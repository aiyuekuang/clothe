/**
 * Created by zengtao on 2017/5/19.
 */
import React, { Fragment, Component } from 'react';
import PropTypes from "prop-types";

export default class IconSvg extends Component {

  static propTypes = {
    /** 颜色 */
    fill: PropTypes.string,
    /** 宽高 */
    size: PropTypes.number,
    /** 样式 */
    className:PropTypes.string,
    /** 从http://iconfont.cn/里拿到的svg里的path里的字符串，如果有多个path则用数组，单个则用字符串 */
    path:PropTypes.any
  }

  static defaultProps = {
    /** 颜色 */
    fill: '#999999',
    /** 宽高 */
    size: 16,
    /** 样式 */
    className:"",
    /** 从http://iconfont.cn/里拿到的svg里的path里的字符串，如果有多个path则用数组，单个则用字符串 */
    path:"M273.6 431l212.9 212.9c14.1 14.1 36.9 14.1 50.9 0l213-212.9c22.7-22.7 6.6-61.5-25.5-61.5H299.1c-32.1 0-48.1 38.8-25.5 61.5z"
  };

  componentWillReceiveProps(nextProps) {}

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {};

  //移除
  componentWillUnmount() {
    //离开页面消除所有接口请求
    //window.requestCancel();
  }

  render() {
    const { fill, size,className,path} = this.props;
    const {} = this.state;
    let pathComp=()=>{
      if(typeof path === "object"){
        return path.map((data,i)=>{
          return(
              <path
                  key={i}
                  d={data}
                  fill={fill}
              />
          )
        })
      }else {
        return (
            <path
                d={path}
                fill={fill}
            />
        )
      }
    }


    return (
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
        {pathComp()}
      </svg>
    );
  }
}
