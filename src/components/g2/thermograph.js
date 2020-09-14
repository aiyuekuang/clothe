/**
 * Created by zengtao on 2017/5/19.
 */
import React, {useEffect} from 'react';
import {Axis, Chart, Geom, Legend, Tooltip} from 'bizcharts';
import DataSet from '@antv/data-set';
import Nodataicon from "../icon/no_data"
import {heatmap} from "../utils/init";
//G2.Global.renderer = 'svg'


let defaultProps = {
  //固定宽高
  width: null,
  //高度必填，不然就报错
  height: 500,
  padding: [10,10,20,30],
  fontSize: 14,
  // 数据源
  dataSource: heatmap,
  //标题
  title: "完成率",
  x: "x",
  y: "y",
  tipTitle: "热度",
  hasLegend: false
}
export default function Index(prop) {

  let props = {
    ...defaultProps, ...prop
  }
  const {x, y, title, fontSize, width, height, padding, transpose, position, dy, xName, yName, dataSource, color, hasLegend, tipTitle} = props

  useEffect(() => {

    return () => {
    }
  }, []);

  const ds = new DataSet({
    state: {
      sizeEncoding: false
    }
  });

  let _dataSource = [{}]
  if(dataSource && dataSource.length){
    _dataSource = dataSource
  }else {
    _dataSource[0][x]=0;
    _dataSource[0][y]=0;
  }

  const dv = ds
    .createView()
    .source(_dataSource)
    .transform({
      sizeByCount: false,
      // calculate bin size by binning tipTitle
      type: "bin.hexagon",
      fields: [x, y],
      // 对应坐标轴上的一个点
      bins: [10, 5],
      as: [x, y, tipTitle]
    });

  return (
    <div className="up_g2_warp" style={{width}}>
      {dataSource && dataSource.length?
        <Chart height={height ? height : 500} data={dv} padding={padding} forceFit>
          <Tooltip showTitle={false} crosshairs={false}/>
          <Axis
            name={x}
            grid={{
              lineStyle: {
                stroke: "#d9d9d9",
                lineWidth: 1,
                lineDash: [2, 2]
              }
            }}
          />
          {hasLegend ? <Legend offset={40}/> : null}
          <Geom
            type="polygon"
            position={`${x}*${y}`}
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
            color={[tipTitle, "#BAE7FF-#1890FF-#0050B3"]}
          />
        </Chart>
        : <div className="none_data">
          <div><Nodataicon/>暂无数据</div>
        </div>}
    </div>
  );
}

