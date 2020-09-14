import {Form, Input, Button, Checkbox} from 'antd';
import {MinusCircleOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined} from '@ant-design/icons';
import React, {Fragment, useEffect, useState, useImperativeHandle, forwardRef} from 'react';
import {formItemLayoutFun} from "./form_adds";

const {TextArea} = Input

let defaultProps = {
  color: "#1DA57A",
  formItemLayout: [6, 16],
  multiple: false,
  record: null,
  label: "选项",
  rules: [
    {
      required: true,
      whitespace: true,
      message: "不能为空",
    },
  ],
  name: "options",
  isTextArea: false
}

function Index(prop, ref) {
  const [arr, setArr] = useState([]);

  let props = {
    ...defaultProps, ...prop
  }
  const {color, record, label, rules, name, isTextArea, clotheLang} = props;

  useEffect(() => {
    // Update the document title using the browser API

    return () => {
    }
  }, []);

  let _style = {
    className: "dynamic-delete-button",
    style: {margin: '0 8px', fontSize: 14, color: color}
  }

  let formItemLayout = (formItemLayout_ = props.formItemLayout) => formItemLayoutFun(formItemLayout_, true);

  let formItemLayoutBtn = (formItemLayout_ = props.formItemLayout) => {
    return {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: formItemLayout_[1], offset: formItemLayout_[0]},
      },
    }
  }

  useImperativeHandle(ref, () => ({
    returnArr: () => {
      return arr;
    }
  }))

  return (
    <Fragment>
      <Form.List name={name}>
        {(fields, {add, remove, move}) => {
          return (
            <div>
              {fields.map((field, index) => {
                return (
                  <Form.Item
                    {...formItemLayout()}
                    label={`${label}${index + 1}`}
                    required={true}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={rules}
                      noStyle
                    >
                      {isTextArea ? <TextArea placeholder={`${clotheLang.form.pleaseEnterOptions}${index + 1}`}
                                              style={{width: '60%'}}/> :
                        <Input placeholder={`${clotheLang.form.pleaseEnterOptions}${index + 1}`} style={{width: '60%'}} allowClear/>}
                    </Form.Item>
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
                        <div>
                          <MinusCircleOutlined
                            {..._style}
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        </div>
                      </Fragment> : null}
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