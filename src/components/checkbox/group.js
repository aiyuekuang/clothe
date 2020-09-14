/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, useEffect, useState} from 'react';
import {Checkbox} from "antd"

const CheckboxGroup = Checkbox.Group;

let defaultProps = {
  dataSource: [
    {
      name: "11",
      id: 1
    },
    {
      name: "22",
      id: 2
    }
  ],
  dataSourceLabel: "name",
  dataSourceValue: "id",
  value: [],
  onChange: (data) => {

  },
  otherSet: {},
  //是否有全选按钮
  hasAll: true
}

export default function Index(prop) {
  let props = {
    ...defaultProps, ...prop
  }
  const {dataSource, children, value, onChange, otherSet, dataSourceLabel, dataSourceValue, clotheLang, hasAll} = props;

  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [_dataSource, setDataSource] = useState([]);


  useEffect(() => {
    let __dataSource = []
    if (dataSource && dataSource.length) {
      if (dataSource[0].label && dataSource[0].value) {
        setDataSource(dataSource)
        return;
      }
    }

    dataSource.forEach((data, i) => {
      __dataSource.push({
        label: data[dataSourceLabel],
        value: data[dataSourceValue]
      })
    })

    setDataSource(__dataSource)
    return () => {
    }
  }, [dataSource]);


  let onChanges = checkedList => {
    setIndeterminate(!!checkedList.length && checkedList.length < _dataSource.length)
    setCheckAll(checkedList.length === _dataSource.length)
    setCheckedList(checkedList)
    onChange(checkedList)
  };

  let onCheckAllChange = e => {
    setCheckedList(e.target.checked ? _dataSource : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  };

  return (
    <div>
      {hasAll ? <Fragment>
        <div className="site-checkbox-all-wrapper">
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            {clotheLang.common.all}
          </Checkbox>
        </div>
        <br/>
      </Fragment> : null}
      <CheckboxGroup
        options={_dataSource}
        value={checkedList}
        onChange={onChanges}
        {...otherSet}
      />
    </div>
  );
}
