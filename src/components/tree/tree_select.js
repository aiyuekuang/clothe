import React from 'react';
import {TreeSelect} from 'antd';
import {diffObj, isArrayop} from "esn";

const TreeNode = TreeSelect.TreeNode;

export default class Index extends React.Component {
  static defaultProps = {
//数据的label
    dataSourceKey: "title",
    //数据的value值
    dataSourceValue: "value",
    key_key: "id",
    //除非你的子也不叫children
    children: "children",
    //数据源
    treeData: [
      {
        title: 'Node1',
        value: '0-0',
        key: '0-0',
        children: [
          {
            title: 'Child Node1',
            value: '0-0-1',
            key: '0-0-1',
          },
          {
            title: 'Child Node2',
            value: '0-0-2',
            key: '0-0-2',
          },
        ],
      },
      {
        title: 'Node2',
        value: '0-1',
        key: '0-1',
      },
    ],
    width: "100%",
    form_value_string: false,
    //单选还是多选
    multiple: true,
    config: {},
    //单选时是否需要也是数组格式的返回
    isOutArr: false,
    //单选时是否可以选择父，默认不可以
    selectPrent: false,
    //checkbox状态时，判断是否需要禁用checkbox的函数
    disableCheckbox: (data) => {
    }
  }
  state = {
    //选中的数据
  };


  componentDidMount = () => {
  }


  handleDataSet = (value) => {
    const {multiple, form_value_string, isOutArr} = this.props;
    let _value = value;

    if (multiple) {
      if (form_value_string) {
        if(_value){
          _value = _value.split(",")
        }else {
          _value = []
        }
      }
    } else {
      if (isOutArr) {
        if(_value && _value.length){
          _value = value[0]
        }else {
          _value = ""
        }
      }
    }

    return _value;
  }

  handleData = (value) => {
    const {multiple, form_value_string, isOutArr} = this.props;
    let _value = value;

    if (!_value) {
      return null
    }

    if (multiple) {
      if (form_value_string) {
        _value = _value.join(",")
      }
    } else {
      if (isOutArr) {
        _value = [value]
      }
    }
    return _value;
  }


  onChange = (value, label, extra) => {
    // console.log(value, label, extra)
    let _value = value;

    if (this.props.config.treeCheckStrictly) {
      _value.forEach((data, i) => {
        _value[i] = data.value;
      })
    }

    this.props.onChange(this.handleData(_value))
  };

  renderTreeNodes = data => {
    const {dataSourceKey, dataSourceValue, children, key_key, multiple, selectPrent} = this.props;
    return data.map((item, i) => {
      if (item[children] && item[children].length > 0) {
        return (
          <TreeNode title={item[dataSourceKey]} key={item[dataSourceValue]} value={item[dataSourceValue]}
                    selectable={multiple || selectPrent} disableCheckbox={this.props.disableCheckbox(item)}>
            {this.renderTreeNodes(item[children])}
          </TreeNode>
        );
      }
      return <TreeNode title={item[dataSourceKey]} key={item[dataSourceValue]} value={item[dataSourceValue]}
                       disableCheckbox={this.props.disableCheckbox(item)}/>;
    });
  }

  render() {
    const {treeData, width, value, config, multiple, clotheLang, form_value_string} = this.props
    const {} = this.state

    return (
      <TreeSelect
        style={{width}}
        value={this.handleDataSet(value)}
        placeholder={clotheLang.form.pleaseSelect}
        allowClear
        onChange={this.onChange}
        treeCheckable={multiple}
        {...config}
      >
        {this.renderTreeNodes(treeData)}
      </TreeSelect>
    );
  }
}
