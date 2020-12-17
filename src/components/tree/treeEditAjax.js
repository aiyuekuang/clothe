/**
 * Created by zengtao on 2017/5/19.
 */
import React, {createRef} from 'react';

import {Form, Radio, Tree} from "antd";
import UpTree from "./treeFromAjax";
import {ajax} from "../utils/common";
import Tree_form from "./tree_eidt";

const TreeNode = Tree.TreeNode;

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 6}
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16}
  }
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 6
    }
  }
};


const defaultProps = {
  //树数据
  treeData: [],
  //重新更新树
  get_tree: () => {
  },
  //删除树之后，刚刚删的树的数据也要重置
  rest_select_data: () => {
  },
  //选中的树
  select_data: {},
  //树控件新增、修改的接口地址
  tree_edit: "",
  //树控件的删除地址
  tree_delect: "",
  treeEditUrl: null
}


export default class TreeEditAjax extends React.Component {
  constructor(props) {
    super(props);
    //React16.3中创建Ref的方法
    this.up_tree = createRef();
  }

  static defaultProps = {
    ajax: ajax,
    //树数据的新增与编辑地址
    tree_edit: null,
    //树控件的删除地址
    tree_delect: null,
    //树的label
    dataSourceKey: "label",
    //树的value
    dataSourceValue: "value",
    //提交的本级的id
    id: "id",
    //上级树的id
    parentId: "parentId",
    //分类名称
    name: "name",
    //修改或删除成功后的提示
    msg: (data) => {
      return "操作成功"
    },
    //是否可以换位置
    change_pos: true,
    //上移下移url
    move_url: "",
    //上移下移的接口标示
    orderForward: "orderForward",
    //根目录的id，默认是-1
    rootId: -1,
    //其他需要写入的树表单字段
    formData: [],
    //标题校验规则
    titleRule: [],
    minWidth: "auto",
  };

  state = {
    select_data: {},
    father_item: null,
    //从界面传来的树的数据
    treeDataProps: null,
    value: null
  };



  componentDidMount = () => {
  };


  //选择的当前树
  onSelect = (value = {}, obj = {}, father_item = null) => {
    const {dataSourceValue} = this.props;
    this.setState({
      select_data: value,
      father_item: father_item && father_item.length > 1 ? father_item.slice(-2)[0] : null,
      value: value[dataSourceValue]
    });
  };

  //删除树之后，刚刚删的树的数据也要重置
  rest_select_data = (value = {}) => {
    this.setState({
      select_data: value
    });
  };

  //切换
  onChange = (e) => {
    if (e.target.value === "a") {
      this.onSelect();
    }
  };

  //更新数据的方法
  get_tree = () => {
    this.up_tree.current.onLoadData();
  }

  set_tree_data = (treeDataProps) => {
    this.setState({
      treeDataProps
    })
  }


  render() {
    const {minWidth} = this.props;
    const {treeDataProps, select_data, value, clotheLang} = this.state

    return (
      <div className="up_tree_eidt_warp">
        <div className="up_tree_eidt_warp_l" style={{minWidth: minWidth}}>
          <UpTree
            ref={this.up_tree}
            onSelect={this.onSelect}
            set_tree_data={this.set_tree_data}
            {...this.props}
            isRandomKey={false}
          />
        </div>
        <div className="up_tree_eidt_warp_r">
          <div className="up_tree_eidt_warp_r_tab">
            <RadioGroup
              onChange={this.onChange}
              value={!value ? "a" : "b"}
            >
              <RadioButton value="a">{clotheLang.form.add}</RadioButton>
              <RadioButton disabled={value == null} value="b">{clotheLang.tree.modify}</RadioButton>
            </RadioGroup>
          </div>
          <Tree_form
            select_data={this.state.select_data}
            rest_select_data={this.rest_select_data}
            father_item={this.state.father_item}
            get_tree={this.get_tree}
            treeData={treeDataProps}
            onSelect={this.onSelect}
            value={value}
            {...this.props}
          />
        </div>
        <div className="up_tree_eidt_warp_rr"/>
      </div>
    );
  }
}
