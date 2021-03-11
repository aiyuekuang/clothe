/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, Component, PureComponent, createRef} from 'react';
import {Button, Input, Modal, Upload} from 'antd';
import {cuns} from 'esn'
import BraftEditor from 'braft-editor'
import {ContentUtils} from 'braft-utils'
import {ImageUtils} from 'braft-finder'
import {upload} from "../utils/fetchData"
import {UploadPro} from "../index";
import {UploadOutlined} from "@ant-design/icons"
import {convertRawToHTML, convertHTMLToRaw} from 'braft-convert'
import PropTypes from "prop-types";

export default class RichText extends Component {

    static propTypes = {
        /** ajax的实现函数 */
        ajax: PropTypes.func.isRequired,
        /** 文字变化之后的接收 (data) => {console.log(data)}*/
        onChange: PropTypes.func,
        /** 全部的组件 */
        controls: PropTypes.array,
        /** 在默认基础上，其他需要的组件 */
        extraControls: PropTypes.array,
        /** 提交按钮触发 (data) => {console.log(data)}*/
        submit: PropTypes.func,
        /** 重置按钮 () => {}*/
        rest: PropTypes.func,
        /** 是否显示btn */
        btn: PropTypes.bool,
        /** 上传图片的url */
        uploadUrl: PropTypes.string,
        /** 图片上传的其他参数设置 */
        uploadSet: PropTypes.object,
        /** 图片文件的上传格式 */
        image: PropTypes.array,
        /** 是否需要上传video 'video/mp4'*/
        video: PropTypes.string, /** 'video/mp4'
         /** 是否需要上传音频 */
        audio: PropTypes.bool, /**  'audio/mp3'
         /** 判断数据是否正确的函数 (data) => {return data.key === 1}*/
        apiKeyFun: PropTypes.func,
        /** 数据获取方式 (data) => {return data.filePath}*/
        setData: PropTypes.func,
        /** 其他clothe上传组件的设置 */
        clotheLoadSet: PropTypes.object,
        /** 其他的富文本的设置 */
        config: PropTypes.object,
        /** 值 */
        value: PropTypes.any,
        /** 是否返回raw格式的数据 */
        raw: PropTypes.bool
    }

    static defaultProps = {
        /** ajax的实现函数 */
        ajax: () => {
        },
        /** 文字变化之后的接收 */
        onChange: (data) => {
            console.log(data)
        },
        /** 全部的组件 */
        controls: [
            'undo', 'redo', 'separator',
            'font-size', 'line-height', 'letter-spacing', 'separator',
            'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
            'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
            'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
            'link', 'separator', 'hr', 'separator',
            'clear'
        ],
        /** 在默认基础上，其他需要的组件 */
        extraControls: [],
        /** 提交按钮触发 */
        submit: (data) => {
            console.log(data)
        },
        /** 重置按钮 */
        rest: () => {

        },
        /** 是否显示btn */
        btn: false,
        /** 上传图片的url */
        uploadUrl: null,
        /** 图片上传的其他参数设置 */
        uploadSet: {},
        /** 图片文件的上传格式 */
        image: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/apng', 'image/svg'],
        /** 是否需要上传video */
        video: false, /** 'video/mp4'
         /** 是否需要上传音频 */
        audio: false, /**  'audio/mp3'
         /** 判断数据是否正确的函数 */
        apiKeyFun: (data) => {
            return data.key === 1
        },
        /** 数据获取方式 */
        setData: (data) => {
            return data.filePath
        },
        /** 其他clothe上传组件的设置 */
        clotheLoadSet: {},
        /** 其他的富文本的设置 */
        config: {},
        /** 值 */
        value: null,
        /** 是否返回raw格式的数据 */
        raw: false
    }


    constructor(props) {
        super(props);

        this.state = {
            editorState: BraftEditor.createEditorState(props.value)
        }

    }

    componentdidmount() {
        // ContentUtils.insertText(this.state.editorState, "dsdsd")
    }


    componentWillUnmount() {
    }

    rest = (data) => {
        this.setState({
            editorState: ContentUtils.clear(this.state.editorState)
        })
        this.props.rest();
    }

    handleChange = (editorState) => {
        this.setState({
            editorState,
        })

        if (this.props.raw) {
            this.props.onChange({html: editorState.toHTML(), raw: editorState.toRAW()})
        } else {
            this.props.onChange(editorState.toHTML())
        }
    }

    // blur = () => {
    //   this.props.onChange(this.state.editorState.toHTML())
    // }


    preview = () => {
        if (window.previewWindow) {
            window.previewWindow.close()
        }
        window.previewWindow = window.open()
        window.previewWindow.document.write(`<div style='white-space: pre'>${this.buildPreviewHtml()}</div>`)
        window.previewWindow.document.close()

    }

    buildPreviewHtml() {
        return this.state.editorState.toHTML()
    }

    render() {
        const {uploadUrl, uploadSet, image, video, audio, setData, apiKeyFun, config, clotheLang, clotheLoadSet} = this.props
        const {editorState} = this.state
        const extendControls = [...(uploadUrl ? [{
            key: 'antd-uploader',
            type: 'component',
            component: (
                <UploadPro
                    apiSet={setData}
                    apiKey={apiKeyFun}
                    msg={(data) => {
                        return data.msg;
                    }}
                    showUploadList={false}
                    url={uploadUrl}
                    config={{
                        data: {...uploadSet},
                    }}
                    onChange={(data) => {
                        this.setState({
                            editorState: ContentUtils.insertMedias(this.state.editorState, [{
                                type: 'IMAGE',
                                url: data
                            }])
                        })
                    }}
                    accept={image}
                    {...clotheLoadSet}
                >
                    {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                    <button type="button" className="control-item button upload-button" data-title="插入图片">
                        <UploadOutlined/>
                    </button>
                </UploadPro>
            )
        }] : []),
            'separator',
            {
                key: 'clear-editor',
                type: 'button',
                text: clotheLang.richText.eliminate,
                onClick: this.rest
            },
            'separator',
            {
                key: 'custom-button',
                type: 'button',
                text: clotheLang.richText.preview,
                onClick: this.preview
            }
        ]

        return (
            <div className="braft_warp">
                <div className="braft_warp_top">
                    <BraftEditor
                        ref={instance => this.editorInstance = instance}
                        value={editorState}
                        onChange={this.handleChange}
                        onBlur={this.blur}
                        extendControls={extendControls}
                        controls={this.props.controls.concat(this.props.extraControls)}
                        {...config}
                    />
                </div>
                {this.props.btn ? <div className="braft_warp_btn">
                    <div>
                        <Button type="primary" onClick={this.props.submit}>{clotheLang.form.submit}</Button>
                    </div>
                </div> : null}
                {uploadUrl ? <div>
                    提示：插入图片时，请在输入框中获取光标后，在提交
                </div> : null}
            </div>
        )

    }
}
