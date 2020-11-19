/**
 * Created by zengtao on 2017/5/19.
 */
import React from 'react';
import {Input, message} from 'antd';
import {TablePro} from "@components"


export default class Index extends React.Component {
  constructor(arg) {
    super(arg);
  }

  state = {
    data: []
  }


  componentDidMount = () => {

  }


  remove = () => {

  }

  render() {
    return (
      <div className="up_index">
        <TablePro
          columns={[
            {
              // 表单标题
              title: "编号",
              dataIndex: "id",
              width:50
            },{
              // 表单标题
              title: "搜索",
              dataIndex: "title",
            },{
              // 表单标题
              title: "文本",
              dataIndex: "text",
            },{
              // 表单标题
              title: "图片",
              dataIndex: "img",
              render:(text,record)=>{
                return (
                  <img width={100} height={50} src={text} alt=""/>
                )
              }
            }
          ]}
          searchForm={[
            {
              // 表单标题
              title: "搜索",
              field: "priceRange",
              // 是否在收起时显示
              isTop: true,


            },
            {
              // 表单标题
              title: "代理",
              field: "agentName",
              // 是否在收起时显示
              isTop: true,

            },
            {
              // 表单标题
              title: "日期",
              field: "date",
              // 是否在收起时显示
            },
          ]}
        />
      </div>
    )
  }
}


