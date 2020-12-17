/*
 * @Author: PengKang
 * @Date: 2020-05-14 17:39:46
 * @LastEditors: PengKang
 * @LastEditTime: 2020-05-18 09:44:41
 * @FilePath: \esa-admin\src\work\components\productTree\index.js
 */

import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';

import {Tree} from "antd";

import {deepFind, ajax} from "../utils/common";

import {uid} from "esn"

let defaultProps = {
  ajax: ajax,
  //树的label
  dataSourceKey: "name",
  //树的value
  dataSourceValue: "id",
  //接口请求数据的时候，需要传递的标识参数，默认的是id
  primaryKeyField: "id",
  // 每一层需要请求的接口地址
  treeUrl: [
    "/api/phoneManage/series/getMarketType",
    '/api/phoneManage/series/getByMarketType',
    '/api/phoneManage/saleModel/getBySeriesId',
    '/api/phoneManage/developmentModel/getBySaleModelId',
    '/api/phoneManage/productModel/getByDevelopmentModelId'
  ],
  // 	点击树节点触发函数
  onSelect: () => {
  },
  // 树形初始化数据时需要的参数
  initTreeDate: {name: 'root', key: '0', level: 0},
  //获取数据之后，对每个树的对象进行生成
  setTreeObj: (data) => {

  },
  //获取数据后的设置数据提取函数
  setData: (data) => {
    return data.entity.Records
  },
  //数据更新之后的回调
  set_tree_data: (data) => {

  },
  //是否需要随机生成key
  isRandomKey: false
}

/**
 * 更新树形数据
 * @param {Array} list
 * @param {string} key
 * @param {Array} children
 */
function updateTreeData(list = [], key, children) {
  return list.map(node => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    } else if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
}


function index(prop, ref) {
  let props = {
    ...defaultProps,
    ...prop
  }
  const {treeUrl, onSelect, initTreeDate, ajax, setData, set_tree_data, dataSourceKey, dataSourceValue, primaryKeyField, isRandomKey} = props;
  // 当前树的数据
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    onLoadData(initTreeDate)
    return () => {
    }
  }, []);

  useEffect(() => {
    set_tree_data(treeData)

    return () => {
    }
  }, [treeData]);

  /**
   * 加载数据
   * @param {Object} param
   */
  function onLoadData(data) {
    return new Promise(resolve => {
      if (data.children) {
        resolve();
        return;
      }
      if (!treeUrl[data.level]) {
        resolve();
        return;
      }

      let param = {}
      param[primaryKeyField] = data[dataSourceValue]
      ajax(treeUrl[data.level], param, (json) => {

        let resultData = setData(json);
        resolve();
        let treeData = resultData.map((e) => {


          let _level = data.level || data.level === 0 ? data.level + 1 : 0
          return {
            ...e,
            title: e[dataSourceKey],
            key: isRandomKey ? uid() : e[dataSourceValue],
            id: e[primaryKeyField],
            level: _level,
            ...(!treeUrl[_level] ? {
              isLeaf: true
            } : {})
          }
        })


        setTreeData(origin => origin && origin.length ? updateTreeData(origin, data.key, treeData) : treeData);
      })
    });
  }

  const setSelectedKeys = (value = null) => {

  }

  useImperativeHandle(ref, () => ({
    onLoadData: () => {
      return onLoadData();
    },
    setSelectedKeys: () => {
    }
  }))

  return (
    <Tree
      {...props}
      onSelect={(key, e) => {
        let {node} = e
        // 深度搜索找到对应的节点
        let myarr = deepFind(treeData, (item, index, level) => item.key === node.key, 'children')
        onSelect(node, treeData, myarr)
      }}
      loadData={onLoadData}
      treeData={treeData}
    />
  )
}

export default forwardRef(index)
