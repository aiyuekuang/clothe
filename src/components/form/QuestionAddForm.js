import {Form, Input, Button, Checkbox, Switch} from 'antd';
import {MinusCircleOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined} from '@ant-design/icons';
import React, {Fragment, useEffect, useState, useRef, forwardRef} from 'react';
import {QuestionAddFormIn,FormAdd} from "../index"
import PropTypes from "prop-types";


const QuestionAddForm = forwardRef((props,ref) => {


    const dateRef = useRef()

    const {formData, submit, color, hasOpt, record, disabledAdd,clotheLang} = props;

    const submitFun = (values, record, fun) => {
        let _values = {...values}
        if (hasOpt) {
            _values.isEmpty = dateRef.current.returnArr()
        }
        submit(_values, record, fun)
    }

    return (
        <FormAdd
            record={record}
            formData={formData}
            submit={submitFun}
            otherForm={() => {
                if (hasOpt) {
                    return (
                        <QuestionAddFormIn
                            record={record}
                            color={color}
                            ref={dateRef}
                            disabledAdd={disabledAdd}
                        />
                    )
                } else {
                    return null
                }
            }}
        />
    );
});
QuestionAddForm.propTypes = {
    /** 整个组件的主色调，比如箭头图标等 */
    color: PropTypes.string,
    /** 提交 () => {

    }*/
    submit: PropTypes.func,
    /** 生成表单的数据
     * title---表单标题
     * field---字段
     * initValue---默认值,可以是函数，(text,record)=>{}
     * extra---其他提示
     * config---表单组件的其他antd的formitem设置
     * component---antd的表单组件
     * */
    formData:PropTypes.array,
    /** 是否有自定义表单的选项 */
    hasOpt: PropTypes.bool,
    /** 写入表单数据 */
    record: PropTypes.object,
    /** 是否需要禁用新增，主要是编辑时不给新增用来禁用 */
    disabledAdd: PropTypes.bool
};
QuestionAddForm.defaultProps = {
    /** 整个组件的主色调，比如箭头图标等 */
    color: "#1DA57A",
    /** 提交 */
    submit: () => {

    },
    /** 生成表单的数据 */
    formData: [{
        //表单标题
        title: "是否必答",
        //字段
        field: "must",
        //默认值,可以是函数，(text,record)=>{}
        initValue: true,
        //其他提示
        extra: "",
        //表单组件
        config: {
            valuePropName: 'checked'
        },
        component: <Switch checkedChildren="是" unCheckedChildren="否"/>
    }, {
        //表单标题
        title: "标题",
        //字段
        field: "title",
        fill: true,
        //表单组件
        component: <Input/>,
    }],
    /** 是否有自定义表单的选项 */
    hasOpt: true,
    /** 写入表单数据 */
    record: null,
    /** 是否需要禁用新增，主要是编辑时不给新增用来禁用 */
    disabledAdd: false
};
export default QuestionAddForm;