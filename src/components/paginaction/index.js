/**
 * Created by zengtao on 2017/5/19.
 */
import React,{Fragment,Component,PureComponent} from 'react';
import { Button, Input, Modal,Pagination } from 'antd';
import {cuns} from 'esn'

export default class Page extends Component {

    static defaultProps={
        //居中还是居左居右
        align:"right",
        //组件的内边距
        padding:6,
    }

    state={

    }



    componentDidMount = () => {

    }

    //移除
    componentWillUnmount(){
    }

    render() {
        return (
            <div className="up_page" style={{textAlign: this.props.align,padding:this.props.padding}}>
                <Pagination {...this.props}/>
            </div>
        )
    }
}