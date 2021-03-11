/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Component} from 'react';
import {DatePicker} from 'antd';
import moment from "moment"
import PropTypes from "prop-types";

const {RangePicker} = DatePicker;

export function disabledDate(current, disabledStart, disabledEnd, disabledRang, formatData) {
    // Can not select days before today and today
    let bool = []
    if (disabledStart) {
        bool.push(current && current < moment(disabledStart, formatData).endOf('day'));
    }
    if (disabledEnd) {
        bool.push(current && current > moment(disabledEnd, formatData).endOf('day'));
    }

    if (disabledRang) {
        bool.push(current && current > moment(disabledRang[0], formatData).endOf('day') && current < moment(disabledRang[1], formatData).endOf('day'));
    }

    return bool.find((data, i) => {
        return data
    });
}


export default class RangSelect extends Component {

    static propTypes = {
        /** 格式化 */
        format: PropTypes.string,
        /** 返回字符串数据还是数组 */
        string: PropTypes.bool,
        /** 是否展示时间 */
        showTime: PropTypes.bool,
        /** 这个时间之前的时间不可选,字符串即可 */
        disabledStart: PropTypes.string,
        /** 这个时间之后的时间不能选 */
        disabledEnd: PropTypes.string,
        /** 这个时间范围内的不能选，数组[开始时间字符串,结束时间] */
        disabledRang: PropTypes.array,
        /** 只能选择几天 */
        limitNum: PropTypes.number
    }

    static defaultProps = {
        /** 格式化 */
        format: "YYYY-MM-DD",
        /** 返回字符串数据还是数组 */
        string: true,
        /** 是否展示时间 */
        showTime: true,
        /** 这个时间之前的时间不可选,字符串即可 */
        disabledStart: null,
        /** 这个时间之后的时间不能选 */
        disabledEnd: null,
        /** 这个时间范围内的不能选 */
        disabledRang: null,
        /** 只能选择几天 */
        limitNum: null
    }

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount = () => {

    }


    //移除
    componentWillUnmount() {
        //离开页面消除所有接口请求
        //window.requestCancel();
    }

    onChange_ = (date, dateString) => {
        const {onChange, value, string} = this.props;
        if (string) {
            let value_ = "";
            for (let i of dateString) {
                if (i) {
                    value_ += (i + ",")
                }
            }
            onChange(value_)
        } else {
            onChange(dateString)
        }
    }

    render() {
        const {onChange, value, showTime, format, disabledStart, disabledEnd, disabledRang, limitNum} = this.props;
        const {} = this.state;


        let formatData = format

        if (showTime) {
            formatData += " HH:mm:ss"
        }

        let value_ = value

        if (value instanceof Array) {
            let arr = []
            for (let i of value) {
                if (i) {
                    arr.push(moment(i, formatData))
                }
            }
            value_ = arr
        }

        if (typeof value == "string" && value !== "") {
            let arr = []
            for (let i of value.split(',')) {
                if (i) {
                    arr.push(moment(i, formatData))
                }
            }
            value_ = arr
        }
        if (value === "") {
            value_ = [undefined, undefined]
        }


        function disabledDateTime() {
            return {
                disabledHours: () => [0, 0],
                disabledMinutes: () => [0, 0],
                disabledSeconds: () => [0, 0],
            };
        }

        return (
            <React.Fragment>
                <RangePicker
                    {...this.props}
                    onChange={(date, dateString) => this.onChange_(date, dateString)}
                    value={value_}
                    disabledDate={(current) => disabledDate(current, disabledStart, disabledEnd, disabledRang, formatData)}
                    format={formatData}
                />
            </React.Fragment>
        )
    }
}