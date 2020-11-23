/**
 * Created by zengtao on 2017/5/19.
 */
import React, {useEffect, useState} from 'react';
import {Button, Form, Input} from 'antd';
import {DownOutlined, UpOutlined} from '@ant-design/icons';
import {formItemLayoutFun} from "./form_adds";


const FormItem = Form.Item;

const defaultProps = {
  //生成表单的各个字段
  formData: [{
    //表单标题
    title: "标题",
    //字段
    field: "email",
    //表单规则
    rules: [{
      max: 10, message: '长度不得超过10',
    }],
    //默认值
    initValue: 1,
    //表单组件
    component: <Input/>,
    //是否在收起时显示
    isTop: true
  }, {
    //表单标题
    title: "关键字",
    //字段
    field: "email2",
    //表单规则
    rules: [{
      max: 10, message: '长度不得超过10',
    }],
    //表单组件
    component: <Input/>,
    //是否在收起时显示
    isTop: false
  }],
  //submit提交
  submit: (values) => {
    console.log(values)
  },
  //是横向布局还是竖着的布局，默认是横向的
  searchLine: true,
  //布局比例
  formItemLayout: [5, 17],
  //是否需要无label的模式
  noLabel: false,
  //form表单需要的设置
  formSet: {},
  //实例运行时，返回一个form
  returnFormCallback: (form) => {

  },
  //是否需要表格是label和input是横向结构
  layoutHorizontal: true,
  //表单数据变化时的回调
  onValuesChange: (changedValues, allValues) => {

  },
  //是否需要提交按钮
  hasSubmit: true,
  //是否需要重置按钮
  hasRest:true,
  //展开或者收起时，触发的回调
  toggleCallback:(bool)=>{

  },
  //重置的时候的回调
  restCallback:()=>{}
}

export default function index(prop) {
  const props = {
    ...defaultProps,
    ...prop
  };

  const {searchLine, formData, noLabel, formSet, returnFormCallback, clotheLang, layoutHorizontal, onValuesChange, hasSubmit,hasRest,toggleCallback,restCallback} = props;

  const [form] = Form.useForm();
  const [toogle, setToogle] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Update the document title using the browser API
    showFun()
    returnFormCallback(form);
    return () => {
    }
  }, []);

  useEffect(() => {
    // Update the document title using the browser API
    toggleCallback(!toogle)
    return () => {
    }
  }, [toogle]);

  let formItemLayout = (formItemLayout_ = props.formItemLayout, _layoutHorizontal = layoutHorizontal) => formItemLayoutFun(formItemLayout_, _layoutHorizontal);

  let showFun = (arr = props.formData) => {
    let index = arr.find((data, i) => {
      return !data.isTop
    })
    setShow(index !== undefined)
  }

  const toogle_fun = () => {
    if (!toogle) {
      let rest_field = [];
      for (let i = 0; i < props.formData.length; i++) {
        if (!props.formData[i].isTop) {
          rest_field.push(props.formData[i].field)
        }
      }
      form.resetFields(rest_field);
    }
    setToogle(!toogle)
  }


  const rest = () => {
    form.resetFields();
    form.validateFields()
      .then(values => {
        restCallback(form)
        props.submit(values);
      })
  }

  const handleSubmit = (values) => {
    props.submit(values);
  }

  let initialValues = {}


  let lists = formData.map((data, i) => {
    let prop = {}
    if (!noLabel) {
      prop.label = data.title
    }

    initialValues[data.field] = data.initValue

    let dom = (<FormItem
      name={data.field}
      {...prop}
      {...{
        name: data.field,
        rules: [{
          required: data.fill, message: `${clotheLang.form.pleaseEnter}${data.title}!`,
        }, ...(data.rules ? data.rules : [])],
        ...data.other_set
      }}
    >
      {data.component ? data.component : <Input placeholder={`${clotheLang.form.pleaseEnter}${data.title}`} allowClear/>}
    </FormItem>)


    if (toogle) {
      if (data.isTop) {
        return (
          <div key={i}>
            {dom}
          </div>
        )
      } else {
        return null
      }
    } else {
      return (
        <div key={i}>
          {dom}
        </div>
      )
    }
  })

  return (
    <Form onFinish={handleSubmit}
          form={form}
          initialValues={initialValues}
          labelAlign="left"
          onValuesChange={(changedValues, allValues) => {
            onValuesChange(changedValues, allValues,form)
            if (!hasSubmit) {
              props.submit(allValues);
            }
          }}
          // className="ant-advanced-search-form"
          {...formSet}
    >
      <div className="up_table_form">
        {lists}
        {hasSubmit ? <div>
          <div className="up_table_form_btn ant-form-item">
           <Button
              type="primary"
              htmlType="submit"
            >
              {clotheLang.form.query}
            </Button>
            {hasRest?<Button
              style={{marginLeft: 10}}
              onClick={rest}
            >
              {clotheLang.form.rest}
            </Button>:null}
            {show ? <a
              style={{marginLeft: 6}}
              onClick={toogle_fun}>
              {toogle ? clotheLang.form.open : clotheLang.form.putItAway}&nbsp;
              {toogle ? <DownOutlined/> : <UpOutlined/>}
            </a> : null}
          </div>
        </div> : null}
      </div>
    </Form>
  );
};
