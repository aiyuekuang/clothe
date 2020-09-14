/**
 * Created by zengtao on 2017/5/19.
 */
import React, {useEffect} from 'react';
import {Axis, Chart, Coord, Geom, Legend, Tooltip} from 'bizcharts';
import DataSet from '@antv/data-set';
import Nodataicon from "../icon/no_data"
import {heatmap} from "../utils/init";
//G2.Global.renderer = 'svg'
const { DataView } = DataSet;

let defaultProps = {
  //固定宽高
  width: null,
  //高度必填，不然就报错
  height: 500,
  padding: [10,10,20,30],
  fontSize: 14,
  //数据源对用的数据字段
  fields:["a", "b"],
  // 数据源
  dataSource: [
    {
      item: "Design",
      a: 70,
      b: 30
    },
    {
      item: "Development",
      a: 60,
      b: 70
    },
    {
      item: "Marketing",
      a: 50,
      b: 60
    },
    {
      item: "Users",
      a: 40,
      b: 50
    },
    {
      item: "Test",
      a: 60,
      b: 70
    },
    {
      item: "Language",
      a: 70,
      b: 50
    },
    {
      item: "Technology",
      a: 50,
      b: 40
    },
    {
      item: "Support",
      a: 30,
      b: 40
    },
    {
      item: "Sales",
      a: 60,
      b: 40
    },
    {
      item: "UX",
      a: 50,
      b: 60
    }
  ],
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
  const {x, y, title, fontSize, width, height, padding, transpose, position, dy, xName, yName, dataSource, color, hasLegend, fields} = props

  useEffect(() => {

    return () => {
    }
  }, []);




  const dv = new DataView()
    .source(dataSource)
    .transform({
      type: "fold",
      fields: fields,
      // 展开字段集
      key: "user",
      // key字段
      value: "score" // value字段
    });

  const cols = {
    score: {
      min: 0,
      max: 100
    }
  };

  return (
    <div className="up_g2_warp" style={{width}}>
      {dataSource && dataSource.length?
        <Chart height={height ? height : 500} data={dv} padding={padding} scale={cols} forceFit>
          <Coord type="polar" radius={0.8} />
          <Axis
            name="item"
            line={null}
            tickLine={null}
            grid={{
              lineStyle: {
                lineDash: null
              },
              hideFirstLine: false
            }}
          />
          <Tooltip />
          <Axis
            name="score"
            line={null}
            tickLine={null}
            grid={{
              type: "polygon",
              lineStyle: {
                lineDash: null
              },
              alternateColor: "rgba(0, 0, 0, 0.04)"
            }}
          />
          <Legend name="user" marker="circle" offset={30} />
          <Geom type="area" position="item*score" color="user" />
          <Geom type="line" position="item*score" color="user" size={2} />
          <Geom
            type="point"
            position="item*score"
            color="user"
            shape="circle"
            size={4}
            style={{
              stroke: "#fff",
              lineWidth: 1,
              fillOpacity: 1
            }}
          />
        </Chart>
        : <div className="none_data">
          <div><Nodataicon/>暂无数据</div>
        </div>}
    </div>
  );
}

