/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, Fragment, useEffect, useImperativeHandle, useState} from 'react';
import PropTypes from "prop-types";


let defaultProps = {

}

const TabSelect = forwardRef((props,ref) => {

  const {className, label, dataSource, dataSourceKey, dataSourceValue, onChange, value, color, disabled, isRequired, defaultValue} = props;
  const [selectValue, setSelectValue] = useState(defaultValue);


  useEffect(() => {
    setSelectValue(defaultValue)
    return () => {
    }
  }, [defaultValue]);


  const change = (data) => {
    if (data[dataSourceValue] !== selectValue) {
      setAllValue(data[dataSourceValue], data)
    } else {
      if (!isRequired) {
        setAllValue(null, data)
      }
    }
  }

  function setAllValue(value = null, data) {
    setSelectValue(value)
    onChange(value, data)
  }

  let style = (data) => {
    let style = {}
    if (disabled) {
      style.cursor = "not-allowed"
    }

    if (selectValue === data[dataSourceValue]) {
      style.background = color;
    }
    return style
  }

  useImperativeHandle(ref, () => ({
    setValue: (value) => {
      setSelectValue(value);
    }
  }))

  const list = dataSource.map((data, i) => {
    return (
      <div key={data[dataSourceValue]} onClick={() => disabled ? null : change(data)}
           className={selectValue === data[dataSourceValue] ? "up_tab_select_list_act" : ""}
           style={style(data)}>
        {data[dataSourceKey]}
      </div>
    )
  })

  return (
    <div className={`${className} up_tab_select`}>
      <div className="up_tab_select_label">
        {label}：
      </div>
      <div className="up_tab_select_list">
        {list}
      </div>
    </div>
  );
})

TabSelect.propTypes = {
  /** 禁用 */
  disabled: PropTypes.bool,
  /** 样式名 */
  className: PropTypes.string,
  /** 左侧的选项名称 */
  label: PropTypes.string,
  /** 筛选的数据源 */
  dataSource:PropTypes.array,
  /** 数据源的名称 */
  dataSourceKey: PropTypes.string,
  /** 数据源对应的值的字段名 */
  dataSourceValue: PropTypes.string,
  /** 默认值 */
  defaultValue: PropTypes.any,
  /** 表单中用到的控制的值 */
  value: PropTypes.any,
  /** 选择框变化时的事件，会返回值和对象 (value, data) => {}，value是主键的值，data是对象*/
  onChange: PropTypes.func,
  /** 点击后的颜色 */
  color: PropTypes.string,
  /** 是否需要必选 */
  isRequired: PropTypes.bool
};
TabSelect.defaultProps = {
  /** 禁用 */
  disabled: false,
  /** 样式名 */
  className: "",
  /** 左侧的选项名称 */
  label: "选项",
  /** 筛选的数据源 */
  dataSource: [
    {
      title: "第一",
      value: 1
    }, {
      title: "第二",
      value: 2
    }, {
      title: "第三",
      value: 3
    }
  ],
  /** 数据源的名称 */
  dataSourceKey: "label",
  /** 数据源对应的值的字段名 */
  dataSourceValue: "value",
  /** 默认值 */
  defaultValue: null,
  /** 表单中用到的控制的值 */
  value: null,
  /** 选择框变化时的事件，会返回值和对象 (value, data) => {}，value是主键的值，data是对象*/
  onChange: (value, data) => {

  },
  /** 点击后的颜色 */
  color: "#666666",
  /** 是否需要必选 */
  isRequired: false
};
export default TabSelect;
