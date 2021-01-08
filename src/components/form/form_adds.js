/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, useEffect, useState} from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import {isString} from 'esn'
import {ajax} from "../utils/common"

const FormItem = Form.Item;

const defaultProps = {
  ajax: ajax,
  //生成表单的各个字段
  formData: [{
    //表单标题
    title: "编号",
    //字段
    field: "id",
    //是否必填
    fill: true,
    //表单规则
    rules: [{
      max: 10, message: '长度不得超过10',
    }],
    //默认值,可以是函数，(text,record)=>{}
    initValue: 1,
    //其他的规则对象设置
    config: {},
    //其他提示
    extra: "",
    //日期控件用到的format
    format: 'YYYY-MM-DD',
    //表单组件
    component: <Input/>,
    //编辑时是否需要隐藏
    hide: false,
    //新增时是否需要隐藏
    addHide: true,
    //是否需要占一整行
    isLine: true,
    //根据哪个字段来判断显示还是不显示
    relation: null,
  }, {
    //表单标题
    title: "标题",
    //字段
    field: "title",
    fill: false,
    //表单规则
    rules: [{
      max: 10, message: '长度不得超过10',
    }],
    //表单组件
    component: <Input/>,
  }, {
    //表单标题
    title: "上传图片环节缓解带回家去外地",
    //字段
    field: "img",
    fill: false,
    //表单组件
    component: <Input/>,
    rules: []
  }],
  //submit提交
  submit: (values, record, fun) => {
    console.log(values, record, fun)
    fun()
  },
  //编辑新增的提交url
  addUrl: null,
  //提交后的操作，比如关闭弹框之类
  addFormSubmitCallback: () => {
  },
  //编辑时单条的数据
  record: null,
  //上面表单组件的位置
  formItemLayout: [6, 16],
  //编辑时传递的主键
  primaryKeyField: "id",
  //有几列数据
  li: 1,
  //表单的样式
  className: "",
  //时间的格式
  dateFormat: 'YYYY-MM-DD',
  //提交时需要的额外参数
  values: {},
  //是否需要提交和重置
  hasBtn: true,
  //编辑需要另外的url的
  editUrl: null,
  //额外需要的表单component
  otherForm: () => <div></div>,
  //form表单需要的设置
  config: {},
  //组件变化是否需要重置值
  formDataChangeRest: false,
  //编辑时有遇到hide字段，是否需要隐藏整个组件
  hideParam: false,
  //实例运行时，返回一个form
  returnFormCallback: (form) => {

  },
  //是否需要表格是label和input是横向结构
  layoutHorizontal: true,
  //底部按钮之上的文本
  renderFooter: () => (<span></span>),
  //触发重置的字段
  visible: false,
  //是否需要在visible为false的时候重置表单
  isVisibleRest: false,
  //表单数据变化时的回调
  onValuesChange: (changedValues, allValues) => {

  },
  //禁用提交按钮
  disabledBtn:false,
  size: "middle",
  //其他新增时需要的按钮,用<div>包裹一下
  otherBtn:({form})=><Fragment/>,
  //提交时的文本
  submitText:null,
  //自定义提交按钮
  CustomSubmit:null
}

export let formItemLayoutFun = (formItemLayout_, _layoutHorizontal) => {
  if (_layoutHorizontal) {
    return {
      labelCol: {
        xs: {span: 24},
        sm: {span: formItemLayout_[0]},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: formItemLayout_[1]},
      },
    }
  } else {
    return {
      labelCol: {
        xs: {span: 24},
        sm: {span: 24},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
      },
    }
  }
}

export default function index(prop, ref) {
  const props = {
    ...defaultProps,
    ...prop
  };

  const {li, className, formData, hasBtn, editUrl, otherForm, record, config, formDataChangeRest, hideParam, returnFormCallback, layoutHorizontal, renderFooter, visible, isVisibleRest, clotheLang, onValuesChange,disabledBtn,size,otherBtn,submitText,CustomSubmit} = props;


  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(false);
  const [actData, setActData] = useState(null);
  let count = 0;

  useEffect(() => {
    // Update the document title using the browser API
    returnFormCallback(form);
    return () => {
    }
  }, []);

  useEffect(() => {
    // Update the document title using the browser API
    if (formDataChangeRest) {
      form.resetFields();
    }

    return () => {
    }
  }, [formData]);

  useEffect(() => {
    // Update the document title using the browser API

    if (isVisibleRest && !visible) {
      form.resetFields()
    }
    return () => {
    }
  }, [visible]);

  useEffect(() => {
    // Update the document title using the browser API
    count++;
    if (record) {
      form.setFieldsValue(record)
    } else {
      // if (count > 1) {
        form.resetFields()
      // }
    }
    return () => {
    }
  }, [record]);

  let formItemLayout = (formItemLayout_ = props.formItemLayout, _layoutHorizontal = layoutHorizontal) => formItemLayoutFun(formItemLayout_, _layoutHorizontal);

  const rest = () => {
    form.resetFields();
    //this.props.submit({});
  }

  function handleSubmit(values){
    // let _record =null
    // if(record){
    //     _record = cloneop(record);
    // }

    setDisabled(true)
    let values_temp = {};
    if (!hideParam) {
      values_temp = {...initialValues, ...values, ...props.values};
    } else {
      values_temp = {...values, ...props.values};
    }

    for (let i in values_temp) {
      if (values_temp[i] && values_temp[i]._isAMomentObject) {
        let index = props.formData.find((data) => {
          return i === data.field
        })
        values_temp[i] = values_temp[i].format(index.format ? index.format : props.dateFormat)
      }
    }
    if (props.record) {
      values_temp[props.primaryKeyField] = props.record[props.primaryKeyField]
    }

    if (props.addUrl) {
      let _url = props.addUrl
      if (editUrl && props.record && props.record[props.primaryKeyField]) {
        _url = editUrl
      }
      props.ajax(_url, values_temp, (data) => {
        props.addFormSubmitCallback(data, values_temp)
        setTimeout(function () {
          rest();
        },1000)
      }, () => {
        setDisabled(false)
      })
    } else {
      props.submit(values_temp, props.record, (data) => {
        props.addFormSubmitCallback(props.record, data)
        setDisabled(false)
        setTimeout(function () {
          rest();
        },1000)
      },()=>{
          setDisabled(false)
      });
    }
  }
  let initialValues = {}

  let counts = 0;
  let line = 0;

  let lists = props.formData.map((data, i) => {
    initialValues[data.field] = props.record ?
      typeof data.initValue === "function" ?
        data.initValue(props.record[data.field], props.record)
        : props.record[data.field]
      : data.initValue

    if (record ? !data.hide : !data.addHide) {
      counts++
    }

    let listStyle = {};
    if (data.isLine) {
      line++
      listStyle.gridColumnStart = `span ${li}`;
      listStyle.gridRowStart = Math.floor(counts / li) + line;
    }

    return (
      <Fragment key={i}>
        {(props.record && data.hide) || (!props.record && data.addHide) || data.relation && (!actData && data.relation(initialValues) || props.record && !actData && data.relation(props.record) || actData && data.relation(actData)) ? null :
          <div style={listStyle}>
            <FormItem
              {...data.formItemLayout ? formItemLayout(data.formItemLayout) : formItemLayout()}
              label={data.title}
              style={{
                marginBotton: 10
              }}
              extra={data.extra ? (typeof data.extra === "function" ? data.extra() : data.extra) : ""}
              {...{
                name: data.field,
                rules: [{
                  required: data.fill, message: `${clotheLang.form.pleaseEnter}${data.title}!`,
                }, ...(data.rules ? data.rules : [])],
                ...data.config
              }}
            >
              {data.component ? (typeof data.component === "function" ? data.component(props.record) : data.component) :
                <Input placeholder={`${clotheLang.form.pleaseEnter}${data.title}`} allowClear size={size}/>}
            </FormItem>
          </div>}
      </Fragment>
    )
  })


  return (
    <Form
      onFinish={handleSubmit}
      form={form}
      initialValues={initialValues}
      layout={layoutHorizontal ? "horizontal" : "vertical"}
      onValuesChange={(changedValues, allValues) => {
        setActData(allValues)
        onValuesChange(changedValues, allValues,form)
      }}
      {...config}
    >
      <div className={className} style={{width: "100%"}}>
        <div className="up_table_form_add_list" style={{gridTemplateColumns: `repeat(${li}, 1fr)`, gridColumnGap: li === 1 ? "0" : "2%"}}>
          {lists}
        </div>
        <div className="">
          {otherForm()}
        </div>
        {hasBtn ? <div style={{width: li === 1 ? "100%" : ((100 / li) - 1.333333) + "%"}}>
          <Row>
            <Col {...formItemLayout().labelCol}/>
            <Col {...formItemLayout().wrapperCol}>
              <div className="up_table_form_add_btn">
                {otherBtn({form})}
                {CustomSubmit?<CustomSubmit form={form} submit={form.submit}/>:<div>
                  <Button disabled={disabled || disabledBtn} type="primary" htmlType="submit">{submitText?submitText:clotheLang.form.submit}</Button>
                </div>}
                {!props.record ? <div>
                  <Button disabled={disabled} onClick={rest}
                  >
                    {clotheLang.form.rest}
                  </Button>
                </div> : null}
              </div>
              <div className="up_table_form_add_renderFoot">
                {isString(renderFooter) ? renderFooter : renderFooter()}
              </div>
            </Col>
          </Row>
        </div> : null}
      </div>
    </Form>
  );
};
