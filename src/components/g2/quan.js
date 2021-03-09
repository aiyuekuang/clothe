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
const { Html } = Guide;
//G2.Global.renderer = 'svg'
const {DataView} = DataSet;
export default class Circle extends Component {

    static defaultProps = {
        //固定宽高
        width: null,
        //高度必填，不然就报错
        height: null,
        padding:"auto",
        // 数据源
        data: [
            {x: '事例一', y: 40},
            {x: '事例二', y: 21},
            {x: '事例三', y: 17},
            {x: '事例四', y: 13},
            {x: '事例五', y: 0}
        ],
        x: "x",
        y: "y",
        //标题
        title: null,
        //描述
        info: null,
        legend_x:-100,
        legend_y:100
    }

    state = {}
    //改变数据的动画



    componentDidMount = () => {
    }


    //移除
    componentWillUnmount() {

    }

    render() {
        const {x, y, title, info, width, height, padding,legend_x,legend_y} = this.props
        let dv = new DataView();
        dv.source(this.props.data).transform({
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
            <div className="up_g2_warp" style={{width: width}}>
                <Chart
                    height={height?height:500}
                    data={dv}
                    scale={cols}
                    padding={padding}
                    forceFit
                >
                    {title ? <div className='mainTitle'>
                        {title}
                    </div> : null}
                    {info ? <div className='subTitle'>
                        {info}
                    </div> : null}
                    <Coord type={'theta'} radius={0.75} innerRadius={0.6}/>
                    <Axis name="percent"/>
                    <Legend
                        position="right"
                        offsetY={legend_y}
                        offsetX={legend_x}
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