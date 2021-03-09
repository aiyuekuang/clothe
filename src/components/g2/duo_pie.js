/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, Component, PureComponent} from 'react';
import {
    Chart,
    Geom,
    Tooltip,
    Guide, Legend,
} from "bizcharts";

const {Text} = Guide;
//G2.Global.renderer = 'svg'
export default class PieSmall extends Component {

    static defaultProps = {
        //固定宽高
        width: null,
        //高度必填，不然就报错
        height: null,
        padding:"auto",
        // 数据源
        data: [{
            x: 'male',
            y: 50,
        }, {
            x: 'middle',
            y: 25,
        }, {
            x: 'female',
            y: 25,
        }],
        x: "x",
        y: "y",
        //标题
        title: null,
        //描述
        info: null,
        //圈里字的大小
        font_size:16
    }

    state = {}
    componentDidMount = () => {
    }

    //移除
    componentWillUnmount() {

    }

    render() {
        const {x, y, title, info, data, width, height, padding,font_size} = this.props
        let data_temp = [], score = 0;
        for (let i of data) {
            let temp = {...i};
            temp.path = 'M381.759 0h292l-.64 295.328-100.127-100.096-94.368 94.368C499.808 326.848 512 369.824 512 415.712c0 141.376-114.56 256-256 256-141.376 0-256-114.624-256-256s114.624-256 256-256c48.8 0 94.272 13.92 133.12 37.632l93.376-94.592L381.76 0zM128.032 415.744c0 70.688 57.312 128 128 128s128-57.312 128-128-57.312-128-128-128-128 57.312-128 128z'
            data_temp.push(temp);
            score += i[y];

        }
        const cols = {}
        cols[y] = {
            min: 0,
            max: score,
        }

        return (
            <div className="up_g2_warp" style={{width: width, padding: padding}}>
                <Chart
                    data={data_temp}
                    scale={cols}
                    height={height ? height : 500}
                    forceFit
                >
                    {title ? <div className='mainTitle'>
                        {title}
                    </div> : null}
                    {info ? <div className='subTitle'>
                        {info}
                    </div> : null}
                    <Tooltip
                        showTitle={false}
                        itemTpl={'<li data-index={index}>'
                        + '<span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>' + '{name}: {value}' + '人</li>'}
                    />
                    <Geom
                        type="interval"
                        position={`${x}*${y}`}
                        color={x}
                        shape="liquid-fill-gauge"
                        style={{
                            lineWidth: 10,
                            opacity: 0.75
                        }}
                    />
                    <Legend/>
                    <Guide>
                        {
                            data_temp.map(
                                (row, i) => {
                                    let pos = {};
                                    pos[x] = row[x];
                                    pos[y] = score / 2;
                                    return (<Text
                                        content={`${((row[y] / score) * 100).toFixed(2)}%`}
                                        top
                                        key={i}
                                        position={pos}
                                        style={{
                                            opacity: 0.75,
                                            fontSize: font_size,
                                            textAlign: 'center',
                                        }}
                                    />)
                                })
                        }
                    </Guide>
                </Chart>
            </div>
        )
    }
}