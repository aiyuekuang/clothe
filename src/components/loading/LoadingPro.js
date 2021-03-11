/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, useEffect, useState, forwardRef} from 'react';
import {Button, Spin} from "antd"
import PropTypes from "prop-types";


const LoadingPro = forwardRef((props,ref) => {
    const {top, left, config} = props;

    useEffect(() => {

        return () => {
        }
    }, []);


    return (
        <div className="clothe_loading" style={{
            top,
            left
        }}>
            <Spin {...config}/>
        </div>
    );
})

LoadingPro.propTypes = {
    /** 相较顶部的距离 */
    top: PropTypes.string,
    /** 相较左侧的距离 */
    left: PropTypes.string,
    /** 其他antd Spin的设置*/
    config: PropTypes.object
};
LoadingPro.defaultProps = {
    /** 相较顶部的距离 */
    top: "45%",
    /** 相较左侧的距离 */
    left: "45%",
    /** 其他antd Spin的设置*/
    config: {}
};
export default LoadingPro;
