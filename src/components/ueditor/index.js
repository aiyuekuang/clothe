/**
 * Created by zengtao on 2017/5/19.
 */
import React,{Fragment,Component,PureComponent} from 'react';
import { Button, Input, Modal } from 'antd';
import {cuns} from 'esn'
import {uid} from "../utils/common"
export default class Index extends Component {

    static defaultProps = {
        //文字变化之后的接收
        onChange: (data)=> {
        },
        //百度富文本的一些常用设置
        config:{
            toolbars: [[
                'fullscreen', 'source', '|', 'undo', 'redo', '|',
                'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch',
                '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                'directionalityltr', 'directionalityrtl', 'indent', '|',
                'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                'simpleupload',
                'horizontal', 'date', 'time',
            ]]
        }
    }


    state = {}

    um = null
    uuid = uid()

    componentDidMount = () => {
        if (!this.isInclude("ueditor.all.min.js")) {
            this.createScriptDom("/lib/ueditor_s/ueditor.config.js", () => {
                this.createScriptDom("/lib/ueditor_s/ueditor.all.min.js", () => {
                    this.createScriptDom("/lib/ueditor_s/lang/zh-cn/zh-cn.js", () => {
                        this.init();
                    });
                });
            });
        } else {
            this.init();
        }
    }

    componentWillReceiveProps(nextProp) {
        if (nextProp.value != this.props.value) {
            if (nextProp.value) {
                this.setContent(nextProp.value)
                this.props.onChange(nextProp.value)
            } else {
                this.setContent("")
            }
        }
    }

    //移除
    componentWillUnmount() {

    }



    isInclude = (name)=> {
        var js = /js$/i.test(name);
        var es = document.getElementsByTagName(js ? 'script' : 'link');
        for (var i = 0; i < es.length; i++)
            if (es[i][js ? 'src' : 'href'].indexOf(name) != -1)return true;
        return false;
    }

    createScriptDom = (url, callback, type = 'js')=> {
        let scriptDom = null;
        if (type == "js") {
            scriptDom = document.createElement('script');
            scriptDom.type = 'text/javascript';
            scriptDom.async = true;
            scriptDom.src = url;
            document.body.appendChild(scriptDom);
        } else {
            var head = document.getElementsByTagName('head')[0];
            scriptDom = document.createElement('link');
            scriptDom.href = url;
            scriptDom.rel = 'stylesheet';
            scriptDom.type = 'text/css';
            head.appendChild(scriptDom);
        }
        scriptDom.onload = function () {
            callback();
        }
    }

    init = ()=> {
        this.um = UE.getEditor(this.uuid,this.props.config);
        this.um.addListener('blur', ()=> {
            this.props.onChange(this.getAllHtml())
        });

        if (this.props.value) {
            this.setContent(this.props.value)
            this.props.onChange(this.props.value)
        }
    }

    //获取内容
    getAllHtml = ()=> {
        return this.um.getContent();
    }

    //写入内容
    setContent = (text, isAppendTo = false)=> {
        this.um.ready(()=> {
            this.um.setContent(text, isAppendTo);
        });
    }

    render() {
        return (
            <div className="up_ueditor">
                <script type="text/plain" id={this.uuid} style={{width:"100%",height:240}}/>
            </div>
        )
    }
}