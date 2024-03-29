/**
 * Created by zengtao on 2018/8/1.
 */
import React, {Fragment, Component, PureComponent} from 'react';
import {Button, Input, Alert, notification, Form, Table, Empty, Tree, Modal, Spin} from 'antd';
import {TreeEdit} from "../index"
const TreeNode = Tree.TreeNode;
import {isValEmpty, treeFindObjById} from "esn"
import {DownOutlined, CaretRightOutlined,EditOutlined} from "@ant-design/icons"
import PropTypes from "prop-types";
const { DirectoryTree } = Tree;

export default class TreePro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //调用者传来的树控件数据
      treeData: [],
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      select_value: props.defaultValue,
      loading: false
    };
    this.first = true
  }

  static propTypes = {
    /** ajax的实现 */
    ajax: PropTypes.func,
    /** 调用者选择后的回调value是key的数组，obj是属性的数组 (value, obj) => {console.log(value, obj)}*/
    select: PropTypes.func,
    /** 是否显示按钮，默认不显示 */
    btn: PropTypes.bool,
    /** 标题 */
    title:PropTypes.string,
    /** 去除添加,默认去除 */
    add: PropTypes.bool,
    /** 调用树数据的参数 */
    param: PropTypes.object,
    /** 是否显示搜索，默认显示 */
    search: PropTypes.bool,
    /** 树的url，如果为null就是不需要树 */
    treeUrl: PropTypes.string,
    /** 获取树数据的接口返回 (data) => {return data.entity;}*/
    setData:PropTypes.func ,
    /** 数据的label */
    dataSourceKey: PropTypes.string,
    /** 数据的value值 */
    dataSourceValue: PropTypes.string,
    /** 树的其他设置 */
    config: PropTypes.object,
    /** 树编辑控件或者其他什么控件需要这个树的数据的时候可以使用和这个回调 (data) => {}*/
    getTreeData: PropTypes.func,
    /** tree的样式 */
    className: PropTypes.string,
    /** 树形需要隐藏时点击的按钮，如果需要就传递一个控制的函数 */
    treeHide: PropTypes.func,
    /** 树控件的最大高度 */
    maxHeight: PropTypes.any,
    /** 树控件的最大高度 (data,obj) => {}*/
    onChange: PropTypes.func,
    /** 初始选中的值 */
    defaultValue: PropTypes.array,
    /** 是否首次选中第一个数据 ,默认是null,可以传递布尔值*/
    selectFirstValue: PropTypes.any,
    /** 是否搜索到之后第一个就自动选中 */
    isSelectSearchValue:PropTypes.bool,
    /** 编辑时，表单的FormItem设置*/
    addFormConfig:PropTypes.object,
    /** 编辑时，表单的设置*/
    treeEditSet:PropTypes.object,
    /** 是否目录形式的树形*/
    isDirectoryTree:PropTypes.bool
  }

  static defaultProps = {
    ajax: () => {
    },
    /** 调用者选择后的回调value是key的数组，obj是属性的数组 */
    select: (value, obj) => {
       console.log(value, obj)
    },
    /** 是否显示按钮，默认不显示 */
    btn: false,
    /** 标题 */
    title: "资源目录",
    /** 去除添加,默认去除 */
    add: false,
    /** 调用树数据的参数 */
    param: {},
    /** 是否显示搜索，默认显示 */
    search: false,
    /** 树的url，如果为null就是不需要树 */
    treeUrl: "/tree",
    /** 获取树数据的接口返回 */
    setData: (data) => {
      return data.entity;
    },
    /** 数据的label */
    dataSourceKey: "label",
    /** 数据的value值 */
    dataSourceValue: "value",
    /** 树的其他设置 */
    config: {},
    /** 树编辑控件或者其他什么控件需要这个树的数据的时候可以使用和这个回调 */
    getTreeData: (data) => {
    },
    /** tree的样式 */
    className: "up_tree_warp",
    treeHide: null,
    /** 树控件的最大高度 */
    maxHeight: 500,
    onChange: (data,obj) => {
    },
    /** 初始选中的值 */
    defaultValue: null,
    /** 是否首次选中第一个数据 */
    selectFirstValue: null,
    /** 是否搜索到之后第一个就自动选中 */
    isSelectSearchValue:false,
    /** 编辑时，表单的设置*/
    addFormConfig:{},
    /** 编辑时，表单的设置*/
    treeEditSet:{},
    /** 是否目录形式的树形*/
    isDirectoryTree:false
  }


  componentDidMount() {
    //必须在这里声明，所以 ref 回调可以引用它
    //this.props.onRef(this)
    this.getTree();
  }


  getTree = () => {
    const {dataSourceValue,onChange} = this.props;
    const {select_value} = this.state;
    // if(this.props.treeData){
    //     this.setState({
    //         treeData:this.props.treeData
    //     })
    //     this.generateList(this.props.treeData);
    //     return;
    // }
    this.setState({
      loading: true
    })
    if (this.props.treeUrl) {
      this.props.ajax(this.props.treeUrl, this.props.param, (data) => {
        let value = this.props.setData(data);

        if ((this.props.selectFirstValue && this.first) || (this.props.selectFirstValue && !(select_value  && treeFindObjById(select_value[0],value,dataSourceValue)))) {
          let _value =  value && value.length ? [value[0][dataSourceValue]] : []
          let _valueObj =  value && value.length ? value[0] : {}

          this.setState({
            select_value:_value,
            selectValueObj:_valueObj
          })
          onChange(_value,_valueObj)
        }

        this.setState({
          treeData: this.props.setData(data),
          loading: false
        })
        this.props.getTreeData(this.props.setData(data))
        this.generateList(this.props.setData(data));
      }, () => {
        this.first = false
        this.setState({
          loading: false
        })
      })
    } else {
      console.log("请传树的url，否则怎么会有树的结构出来")
    }
  }

  returnValue=()=>{
    return {value:this.state.select_value,valueObj:this.state.selectValueObj}
  }

  //点击资源目录搜索
 /* getParentKey = (value, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.length > 0) {
          if (node.children.some(item => item[this.props.dataSourceValue] === value)) {
            parentKey = node[this.props.dataSourceValue];
          } else if (this.getParentKey(value, node.children)) {
            parentKey = this.getParentKey(value, node.children);
          }
        }
      }
    }
    if (isValEmpty(parentKey)) {
      let dsd = parentKey.toString();
      return dsd;
    } else {
      return parentKey;

    }
  };  */

  //点击资源目录搜索
  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item[this.props.dataSourceValue] === key)) {
          parentKey = node[this.props.dataSourceValue];
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  dataList = [];
  generateList = (data) => {
    const {dataSourceKey, dataSourceValue} = this.props;
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const value = node[this.props.dataSourceValue];
      let obj = {...node};
      obj[dataSourceKey] = node[dataSourceKey]
      obj[dataSourceValue] = value
      this.dataList.push(obj);
      if (node.children) {
        if (node.children.length > 0) {
          this.generateList(node.children);
        }
      }
    }
  };

  onChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      this.setState({
        searchValue: value,
        expandedKeys: []
      })
      return
    }
    const expandedKeys = this.dataList.map((item) => {
      if (item[this.props.dataSourceKey].indexOf(value) > -1) {
        return this.getParentKey(item[this.props.dataSourceValue], this.state.treeData);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);

    let _selectValue = this.dataList.filter((item) => {
      return item[this.props.dataSourceKey].indexOf(value) > -1
    })
    if(_selectValue &&_selectValue.length && this.props.isSelectSearchValue ){
      this._select(_selectValue[0][this.props.dataSourceValue],_selectValue[0],{})
      this.setSelectedKeys([_selectValue[0][this.props.dataSourceValue]])
    }

    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  }

  _select = (value, obj, parentData) => {
    this.props.select(value, obj, parentData)
    this.props.onChange(value, obj, parentData)
    this.setState({
      select_value:value,
      selectValueObj:obj

    })
  }

  select = (value, e) => {
    if (!this.props.btn) {
      if (value.length > 0) {
        this._select(value, e.node.dataRef, e.node.father_item)
      } else {
        this._select(null, {}, null)
      }
    }
    this.setSelectedKeys(value)
  }

  setSelectedKeys = (value = null) => {
    this.setState({
      select_value: value
    })
  }

  //新增，修改
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const {searchValue, expandedKeys, autoExpandParent, loading, treeData, select_value} = this.state;
    const {addFormConfig, config, className, treeHide, maxHeight, clotheLang,add,title,ajax,treeEditSet,setData,dataSourceValue,dataSourceKey,isDirectoryTree} = this.props;

    const loop = (data = treeData, father_item = null) => {
      //console.log(!data instanceof Array,data,[data])
      if (data instanceof Array) {

      } else {
        data = [data]
      }
      return data.map((item, i) => {
        const index = item[this.props.dataSourceKey].indexOf(searchValue);
        const beforeStr = item[this.props.dataSourceKey].substr(0, index);
        const afterStr = item[this.props.dataSourceKey].substr(index + searchValue.length);
        const title = index > -1 ? (
          <span key={i}>
                        {beforeStr}
            <span style={{color: '#f50'}} key={i}>
                            {searchValue}
                        </span>
            {afterStr}
                    </span>
        ) : <span key={i}>{item[this.props.dataSourceKey]}</span>;
        if (item.children && item.children.length > 0) {
          return (
            <TreeNode key={item[this.props.dataSourceValue]} title={title} dataRef={item}
                      father_item={father_item}>
              {loop(item.children, item)}
            </TreeNode>
          );
        }
        return <TreeNode key={item[this.props.dataSourceValue]} title={title} dataRef={item}
                         father_item={father_item}/>;
      });
    }

    let Comp = isDirectoryTree?DirectoryTree:Tree;

    return (
      <div className={className}>
        {title ? <div className="up_tree_head">
          <div className="up_tree_head_tit">
            {this.props.title}
          </div>
          {this.props.add ? <div className="up_tree_head_tit_edit">
            <a onClick={this.showModal}><EditOutlined /></a>
          </div> : null}
          {treeHide ? <div onClick={treeHide.bind(this, false)}>
            <div className="up_tree_head_show">
              <CaretRightOutlined/>
            </div>
          </div> : null}
        </div> : null}
        {this.props.search ? <div className="up_tree_search">
          <Input placeholder={clotheLang.tree.pleaseEnterName} onChange={this.onChange} allowClear/>
        </div> : null}
        <div className="up_tree_body" style={{maxHeight: maxHeight}}>
          {loading ? <div className="loading"><Spin/></div> : (treeData && treeData.length > 0 ? <Comp
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onSelect={this.select}
            // switcherIcon={<DownOutlined/>}
            selectedKeys={select_value ? select_value : []}
            {...config}
          >
            {loop()}
          </Comp> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>)}
        </div>
        {this.props.btn ? <div className="up_tree_btn">
          <Button type="primary"
                  onClick={this._select.bind(this, this.state.select_value)}>{clotheLang.common.determine}</Button>
        </div> : null}
        <Modal
          title={`${clotheLang.form.add}/${clotheLang.tree.modify}`}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          width={800}
        >
          <TreeEdit
            ajax={ajax}
            treeData={this.state.treeData}
            getTree={this.getTree}
            treeUrl={this.props.treeUrl}
            config={addFormConfig}
            clotheLang={clotheLang}
            setData={setData}
            dataSourceValue={dataSourceValue}
            dataSourceKey={dataSourceKey}
            {...treeEditSet}
          />
        </Modal>
      </div>
    )
  }
}
