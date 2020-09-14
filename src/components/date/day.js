/**
 * Created by zengtao on 2017/5/19.
 */
import React,{Fragment,Component,PureComponent} from 'react';
import { Button, Input, Modal,DatePicker} from 'antd';
import {cuns} from 'esn'
const {MonthPicker, RangePicker, WeekPicker} = DatePicker;
import moment from "moment"
export default class Index extends Component {

    static defaultProps = {
        format:"YYYY-MM-DD"
    }

    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        // if ('value' in nextProps) {
        // }
        return null;
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

    onChange_=(date,dateString)=>{
        const {onChange,value,format} =this.props;
        onChange(dateString)

    }

    render() {
        const {onChange,value,format} =this.props;
        const {} =this.state;

        let value_= value
        if(typeof value == "string" && value !== ""){
            value_ = moment(value,format)
        }
        if(value === ""){
            value_ = undefined
        }

        return (
            <React.Fragment>
                <DatePicker {...this.props} onChange={(date,dateString)=>this.onChange_(date,dateString)}  value={value_} />
            </React.Fragment>
        )
    }
}