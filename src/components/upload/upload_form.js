/**
 * Created by zengtao on 2018/12/18.
 */
import React, {Fragment, Component, PureComponent} from 'react';
import {Button, Input, Modal, Form, Upload, message, Tooltip, notification} from 'antd';
import {form_value, turn_data} from "../utils/common";
import {createMap} from "esn";
import {CloudUploadOutlined} from "@ant-design/icons";
import {uploadType} from "../utils/enum"
function f3(n) {
    return n === 0 ? 0 : n - (n * 2);
}

export default class Index extends Component {

    static defaultProps = {
        ajax: () => {
        },
        //是否禁用上传按钮
        disabled: false,
        //图片上传地址
        url: "/upload/profile",
        //上传的参数
        // upload_parm: (file) => {
        //     return {};
        // },
        //允许上传几张，默认是1张图片
        num: 1,
        //允许上传的文件格式
        accept: [],
        //文件最大
        max_size: 1,
        //其他设置
        other_set: {},
        //上传文件的参数名
        name: "file",
        //接口数据处理
        api_set: (data) => {
            return data.entity;
        },
        //接口数据是否接收成功的函数
        api_key: (data) => {
            return data.key === 1
        },
        //当前图片list改变时就会调用
        onChange: (list) => {
            //console.log(list)
        },
        //上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
        listType: "picture",
        //按钮文本
        tit: "点击上传",
        //是否展示 uploadList, 可设为一个对象，用于单独设定 showPreviewIcon 和 showRemoveIcon
        showUploadList: true,
        //上传成功后的回调,
        upload_fun: (data, loading) => {
            loading()
        },
        //上传开始时的回调
        before_upload: () => {

        },
        //成功和失败后的提示语
        msg: (data) => {
            return data.value
        },
        //前缀url,如果后端返回的是一个需要拼接的地址，那就用这个地址拼接
        add_url: "",
        //拼接代码需要用到的接口返回格式
        response: (url) => {
            return {key: 1, entity: url, value: "成功"}
        },
        //onChange的时候，是返回数组还是返回字符串
        form_value_string: true,
        token: "",
        //是否可以切换图片模式
        hasPattern: false,
        Authorization:"Authorization",
        //错位时是谈简单tip还是右上角的错误通知
        isTip:true
    }

    constructor(props) {
        super(props);


        this.state = {
            loading_img: false,
            fileList: turn_data(props.value, (data, i) => {
                return {
                    thumbUrl: props.add_url + data,
                    name: data.split('/').pop(),
                    response: props.response(data),
                    uid: i,
                    status: 'done',
                    url: props.add_url + data
                }
            }),
            pattern: 1,
        }
    }


    patternEnum = createMap([{
        id: 1,
        name: this.props.clotheLang.upload.uploadMode
    }, {
        id: 2,
        name: this.props.clotheLang.upload.urlMode
    }])


    componentWillReceiveProps(nextProp) {
        if (nextProp.value !== this.props.value) {
            this.setState({
                fileList: turn_data(nextProp.value, (data, i) => {
                    return {
                        thumbUrl: this.props.add_url + data,
                        name: data.split('/').pop(),
                        response: this.props.response(data),
                        uid: i,
                        status: 'done',
                        url: this.props.add_url + data
                    }
                })
            })
        }
    }

    load = null

    load_fun = (bool = true) => {

        if (this.props.showUploadList) {
            return;
        }

        if (bool && !this.load) {
            this.load = message.loading(`${this.props.clotheLang.upload.loading}...`, 0);
        } else {
            this.load()
        }
    }

    /**
     * 上传之前的验证
     */
    beforeUpload = (file) => {
        this.load_fun(true)
        const {max_size} = this.props
        this.setState({
            loading_img: true
        })
        this.props.before_upload(file);
        let isLtMax = true, judge = true;
        if (max_size) {
            let file_size = file.size / 1024 / 1024;
            isLtMax = file_size < max_size;
            if (!isLtMax) {
                message.error(`${this.props.clotheLang.upload.file}${file_size.toFixed(2)}M${this.props.clotheLang.upload.exceed}${max_size}M${this.props.clotheLang.upload.limit}`);
            }
        }
        //数组遍历后返回一个处理
        const arrToString=(arr,fun)=>{
            return arr.map((data,i)=>{
                return fun(data)
            })
        }


        if (this.props.accept.length > 0) {
            judge = this.props.accept.find((i) => {
                return i === file.type
            })
            if (!judge) {
                this.load_fun(false)
                let type = arrToString(this.props.accept,(data)=>{
                    return uploadType.get(data)?uploadType.get(data).title:""
                })
                message.error(`${this.props.clotheLang.upload.file}《${file.name}》${this.props.clotheLang.upload.typeMust}${type?type:this.props.clotheLang.upload.agreed}`);
            }
        }
        this.setState({
            loading_img: false
        })
        return judge !== undefined && isLtMax;
    };

    handleChange = (info) => {
        let fileList = info.fileList;
        fileList = fileList.filter((file) => {
            if (file.response) {
                file.url = this.props.add_url + this.props.api_set(file.response);
                return this.props.api_key(file.response);
            } else {
                if (!file.hasOwnProperty("status")) {
                    return false;
                }
                return true;
            }
        });

        if (info.file.status === "done") {
            if (this.props.api_key(info.file.response)) {
                this.load_fun(false)
                if(!this.props.showUploadList){
                    message.success(this.props.clotheLang.upload.success,3)
                }
            } else {
                this.load_fun(false)
                this.setState({loading_img: false});
                if(this.props.isTip){
                    message.error(`${this.props.clotheLang.upload.file}《${info.file.name}》${this.props.clotheLang.upload.failed}：${this.props.msg(info.file.response)}`);
                }else {
                    notification["error"]({
                        message: this.props.clotheLang.common.error,
                        description:
                          `${this.props.clotheLang.upload.file}《${info.file.name}》${this.props.clotheLang.upload.failed}：${this.props.msg(info.file.response)}`,
                    });
                }

            }
            this.props.upload_fun(info.file.response, () => {
                this.setState({loading_img: false});
            })
            fileList = fileList.slice(f3(this.props.num));
            this.props.onChange(form_value(fileList, this.props.form_value_string, this.props))
        }

        if (info.file.status === "removed") {
            this.props.onChange(form_value(fileList, this.props.form_value_string, this.props))
        }

        this.setState({fileList});
    }

    patternChange = (value) => {
        if (value === 1) {
            this.setState({
                pattern: 2
            })
        } else {
            this.setState({
                pattern: 1
            })
        }
    }


    render() {
        const {token, value, hasPattern,Authorization} = this.props;
        const {pattern, fileList} = this.state;
        const props = {
            action: this.props.url,
            onChange: this.handleChange,
            name: this.props.name,
            ...this.props.other_set
        };
        const headers = {}
        headers[Authorization]=token
        return (
            <Fragment>
                {
                    pattern === 1 ? <Upload
                        className="inline_block"
                        fileList={fileList} {...props}
                        disabled={this.state.loading_img || this.props.disabled}
                        listType={this.props.listType}
                        accept={this.props.accept.length > 0 ? this.props.accept.join(",") : null}
                        beforeUpload={this.beforeUpload}
                        showUploadList={this.props.showUploadList}
                        headers={{
                            ...headers,...props.headers
                        }}
                    >
                        {this.props.children ? this.props.children :
                            <Button
                                disabled={this.state.loading_img || this.props.disabled}>
                                {this.props.showUploadList ?
                                    <Fragment><CloudUploadOutlined/> {this.props.tit}</Fragment> : this.props.tit}
                            </Button>
                        }
                    </Upload> : <Input style={{width: 180}} value={value} onChange={this.props.onChange} allowClear/>
                }
                &nbsp;
                {hasPattern ?
                    <a onClick={this.patternChange.bind(this, pattern)}>{this.patternEnum.get(pattern).name}</a> : null}


            </Fragment>
        )
    }
}
