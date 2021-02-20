/**
 * Created by zengtao on 2018/12/27.
 */
import React, { Component } from 'react';
import QueueAnim from 'rc-queue-anim';
import PropTypes from 'prop-types'

export default class Index extends Component {
    static propTypes = {
        /** Description of prop "foo". */
        duration: PropTypes.number,
        /** Description of prop "baz". */
        type: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
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