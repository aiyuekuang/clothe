import {Form, Input, Button, Checkbox} from 'antd';
import {MinusCircleOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined} from '@ant-design/icons';
import React, {Fragment, useEffect, useState, useImperativeHandle, forwardRef} from 'react';
import {formItemLayoutFun} from "./FormAdd";
import PropTypes from "prop-types";

const {TextArea} = Input



const FormCustom = forwardRef((props,ref) => {
  const [arr, setArr] = useState([]);


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
});

FormCustom.propTypes = {
  /** 整个组件的主色调，比如箭头图标等 */
  color:PropTypes.string,
  /** 标题和组件的比例 */
  formItemLayout: PropTypes.array,
  /** 标题 */
  label: PropTypes.string,
  /** 组件的antd规则 */
  rules: PropTypes.array,
  /** 组件的提交的字段 */
  name: PropTypes.string,
  /** 是文本框还是要输入框 */
  isTextArea: PropTypes.bool
};
FormCustom.defaultProps = {
  /** 整个组件的主色调，比如箭头图标等 */
  color: "#1DA57A",
  /** 标题和组件的比例 */
  formItemLayout: [6, 16],
  /** 标题 */
  label: "选项",
  /** 组件的规则 */
  rules: [
    {
      required: true,
      whitespace: true,
      message: "不能为空",
    },
  ],
  /** 组件的提交的字段 */
  name: "options",
  /** 是文本框还是要输入框 */
  isTextArea: false
};

export default FormCustom