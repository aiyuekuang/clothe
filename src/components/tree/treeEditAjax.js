/**
 * Created by zengtao on 2017/5/19.
 */
import React, {createRef} from 'react';

import {Form, Radio, Tree} from "antd";
import {TreeFromAjax} from "../index";
import {ajax} from "../utils/common";
import Tree_form from "./tree_eidt";
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


export default class TreeEditAjax extends React.Component {
    constructor(props) {
        super(props);
        //React16.3中创建Ref的方法
        this.up_tree = createRef();
    }

    static propTypes = {
        /** ajax的实现函数 */
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
        id: PropTypes.string,
        /** 上级树的id */
        parentId: PropTypes.string,
        /** 分类名称 */
        name: PropTypes.string,
        /** 修改或删除成功后的提示 (data) => {return "操作成功"}*/
        msg: PropTypes.func,
        /** 是否可以换位置 */
        isChangePos: PropTypes.bool,
        /** 上移下移url */
        move_url: PropTypes.string,
        /** 上移下移的接口标示 */
        orderForward: PropTypes.string,
        /** 根目录的id，默认是-1 */
        rootId: PropTypes.number,
        /** 其他需要写入的树表单字段 */
        formData: PropTypes.array,
        /** 标题校验规则 */
        titleRule: PropTypes.array,
        /** 最小宽度 */
        minWidth: PropTypes.string,
    };

    static defaultProps = {
        /** ajax的实现函数 */
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
        id: "id",
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
        move_url: "",
        /** 上移下移的接口标示 */
        orderForward: "orderForward",
        /** 根目录的id，默认是-1 */
        rootId: -1,
        /** 其他需要写入的树表单字段 */
        formData: [],
        /** 标题校验规则 */
        titleRule: [],
        /** 最小宽度 */
        minWidth: "auto",
    };

    state = {
        selectData: {},
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
            selectData: value,
            father_item: father_item && father_item.length > 1 ? father_item.slice(-2)[0] : null,
            value: value[dataSourceValue]
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
    };

    //更新数据的方法
    getTree = () => {
        this.up_tree.current.onLoadData();
    }

    getTreeData = (treeDataProps) => {
        this.setState({
            treeDataProps
        })
    }


    render() {
        const {minWidth} = this.props;
        const {treeDataProps, selectData, value, clotheLang} = this.state

        return (
            <div className="up_tree_eidt_warp">
                <div className="up_tree_eidt_warp_l" style={{minWidth: minWidth}}>
                    <TreeFromAjax
                        ref={this.up_tree}
                        onSelect={this.onSelect}
                        getTreeData={this.getTreeData}
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
                        selectData={this.state.selectData}
                        restSelectData={this.restSelectData}
                        father_item={this.state.father_item}
                        getTree={this.getTree}
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
