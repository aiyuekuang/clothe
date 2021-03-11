import React, {useState, useEffect, forwardRef} from 'react';
import {Tree, TreeSelect} from 'antd';
import {diffObj, isArrayop, uid} from "esn";
import {ajax} from "../utils/common";
import PropTypes from "prop-types";

let layer = 0;
let count = 0;

const TreeInForm = forwardRef((props, ref) => {

    const {dataSource, config,ajax, clotheLang, dataSourceKey, dataSourceValue, children, isRandomKey, primaryKeyField, value, disableCheckbox, url, values, setData, onChange} = props;
    const [checkedKeys, setCheckedKeys] = useState(value);
    const [dataSource_, setDataSource_] = useState(dataSource);


    const getData = (url) => {
        ajax(url, values, (data) => {
            setDataSource_(setData(data).map((data,i)=> data.layer = count));
        });
    };

    useEffect(() => {
        if (isArrayop(url)) {
            layer = url.length
        }

        if (!dataSource && isArrayop(url)) {
            getData(url)
        }else {
            getData(url[count])
        }
        return () => {
        }
    }, [url]);

    useEffect(() => {
        onChange(checkedKeys)
        return () => {
        }
    }, [checkedKeys]);

    const onCheck = checkedKeys => {
        setCheckedKeys(checkedKeys.checked);
    };

    let renderTreeNodes = dataSource => {
        return dataSource.map((e) => {
            if (e[children] && e[children].length) {
                e[children] = renderTreeNodes(e[children])
            }
            return {
                ...e,
                title: e[dataSourceKey],
                key: isRandomKey ? uid() : e[dataSourceValue],
                id: e[primaryKeyField],
                disableCheckbox: disableCheckbox(e)
            }
        })
    }

    let onLoadData = treeNode => {
        console.log(222,treeNode)
        count = treeNode.layer
        count++
        getData(url[count]);
    }


    return (
        <TreeSelect
            allowClear
            multiple
            value={checkedKeys}
            treeData={renderTreeNodes(dataSource_)}
            loadData={onLoadData}
            {...config}
        />
    );
})

TreeInForm.propTypes = {
    /** ajax的实现函数 */
    children: PropTypes.func.isRequired,
    /** The color for the button */
    color: PropTypes.string,
    /** The size of the button */
    size: PropTypes.oneOf(['small', 'normal', 'large']),
    /** Disable button */
    disabled: PropTypes.bool,
    /** Gets called when the user clicks on the button */
    onClick: PropTypes.func,
};
TreeInForm.defaultProps = {
    /** ajax的实现函数 */
    ajax: ajax,
    /** 数据的label */
    dataSourceKey: "title",
    /** 数据的value值 */
    dataSourceValue: "value",
    primaryKeyField: "id",
    /** 除非你的子也不叫children */
    children: "children",
    /** 数据源 */
    dataSource: [],
    width: "100%",
    config: {},
    url: null,
    /** 获取数据后的设置数据提取函数 */
    setData: (data) => {
        return data.entity.Records
    },
    /** 单选时是否需要也是数组格式的返回 */
    isOutArr: false,
    /** 单选时是否可以选择父，默认不可以 */
    selectPrent: false,
    /** checkbox状态时，判断是否需要禁用checkbox的函数 */
    disableCheckbox: (data) => {
    },
    /** 是否需要随机生成key */
    isRandomKey: false,
    value: [],
    values: {},
    onChange: () => {
    },
};
export default TreeInForm;
