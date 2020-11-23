import {Form, Input, Button, Checkbox, Space} from 'antd';
import {MinusCircleOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined} from '@ant-design/icons';
import React, {Fragment, useEffect, useState, useImperativeHandle, forwardRef} from 'react';

let defaultProps = {
  color: "#1DA57A",
  formItemLayout: [6, 16],
  multiple: false,
  record: null,
  rules: [
    {
      required: true,
      whitespace: true,
      message: "不能为空",
    },
  ],
  name: "options",
  component: null,
  otherComp: [{
    title: "地区",
    field: "label",
    fill: true,
    width: 3,
    component: <Input/>
  }, {
    title: "值",
    field: "value",
    fill: true,
    width: 3,
    component: <Input/>
  }, {
    title: "值的",
    field: "extra",
    fill: true,
    width: 10,
    component: <Input/>
  }]
}

function Index(prop, ref) {

  let props = {
    ...defaultProps, ...prop
  }
  const {color, record, label, rules, name, isTextArea, clotheLang, component, otherComp} = props;

  useEffect(() => {
    // Update the document title using the browser API

    return () => {
    }
  }, []);

  let _style = {
    className: "dynamic-delete-button",
    style: {margin: '0 8px', fontSize: 14, color: color}
  }

  let formItemLayoutBtn = (formItemLayout_ = props.formItemLayout) => {
    return {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: formItemLayout_[1], offset: formItemLayout_[0]},
      },
    }
  }


  let list = (field, index) => otherComp.map((data, i) => {

    let rules = () => {
      return [
        {
          required: data.fill,
          whitespace: true,
          message: `${data.title}不能为空`,
        },
      ]
    }

    return (<div className="anup_form_custom" style={{width: data.width + "0%"}} key={data.field}>
      <Form.Item
        {...field}
        name={[field.name, data.field]}
        fieldKey={[field.fieldKey, data.field]}
        validateTrigger={['onChange', 'onBlur']}
        rules={rules()}
        noStyle
      >
        {data.component ? data.component : <Input
          placeholder={`${data.title}${index + 1}`}/>}
      </Form.Item>
    </div>)
  })

  return (
    <Fragment>
      <Form.List name={name}>
        {(fields, {add, remove}) => {
          return (
            <div>
              {fields.map((field, index) => {
                return (
                  <Form.Item
                    {...formItemLayoutBtn()}
                    key={field.key}
                  >
                    <div className="anup_form_custom_warp">
                      <div className="anup_form_custom_warp_l">
                        {list(field, index)}
                      </div>
                      <div className="anup_form_custom_warp_r">
                        <div className="anup_form_ques_opt">
                          {fields.length > 1 ? <Fragment>
                            <div>
                              <ArrowUpOutlined
                                {..._style}
                                onClick={() => {
                                  move(index, index - 1);
                                }}
                              />
                            </div>
                            <div>
                              <ArrowDownOutlined
                                {..._style}
                                onClick={() => {
                                  move(index, index + 1);
                                }}
                              />
                            </div>
                          </Fragment> : null}
                          <div>
                            <MinusCircleOutlined
                              {..._style}
                              onClick={() => {
                                remove(field.name);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form.Item>
                )
              })}
              <Form.Item
                {...formItemLayoutBtn()}
              >
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  style={{width: '60%'}}
                >
                  <PlusOutlined/> {clotheLang.form.add}
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>
    </Fragment>
  );
};

export default Index = forwardRef(Index)