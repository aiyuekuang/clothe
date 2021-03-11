/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, Fragment, useEffect, useState} from 'react';
import {Checkbox} from "antd"
import PropTypes from "prop-types";

const CheckboxGroup = Checkbox.Group;

let CheckboxProGroup = forwardRef((props, ref)=>{

  const {dataSource, children, value, onChange, config, dataSourceLabel, dataSourceValue, clotheLang, hasAll} = props;

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
        {...config}
      />
    </div>
  );
})

CheckboxProGroup.propTypes = {
  /** 数据源 */
  dataSource: PropTypes.array,
  /** 数据源的label字段 */
  dataSourceLabel: PropTypes.string,
  /** 数据源的value字段 */
  dataSourceValue: PropTypes.string,
  /** antd form的值 */
  value: PropTypes.array,
  /** antd form的值改变的回调 onChange: (data) => {

  }*/
  onChange: PropTypes.func,
  /** antd的其他设置 */
  config: PropTypes.object,
  /** 是否有全选按钮 */
  hasAll: PropTypes.bool
};
CheckboxProGroup.defaultProps = {
  /** 数据源 */
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
  /** 数据源的label字段 */
  dataSourceLabel: "name",
  /** 数据源的value字段 */
  dataSourceValue: "id",
  /** antd form的值 */
  value: [],
  /** antd form的值改变的回调 */
  onChange: (data) => {

  },
  /** antd的其他设置 */
  config: {},
  /** 是否有全选按钮 */
  hasAll: true
};

export default CheckboxProGroup;