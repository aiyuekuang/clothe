/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, useEffect, useRef, useState} from 'react';
import {Button, Input, InputNumber, Form, Table, Popconfirm} from "antd"
import {TableCommon} from "../index"
import {
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";


let defaultProps = {
  rowKey: "id",
  addFormSet: {},
  columns: [{
    // 表单标题
    title: "搜索",
    field: "title",
    // 是否在收起时显示
    is_top: true,
    fill: true,
    comp: <Input placeholder="输入邮箱/管理者"/>,
    editable: true
  },
    {
      // 表单标题
      title: "所属省份",
      field: "title2",
      fill: true,
      editable: true

      // 是否在收起时显示
    }]
}

export default function Index(prop) {
  let props = {
    ...defaultProps, ...prop
  }

  const {rowKey, clotheLang, columns, addUrl, addFormSet, editUrl} = props;

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [addData, setAddData] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [record, setRecord] = useState({});
  const table = useRef()

  const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          comp,
                          record,
                          index,
                          children,
                          fill,
                          rules,
                          other_set,
                          ...restProps
                        }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            style={{margin: 0}}
            {...{
              name: dataIndex,
              rules: [{
                required: fill, message: `${clotheLang.form.pleaseEnter}${title}!`,
              }, ...(rules ? rules : [])],
              ...other_set
            }}
          >
            {comp ? (typeof comp === "function" ? comp(props.record) : comp) :
              <Input placeholder={`${clotheLang.form.pleaseEnter}${title}`} allowClear/>}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };


  const isEditing = (record) => record[rowKey] === editingKey;

  const edit = (record) => {
    form.setFieldsValue({...record});
    setEditingKey(record[rowKey]);
  };

  const cancel = () => {
    setEditingKey('');
    setAddData([])
  };


  const save = async (data) => {
    try {
      const row = await form.validateFields();

      const values = {
        ...data,
        ...row,
      }

      setDisabled(true)
      let values_temp = {};
      values_temp = {...values, ...addFormSet.addParms};

      if (editingKey && editingKey !== "addKey") {
        values_temp[rowKey] = editingKey
      } else {
        values_temp[rowKey] = null
      }

      if (addUrl) {
        let _url = addUrl
        if (editUrl && editingKey !== "addKey") {
          _url = editUrl
        }
        props.ajax(_url, values_temp, (data) => {
          setEditingKey('');
          setAddData([])
          table.current.get_data(1);
        }, () => {
          setDisabled(false)
          // cancel()
        })
      } else {
        addFormSet.submit(values_temp, addFormSet.record, (data) => {
          addFormSet.addFormSubmitCallback(addFormSet.record, data)
        }, () => {
          setDisabled(false)
          // cancel()
        });
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  /**
   * 新增单行数据
   */
  const add = () => {
    let obj = {id: "addKey"};
    for (let i of columns) {
      if (i.editable) {
        obj[i.field] = i.initValue ? i.initValue : ""
      }
    }
    setAddData([obj])
    form.setFieldsValue(obj);
    setEditingKey("addKey");
  };


  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      dataIndex: col.dataIndex ? col.dataIndex : col.field,
      onCell: (record) => ({
        record,
        fill: col.fill,
        comp: col.comp,
        dataIndex: col.field,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div className="anup_edit_table_warp">
      <Form form={form}
            component={false}
            onValuesChange={(changedValues, allValues) => {
              if (addFormSet.onValuesChange) {
                addFormSet.onValuesChange(changedValues, allValues, form)
              }
            }}
            {...addFormSet.formSet}>
        <TableCommon
          ref={table}
          addData={addData}
          setData={(data) => data.entity.records}
          setTotal={(data) => data.entity.totalCount}
          antdSet={{
            components: {
              body: {
                cell: EditableCell,
              }
            },
            bordered: true,
            pagination: {
              onChange: cancel,
            },
            rowClassName: "editable-row",
          }}

          hideSelectAll={false}
          actionComp={(_, record) => {
            const editable = isEditing(record);
            return editable ? (
              <span>
            <a onClick={() => save(record)} style={{marginRight: 8}}>
              保存
            </a>
            <Popconfirm title="确定取消？" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
            ) : (
              <Button type="link" disabled={editingKey !== ''} onClick={() => edit(record)}>
                编辑
              </Button>
            );
          }}
          {...props}
          otherBtn={(selectedRowKeys, onSelectChange, get_data, values) => {
            return (
              <Fragment>
                <div>
                  <Button
                    icon={<PlusOutlined/>}
                    type="primary"
                    onClick={() => add()}
                  >
                    新增
                  </Button>
                </div>
                {props.otherBtn ? props.otherBtn(selectedRowKeys, onSelectChange, get_data, values) : null}
              </Fragment>

            )
          }}
          size="default"
          columns={mergedColumns}
        />
      </Form>
    </div>
  );

}
