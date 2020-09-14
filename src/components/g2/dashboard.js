/**
 * Created by zengtao on 2017/5/19.
 */
import React, {useEffect, useState} from 'react';
import {Axis, Chart, Coord, Geom, Guide, Shape} from 'bizcharts';
import Nodataicon from "../icon/no_data"
//G2.Global.renderer = 'svg'
const {Html, Arc} = Guide;


// 自定义Shape 部分
Shape.registerShape('point', 'pointer', {
  drawShape(cfg, group) {
    let point = cfg.points[0]; // 获取第一个标记点
    point = this.parsePoint(point);
    const center = this.parsePoint({ // 获取极坐标系下画布中心点
      x: 0,
      y: 0,
    });
    // 绘制指针
    group.addShape('line', {
      attrs: {
        x1: center.x,
        y1: center.y,
        x2: point.x,
        y2: point.y,
        stroke: cfg.color,
        lineWidth: 5,
        lineCap: 'round',
      },
    });
    return group.addShape('circle', {
      attrs: {
        x: center.x,
        y: center.y,
        r: 12,
        stroke: cfg.color,
        lineWidth: 4.5,
        fill: '#fff',
      },
    });
  },
});


let defaultProps = {
  //固定宽高
  width: 400,
  //高度必填，不然就报错
  height: 200,
  padding: "auto",
  fontSize: 14,
  // 数据源
  value: 8,
  //标题
  title: "完成率",
  //legend的位置
  position: "top",
  color: ['#F5222D', '#FFBF00', '#0086FA', '#23b89c'],
  max: 10,
  company: "%"
}
export default function Index(prop) {
  const [data, setData] = useState([]);
  const [lineWidth, setLineWidth] = useState(25);

  let props = {
    ...defaultProps, ...prop
  }
  const {x, y, title, fontSize, width, height, padding, transpose, position, dy, xName, yName, value, color, max, company} = props
  const cols = {
    value: {
      min: 0,
      max,
      tickInterval: 1,
      nice: false,
    },
  };

  useEffect(() => {
    setData([{value}])
    return () => {
    }
  }, [value]);

  useEffect(() => {
    let value = 25;
    if (height <= 400 && height > 200) {
      value = 20
    } else if (height <= 200) {
      value = 10
    }
    setLineWidth(value)
    return () => {
    }
  }, [height]);

  const val = data.length && data[0].value;

  return (
    <div className="up_g2_warp" style={{width, padding: padding}}>
      {data && data.length > 0 ? <Chart width={width} height={height} data={data} scale={cols} padding={[0, 0, 0, 0]} forceFit>
        <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.75}/>
        <Axis
          name="value"
          zIndex={2}
          line={null}
          label={{
            offset: -(lineWidth - 1),
            textStyle: {
              fontSize: fontSize,
              fill: '#CBCBCB',
              textAlign: 'center',
              textBaseline: 'middle',
            },
          }}

        />
        <Axis name="1" visible={false}/>
        <Guide>
          <Arc
            zIndex={0}
            start={[0, 0.965]}
            end={[max, 0.965]}
            style={{ // 底灰色
              stroke: 'rgba(0, 0, 0, 0.09)',
              lineWidth,
            }}
          />
          {val >= 0 && <Arc
            zIndex={1}
            start={[0, 0.965]}
            end={[val, 0.965]}
            style={{ // 底灰色
              stroke: color[0],
              lineWidth,
            }}
          />}
          {val >= max * 0.2 &&
          <Arc
            zIndex={1}
            start={[max * 0.2, 0.965]}
            end={[val, 0.965]}
            style={{ // 底灰色
              stroke: color[1],
              lineWidth,
            }}
          />}
          {val >= max * 0.2 && val <= max * 0.4 &&
          <Arc
            zIndex={1}
            start={[max * 0.2, 0.965]}
            end={[val, 0.965]}
            style={{ // 底灰色
              stroke: color[1],
              lineWidth,
            }}
          />}
          {val >= max * 0.4 &&
          <Arc
            zIndex={1}
            start={[max * 0.4, 0.965]}
            end={[val, 0.965]}
            style={{ // 底灰色
              stroke: color[2],
              lineWidth,
            }}
          />}
          {val >= max * 0.4 && val < max * 0.6 &&
          <Arc
            zIndex={1}
            start={[max * 0.4, 0.965]}
            end={[val, 0.965]}
            style={{ // 底灰色
              stroke: color[2],
              lineWidth,
            }}
          />}
          {val >= max * 0.6 &&
          <Arc
            zIndex={1}
            start={[max * 0.6, 0.965]}
            end={[val, 0.965]}
            style={{ // 底灰色
              stroke: color[3],
              lineWidth,
            }}
          />}
          {val >= max * 0.6 && val <= max &&
          <Arc
            zIndex={1}
            start={[max * 0.6, 0.965]}
            end={[val, 0.965]}
            style={{ // 底灰色
              stroke: color[3],
              lineWidth,
            }}
          />}
          <Html
            position={['50%', '95%']}
            html={() => (`<div style="width: 100%;text-align: center;font-size: 12px!important;"><p style="font-size: ${fontSize + 4}px; color: rgba(0,0,0,0.43);margin: 0;">${title}</p><p style="font-size: ${fontSize + 8}px;color: rgba(0,0,0,0.85);margin: 0;">${val * 10}${company}</p></div>`)}
          />
        </Guide>
        <Geom
          type="point"
          position="value*1"
          shape="pointer"
          color="#1890FF"
          active={false}
          style={{stroke: '#fff', lineWidth: 1}}
        />
      </Chart> : <div className="none_data">
        <div><Nodataicon/>暂无数据</div>
      </div>}
    </div>
  );
}

