/**
 * Created by zengtao on 2018/12/27.
 */
import React, { Component } from 'react';
import QueueAnim from 'rc-queue-anim';
import PropTypes from 'prop-types'

/** 自定义的列表动画组件 */
export default class Ani extends Component {
    static propTypes = {
        /** 默认的动画延迟时间 */
        duration: PropTypes.number,
        /** css的类名 */
        className: PropTypes.string,
        /** antd的设置*/
        config: PropTypes.object,
        /** Description of prop "baz". */
        type: PropTypes.string
    }
    static defaultProps = {
        /**默认的动画延迟时间*/
        duration:2000,
        //默认的动画效果
        type:"alpha",
        className:"",
        config:{

        }
    }

    state = {
    }


    componentDidMount = () => {

    }



    //移除
    componentWillUnmount() {

    }

    render() {
        return (
            <QueueAnim {...this.props.config} className={this.props.className+" ani_warp"}>
                {this.props.children}
            </QueueAnim>
        )
    }
}