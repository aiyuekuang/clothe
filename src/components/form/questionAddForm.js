import {Form, Input, Button, Checkbox} from 'antd';
import {MinusCircleOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined} from '@ant-design/icons';
import React, {Fragment, useEffect, useState, useImperativeHandle, forwardRef} from 'react';
import {cloneop} from "esn";


let defaultProps = {
    color: "#1DA57A",
    formItemLayout: [6, 16],
    multiple: false,
    record: null,
    //
    isEmpty: "isEmpty",
    //是否需要禁用新增，主要是编辑时不给新增用来禁用
    disabledAdd:false
}

function Index(prop, ref) {
    const [arr, setArr] = useState([]);

    let props = {
        ...defaultProps, ...prop
    }

    const {color, record, isEmpty,disabledAdd,clotheLang} = props;

    useEffect(() => {
        // Update the document title using the browser API
        if(record){
            setArr(record[isEmpty])
        }

        return () => {
        }
    }, [record]);

    let _style = {
        className: "dynamic-delete-button",
        style: {margin: '0 8px', fontSize: 14, color: color}
    }

    function setFill(bool, index) {
        let _arr = cloneop(arr)
        _arr[index] = bool

        setArr(_arr)
    }

    let formItemLayout = (formItemLayout_ = props.formItemLayout) => {
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
    }

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
            <Form.List name="options">
                {(fields, {add, remove, move}) => {
                    return (
                        <div>
                            {fields.map((field, index) => {
                                let checkboxProps = record && record[isEmpty][index] ? {defaultChecked: true} : {}
                                return (
                                    <Form.Item
                                        {...formItemLayout()}
                                        label={`${clotheLang.form.options}${index + 1}`}
                                        required={true}
                                        key={field.key}
                                    >
                                        <Form.Item
                                            {...field}
                                            validateTrigger={['onChange', 'onBlur']}
                                            rules={[
                                                {
                                                    required: true,
                                                    whitespace: true,
                                                    message: clotheLang.form.noEmpty,
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <Input placeholder={`${clotheLang.form.pleaseEnterOptions}${index + 1}`} style={{width: '60%'}} allowClear/>
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
                                            <div>
                                                &nbsp;&nbsp;<Checkbox {...checkboxProps} onChange={(e) => {
                                                setFill(e.target.checked, field.name)
                                            }}>{clotheLang.form.canEmpty}</Checkbox>
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
                                    disabled={disabledAdd}
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
