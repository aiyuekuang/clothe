/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, forwardRef, useImperativeHandle, useState, useEffect, Component} from 'react';
import {Modal} from "antd"
import PropTypes from "prop-types";
//本项目的模板页面

const ModalWarp = forwardRef((props, ref) => {
    // Declare a new state variable, which we'll call "count"
    const [visible, setVisible] = useState(false);

    const {title, className, config, open, close, Component, width} = props;

    useEffect(() => {
        if (props.visible !== null) {
            setVisible(props.visible)
        }
    }, [props.visible]);


    let handleCancel = () => {
        close()
        setVisible(false)
    }

    let onShow = () => {
        open();
        setVisible(true);
    }

    useImperativeHandle(ref, () => ({
        setVisible: (bool) => {
            return setVisible(bool);
        }
    }))

    return (
        <Fragment>
            <div className={className} onClick={onShow}>
                {props.children}
            </div>
            <Modal
                title={title}
                visible={visible}
                footer={null}
                onCancel={handleCancel}
                width={width}
                {...config}
            >
                {/*<Comp visible={visible} setVisible={setVisible}/>*/}
                <Component visible={visible} setVisible={setVisible}/>
                {/*{compnent({visible, setVisible})}*/}
            </Modal>
        </Fragment>
    );
})

ModalWarp.propTypes = {
    /** 弹窗上方的提示文字*/
    title: PropTypes.string,
    /** 弹窗的样式类名*/
    className: PropTypes.string,
    /** 弹窗根据antd的其他设置*/
    config: PropTypes.object,
    /** 打开之后的回调*/
    open: PropTypes.func,
    /** 关闭之后的回调*/
    close: PropTypes.func,
    /** 弹窗的宽度*/
    width: PropTypes.number,
    /** 弹窗中的内容react组件*/
    Component: PropTypes.elementType,
    /** 外部的显示与不显示来控制组件，默认值是null不启用，使用是使用布尔值*/
    visible: PropTypes.any
};
ModalWarp.defaultProps = {
    /** 弹窗上方的提示文字*/
    title: "提示",
    /** 弹窗的样式类名*/
    className: "inlineBlock",
    /** 弹窗根据antd的其他设置*/
    config: {},
    /** 打开之后的回调*/
    open: () => {
    },
    /** 关闭之后的回调*/
    close: () => {
    },
    /** 弹窗的宽度*/
    width: 800,
    /** 弹窗中的内容react组件*/
    Component: ({visible, setVisible}) => {
        return (
            <div>dd</div>
        )
    },
    /** 外部的显示与不显示来控制组件*/
    visible: null
};

export default ModalWarp

