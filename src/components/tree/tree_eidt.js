/**
 * Created by zengtao on 2017/5/19.
 */
import React, {createRef, Fragment, useEffect, useState} from 'react';

import {Button, Form, Input, message, Radio, Tree, TreeSelect} from "antd";
import {isObjEmpty} from "esn";
import Up_Tree from "./tree";
import {ajax} from "../utils/common";
import {up_confirm} from "../modal"
import {ArrowDownOutlined, ArrowUpOutlined, EditOutlined, PlusOutlined, RestOutlined} from "@ant-design/icons";

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
  treeEditUrl: null,
  values:{},
  onValuesChange:()=>{}

}


export function Tree_form(prop) {
  const props = {
    ...defaultProps,
    ...prop
  };

  const {key_label, key_value, name, id, parentId, change_pos, father_item, select_data, rootId, titleRule, tree_delect, move_url, value, treeEditUrl, treeData,onValuesChange} = props;


  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    // Update the document title using the browser API
    form.resetFields();
    return () => {

    }

  }, [select_data, value]);

  let handleSubmit = values => {
    console.log("Received values of form: ", values);
    eidt_tree({...values,...props.values});
  };

  //我的资源分类_添加/修改我的资源分类
  let eidt_tree = (values, id = select_data[key_value]) => {
    let obj = {};
    obj[props.id] = id;
    let _url = props.tree_edit
    if (treeEditUrl && id) {
      _url = treeEditUrl
    }
    setLoading(true)

    props.ajax(_url, {...values, ...obj}, data => {
      message.success(props.msg(data));
      props.onSelect();
      props.get_tree();
      form.resetFields();
      setLoading(false)

    });
  };

  //删除我的资源分类
  let delect_tree = (id = select_data[key_value]) => {
    let obj = {};
    obj[props.id] = id;
    props.ajax(tree_delect, obj, data => {
      message.success(props.msg(data));
      props.get_tree();
      props.onSelect();
      // props.rest_select_data();
      form.resetFields();
    });
  };

  //移动资源
  let move_tree = (forward = "up", id = select_data[key_value]) => {
    let obj = {};
    obj[props.id] = id;
    obj[props.orderForward] = forward
    props.ajax(move_url, obj, data => {
      message.success(props.msg(data));
      props.get_tree();
      // props.rest_select_data();
      // props.form.resetFields(props.name);
    });
  };


  let delect = () => {
    up_confirm(delect_tree)
  };

  let move = (forward) => {
    move_tree(forward);
  };

  //childisabled他的子类也不能点
  let renderTreeNodes = (data, dis = null, childisabled = false) => {
    return data.map((item, i) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            title={item[key_label]}
            key={item[key_value]}
            value={item[key_value]}
            dataRef={item}
            disabled={dis === item[key_value] || childisabled}
          >
            {renderTreeNodes(item.children, dis, dis === item[key_value] || childisabled)}
          </TreeNode>
        );
      }

      return (
        <TreeNode
          title={item[key_label]}
          key={item[key_value]}
          value={item[key_value]}
          dataRef={item}
          disabled={dis === item[key_value] || childisabled}
        />
      );
    });
  };

  let initialValues = {}

  let lists = props.formData.map((data, i) => {
    initialValues[data.field] = props.select_data ?
      data.init_warp ?
        data.init_warp(props.select_data[data.field])
        : props.select_data[data.field]
      : data.initValue
    return (
      <Fragment key={i}>
        {props.select_data && data.hide ? null :
          <FormItem
            {...formItemLayout}
            label={data.title}
            extra={data.extra}
            {...{
              name: data.field,
              rules: data.rules ? [{
                required: data.fill, message: `请输入${data.title}!`,
              }, ...data.rules] : [{
                required: data.fill, message: `请输入${data.title}!`,
              }],
              ...data.other_set
            }}
          >
            {data.comp ? data.comp : <Input placeholder={`请输入${data.title}`}/>}
          </FormItem>}
      </Fragment>
    )
  })

  let tree_father = () => {
    if (father_item) {
      return father_item[key_value];
    } else if (
      !isObjEmpty(select_data) &&
      father_item == null
    ) {
      return rootId;
    } else {
      return "";
    }
  };
  let root = {children: props.treeData};
  root[key_label] = "根目录";
  root[key_value] = rootId;

  initialValues[name] = props.select_data[key_label]
  initialValues[parentId] = tree_father()

  return (
    <Form onFinish={handleSubmit}
          form={form}
          initialValues={initialValues}
          onValuesChange={(changedValues, allValues) => {
            onValuesChange(changedValues, allValues,form)
          }}
    >
      <FormItem {...formItemLayout} label="名称" name={name} {...{
        rules: [{required: true, message: '请输入名称'}, ...titleRule]
      }}>
        <Input placeholder="请输入名称" allowClear/>
      </FormItem>
      <FormItem {...formItemLayout} label="上级目录" name={parentId} {...{
        rules: [{required: true, message: '请选择上级目录'}]
      }}>
        <TreeSelect
          // showSearch
          allowClear
          dropdownStyle={{maxHeight: 400, overflow: "auto"}}
          placeholder="请选择上级目录"
          disabled={!change_pos && !(JSON.stringify(select_data) === "{}")}
        >
          {renderTreeNodes([root], props.select_data[key_value])}
        </TreeSelect>
      </FormItem>
      {lists}
      <FormItem {...tailFormItemLayout}>
        <div className="up_tree_eidt_form_btn">
          <div>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!props.tree_edit || loading}
            >
              {
                Object.keys(props.select_data).length === 0
                  ? <PlusOutlined/>
                  : <EditOutlined/>
              }{" "}
              {Object.keys(props.select_data).length === 0
                ? "新增"
                : "修改"}
            </Button>
          </div>
          {Object.keys(props.select_data).length !== 0 ? (
            <Fragment>
              <div>
                <Button type="primary" shape="circle"
                        onClick={move.bind(this, "up")}><ArrowUpOutlined style={{color: "#fff"}}/></Button>
              </div>
              <div>
                <Button type="primary" shape="circle"
                        onClick={move.bind(this, "down")}><ArrowDownOutlined style={{color: "#fff"}}/></Button>
              </div>
              <div>
                <Button type="danger" onClick={delect} disabled={!props.tree_delect}>
                  <RestOutlined/> 删除
                </Button>
              </div>
            </Fragment>
          ) : null}
        </div>
      </FormItem>
    </Form>
  );
};


export default class TreeEidt extends React.Component {
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
    key_label: "label",
    //树的value
    key_value: "value",
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
    //获取树的url
    treeUrl: "",
    //根目录的id，默认是-1
    rootId: -1,
    //其他需要写入的树表单字段
    formData: [],
    //标题校验规则
    titleRule: [],
    minWidth: "auto",
    //切换新增和修改的时候的事件
    changeAdd:(isAdd)=>{

    }
  };

  state = {
    select_data: {},
    father_item: null,
    //从界面传来的树的数据
    treeData: null,
    value: null
  };


  componentDidMount = () => {
  };


  //选择的当前树
  onSelect = (value = null, obj = {}, father_item = null) => {
    this.up_tree.current.setSelectedKeys();
    this.setState({
      select_data: obj,
      father_item,
      value
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
    this.props.changeAdd(e.target.value === "a")
  };

  //更新数据的方法
  get_tree = () => {
    this.up_tree.current.get_tree();
  }

  set_tree_data = (treeData) => {
    this.setState({
      treeData
    })
  }

  render() {
    const {minWidth, clotheLang} = this.props;
    const {treeData, select_data, value} = this.state

    return (
      <div className="up_tree_eidt_warp">

        <div className="up_tree_eidt_warp_l" style={{minWidth: minWidth}}>
          <Up_Tree
            ref={this.up_tree}
            select={this.onSelect}
            set_tree_data={this.set_tree_data}
            {...this.props}
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
            treeData={treeData}
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
