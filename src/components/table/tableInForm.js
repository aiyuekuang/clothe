/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, useEffect, useRef, useState} from 'react';
import {Button} from "antd"
import TableCommon from "./index";
import Table_select from "./table_select"
import {isArrayop} from "esn";

//本项目的模板页面


let defaultProps = {
  onChange: (primaryKeyField) => {
  },
  value: [],
  //
  tableSelectSet: {},
  //请求接口时，需要带到表格组件的参数名称
  valuesField:"id"
}

export default function Index(prop) {
  // Declare a new state variable, which we'll call "count"

  let props = {
    ...defaultProps, ...prop
  }
  const {tableSelectSet, value, onChange,valuesField,clotheLang} = props;

  useEffect(() => {
    // Update the document title using the browser API

    return () => {
    }
  }, []);


  let values = {}
  values[valuesField] = value

  return (
    <div>
      <TableCommon
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
}
