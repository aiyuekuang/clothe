/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, Component, PureComponent} from 'react';
import {Button, Input, Modal} from 'antd';
import {cuns} from 'esn'
import {
    G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Guide,
    Shape,
    Facet,
    Util
} from "bizcharts";
import DataSet from '@antv/data-set';

//G2.Global.renderer = 'svg'
const {DataView} = DataSet;
export default class Pie extends Component {

    static defaultProps = {
        //固定宽高
        width: null,
        //高度必填，不然就报错
        height: null,
        //边距必填，不然就报错
        padding: "auto",
        // 数据源
        data: [
            {x: '事例一', y: 40},
            {x: '事例二', y: 21},
            {x: '事例三', y: 17},
            {x: '事例四', y: 13},
            {x: '事例五', y: 9}
        ],
        x: "x",
        y: "y",
        //标题
        title: null,
        //描述
        info: null
    }

    state = {}




    componentDidMount = () => {
    }


    //移除
    componentWillUnmount() {

    }

    render() {
        const {x, y, title, info, data,width, height,padding} = this.props
        //改变数据的动画
        let dv = new DataView();
        dv.source(data).transform({
            type: "percent",
            field: y,
            dimension: x,
            as: "percent"
        });

        const cols = {
            percent: {
                formatter: val => {
                    val = (val * 100).toFixed(2) + "%";
                    return val;
                }
            }
        };
        return (
            <div className="up_g2_warp" style={{width: width, padding:padding}}>

            <Chart forceFit
                   height={height?height:500}
                   data={dv}
                   padding="auto"
                   scale={cols}
            >
                {title ? <div className='mainTitle'>
                    {title}
                </div> : null}
                {info ? <div className='subTitle'>
                    {info}
                </div> : null}
                <Coord type="theta" radius={0.75}/>
                <Axis name="percent"/>
                <Legend
                    position="right"
                />
                <Tooltip
                    showTitle={false}
                    itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                />
                <Geom
                    type="intervalStack"
                    position="percent"
                    color={x}
                    tooltip={[
                        `${x}*${y}`,
                        (item, y) => {
                            return {
                                name: item,
                                value: y
                            };
                        }
                    ]}
                    style={{
                        lineWidth: 1,
                        stroke: "#fff"
                    }}
                >
                    <Label
                        content="percent"
                        formatter={(val, item) => {
                            return item.point[x] + ": " + val;
                        }}
                    />
                </Geom>
            </Chart>
            </div>
        )
    }
}