/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, useEffect, useState} from 'react';
import {Button, Switch, Transfer, Table, Tag} from "antd"
import {isArrayop} from "esn";
import difference from "lodash/difference";

const TableTransfer = ({leftColumns, rightColumns,tableSet, ...restProps}) => (
  <Transfer {...restProps} showSelectAll={false}>
    {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled
      }) => {
      const columns = direction === "left" ? leftColumns : rightColumns;

      const rowSelection = {
        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          style={{ pointerEvents: listDisabled ? "none" : null }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            }
          })}
          {...tableSet}
          size="small"
        />
      );
    }}
  </Transfer>
);


let defaultProps = {
  //数据源
  dataSource: [{
    id: 1,
    title: "第一",
    value: 1
  }, {
    id: 2,
    title: "第二",
    value: 2
  }, {
    id: 3,
    title: "第三",
    value: 3
  }],
  columns: [{
    dataIndex: 'title',
    title: 'Name',
  }, {
    dataIndex: 'value',
    title: 'value',
  }],
  //需要禁用的选项的函数判断
  disabledFun: (data) => {
    return false
  },
  //key值取的数据源字段
  primaryKeyField: "id",
  //禁用整个组件
  disabled: false,
  //根据那个字段进行搜索
  searchField: "title",
  onChange: (value) => {
    console.log(99, value)
  },
  value: [],
  tableSet:{}
}

export default function Index(prop) {
  let props = {
    ...defaultProps, ...prop
  }
  const [_dataSource, setDataSource] = useState([])
  const {dataSource, disabledFun, primaryKeyField, value, disabled, searchField, columns, onChange,tableSet} = props;

  const [targetKeys, setTargetKeys] = useState(value);


  useEffect(() => {
    setDataSource(buildData(dataSource))
    return () => {
    }
  }, [dataSource]);

  useEffect(() => {
    onChange(targetKeys)
    return () => {
    }
  }, [targetKeys]);

  useEffect(() => {
    setTargetKeys(value)
    return () => {
    }
  }, [value]);

  function buildData(data = []) {
    const mockData = [];

    if (!isArrayop(data)) {
      return mockData
    }

    data.forEach((data, i) => {
      mockData.push({
        key: primaryKeyField ? data[primaryKeyField] : i,
        disabled: disabledFun(data),
        ...data
      });
    })
    return mockData;
  }

  let onChanges = nextTargetKeys => {
    setTargetKeys(nextTargetKeys);
  };


  return (
    <div className="anup_transfer">
      <TableTransfer
        dataSource={_dataSource}
        targetKeys={targetKeys}
        disabled={disabled}
        showSearch={searchField}
        onChange={onChanges}
        filterOption={(inputValue, item) =>
          item[searchField].indexOf(inputValue) !== -1
        }
        leftColumns={columns}
        rightColumns={columns}
        tableSet={tableSet}
      />
    </div>
  );
}