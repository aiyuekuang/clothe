/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, Fragment, useEffect, useRef, useState} from 'react';
import {Button} from "antd"
import TablePro from "./index";
import Table_select from "./table_select"
import {isArrayop} from "esn";
import PropTypes from "prop-types";

//本项目的模板页面


let defaultProps = {}

const TableInForm = forwardRef((props, ref) => {

    const {tableSelectSet, value, onChange, valuesField, clotheLang} = props;

    useEffect(() => {
        // Update the document title using the browser API

        return () => {
        }
    }, []);


    let values = {}
    values[valuesField] = value

    return (
        <div>
            <TablePro
                values={values}
                otherBtn={(selectedRowKeys, onSelectChange, getData, values) => {
                    return (
                        <div>
                            <Table_select
                                ajax={props.ajax}
                                onChange={onChange}
                                value={value}
                                {...tableSelectSet}
                                clotheLang={clotheLang}
                            >
                                <Button>{clotheLang.table.select}</Button>
                            </Table_select>
                        </div>)
                }}
                {...props}
                deleteCallback={(id) => {
                    let _value = [...value]
                    if (isArrayop(id)) {
                        _value.forEach((data, i) => {
                            _value.remove(data);
                        })
                    } else {
                        _value.remove(id);
                    }
                    onChange(_value);
                }}
            />
        </div>
    );
})

TableInForm.propTypes = {
    /** 组件改变时的函数 */
    onChange: PropTypes.func,
    /** 组件的值 */
    value: PropTypes.array,
    /** TableSelect的设置 (primaryKeyField) => {}*/
    tableSelectSet: PropTypes.object,
    /** 请求接口时，需要带到表格组件的参数名称 */
    valuesField: PropTypes.string
};

TableInForm.defaultProps = {
    /** 组件改变时的函数 */
    onChange: (primaryKeyField) => {
    },
    /** 组件的值 */
    value: [],
    /** TableSelect的设置 */
    tableSelectSet: {},
    /** 请求接口时，需要带到表格组件的参数名称 */
    valuesField: "id"
};
export default TableInForm;
