/**
 * Created by zengtao on 2017/5/19.
 */
import React,{Fragment,Component,PureComponent} from 'react';
import { Button, Input, Modal } from 'antd';
import {cuns} from 'esn'

export default class Index extends Component {

    static defaultProps = {}

    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        // if ('value' in nextProps) {
        // }
        // return null;
    }

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount = () => {

    }


    //移除
    componentWillUnmount(){
        //离开页面消除所有接口请求
        //window.requestCancel();
    }

    render() {
        const {} =this.props;
        const {} =this.state;
        return (
            <React.Fragment>

            </React.Fragment>
        )
    }
}