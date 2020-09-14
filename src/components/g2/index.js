/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, Component, PureComponent} from 'react';
import {Button, Input, Modal} from 'antd';
import {cuns} from 'esn'
import {G2, Chart, Geom, Axis, Tooltip, Legend, Coord, Guide} from 'bizcharts';
import DataSet from '@antv/data-set';
import Nodataicon from "../icon/no_data"
//G2.Global.renderer = 'svg'

export default class Index extends Component {

    static defaultProps = {
        //固定宽高
        width: null,
        //高度必填，不然就报错
        height: null,
        padding:"auto",
        // 数据源
        data: [
            {
                country: "中国",
                population: 131744
            },
            {
                country: "印度",
                population: 104970
            },
            {
                country: "美国",
                population: 29034
            },
            {
                country: "印尼",
                population: 23489
            },
            {
                country: "巴西",
                population: 18203
            }
        ],
        //x的名称
        x: "country",
        //y的名称
        y: "population",
        xName:"日期时间",
        yName:"数量",
        //标题
        title: null,
        //描述
        info: null,
        //横过来
        transpose:false,
        //legend的位置
        position:"top",
        dy:-20
    }
    constructor(props) {
        super(props);
        this.dv = new DataSet().createView();


    }
    state = {}
    //改变数据的动画




    componentDidMount = () => {
    }


    //移除
    componentWillUnmount() {

    }
    render() {
        const {x, y, title, info, width, height,padding,transpose,data,position,dy,xName,yName} = this.props

        const cols = {
            [`${x}`]:{
                alias:xName
            },
            [`${y}`]:{
                alias:yName
            }
        };

        return (
            <div className="up_g2_warp" style={{width: width, padding:padding}}>
                {data && data.length>0?<Chart
                       data={this.dv.source(this.props.data)}
                       scale={cols}
                       height={height?height:500}
                       padding="auto"
                       forceFit
                >
                    {title ? <div className='mainTitle'>
                        {title}
                    </div> : null}
                    {info ? <div className='subTitle'>
                        {info}
                    </div> : null}
                    <Coord transpose={transpose} />
                    <Axis name={x}/>
                    <Axis name={y}/>
                    <Legend position={position} dy={dy}/>
                    <Tooltip

                    />
                    <Geom type="interval" position={`${x}*${y}`} color={x}/>
                </Chart>: <div className="none_data"><div><Nodataicon/>暂无数据</div></div>}
            </div>
        )
    }
}