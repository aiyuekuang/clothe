/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, Fragment, useEffect, useState} from 'react';
import {Button} from "antd"
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/sql-hint.js';
let defaultProps = {
  value: null,
  //jsx，text/x-mysql
  mode: "text/x-mysql",
  otherSet:{},
  //主题有白色和黑色2种，白色是eclipse，黑色是monokai
  theme:"monokai",
  height:200,
  tip:"(按住Ctrl会自动提示补全)",
  onChange:(code)=>{

  }
}

function index(prop, ref) {
  const [count, setCount] = useState(0);

  let props = {
    ...defaultProps, ...prop
  }
  const {value,mode,otherSet,theme,height,tip,onChange} = props;

  useEffect(() => {

    return () => {
    }
  }, []);

  let change = (e)=>{
    console.log(e.getValue())
    onChange(e.getValue())
  }

  return (
    <div className="anup_code" >
      <CodeMirror
        height={height}
        value={value}
        options={{
          theme: theme,
          tabSize: 2,
          keyMap: 'sublime',
          mode: mode,
          extraKeys: {"Ctrl": "autocomplete"},
          placeholder:`请输入${mode}代码`,
          lineWrapping:true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          // fullScreen: true,
          ...otherSet
        }}
        onChange={(code)=>change(code)}
      />
      <div className="anup_code_tip">
        {tip}
      </div>
    </div>
  );
}
export default forwardRef(index)

