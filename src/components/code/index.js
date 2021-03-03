/**
 * Created by zengtao on 2017/5/19.
 */
import React, {createRef, forwardRef, Fragment, useEffect, useState} from 'react';
import {Controlled  as CodeMirror} from 'react-codemirror2'
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/sql-hint.js';
import PropTypes from "prop-types";

let CodePro = forwardRef((props, ref)=>{

  const [value, setValue] = useState("wewewe");

  const {mode,config,theme,height,tip,onChange} = props;


  useEffect(() => {

    return () => {
    }
  }, []);

  useEffect(() => {
    setValue(props.value)
    return () => {
    }
  }, [props.value]);

  let change = (value)=>{
    onChange(value)
    setValue(value)
  }


  return (
    <div className="anup_code" >
      <CodeMirror
        value={value}
        editorDidMount={editor => { editor.setSize("",height); }}
        options={{
          lineNumbers: true, //显示行号
          theme: theme,
          tabSize: 2,
          keyMap: 'sublime',
          mode: mode,
          extraKeys: {"Ctrl": "autocomplete"},
          placeholder:`请输入${mode}代码`,
          lineWrapping:true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          // fullScreen: true,
          ...config
        }}
        onBeforeChange={(editor, data, value) => {
          change(value)
        }}
        // onChange={(code)=>change(code)}
      />
      <div className="anup_code_tip">
        {tip}
      </div>
    </div>
  );
})


CodePro.propTypes = {
    /** 富文本的数据 */
    value: PropTypes.string,
    /** jsx，text/x-mysql */
    mode: PropTypes.string,
    /** antd的其他设置 */
    config:PropTypes.object,
    /** 主题有白色和黑色2种，白色是eclipse，黑色是monokai */
    theme:PropTypes.string,
    /** 高度 */
    height:PropTypes.number,
    /** 下方的提示语 */
    tip:PropTypes.string,
    /** 写入变化后的回调 */
    onChange:PropTypes.func
};
CodePro.defaultProps = {
    /** 富文本的数据 */
    value: null,
    /** jsx，text/x-mysql */
    mode: "text/x-mysql",
    /** antd的其他设置 */
    config:{},
    /** 主题有白色和黑色2种，白色是eclipse，黑色是monokai */
    theme:"monokai",
    /** 高度 */
    height:200,
    /** 下方的提示语 */
    tip:"(按住Ctrl会自动提示补全)",
    /** 写入变化后的回调 */
    onChange:(code)=>{

    }
};
export default CodePro

