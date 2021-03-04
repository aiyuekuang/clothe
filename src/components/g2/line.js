/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, Component, PureComponent} from 'react';
import {Button, Input, Modal} from 'antd';
import {cuns} from 'esn'
import {G2, Chart, Geom, Axis, Tooltip, Legend, Coord, Guide} from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from "bizcharts-plugin-slider";
import moment from "moment"
//G2.Global.renderer = 'svg'
export default class Line extends Component {

    static defaultProps = {
        /** 宽度 */
        width: null,
        /** 高度 */
        height: null,
        /** 间距 */
        padding:"auto",
        // 数据源
        data: [
            {
                "time": "2019-08-08",
                "value": 0
            },
            {
                "time": "2019-08-09",
                "value": 0
            },
            {
                "time": "2019-08-10",
                "value": 0
            },
            {
                "time": "2019-08-11",
                "value": 0
            },
            {
                "time": "2019-08-12",
                "value": 0
            },
            {
                "time": "2019-08-13",
                "value": 0
            },
            {
                "time": "2019-08-14",
                "value": 0
            },
            {
                "time": "2019-08-15",
                "value": 0
            },
            {
                "time": "2019-08-16",
                "value": 0
            },
            {
                "time": "2019-08-17",
                "value": 0
            },
            {
                "time": "2019-08-18",
                "value": 0
            },
            {
                "time": "2019-08-19",
                "value": 0
            },
            {
                "time": "2019-08-20",
                "value": 0
            },
            {
                "time": "2019-08-21",
                "value": 0
            },
            {
                "time": "2019-08-22",
                "value": 0
            },
            {
                "time": "2019-08-23",
                "value": 0
            },
            {
                "time": "2019-08-24",
                "value": 0
            },
            {
                "time": "2019-08-25",
                "value": 0
            },
            {
                "time": "2019-08-26",
                "value": 0
            },
            {
                "time": "2019-08-27",
                "value": 0
            },
            {
                "time": "2019-08-28",
                "value": 0
            },
            {
                "time": "2019-08-29",
                "value": 12
            },
            {
                "time": "2019-08-30",
                "value": 1039
            },
            {
                "time": "2019-08-31",
                "value": 438
            },
            {
                "time": "2019-09-01",
                "value": 0
            },
            {
                "time": "2019-09-02",
                "value": 587
            },
            {
                "time": "2019-09-03",
                "value": 341
            },
            {
                "time": "2019-09-04",
                "value": 600
            },
            {
                "time": "2019-09-05",
                "value": 684
            },
            {
                "time": "2019-09-06",
                "value": 250
            },
            {
                "time": "2019-09-07",
                "value": 0
            },
            {
                "time": "2019-09-08",
                "value": 0
            }
        ],
        //x的名称
        x: "time",
        //y的名称
        y: "value",
        xName: "日期时间",
        yName: "数量",
        //标题
        title: null,
        //描述
        info: null,
        //[0, 1]
        range: null,
        //0
        min: null,
        //smooth曲线，circle直线
        shape: "smooth",
        //日期筛选的日期format
        format: "YYYY-MM-DD",
        //filter筛选日期
        filterSatrt: null,
        filterEnd: null,
    }

    //改变数据的动画


    constructor(props) {
        super(props);

        this.state = {};
        let _state = {}

        if (props.filterSatrt) {
            _state = {
                start: props.filterSatrt,
                end: props.filterEnd
            }
        }

        this.ds = new DataSet({
            state: _state
        })

        this._dv = this.ds.createView("origin")

    }


    componentDidMount = () => {

    }


    //移除
    componentWillUnmount() {

    }


    onChange(obj) {
        const {startValue, endValue} = obj;

        this.ds.setState("start", moment(startValue).format(format));
        this.ds.setState("end", moment(endValue).format(format));
    }

    render() {
        const {x, y, title, info, width, height, padding, data, range, shape, min, xName, yName, format, filterSatrt, filterEnd} = this.props
        const cols = {};

        const dv = this._dv.source(data);

        if (filterSatrt) {
            dv.transform({
                type: "filter",
                callback: (obj) => {
                    const time = moment(obj.time).format(format); // !注意：时间格式，建议转换为时间戳进行比较
                    return time >= this.ds.state.start && time <= this.ds.state.end;
                }
            });
        }


        cols[x] = {
            min,
            alias: xName
        }

        cols[y] = {
            range,
            alias: yName
        }

        return (
            <div className="up_g2_warp" style={{width: width, padding: padding}}>
                <Chart
                    data={dv}
                    scale={cols}
                    height={height ? height : 500}
                    padding="auto"
                    forceFit
                >
                    {title ? <span className='mainTitle'>
                        {title}
                    </span> : null}
                    {info ? <span className='subTitle'>
                        {info}
                    </span> : null}
                    <Axis name={x}/>
                    <Axis name={y}/>
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom type="line" position={`${x}*${y}`} size={2} shape={shape}/>
                    <Geom
                        type="point"
                        position={`${x}*${y}`}
                        size={4}
                        shape={shape}
                        style={{
                            stroke: "#fff",
                            lineWidth: 1
                        }}
                    />
                </Chart>
                {filterSatrt ? <Slider
                    width="auto"
                    height={26}
                    start={dv.start}
                    end={dv.end}
                    xAxis={x}
                    yAxis={y}
                    scales={{
                        date: {
                            type: y,
                            tickCount: 10,
                            mask: format
                        }
                    }}
                    data={dv}
                    backgroundChart={{
                        type: "line"
                    }}
                    onChange={this.onChange.bind(this)}
                /> : null}
            </div>
        )
    }
}