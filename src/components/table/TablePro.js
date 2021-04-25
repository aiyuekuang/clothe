/**
 * Created by zengtao on 2018/8/1.
 */
import React, {Component, Fragment} from 'react';
import {Button, Divider, Dropdown, Input, Menu, Modal, Table,} from 'antd';
import {FormAdd, SearchFrom, TreePro} from "../index"
import {getTextByJs, ajax} from "../utils/common"
import {CaretRightOutlined, DeleteOutlined, DownOutlined, PlusOutlined} from "@ant-design/icons"
import {diffObj, isArrayop, uid} from "esn";
import PropTypes from "prop-types";

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


const { Search } = Input;
const confirm = Modal.confirm;


export default class TablePro extends Component {

    static propTypes = {
        /** ajax的实现函数 */
        ajax: PropTypes.func.isRequired,
        /** 外部传进来的已有数据 */
        addData: PropTypes.array,
        style: PropTypes.object,
        /** 表格结构数据,参考antd的table columns */
        columns: PropTypes.array,
        /** 接口连接 */
        url:PropTypes.string,
        /** 额外的需要加入的参数 */
        values: PropTypes.object,
        /** 数据获取方式 (data) => {return data.data.records}*/
        setData: PropTypes.func,
        /** 获取分页总数的方式  (data) => {return data.total}*/
        setTotal: PropTypes.func,
        /** 整个table的外边距 */
        margin: PropTypes.number,
        /** 树的搜索字段 */
        getTreeField: PropTypes.string,
        /** 树的url，如果为null就是不需要树 */
        treeUrl: PropTypes.string,
        /** 表格的其他属性 */
        config: PropTypes.object,
        /** 是否有分页 */
        hasPage: PropTypes.bool,
        /** 判断是否可以被选中的函数，返回false就是这行不可以被选中 (record) => {return false}*/
        rowDisabledFun:PropTypes.func,
        /** 批量操作的对象 [{icon,title,fun(selectedRowKeys---当前已经选中的表格数据, onSelectChange---表格数据更新到组件的函数, get_data---逻辑完成后需要更新表格数据的函数)}]*/
        rowAction: PropTypes.array,
        /** 主键id */
        primaryKeyField:PropTypes.string,
        /** 是否有新增/编辑 */
        hasAdd: PropTypes.bool,
        /** 是否有编辑，这个参数可以传递函数，因为有的时候不同的行，有的需要编辑，有的则不需要，回调函数中会返回一个record */
        hasEdit: PropTypes.any,
        /** 是否有批量删除 */
        hasDeleteBatch: PropTypes.bool,
        /** 对删除进行判断，哪些可以删除，哪些不可以删除 (record) => {return true;}*/
        deleteDisabledFun: PropTypes.func,
        /** 其他操作的组件 */
        actionComponent: PropTypes.func,
        /** 弹框的设置 */
        modalConfig: PropTypes.object,
        /** 主标题字段，用于显示在新增或编辑弹框的上面 */
        modalTitle: PropTypes.string,
        /** 其他按钮组件，返回一个每个按钮一个div包裹的组件，每个按钮都要用div包裹，不然会连接在一起*/
        otherBtn: PropTypes.elementType,
        /** 编辑和新增用到的表单组件，参考formAdd组件*/
        addForm: PropTypes.array,
        /** 新增编辑的提交函数，formAdd的自定义提交 */
        addSubmitFun: PropTypes.func,
        /** 编辑新增的提交url */
        addUrl: PropTypes.string,
        /** 搜索组件的form对象 */
        searchForm: PropTypes.array,
        /** 操作的宽度 */
        actionWidth: PropTypes.number,
        /** 上方筛选组件的其他参数，参考SearchFrom的配置 */
        searchFormSet: PropTypes.object,
        /** 树组件的其它组件参数设置 */
        treeSet: PropTypes.object,
        /** 其他新增的表单的的设置 */
        addFormSet: PropTypes.object,
        /** 编辑时获取服务器数据 (record, fun) => {fun(record);}*/
        editGetRecord: PropTypes.func,
        /** 表单修改时需要传的主键的id，一般是跟主键保持一致都是id，我们也建议使用id*/
        addFormRowKey: PropTypes.string,
        /** 删除用到的url */
        deleteUrl: PropTypes.string,
        /** 删除接口时用到的id，一般是跟主键保持一致都是id，我们也建议使用id */
        deleteIdField: PropTypes.string,
        /** 操作选项是否固定 */
        isActionFixed: PropTypes.any,
        /** 外面的需要用到这个表格请求的数据的话，可以用这个方法 (data) => {}*/
        tableDataCallback: PropTypes.func,
        /** 批量删除需要的额外的参数 */
        deleteValues: PropTypes.object,
        /** 表格的是什么型的默认是紧凑型的 */
        size: PropTypes.string,
        /** 搜索的标题字段 */
        searchPlaceholder: PropTypes.string,
        /** 关键字搜索接口中用到的字段 */
        searchLabelField: PropTypes.string,
        /** 删除前confirm的提示文字 (record) => {}*/
        deleteConfirmText: PropTypes.any,
        /** 搜索框的宽度 */
        searchWidth: PropTypes.number,
        /** 树控件点击后的回调 (data) => {}*/
        treeClick: PropTypes.func,
        /** 搜索变化时的回调 (values) => {}*/
        onSearchChange: PropTypes.func,
        /** 编辑需要另外的url的 */
        editUrl: PropTypes.string,
        /** 删除使用数组返回，而不是逗号分隔的字符串 */
        deleteUseArr: PropTypes.bool,
        /** 编辑时的回调 (record) => {}*/
        editCallback: PropTypes.func,
        /** 删除按钮点击的时候，调用的函数 (id) => {}*/
        deleteCallback: PropTypes.func,
        /** 其他搜索下方的dom */
        otherSearchDom: PropTypes.elementType,
        /** otherSearchDom的位置是否在上面搜索的下面 */
        otherSearchDomIsBottom: PropTypes.bool,
        /** 编辑和新增成功之后的回调 ()=>{}*/
        addFormSubmitCallback: PropTypes.func,
        /** 上方的搜索，是否需要强制转为数字类型 */
        searchTypeIsNumber: PropTypes.bool,
        /** 弹窗关闭时的回调 ()=>{}*/
        modalCloseCallback: PropTypes.func,
        /** 表格高度 */
        height: PropTypes.number,
        /** 表格的宽度 */
        width: PropTypes.number,
        /** 行数据的record，进行处理 (record) => {return record}*/
        setRecord: PropTypes.func,
        /** 首次加载组件是否请求数据 */
        firstLoadData: PropTypes.bool,
        /** 是否需要隐藏多选的按钮 */
        hideSelectAll: PropTypes.bool,
        /** 关键词搜索时的生命周期 (value, values) => {}*/
        searchCallback: PropTypes.func,
        /** 新增按钮文字 */
        addText: PropTypes.string,
        /** 文本的字体大小 */
        pageSize: PropTypes.number,
        /** 远程排序用到需要排序的字段 */
        sortField: PropTypes.string,
        /** 排序方式用到的字段 */
        sortOrderField: PropTypes.string,
        /** 点击新增按钮时的回调 */
        addCallback: PropTypes.func,
        /** 表格加载数据时的loading回调  (loading) => {}*/
        loadingCallback:PropTypes.func,
        /** 删除之前的回调(id, record, fun) => {},null就是不需要 */
        deleteBefore: PropTypes.func
    }

    static defaultProps = {
        /** ajax的实现函数 */
        ajax: ajax,
        /** 外部传进来的已有数据 */
        addData: [],
        style: {},
        /** 表格结构数据 */
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
        /** 接口连接 */
        url: "/table",
        /** 额外的需要加入的参数 */
        values: {},
        /** 数据获取方式 */
        setData: (data) => {
            return data.data.records
        },
        /** 获取分页总数的方式 */
        setTotal: null,
        /** 整个table的外边距 */
        margin: 0,
        /** 树的搜索字段 */
        getTreeField: "getTreeField",
        /** 树的url，如果为null就是不需要树 */
        treeUrl: null,
        /** 表格的其他属性 */
        config: {},
        /** 是否有分页 */
        hasPage: true,
        /** 判断是否可以被选中的函数，返回false就是这行不可以被选中 */
        rowDisabledFun: (record) => {
            return false
        },
        /** 批量操作的对象 */
        rowAction: null,
        /** 主键id */
        primaryKeyField: "id",
        /** 是否有新增/编辑 */
        hasAdd: true,
        /** 是否有编辑，这个参数可以传递函数，因为有的时候不同的行，有的需要编辑，有的则不需要，回调函数中会返回一个record */
        hasEdit: true,
        /** 是否有批量删除 */
        hasDeleteBatch: true,
        /** 对删除进行判断，哪些可以删除，哪些不可以删除 */
        deleteDisabledFun: (record) => {
            return true;
        },
        /** 其他操作的组件 */
        actionComponent: null,
        /** 弹框的设置 */
        modalConfig: {},
        /** 主标题字段，用于显示在新增或编辑弹框的上面 */
        modalTitle: "",
        /** 其他按钮组件 */
        otherBtn: null,
        /** 编辑和新增用到的表单组件 */
        addForm: [],
        /** 新增编辑的提交函数 */
        addSubmitFun: null,
        /** 编辑新增的提交url */
        addUrl: null,
        /** 搜索组件的form对象 */
        searchForm: [],
        /** 操作的宽度 */
        actionWidth: 100,
        /** 上方筛选组件的其他参数 */
        searchFormSet: {},
        /** 树组件的其它组件参数设置 */
        treeSet: {},
        /** 其他新增的表单的的设置 */
        addFormSet: {},
        /** 编辑时获取服务器数据 */
        editGetRecord: (record, fun) => {
            fun(record);
        },
        /** 表单修改时需要传的主键的id */
        addFormRowKey: null,
        /** 删除用到的url */
        deleteUrl: null,
        /** 删除接口时用到的id，一般是跟主键保持一致都是id，我们也建议使用id */
        deleteIdField: "id",
        /** 操作选项是否固定 */
        isActionFixed: true,
        /** 外面的需要用到这个表格请求的数据的话，可以用这个方法 */
        tableDataCallback: (data) => {

        },
        /** 批量删除需要的额外的参数 */
        deleteValues: {},
        /** 表格的是什么型的默认是紧凑型的 */
        size: "middle",
        /** 搜索的标题字段 */
        searchPlaceholder: "请输入关键词",
        /** 关键字搜索接口中用到的字段 */
        searchLabelField: null,
        /** 删除前confirm的提示文字 */
        deleteConfirmText: "数据删除后无法恢复，确定删除？",
        /** 搜索框的宽度 */
        searchWidth: 200,
        /** 树控件点击后的回调 */
        treeClick: (data) => {
        },
        /** 搜索变化时的回调 */
        onSearchChange: (values) => {

        },
        /** 编辑需要另外的url的 */
        editUrl: null,
        /** 删除使用数组返回，而不是逗号分隔的字符串 */
        deleteUseArr: false,
        /** 编辑时的回调 */
        editCallback: (record) => {

        },
        /** 删除按钮点击的时候，调用的函数 */
        deleteCallback: (id) => {

        },
        /** 其他搜索下方的dom */
        otherSearchDom: null,
        /** otherSearchDom的位置是否在上面搜索的下面 */
        otherSearchDomIsBottom: false,
        /** 编辑和新增成功之后的回调 */
        addFormSubmitCallback: () => {

        },
        /** 上方的搜索，是否需要强制转为数字类型 */
        searchTypeIsNumber: false,
        /** 弹窗关闭时的回调 */
        modalCloseCallback: () => {

        },
        /** 表格高度 */
        height: null,
        /** 表格的宽度 */
        width: null,
        /** 行数据的record，进行处理 */
        setRecord: (record) => {
            return record
        },
        /** 首次加载组件是否请求数据 */
        firstLoadData: true,
        /** 是否需要隐藏多选的按钮 */
        hideSelectAll: true,
        /** 关键词搜索时的生命周期 */
        searchCallback: (value, values) => {

        },
        /** 新增按钮文字 */
        addText: null,
        pageSize: 10,
        /** 远程排序用到需要排序的字段 */
        sortField: null,
        /** 排序方式用到的字段 */
        sortOrderField: "orderType",
        /** 点击新增按钮时的回调 */
        addCallback: () => {
        },
        /** 表格加载数据时的loading回调 */
        loadingCallback: (loading) => {
        },
        /** 删除之前的回调(id, record, fun) => {},null就是不需要 */
        deleteBefore: null
    }

    constructor(props) {
        super(props);

        this.uid = `up_table_${uid()}`;

        this.state = {
            loading: false,
            selectedRowKeys: [],
            selectedRows: [],
            visible: false,
            pagination: {
                current: 1,
                pageSize: props.pageSize,
                total: 0,
                showTotal: total => `${props.clotheLang.table.all} ${total} ${props.clotheLang.table.record}`,
                showQuickJumper: true,
                showSizeChanger: true,
                size: "small",
                pageSizeOptions: ['5', '10', '20', '30', '40']
            },
            dataSource: [],
            //查询时需要用到的值
            values: props.values,
            record: null,
            tree_show: true,
            otherSearchValues: {},
            //是否点击的新增按钮
            isAddText: true,
            //计算表格与容器的高度
            height: 480
        };
    }

    componentDidMount = () => {
        if (this.props.firstLoadData) {
            this.getData();
        }
        this.getHeight()
    }

    componentWillReceiveProps(nextProp) {
        if (diffObj(nextProp.values, this.props.values)) {
            let _values = {...this.state.values, ...nextProp.values}
            this.setState({
                values: _values
            }, () => {
                this.getData(1, _values, this.state.pagination.pageSize)
            })
        }
        if (diffObj(nextProp.url, this.props.url)) {
            this.getData(this.state.pagination.current, this.state.values, this.state.pagination.pageSize, nextProp.url)
        }
    }

    //移除
    componentWillUnmount() {
        //离开页面消除所有接口请求
        this.setState = (state, callback) => {
            return;
        };
    }

    //计算表格的高度
    getHeight = () => {
        if (this.props.height) {
            this.setState({
                height: this.props.height
            })
            return
        }
        let tbDom = document.getElementById(this.uid).getElementsByClassName("ant-table-thead")[0]
        let tb = tbDom ? tbDom.getBoundingClientRect().bottom : 0;
        // let orgHeight = document.getElementById(this.uid).getElementsByTagName("table")[0].offsetHeight
        // let orgHeight = 0
        let warp = document.getElementById(this.uid).getBoundingClientRect().bottom;
        let result = warp - tb - (this.props.setTotal ? 51 : 0)


        this.setState({
            height: result < 250 ? 250 : result
        })

    }

    //搜索组件
    table_search = (submit) => {
        return (
            <SearchFrom
                toggleCallback={() => {
                    this.getHeight()
                }}
                submit={submit}
                formData={this.props.searchForm}
                {...this.props.searchFormSet}
            />
        )
    }

    //编辑和新增用到的表单组件
    table_add = (record,visible) => {
        return (
            <FormAdd
                visible={visible}
                record={record}
                formData={this.props.addForm}
                addFormSubmitCallback={() => {
                    this.handleCancel()
                    this.getData(this.state.pagination.current, this.state.values, this.state.pagination.pageSize, this.props.url, (data) => {
                        this.props.addFormSubmitCallback(record, data);
                    });
                }}
                disabledBtn={!visible}
                submit={this.props.addSubmitFun}
                addUrl={this.props.addUrl}
                editUrl={this.props.editUrl}
                primaryKeyField={this.props.addFormRowKey ? this.props.addFormRowKey : this.props.primaryKeyField}
                {...this.props.addFormSet}
            />
        )
    }


    //返回表格使用的额外参数
    getValues = () => {
        return this.state.values
    }

    setDataSource = (data = [], page = 1, total = 1) => {
        const pagination = {...this.state.pagination};
        pagination.total = total;
        pagination.current = page;
        this.setState({
            dataSource: data, pagination
        })
    }

    //获取表格数据
    getData = (page = this.state.pagination.current, values = this.state.values, pageSize = this.state.pagination.pageSize, url = this.props.url, fun = () => {
    }) => {
        const {setTotal, hasPage, setData, loadingCallback} = this.props;
        const {otherSearchValues} = this.state;

        this.setState({
            loading: true,
        }, () => {
            loadingCallback(true)
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

        let param = {
            ...values, ...search_init_data, ...otherSearchValues
        }

        if (hasPage) {
            param.pageIndex = page
            param.pageSize = pageSize
        }

        this.props.ajax(url, param, (data) => {
            const pagination = {...this.state.pagination};
            if (setTotal) {
                pagination.total = setTotal(data);
            }
            pagination.current = page;
            pagination.pageSize = pageSize;
            this.props.tableDataCallback(data);
            this.setState({
                dataSource: setData(data) || [],
                pagination
            })
            fun();
        }, () => {
            this.setState({
                loading: false,
            }, () => {
                loadingCallback(false)
                this.getHeight()
            })
        })
    }

    //分页请求数据
    handleTableChange = (pagination, filters, sorter, extra) => {
        const {sortField, sortOrderField} = this.props;
        switch (extra.action) {
            case "paginate":
                this.getData(pagination.current, this.state.values, pagination.pageSize)
                return;
            case "sort":
                if (sorter.column.sorter === true) {
                    let param = {...this.state.values}
                    param[sortOrderField] = sorter.order
                    param[sortField] = sorter.field
                    this.getData(pagination.current, param)
                } else {
                    return;
                }
            default:
                return;
        }

    }

    select = (value, obj) => {
        let values = {...this.state.values}
        this.props.treeClick(value);
        values[this.props.getTreeField] = value ? value[0] : null
        this.getData(1, values);
        this.setState({
            values
        })
    }

    //计算表格的宽度
    scroll = () => {
        const {addUrl, editUrl, hideSelectAll, deleteUrl, hasDeleteBatch, otherBtn, rowAction, actionComponent, columns} = this.props
        if (this.props.width) {
            return this.props.width
        }

        let kuan = (addUrl || editUrl || actionComponent ? this.props.actionWidth : 0) + ((rowAction || (deleteUrl && hasDeleteBatch) || otherBtn) && hideSelectAll ? 60 : 0);
        for (let i of columns) {
            if (i.minWidth) {
                kuan += i.minWidth
            } else {
                kuan += i.width ? i.width : 100;
            }
        }
        return kuan;
    }

    submit = (data) => {
        let values = {...this.state.values, ...data}
        this.props.onSearchChange(values)
        this.getData(1, values);
        this.setState({
            values
        })
    }

    onSelectChange = (selectedRowKeys = [], selectedRows = []) => {
        this.setState({selectedRowKeys, selectedRows});
    }

    handleMenuClick = (e) => {
        this.props.rowAction[e.key].fun(this.state.selectedRowKeys, this.onSelectChange, this.reget_data);
    }

    showModal = (_record = null, isAddText = false) => {
        let record = this.props.setRecord(_record, this.state.dataSource)
        if (_record) {
            this.props.editGetRecord(record, (record) => {
                this.setState({
                    visible: true,
                    record,
                    isAddText
                }, () => {
                    this.props.editCallback(record)
                });
            })
        } else {
            this.props.addCallback()
            this.setState({
                visible: true,
                record,
                isAddText
            });
        }
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        }, () => {
            this.props.modalCloseCallback()
        });
    }

    //批量操作之后更新数据的函数
    reget_data = () => {
        this.getData();
    }

    deleteAll = (id = "") => {
        const {pagination, values} = this.state
        const {deleteUseArr, deleteCallback} = this.props;
        let param = {...this.props.deleteValues};

        // let currentTemp = pagination.current;
        // let totalPage = Math.ceil(pagination.total / pagination.pageSize)
        // let yushu = pagination.total % pagination.pageSize
        // let geshu = 1;
        // if(isArrayop(id)){
        //     geshu = id.length;
        // }
        if (id instanceof Array && !deleteUseArr) {
            param[this.props.deleteIdField] = getTextByJs(id)
        } else {
            if (deleteUseArr && !isArrayop(id)) {
                param[this.props.deleteIdField] = [id]
            } else {
                param[this.props.deleteIdField] = id
            }
        }

        // if (pagination.current === totalPage && (yushu === geshu || yushu === 0) && pagination.current > 0) {
        //     currentTemp -= 1;
        // }
        //
        // if (yushu < geshu) {
        //     let jiye = Math.ceil(geshu / pagination.pageSize)
        //     currentTemp -= jiye
        // }

        this.props.ajax(this.props.deleteUrl, param, (data) => {
            this.setState({
                selectedRowKeys: []
            })
            deleteCallback(id)
            this.getData(1, values);
        }, () => {
        }, true)
    }

    showDeleteConfirm = (id, record) => {
        const {deleteConfirmText} = this.props;
        const {selectedRows} = this.state;
        confirm({
            title: '提示？',
            content: typeof deleteConfirmText === "function" ? deleteConfirmText(record || selectedRows) : deleteConfirmText,
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
                this.deleteAll(id)
            },
            onCancel() {
            },
        });
    }

    //搜索
    search = (value) => {
        let values = {...this.state.values}
        if (this.props.searchTypeIsNumber) {
            value = parseInt(value)
        }
        values[this.props.searchLabelField] = value
        this.getData(1, values);
        this.setState({
            values
        }, () => {
            this.props.searchCallback(value, values)
        })
    }

    tree_hide = (bool) => {
        this.setState({
            tree_show: bool
        })
    }


    render() {
        const {actionWidth, treeSet, hasPage, ajax, deleteUrl, primaryKeyField, isActionFixed, hasEdit, addForm, size, searchPlaceholder, searchLabelField, hasDeleteBatch, searchWidth, setTotal, addUrl, deleteDisabledFun, addSubmitFun, otherSearchDom, clotheLang, modalTitle, otherBtn, hideSelectAll, addData, addText, otherSearchDomIsBottom, modalConfig, deleteBefore} = this.props;
        const {selectedRowKeys, record, tree_show, visible, values, dataSource, loading, otherSearchValues, isAddText, height} = this.state;


        let columns = [...this.props.columns]
        for (let i of columns) {
            if (i && i.strCut) {
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


        if (this.props.actionComponent || deleteUrl || (addForm.length > 0 && hasEdit)) {
            columns.push({
                title: clotheLang.table.operation,
                dataIndex: 'action',
                width: actionWidth,
                fixed: isActionFixed === true ? "right" : isActionFixed,
                render: (text, record) => {
                    let has_edit_ = hasEdit && (addUrl || addSubmitFun);
                    if (typeof hasEdit === "function") {
                        has_edit_ = hasEdit(record) && (addUrl || addSubmitFun);
                    }
                    return (
                        <Fragment>
                            {this.props.actionComponent ? this.props.actionComponent(text, record, this.getData) : null}
                            {has_edit_ && addForm.length > 0 ?
                                <a onClick={this.showModal.bind(this, record, false)}>{clotheLang.table.edit}</a> : null}
                            {has_edit_ || (deleteDisabledFun(record) && has_edit_) ? <Divider type="vertical"/> : null}
                            {deleteUrl ? deleteDisabledFun(record) ?
                                <a className="hongzi"
                                   onClick={deleteBefore ? () => deleteBefore(record[primaryKeyField], record, this.deleteAll) : this.showDeleteConfirm.bind(this, record[primaryKeyField], record)}>{clotheLang.table.delete}</a> : null : null}
                        </Fragment>
                    )
                }
            })
        }

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
                disabled: this.props.rowDisabledFun(record)
            }),
        };
        let btn = this.props.rowAction ? this.props.rowAction.map((data, i) => {
            return (
                <Menu.Item key={i}>{data.icon ? <data.icon/> : null}{data.title}</Menu.Item>
            )
        }) : null

        const menu = (
            <Menu onClick={this.handleMenuClick}>
                {btn}
            </Menu>
        );


        return (
            <div className="up_table_warp" style={{margin: this.props.margin, ...this.props.style}} id={this.uid}>
                <div
                    className={this.props.searchForm.length > 0 || (otherSearchDom && !otherSearchDomIsBottom) ? "up_table_warp_search" : ""}>
                    {this.props.searchForm.length > 0 ? <div className="up_table_warp_top">
                        {this.table_search(this.submit)}
                    </div> : null}
                    {otherSearchDom && !otherSearchDomIsBottom ? <div className="up_table_warp_middle">
                        {otherSearchDom(loading, (data, isUpdate = true) => {
                            let obj = {...otherSearchValues, ...data}
                            this.setState({
                                otherSearchValues: obj
                            }, () => {
                                if (isUpdate) {
                                    this.getData(1, values)
                                }
                            })
                        }, otherSearchValues)}
                    </div> : null}
                </div>
                <div className="up_table_warp_bottom">
                    {this.props.treeUrl ?
                        <div className={tree_show ? "up_table_warp_bottom_l" : "up_table_warp_bottom_l gybxs"}>
                            <TreePro treeHide={this.tree_hide} ajax={ajax} select={this.select}
                                     treeUrl={this.props.treeUrl} {...treeSet}/>
                        </div> : null}
                    <div className={this.props.treeUrl ? "up_table_warp_bottom_r" : "up_table_warp_bottom_r_s"}>
                        <div className="up_table_warp_btn">
                            <div className={tree_show ? "gybxs" : ""} onClick={this.tree_hide.bind(this, true)}>
                                <div className="up_table_warp_btn_tree_btn">
                                    <CaretRightOutlined/>
                                </div>
                            </div>
                            {this.props.hasAdd && addForm.length > 0 ? <div>
                                <Button type="primary"
                                        onClick={this.showModal.bind(this, null, true)}><PlusOutlined/>{addText ? addText : clotheLang.form.add}
                                </Button>
                            </div> : null}


                            {this.props.rowAction ? <div>
                                <Dropdown overlay={menu} disabled={selectedRowKeys.length === 0}>
                                    <Button>
                                        {clotheLang.table.bulkOperation} <DownOutlined/>
                                    </Button>
                                </Dropdown>
                            </div> : null}
                            {otherBtn ? otherBtn(this.state.selectedRowKeys, this.onSelectChange, this.getData, {...values, ...otherSearchValues}) : null}
                            {deleteUrl && hasDeleteBatch ?
                                <div><Button type="danger" disabled={selectedRowKeys.length === 0}
                                             onClick={deleteBefore ? () => deleteBefore(selectedRowKeys, null, this.deleteAll) : this.showDeleteConfirm.bind(this, selectedRowKeys, null)}><DeleteOutlined/>{clotheLang.table.bulkDelete}
                                </Button></div> : null}
                            {searchLabelField ? <div>
                                <Search
                                    placeholder={searchPlaceholder}
                                    onSearch={this.search}
                                    style={{width: searchWidth}}
                                />
                            </div> : null}
                            {otherSearchDom && otherSearchDomIsBottom ? <div>
                                {otherSearchDom(loading, (data, isUpdate = true) => {
                                    let obj = {...otherSearchValues, ...data}
                                    this.setState({
                                        otherSearchValues: obj
                                    }, () => {
                                        if (isUpdate) {
                                            this.getData(1, values)
                                        }
                                    })
                                }, otherSearchValues)}
                            </div> : null}
                        </div>
                        <Table
                            columns={columns}
                            dataSource={[...addData, ...dataSource]}
                            onChange={this.handleTableChange}
                            loading={this.state.loading}
                            pagination={setTotal ? this.state.pagination : false}
                            scroll={{x: this.scroll(), ...(height ? {y: height} : {})}}
                            rowSelection={(this.props.rowAction || (deleteUrl && hasDeleteBatch) || otherBtn) && hideSelectAll ? rowSelection : null}
                            style={{width: "100%"}}
                            size={size}
                            rowKey={primaryKeyField}
                            {...this.props.config}
                        />
                    </div>
                </div>
                <Modal
                    title={(modalTitle ? modalTitle : "") + (isAddText ? clotheLang.form.add : clotheLang.table.edit)}
                    visible={visible}
                    onCancel={this.handleCancel}
                    footer={null}
                    {...modalConfig}
                >
                    <div id="select"/>
                    {this.table_add(record,visible)}
                </Modal>
            </div>
        )
    }
}
