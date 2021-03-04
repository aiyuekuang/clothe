/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {Cascader} from "antd"
import {arrLast, cloneop} from "esn";
import {ajax} from "../utils/common";
import PropTypes from "prop-types";

let CascaderPro = forwardRef((props, ref) => {
    const {dataSource, onChange, value, placeholder, url, ajax, setData, paramField, isLeafFun, isValueLabel, returnLastValue, returnString, values, dataSourceKey, dataSourceValue, valueFun, clotheLang, disabled, primaryKeyField, style} = props;

    const [_dataSource, setDataSource] = useState([]);
    const [_value, setValue] = useState([]);

    useImperativeHandle(ref, function () {
        return {};
    });

    useEffect(() => {
        if (dataSource && dataSource.length) {
            setDataSource(formatData(dataSource))
        } else {
            ajax(url, values, (json) => {
                setDataSource(formatData(setData(json)))
            })
        }

        return () => {
        }
    }, [dataSource]);

    const formatData = (json) => {
        return json && json.length && json.map((data, i) => {
            let _obj = {...data};

            _obj.label = data[dataSourceKey];
            _obj.value = data[dataSourceValue];
            if (_obj.children && _obj.children.length) {
                _obj.children = formatData(_obj.children)
            }
            return _obj
        })
    }

    const change = (data, option) => {
        /**  setValue(data)*/
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


    let valueRecord = valueFun();


    return (
        <div className="anup_cascader_warp">
            {valueRecord ? <div className="anup_cascader_warp_l">
                {valueRecord}
            </div> : null}
            <div className="anup_cascader_warp_r">
                <Cascader
                    options={_dataSource}
                    placeholder={valueRecord ? clotheLang.form.pleaseReSelect : placeholder}
                    onChange={change}
                    style={style}
                    allowClear
                    disabled={disabled}
                />
            </div>
        </div>
    );
})

CascaderPro.propTypes = {
    /** 通用的ajax实现*/
    ajax: PropTypes.func,
    /** 筛选的数据源*/
    dataSource: PropTypes.array,
    /** 数据源的名称*/
    dataSourceKey: PropTypes.string,
    /** 数据源对应的值的字段名*/
    dataSourceValue: PropTypes.string,
    /** 主键的字段*/
    primaryKeyField: PropTypes.string,
    /** 表单中用到的控制的值*/
    value: null,
    /** 选择框变化时的事件，会返回值和对象(value) => {

  }*/
    onChange: PropTypes.func,
    /** 点击后的颜色*/
    placeholder: PropTypes.string,
    /** 每层请求用的url，每层必须使用相同的url，不支持不同层级用不同的*/
    url: null,
    /** 接口获取新数据之后，设置数据的使用(data) => {
    return data
  }*/
    setData: PropTypes.func,
    /** 是否返回值使用label*/
    isValueLabel: PropTypes.bool,
    /** onchange的时候返回最后选择的值*/
    returnLastValue: PropTypes.bool,
    /** change是否返回字符串*/
    returnString: PropTypes.bool,
    /** 其他接口参数*/
    values: PropTypes.object,
    /** 忘了() => {
  return null
}*/
    valueFun: PropTypes.func,
    /** 禁用组件*/

    disabled: PropTypes.bool,
    /** 样式*/

    style: PropTypes.object
};

CascaderPro.defaultProps = {
    /** 通用的ajax实现*/
    ajax: ajax,
    /** 筛选的数据源*/
    dataSource: null,
    /** 数据源的名称*/
    dataSourceKey: "label",
    /** 数据源对应的值的字段名*/
    dataSourceValue: "value",
    primaryKeyField: "id",
    /** 表单中用到的控制的值*/
    value: null,
    /** 选择框变化时的事件，会返回值和对象*/
    onChange: (value) => {

    },
    /** 点击后的颜色*/
    placeholder: "请选择",
    /** 每层请求用的url，每层必须使用相同的url，不支持不同层级用不同的*/
    url: null,
    /** 接口获取新数据之后，设置数据的使用*/
    setData: (data) => {
        return data
    },
    /** 是否返回值使用label*/
    isValueLabel: false,
    /** onchange的时候返回最后选择的值*/
    returnLastValue: false,
    /** change是否返回字符串*/
    returnString: false,
    /** 其他接口参数*/
    values: {},
    valueFun: () => {
        return null
    },
    disabled: false,
    style: {}
}

export default CascaderPro;