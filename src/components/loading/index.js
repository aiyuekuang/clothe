/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, useEffect, useState, forwardRef} from 'react';
import {Button, Spin} from "antd"


let defaultProps = {
    top: "45%",
    left: "45%",
    config: {}
}

function index(prop, ref) {

    let props = {
        ...defaultProps, ...prop
    }
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
}

export default forwardRef(index)