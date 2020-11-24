/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, Component, PureComponent} from 'react';
import {Button, Input, Menu} from 'antd';
import {arrAdd, arrDelNull, isArrayop, truncate} from 'esn';
import {createFromIconfontCN, AppstoreOutlined} from '@ant-design/icons';
//本项目的模板页面
const {SubMenu} = Menu;


//一套算法获取默认展开的父
let _defaultOpenKeys = (value) => {
  if (value === "" || value === "/") {
    return []
  }

  let arr = [];
  let result = arrDelNull(truncate(value.split("/"))).map((data, i) => {
    return "/" + data
  })
  if (result && result.length) {
    result = result.reduce((pre, next) => {
      arr.push(pre);
      return pre + next
    })
  }

  arr.push(result)
  return arr;
};
export default class Index extends Component {

  static defaultProps = {
    //react-Router的history对象用来处理跳转等
    history: {},
    //路由数据对象
    routeData: [{
      name: "搜索",
      zh_CN: "搜索",
      en_US: "search",
      icon: "search",
      path: "/search",
      component: null,
      children: [
        {
          name: "推荐内容",
          zh_CN: "推荐内容",
          en_US: "Recommended content",
          icon: "user",
          path: "/SerachRec",
          component: "SerachRec",
        }, {
          name: "角色设置",
          zh_CN: "角色设置",
          en_US: "Search keywords",
          icon: "user",
          path: "/SerachKey",
          component: "SerachKey",
        }
      ]
    }],
    //对菜单进行缩小展开的控制
    collapsed: false,
    //语言的字段，当项目切换语言时，请同步lang字段对应数据中的字段
    lang: "name",
    //路由数据中，需要跳转网页路由，所对应的字段
    url: "url",
    //需要对当前路由进行隐藏时，对应的路由的字段,可以传递数组["hide","show"]
    hide: "hide",
    //菜单的路由支持阿里的iconfont，默认是antd的库，可以自定义
    iconFontUrl: "//at.alicdn.com/t/font_1835208_p8mpjnjx3ms.js",
    config: {},
    //点击切换菜单按钮时的回调
    onChange:()=>{

    }
  }


  constructor(props) {
    super(props);

    this.IconFont = createFromIconfontCN({
      scriptUrl: props.iconFontUrl,
    });


    this.state = {
      selectedKeys: [location.pathname],
      defaultOpenKeys: _defaultOpenKeys(location.pathname)
    };

    if (props.history.listen) {
      props.history.listen((location, action) => {
        // location is an object like window.location
        if(this.show) {
          this.setState({
            selectedKeys: [location.pathname],
            defaultOpenKeys: _defaultOpenKeys(location.pathname)
          })
        }
      })
    }
  }

  IconFont = null
  show = true

  componentDidMount = () => {

  }

  //移除
  componentWillUnmount() {
    //离开页面消除所有接口请求
    //window.requestCancel();
    this.show = false

  }

  itemFun = (e) => {
    let path = e.key;
    let url = e.item.props.data[this.props.url]
    if (url) {
      window.open(url);
    } else {
      this.setState({
        selectedKeys: [path]
      }, () => {
        this.props.history.push(e.key)
      })
    }
    this.props.onChange(path)
  }

  render() {
    const {routeData, collapsed, lang, hide, config} = this.props;
    const {selectedKeys, defaultOpenKeys} = this.state;

    let menuLi = (routeData, parentPath = "") => routeData.map((data, i) => {
      let isNext = data.children && data.children.length > 0;
      let isExpend = true
      if (isNext) {
        isExpend = false
        for (let i of data.children) {
          let bool;
          if(isArrayop(hide)){
            bool = hide.find((data,t)=>{
              return i[data]
            })
          }else {
            bool = i[hide]
          }

          if (!bool) {
            isExpend = true
          }
        }
      }


      let key_ = parentPath + data.path;
      let IconTemp;
      if (data.icon) {
        IconTemp = <this.IconFont type={data.icon}/>;
      } else {
        IconTemp = <AppstoreOutlined/>
      }

      if (isNext && isExpend) {
        return (
          <SubMenu
            key={key_}
            icon={IconTemp}
            title={
              data[lang]
            }
          >
            {menuLi(data.children, key_)}
          </SubMenu>
        )
      } else {
        let bool;
        if(isArrayop(hide)){
          bool = hide.find((value,i)=>{
            return data[value]
          })
        }else {
          bool = data[hide]
        }

        if (bool) {
          return null;
        } else {
          return (
            <Menu.Item key={key_} icon={IconTemp} data={data}>
              {data[lang]}
            </Menu.Item>
          );
        }
      }
    })

    return (
      <Fragment>
        <Menu
          theme="dark"
          mode="inline"
          style={{lineHeight: '64px'}}
          selectedKeys={selectedKeys}
          defaultOpenKeys={defaultOpenKeys}
          onClick={this.itemFun}
          inlineCollapsed={collapsed}
          {...config}
        >
          {menuLi(routeData)}
        </Menu>
      </Fragment>
    );
  }
}

