/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, Fragment, useEffect, useImperativeHandle, useState} from 'react';
import {Button, Cascader} from "antd"
import {ajax} from "../utils/common";
import {arrLast, cloneop, treeSetData} from "esn";


let defaultProps = {
  ajax: ajax,
  //筛选的数据源
  dataSource: null,
  //数据源的名称
  dataSourceKey: "label",
  //数据源对应的值的字段名
  dataSourceValue: "value",
  //表单中用到的控制的值
  value: null,
  //选择框变化时的事件，会返回值和对象
  onChange: (value) => {

  },
  //点击后的颜色
  placeholder: "请选择",
  //每层请求用的url，每层必须使用相同的url，不支持不同层级用不同的
  url: null,
  //参数用到的上级带的字段
  paramField: "id",
  //第一次加载数据时的id值
  initFieldValue: null,
  //接口获取新数据之后，设置数据的使用
  setData: (data) => {
    return data
  },
  //什么规则的数据是不需要请求下级的
  isLeafFun: (data) => {
    return false
  },
  //是否返回值使用label
  isValueLabel: false,
  //onchange的时候返回最后选择的值
  returnLastValue: false,
  //change是否返回字符串
  returnString: false,
  //其他接口参数
  values: {},
  //总共有几层
  layer: 2,
  valueFun: () => {
    return null
  },
  disabled:false
}

let count = 0


function index(prop, ref) {
  let props = {
    ...defaultProps, ...prop
  }

  const {dataSource, onChange, value, placeholder, ajax, paramField, url, setData, isLeafFun, isValueLabel, returnLastValue, returnString, values, initFieldValue, dataSourceKey, dataSourceValue, layer, valueFun, clotheLang,disabled} = props;

  const [_dataSource, setDataSource] = useState([]);
  const [_value, setValue] = useState([]);

  useImperativeHandle(ref, function () {
    return {};
  });

  useEffect(() => {
    count = layer

    return () => {
    }
  }, [layer]);


  useEffect(() => {
    if (dataSource) {
      count--
      setDataSource(formatData(dataSource.map((data, i) => {
        return {...data, isLeaf: isLeafFun(data)}
      })))
    } else {
      let param = {}
      param[paramField] = initFieldValue
      ajax(url, param, (json) => {
        setDataSource(formatData(setData(json), true))
      })
    }

    return () => {
    }
  }, [dataSource]);

  const formatData = (json, first) => {
    count--
    return json.map((data, i) => {
      let _obj = {...data};
      if (first) {
        _obj.first = true
      }
      _obj.label = data[dataSourceKey];
      _obj.value = data[dataSourceValue];
      if (count > 0 && !isLeafFun(data)) {
        _obj.isLeaf = false
      }
      return _obj
    })

  }

  const change = (data, option) => {
    // setValue(data)
    let _data = cloneop(data);
    let _option = cloneop(option);
    if (returnLastValue && data && data.length) {
      _data = [arrLast(_data)]
      _option = [arrLast(_option)]
    }
    changeAll(_data, _option)
  }

  function changeAll(data, option) {
    let _data = cloneop(data)

    setValue(data)
    if (isValueLabel && data && data.length) {
      _data = option.map((value, i) => {
        return value.label
      });
    }

    if (returnString) {
      if (data && data.length) {
        _data = arrLast(_data)
      } else {
        _data = ""
      }
    }
    onChange(_data, option)
  }

  let loadDataFun = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    let param = {...values}
    param[paramField] = targetOption.value
    if (targetOption.first) {
      count = layer - 1
    }

    ajax(url, param, (json) => {
      targetOption.loading = false;
      let arr = treeSetData(_dataSource, "children", formatData(setData(json)), "children", (data) => {
        return data.value === targetOption.value
      })
      setDataSource(arr)
    })
  }

  let valueRecord = valueFun();

  return (
    <div className="anup_cascader_warp">
      {valueRecord ? <div className="anup_cascader_warp_l">
        {valueRecord}
      </div> : null}
      <div className="anup_cascader_warp_r">
        <Cascader
          options={_dataSource}
          loadData={loadDataFun}
          placeholder={valueRecord ? clotheLang.form.pleaseReSelect : placeholder}
          onChange={change}
          style={{width: "100%"}}
          allowClear
          disabled={disabled}

          // value={_value}
        />
      </div>
    </div>
  );
}

export default forwardRef(index);