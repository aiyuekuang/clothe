/**
 * Created by zengtao on 2017/5/19.
 */
import React from 'react';
import "../style/ztao.scss"
import Table from "./table"
import {CodePro} from "@components/index";


export default class Index extends React.Component {
  constructor(arg) {
    super(arg);
  }

  state = {
    data: []
  }


  componentDidMount = () => {

  }

  render() {
    return (
      <div className="up_index">
        <CodePro/>
      </div>
    )
  }
}


