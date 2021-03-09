import React from 'react';
import {TreeSelect} from 'antd';
import {diffObj, isArrayop} from "esn";
import PropTypes from "prop-types";

const TreeNode = TreeSelect.TreeNode;

export default class Index extends React.Component {

  static propTypes = {
    /** 数据的label */
    dataSourceKey: PropTypes.string,
    /** 数据的value值 */
    dataSourceValue: PropTypes.string,
    /** 除非你的子也不叫children */
    children: PropTypes.string,
    /** 数据源 */
    treeData:PropTypes.array,
    /** 宽度，可以是数字，也可以是字符串 */
    width: PropTypes.any,
    /** 是否需要将值转换成字符串形式 */
    formValueString: PropTypes.bool,
    /** 单选还是多选 */
    multiple: PropTypes.bool,
    config: PropTypes.object,
    /** 单选时是否需要也是数组格式的返回 */
    isOutArr: PropTypes.bool,
    /** 单选时是否可以选择父，默认不可以 */
    selectPrent: PropTypes.bool,
    /** checkbox状态时，判断是否需要禁用checkbox的函数 (data) => {}*/
    disableCheckbox: PropTypes.func
  }

  static defaultProps = {
    /** 数据的label */
    dataSourceKey: "title",
    /** 数据的value值 */
    dataSourceValue: "value",
    /** 除非你的子也不叫children */
    children: "children",
    /** 数据源 */
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
    /** 宽度 */
    width: "100%",
    /** 是否需要将值转换成字符串形式 */
    formValueString: false,
    /** 单选还是多选 */
    multiple: true,
    config: {},
    /** 单选时是否需要也是数组格式的返回 */
    isOutArr: false,
    /** 单选时是否可以选择父，默认不可以 */
    selectPrent: false,
    /** checkbox状态时，判断是否需要禁用checkbox的函数 */
    disableCheckbox: (data) => {
    }
  }
  state = {
    //选中的数据
  };


  componentDidMount = () => {
  }


  handleDataSet = (value) => {
    const {multiple, formValueString, isOutArr} = this.props;
    let _value = value;

    if (multiple) {
      if (formValueString) {
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
    const {multiple, formValueString, isOutArr} = this.props;
    let _value = value;

    if (!_value) {
      return null
    }

    if (multiple) {
      if (formValueString) {
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
    const {dataSourceKey, dataSourceValue, children, multiple, selectPrent,disableCheckbox} = this.props;
    return data.map((item, i) => {
      if (item[children] && item[children].length > 0) {
        return (
          <TreeNode title={item[dataSourceKey]} key={item[dataSourceValue]} value={item[dataSourceValue]}
                    selectable={multiple || selectPrent} disableCheckbox={disableCheckbox(item)}>
            {this.renderTreeNodes(item[children])}
          </TreeNode>
        );
      }
      return <TreeNode title={item[dataSourceKey]} key={item[dataSourceValue]} value={item[dataSourceValue]}
                       disableCheckbox={disableCheckbox(item)}/>;
    });
  }

  render() {
    const {treeData, width, value, config, multiple, clotheLang} = this.props
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
