/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, useEffect} from 'react';
import {Radio} from "antd"
import {uid} from "esn";
import PropTypes from "prop-types";
//本项目的模板页面

const {Button} = Radio;

let defaultProps = {}

const RadioPro = forwardRef((props, ref) => {


    const {dataSource, label, labelValue, value, config, isButton, disabledFun, size} = props;

    useEffect(() => {


        return () => {
        }
    }, [dataSource]);

    useEffect(() => {

        return () => {
        }
    }, [value]);

    function onChange(value) {
        props.onChange(value)
    }

    let children = dataSource.map((data, i) => {
        let View = Radio;
        if (isButton) {
            View = Button
        }
        return <View key={data[labelValue]} value={data[labelValue]} disabled={disabledFun(data)}>{data[label]}</View>;
    });

    return (
        <Radio.Group name={uid()} onChange={onChange} value={value} size={size} {...config}>
            {children}
        </Radio.Group>
    );
})

RadioPro.propTypes = {
    /** 源数据 */
    dataSource: PropTypes.array,
    /** 源数据的label字段 */
    label: PropTypes.string,
    /** 源数据的value字段 */
    labelValue: PropTypes.string,
    /** 选择改变后的回调函数 */
    onChange: PropTypes.func,
    /** 组件的value */
    value: PropTypes.array,
    /** antd文档的其他设置 */
    config: PropTypes.object,
    /** 是否需要使用按钮样式 */
    isButton: PropTypes.bool,
    /** antd对应的组件size */
    size: PropTypes.string,
    /** 需要禁用的选项进行判断 */
    disabledFun: PropTypes.func
};
RadioPro.defaultProps = {
    /** 源数据 */
    dataSource: [
        {
            name: "11",
            id: 1
        },
        {
            name: "22",
            id: 2
        }
    ],
    /** 源数据的label字段 */
    label: "name",
    /** 源数据的value字段 */
    labelValue: "id",
    /** 选择改变后的回调函数 */
    onChange: (value) => {
        console.log(6677, value)
    },
    /** 组件的value */
    value: [],
    /** antd文档的其他设置 */
    config: {},
    /** 是否需要使用按钮样式 */
    isButton: false,
    /** antd对应的组件size */
    size: "default",
    /** 需要禁用的选项进行判断 */
    disabledFun: (data) => {
        return false
    }
};
export default RadioPro;