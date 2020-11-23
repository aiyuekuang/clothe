import {Form, Input, Button, Checkbox, Switch} from 'antd';
import {MinusCircleOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined} from '@ant-design/icons';
import React, {Fragment, useEffect, useState, useRef} from 'react';
import {QuestionAddFormIn,FormAdd} from "../index"


let defaultProps = {
    color: "#1DA57A",
    submit: () => {

    },
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
        other_set: {
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
    //是否有选择
    hasOpt: true,
    record: null,
    disabledAdd: false
}

export default function Index(prop, ref) {
    const [isEmpty, setIsEmpty] = useState([]);

    const dateRef = useRef()
    let props = {
        ...defaultProps, ...prop
    }
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
};
