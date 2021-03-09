/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, Component, PureComponent} from 'react';
import {Chart, Geom, Axis, Tooltip, Legend} from 'bizcharts';
import DataSet from '@antv/data-set';

//G2.Global.renderer = 'svg'

export default class GroupChart extends Component {

    static defaultProps = {
        //固定宽高
        width: null,
        //高度必填，不然就报错
        height: null,
        padding: "auto",
        // 数据源
        data: [
            {
                name: "London",
                "Jan": 18.9,
                "Feb": 28.8,
                "Mar": 39.3,
                "Apr": 81.4,
                May: 47,
                "Jun.": 20.3,
                "Jul.": 24,
                "Aug.": 35.6
            },
            {
                name: "Berlin",
                "Jan.": 12.4,
                "Feb.": 23.2,
                "Mar.": 34.5,
                "Apr.": 99.7,
                May: 52.6,
                "Jun.": 35.5,
                "Jul.": 37.4,
                "Aug.": 42.4
            },
            {
                name: "nanujing",
                "Jan.": 12.4,
                "Feb.": 23.2,
                "Mar.": 34.5,
                "Apr.": 99.7,
                May: 52.6,
                "Jun.": 35.5,
                "Jul.": 37.4,
                "Aug.": 42.4
            }
        ],
        //x的名称
        x: "x",
        //y的名称
        y: "y",
        //标题
        title: null,
        //描述
        info: null,
        //数据源中的name字段
        name: "name",
        //x轴上的那一横排
        fields: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug."]
    }

    state = {}
    //改变数据的动画



    componentDidMount = () => {
    }



    //移除
    componentWillUnmount() {

    }

    render() {
        const {x, y, title, info, name, fields, data, width, height, padding} = this.props
        let dv = new DataSet().createView();
        dv.transform({
            type: "fold",
            fields: fields,
            // 展开字段集
            key: x,
            // key字段
            value: y // value字段
        });
        return (
            <div className="up_g2_warp" style={{width: width, padding: padding}}>

                <Chart
                    data={dv.source(data)}
                    height={height ? height : 500}
                    forceFit
                >
                    {title ? <div className='mainTitle'>
                        {title}
                    </div> : null}
                    {info ? <div className='subTitle'>
                        {info}
                    </div> : null}
                    <Axis name={x}/>
                    <Axis name={y}/>
                    <Legend/>
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom type="interval" position={`${x}*${y}`} color={name} adjust={[
                        {
                            type: "dodge",
                            marginRatio: 1 / 32
                        }
                    ]}/>
                </Chart>
            </div>
        )
    }
}