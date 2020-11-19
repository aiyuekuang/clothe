/**
 * Created by zengtao on 2018/8/1.
 */
import React, {Component, Fragment} from 'react';
import {Button, Input, Modal, Table,} from 'antd';
import Up_Tree from "../tree/tree"
import Search_table from "../form/form_search"
import {diff, ajax} from "../utils/common"
import {CaretRightOutlined} from "@ant-design/icons"
import {diffObj} from "esn";


//截取字符串
function str_cut(str, length) {
  if (!str) {
    return '';
  }
  if (str.length > length) {
    str = str.slice(0, length) + '...';
  }
  return str;
}

const Search = Input.Search;
const confirm = Modal.confirm;


export default class Index extends Component {

  static defaultProps = {
    ajax: ajax,
    //表格结构数据
    columns: [{
      title: '编号',
      dataIndex: 'id',
      key: "id",
      width: 100
    }, {
      title: '标题',
      dataIndex: 'title',
      key: "title",
      width: 200,
    }],
    dataSource: null,
    //接口连接
    url: "/shishi",
    //额外的需要加入的参数
    values: {},
    //数据获取方式
    setData: (data) => {
      return data.entity.pageItems
    },
    //获取分页总数的方式
    setTotal: (data) => {
      return data.records.total
    },
    //整个table的外边距
    margin: 0,
    //树的搜索字段
    getTreeField: "getTreeField",
    //树的url，如果为null就是不需要树
    treeUrl: null,
    //表格的其他属性
    other_set: {},
    //是否有分页
    hasPage: true,
    //判断是否可以被点击
    rowDisabledFun: (record) => {
      return false
    },
    //批量操作的对象
    rowAction: null,
    //主键id
    primaryKeyField: "id",
    //其他按钮组件
    otherBtn: (selectedRowKeys, onSelectChange, get_data) => {
    },
    //搜索组件的form对象
    searchForm: [],

    //其他搜索组件的参数
    searchFormSet: {},
    //树的其它选项
    treeSet: {},

    //外面的需要用到这个表格请求的数据的话，可以用这个方法
    tableDataCallback: (data) => {

    },
    onSearchChange: (values) => {
    },
    //表格的样式
    table_className: "table_className",
    //表格的是什么型的默认是紧凑型的
    size: "middle",
    //搜索的标题字段
    searchPlaceholder: "请输入关键词",
    searchLabelField: null,
    //搜索框的宽度
    searchWidth: 200,
    //树控件点击后的回调
    treeClick: (data) => {
    },
    onChange: (value) => {
    },
    //弹窗的设置
    modalSet: {},
    //弹窗的标题
    tit: null,
    value: [],
    //是否需要重新打开时已选数据还在
    isKeepSelectedRowKeys: true,
    //是否需要重新打开时界面重新初始化
    isShowNewTable: false,
    pageSize:10,
    //首次加载组件是否请求数据
    firstLoadData: true,
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      selectedRowKeys: props.value,
      visible: false,
      pagination: {
        current: 1,
        pageSize: props.pageSize,
        total: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        size: "small",
        pageSizeOptions: ['5', '10', '20', '30', '40']
      },
      dataSource: props.dataSource ? props.dataSource : [],
      //查询时需要用到的值
      values: {},
      record: null,
      tree_show: true,
      selectedRows: [],
      searchForm: {}
    };

  }


  componentDidMount = () => {

  }

  componentWillReceiveProps(nextProp) {
    if (!diff(nextProp.values, this.props.values)) {
      this.get_data(this.state.pagination.current, this.state.values, this.state.pagination.pageSize, nextProp.values)
    }

    if (diffObj(nextProp.value, this.props.value)) {
      this.setState({
        selectedRowKeys: nextProp.value
      })
    }
    if (!diff(nextProp.url, this.props.url)) {
      this.get_data(this.state.pagination.current, this.state.values, this.state.pagination.pageSize, nextProp.values, nextProp.url)
    }
  }

  //移除
  componentWillUnmount() {
    //离开页面消除所有接口请求
  }

  //搜索组件
  table_search = (submit) => {
    return (
      <Search_table returnForm={(searchForm) => {
        this.setState({
          searchForm
        })
      }} submit={submit} formData={this.props.searchForm} {...this.props.searchFormSet}
                    clotheLang={this.props.clotheLang}/>
    )
  }

  //获取表格数据
  get_data = (page = this.state.pagination.current, values = this.state.values, pageSize = this.state.pagination.pageSize, props_value = this.props.values, url = this.props.url) => {
    this.setState({
      loading: true,
    })
    //搜索框初始值的判断
    let search_init_data = {}
    if (JSON.stringify(values) === "{}") {
      for (let i of this.props.searchForm) {
        search_init_data[i.field] = i.initValue
      }
    } else {
      search_init_data = {}
    }
    this.props.ajax(url, {
      ...values, ...search_init_data, ...props_value,
      pageIndex: page,
      pageSize
    }, (data) => {
      const pagination = {...this.state.pagination};
      // if (page == 1) {
      pagination.total = this.props.setTotal(data);
      // }
      pagination.current = page;
      pagination.pageSize = pageSize;
      this.props.tableDataCallback(data);
      this.setState({
        dataSource: this.props.setData(data),
        pagination
      })
    }, () => {
      this.setState({
        loading: false,
      })
    })
  }

  //分页请求数据
  handleTableChange = (pagination, filters, sorter) => {
    this.get_data(pagination.current, this.state.values, pagination.pageSize)
  }

  select = (value, obj) => {
    let values = {...this.state.values}
    this.props.treeClick(value);
    values[this.props.getTreeField] = value ? value[0] : null
    this.get_data(1, values);
    this.setState({
      values
    })
  }

  //计算表格的宽度
  scroll = () => {
    let kuan = 0;
    for (let i of this.props.columns) {
      kuan += i.width?i.width:100;
    }
    return kuan;
  }


  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({selectedRowKeys, selectedRows});
  }


  handleCancel = (e) => {
    this.setState({
      visible: false,
    }, () => {
      if (this.props.isShowNewTable) {
        this.setState({
          values: {},
          pagination: {
            current: 1,
            pageSize: 10,
            total: 10,
            showQuickJumper: true,
            showSizeChanger: true,
            size: "small",
            pageSizeOptions: ['5', '10', '20', '30', '40']
          }
        }, () => {
          this.state.searchForm.resetFields()
        })
      }
    });
  }

  //搜索
  Search = (value) => {
    let values = {}
    values[this.props.searchLabelField] = value
    this.get_data(1, values);
    this.setState({
      values
    })
  }

  tree_hide = (bool) => {
    this.setState({
      tree_show: bool
    })
  }

  change = () => {
    const {onChange} = this.props;
    const {selectedRows} = this.state;
    if(onChange(this.state.selectedRowKeys, selectedRows)  !== false){
      this.handleCancel();
    }
  }

  show = () => {
    if (this.props.firstLoadData) {
      this.get_data();
    }
    let data = {
      // selectedRowKeys:[],
      visible: true,
    }

    if (!this.props.isKeepSelectedRowKeys) {
      data.selectedRowKeys = []
    }
    this.setState(data);
  }


  submit = (data) => {
    let values = {...this.state.values, ...data}
    this.props.onSearchChange(values)
    this.get_data(1, values);
    this.setState({
      values
    })
  }

  render() {
    const {treeSet, hasPage, ajax, deleteUrl, primaryKeyField, isActionFixed, hasEdit, addForm, table_className, size, searchPlaceholder, searchLabelField, hasDeleteBatch, searchWidth, tit, clotheLang,height} = this.props;
    const {selectedRowKeys, record, tree_show, visible} = this.state;

    let columns = [...this.props.columns]
    for (let i of columns) {
      if (i.strCut) {
        i.render = (text) => (
          <span>
                        {text && text.length > i.strCut ?
                          <Fragment>
                            {str_cut(text, i.strCut)}&nbsp;<a onClick={() => {
                            Modal.info({
                              maskClosable: true,
                              title: i.modalConfig && i.modalConfig.title ? i.modalConfig.title : clotheLang.table.allValue,
                              width: i.modalConfig && i.modalConfig.width ? i.modalConfig.width : 520,
                              content: (
                                <div style={{
                                  overflow: 'scroll',
                                  maxHeight: i.modalConfig && i.modalConfig.height ? i.modalConfig.height : 600
                                }}>
                                  {i.modalConfig && i.modalConfig.format ? i.modalConfig.format(text) : text}
                                </div>
                              ),
                              onOk() {
                              }
                            });
                          }}>{clotheLang.common.more}</a>
                          </Fragment> : text}
                                </span>
        )
      }
    }

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: this.props.rowDisabledFun(record)
      }),
    };


    return (
      <Fragment>
        <div
          onClick={this.show}
          style={{display: "inline-block"}}
        >
          {this.props.children}
        </div>
        <Modal
          {...this.props.modalSet}
          title={tit}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <div className="up_table_warp" style={{margin: this.props.margin}}>
            {this.props.searchForm.length > 0 ? <div className="up_table_warp_top">
              {this.table_search(this.submit)}
            </div> : null}
            <div className="up_table_warp_bottom">
              {this.props.treeUrl ?
                <div className={tree_show ? "up_table_warp_bottom_l" : "up_table_warp_bottom_l gybxs"}>
                  <Up_Tree tree_hide={this.tree_hide} ajax={ajax} select={this.select}
                           treeUrl={this.props.treeUrl} {...treeSet} clotheLang={this.props.clotheLang}/>
                </div> : null}
              <div
                className={this.props.treeUrl ? "up_table_warp_bottom_r" : "up_table_warp_bottom_r_s"}>
                <div className="up_table_warp_btn">
                  <div className={tree_show ? "gybxs" : ""} onClick={this.tree_hide.bind(this, true)}>
                    <div className="up_table_warp_btn_tree_btn">
                      <CaretRightOutlined/>
                    </div>
                  </div>


                  {this.props.otherBtn(this.state.selectedRowKeys, this.onSelectChange, this.get_data)}
                  {searchLabelField ? <div>
                    <Search
                      placeholder={searchPlaceholder}
                      onSearch={this.Search}
                      style={{width: searchWidth}}
                    />
                  </div> : null}
                </div>
                <Table primaryKeyField={this.props.primaryKeyField}
                       columns={columns}
                       dataSource={this.state.dataSource}
                       onChange={this.handleTableChange}
                       loading={this.state.loading}
                       pagination={hasPage ? this.state.pagination : false}
                       scroll={{x: this.scroll(), ...(height ? {y: height} : {})}}
                       rowSelection={rowSelection}
                       style={{width: "100%"}}
                       className={table_className}
                       size={size}
                       {...this.props.other_set}
                />
              </div>
            </div>
            <div className="up_table_warp_btn_submit">
              <Button type="primary" onClick={this.change}>{clotheLang.form.submit}</Button>
            </div>
          </div>
        </Modal>
      </Fragment>
    )
  }
}
