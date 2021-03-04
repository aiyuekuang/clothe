/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, Fragment, useEffect, useState} from 'react';
import {Checkbox} from "antd"
import PropTypes from "prop-types";

let CheckboxPro = forwardRef((props, ref)=>{
    const {children,value,onChange,config} = props;

    useEffect(() => {

        return ()=>{
        }
    },[]);

    function onChanges(e) {
        onChange(e.target.checked)
    }

    return (
      <Checkbox onChange={onChanges} checked={value} {...config}>{children}</Checkbox>
    );
})

CheckboxPro.propTypes = {
    /** 单个checkbox是否选中状态 */
    value:PropTypes.bool,
    /** 单个checkbox变化的回调 onChange:(bool)=>{

    }*/
    onChange:PropTypes.func,
    /** antd checkbox其他设置 */
    config:PropTypes.object
};
CheckboxPro.defaultProps = {
    /** 单个checkbox是否选中状态 */
    value:false,
    /** 单个checkbox变化的回调 */
    onChange:(bool)=>{

    },
    /** antd checkbox其他设置 */
    config:{}
};


export default CheckboxPro;
