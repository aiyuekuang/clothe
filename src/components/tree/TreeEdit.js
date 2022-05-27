/**
 * Created by zengtao on 2017/5/19.
 */
import React, {createRef, Fragment, useEffect, useState} from 'react';

import {Button, Form, Input, message, Radio, Tree, TreeSelect} from "antd";
import {isObjEmpty} from "esn";
import {TreePro} from "../index";
import {ajax} from "../utils/common";
import {up_confirm} from "../modal"
import {ArrowDownOutlined, ArrowUpOutlined, EditOutlined, PlusOutlined, RestOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";

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
    getTree: () => {
    },
    //删除树之后，刚刚删的树的数据也要重置
    restSelectData: () => {
    },
    //选中的树
    selectData: {},
    //树控件新增、修改的接口地址
    treeEdit: "",
    //树控件的删除地址
    treeDelete: "",
    treeEditUrl: null,
    values: {},
    onValuesChange: () => {
    }
}


export function Tree_form(prop) {
    const props = {
        ...defaultProps,
        ...prop
    };

    const {dataSourceKey, dataSourceValue, name, primaryKeyField, parentId, isChangePos, father_item, selectData, rootId, titleRule, treeDelete, moveUrl, value, treeEditUrl, treeData, onValuesChange} = props;


    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        // Update the document title using the browser API
        form.resetFields();
        return () => {

        }

    }, [selectData, value]);

    let handleSubmit = values => {
        console.log("Received values of form: ", values);
        eidt_tree({...values, ...props.values});
    };

    //我的资源分类_添加/修改我的资源分类
    let eidt_tree = (values, id = selectData[dataSourceValue]) => {
        let obj = {};
        obj[primaryKeyField] = id;
        let _url = props.treeEdit
        if (treeEditUrl && id) {
            _url = treeEditUrl
        }
        setLoading(true)

        props.ajax(_url, {...values, ...obj}, data => {
            message.success(props.msg(data));
            props.onSelect();
            props.getTree();
            form.resetFields();
            setLoading(false)

        });
    };

    //删除我的资源分类
    let delect_tree = (id = selectData[dataSourceValue]) => {
        let obj = {};
        obj[props.primaryKeyField] = id;
        props.ajax(treeDelete, obj, data => {
            message.success(props.msg(data));
            props.getTree();
            props.onSelect();
            // props.restSelectData();
            form.resetFields();
        });
    };

    //移动资源
    let move_tree = (forward = "up", id = selectData[dataSourceValue]) => {
        let obj = {};
        obj[props.primaryKeyField] = id;
        obj[props.orderForward] = forward
        props.ajax(moveUrl, obj, data => {
            message.success(props.msg(data));
            props.getTree();
            // props.restSelectData();
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
                        title={item[dataSourceKey]}
                        key={item[dataSourceValue]}
                        value={item[dataSourceValue]}
                        dataRef={item}
                        disabled={dis === item[dataSourceValue] || childisabled}
                    >
                        {renderTreeNodes(item.children, dis, dis === item[dataSourceValue] || childisabled)}
                    </TreeNode>
                );
            }

            return (
                <TreeNode
                    title={item[dataSourceKey]}
                    key={item[dataSourceValue]}
                    value={item[dataSourceValue]}
                    dataRef={item}
                    disabled={dis === item[dataSourceValue] || childisabled}
                />
            );
        });
    };

    let initialValues = {}

    let lists = props.formData.map((data, i) => {
        initialValues[data.field] = props.selectData ?
            data.init_warp ?
                data.init_warp(props.selectData[data.field])
                : props.selectData[data.field]
            : data.initValue
        return (
            <Fragment key={i}>
                {props.selectData && data.hide ? null :
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
                            ...data.config
                        }}
                    >
                        {data.component ? data.component : <Input placeholder={`请输入${data.title}`}/>}
                    </FormItem>}
            </Fragment>
        )
    })

    let tree_father = () => {
        if (father_item) {
            return father_item[dataSourceValue];
        } else if (
            !isObjEmpty(selectData) &&
            father_item == null
        ) {
            return rootId;
        } else {
            return "";
        }
    };
    let root = {children: props.treeData};
    root[dataSourceKey] = "根目录";
    root[dataSourceValue] = rootId;

    initialValues[name] = props.selectData[dataSourceKey]
    initialValues[parentId] = tree_father()

    return (
        <Form onFinish={handleSubmit}
              form={form}
              initialValues={initialValues}
              onValuesChange={(changedValues, allValues) => {
                  onValuesChange(changedValues, allValues, form)
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
                    disabled={!isChangePos && !(JSON.stringify(selectData) === "{}")}
                >
                    {renderTreeNodes([root], props.selectData[dataSourceValue])}
                </TreeSelect>
            </FormItem>
            {lists}
            <FormItem {...tailFormItemLayout}>
                <div className="up_tree_eidt_form_btn">
                    <div>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={!props.treeEdit || loading}
                        >
                            {
                                Object.keys(props.selectData).length === 0
                                    ? <PlusOutlined/>
                                    : <EditOutlined/>
                            }{" "}
                            {Object.keys(props.selectData).length === 0
                                ? "新增"
                                : "修改"}
                        </Button>
                    </div>
                    {Object.keys(props.selectData).length !== 0 ? (
                        <Fragment>
                            {moveUrl !== "" ? <Fragment>
                                <div>
                                    <Button type="primary" shape="circle"
                                            onClick={move.bind(this, "up")}><ArrowUpOutlined
                                        style={{color: "#fff"}}/></Button>
                                </div>
                                <div>
                                    <Button type="primary" shape="circle"
                                            onClick={move.bind(this, "down")}><ArrowDownOutlined
                                        style={{color: "#fff"}}/></Button>
                                </div>
                            </Fragment> : null}
                            <div>
                                <Button type="danger" onClick={delect} disabled={!props.treeDelete}>
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


export default class TreeEdit extends React.Component {
    constructor(props) {
        super(props);
        this.up_tree = createRef();
    }

    static propTypes = {
        /** ajax的实现 */
        ajax: PropTypes.func.isRequired,
        /** 树数据的新增与编辑地址 */
        treeEdit: PropTypes.string,
        /** 树控件的删除地址 */
        treeDelete: PropTypes.string,
        /** 树的label */
        dataSourceKey: PropTypes.string,
        /** 树的value */
        dataSourceValue: PropTypes.string,
        /** 提交的本级的id */
        primaryKeyField: PropTypes.string,
        /** 上级树的id */
        parentId: PropTypes.string,
        /** 分类名称 */
        name: PropTypes.string,
        /** 修改或删除成功后的提示 (data) => {return "操作成功"}*/
        msg: PropTypes.func,
        /** 是否可以换位置 */
        isChangePos: PropTypes.bool,
        /** 上移下移url */
        moveUrl: PropTypes.string,
        /** 上移下移的接口标示 */
        orderForward: PropTypes.string,
        /** 获取树的url */
        treeUrl: PropTypes.string,
        /** 根目录的id，默认是-1 */
        rootId: PropTypes.number,
        /** 其他需要写入的树表单字段 */
        formData: PropTypes.array,
        /** 标题校验规则 */
        titleRule: PropTypes.array,
        minWidth: PropTypes.any,
        /** 切换新增和修改的时候的事件 (isAdd)=>{}*/
        changeAdd: PropTypes.func
    };

    static defaultProps = {
        /** ajax的实现 */
        ajax: ajax,
        /** 树数据的新增与编辑地址 */
        treeEdit: null,
        /** 树控件的删除地址 */
        treeDelete: null,
        /** 树的label */
        dataSourceKey: "label",
        /** 树的value */
        dataSourceValue: "value",
        /** 提交的本级的id */
        primaryKeyField: "id",
        /** 上级树的id */
        parentId: "parentId",
        /** 分类名称 */
        name: "name",
        /** 修改或删除成功后的提示 */
        msg: (data) => {
            return "操作成功"
        },
        /** 是否可以换位置 */
        isChangePos: true,
        /** 上移下移url */
        moveUrl: "",
        /** 上移下移的接口标示 */
        orderForward: "orderForward",
        /** 获取树的url */
        treeUrl: "",
        /** 根目录的id，默认是-1 */
        rootId: -1,
        /** 其他需要写入的树表单字段 */
        formData: [],
        /** 标题校验规则 */
        titleRule: [],
        minWidth: "auto",
        /** 切换新增和修改的时候的事件 */
        changeAdd: (isAdd) => {

        }
    };

    state = {
        selectData: {},
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
            selectData: obj,
            father_item,
            value
        });
    };

    //删除树之后，刚刚删的树的数据也要重置
    restSelectData = (value = {}) => {
        this.setState({
            selectData: value
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
    getTree = () => {
        this.up_tree.current.getTree();
    }

    getTreeData = (treeData) => {
        this.setState({
            treeData
        })
    }

    render() {
        const {minWidth, clotheLang} = this.props;
        const {treeData, selectData, value} = this.state

        return (
            <div className="up_tree_eidt_warp">

                <div className="up_tree_eidt_warp_l" style={{minWidth}}>
                    <TreePro
                        ref={this.up_tree}
                        select={this.onSelect}
                        getTreeData={this.getTreeData}
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
                        selectData={this.state.selectData}
                        restSelectData={this.restSelectData}
                        father_item={this.state.father_item}
                        getTree={this.getTree}
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
