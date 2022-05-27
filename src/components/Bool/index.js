/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {Radio} from "antd"


const BoolPro = forwardRef((props, ref) => {
    const [count, setCount] = useState(0);

    const {value, onChange,config,disabled} = props;

    useEffect(() => {

        return () => {
        }
    }, []);

    return (
        <Radio.Group {...config} onChange={onChange} value={value} disabled={disabled}>
            <Radio value={"1"}>是</Radio>
            <Radio value={"0"}>否</Radio>
        </Radio.Group>
    );
})

BoolPro.propTypes = {
    /** antd,RadioGroup的相关设置，返回0和1的字串*/
    config: PropTypes.object,
    /** 禁用组件 */
    disabled: PropTypes.bool,

};
BoolPro.defaultProps = {
    config: {},
    disabled: false,
};
export default BoolPro;
