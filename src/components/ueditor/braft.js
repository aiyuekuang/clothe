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
import {UP_upload} from "../index";
import {UploadOutlined} from "@ant-design/icons"
import { convertRawToHTML, convertHTMLToRaw } from 'braft-convert'

export default class Index extends Component {

  static defaultProps = {
    ajax: () => {
    },
    //文字变化之后的接收
    onChange: (data) => {
      console.log(data)
    },
    //全部的组件
    controls: [
      'undo', 'redo', 'separator',
      'font-size', 'line-height', 'letter-spacing', 'separator',
      'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
      'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
      'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
      'link', 'separator', 'hr', 'separator',
      'clear'
    ],
    //在默认基础上，其他需要的组件
    extra_con: [],
    //提交按钮触发
    submit: (data) => {
      console.log(data)
    },
    //重置按钮
    rest: () => {

    },
    //是否显示btn
    btn: false,
    //上传图片的url
    upload_url: null,
    //图片上传的其他参数设置
    upload_set: {},
    //上传文件的大小以k为单位
    upload_size: 1000,
    //图片文件的上传格式
    image: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/apng', 'image/svg'],
    //是否需要上传video
    video: false,//'video/mp4'
    //是否需要上传音频
    audio: false,// 'audio/mp3'
    //判断数据是否正确的函数
    is_true: (data) => {
      return data.key === 1
    },
    //数据获取方式
    setData: (data) => {
      return data.filePath
    },
    //其他anup上传组件的设置
    anupLoadSet: {},
    //其他的富文本的设置
    other_set: {},
    value: null,
    //是否返回raw格式的数据
    raw:false
  }


  constructor(props) {
    super(props);

    this.state = {
      editorState: BraftEditor.createEditorState(props.value)
    }

  }

  componentdidmount(){
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

    if(this.props.raw){
      this.props.onChange({html:editorState.toHTML(),raw:editorState.toRAW()})
    }else {
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
    const {upload_url, upload_set, upload_size, image, video, audio, setData, is_true, other_set, clotheLang, anupLoadSet} = this.props
    const {editorState} = this.state
    const extendControls = [...(upload_url ? [{
      key: 'antd-uploader',
      type: 'component',
      component: (
        <UP_upload
          api_set={setData}
          api_key={is_true}
          msg={(data) => {
            return data.msg;
          }}
          showUploadList={false}
          url={upload_url}
          other_set={{
            data: {...upload_set},
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
          {...anupLoadSet}
        >
          {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
          <button type="button" className="control-item button upload-button" data-title="插入图片"><UploadOutlined/>
          </button>
        </UP_upload>
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
            controls={this.props.controls.concat(this.props.extra_con)}
            {...other_set}
          />
        </div>
        {this.props.btn ? <div className="braft_warp_btn">
          <div>
            <Button type="primary" onClick={this.props.submit}>{clotheLang.form.submit}</Button>
          </div>
        </div> : null}
        {upload_url ? <div>
          提示：插入图片时，请在输入框中获取光标后，在提交
        </div> : null}
      </div>
    )

  }
}
