/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, Fragment, useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {ModalWarp, TablePro} from "../index";
import {BarsOutlined} from "@ant-design/icons"
import {Modal, Tag} from "antd";


const TableSelectPro = forwardRef((props, ref) => {
    const {width,ajax, tableProSet, onChange,value,showField} = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectData, setSelectData] = useState(value);
    const [selectDataObj, setSelectDataObj] = useState([]);

    let table = forwardRef();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        onChange(selectData);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {

        return () => {

        }
    }, []);


    let arrList=selectDataObj.map((data,i)=>{
        return (
            <div key={i}>
                <Tag>{data[showField]}</Tag>
            </div>
        )
    })


    return (
        <Fragment>
            <Modal
                title="请选择"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={width}
            >
                <TablePro
                    ref={table}
                    otherBtn={()=>{
                        return(
                            <Fragment></Fragment>
                        )
                    }}
                    ajax={ajax}
                    onSelectChange={({selectedRowKeys, selectedRows})=>{
                        setSelectData(selectedRowKeys)
                        setSelectDataObj(selectedRows)
                    }}
                    config={{
                        size:"small"
                    }}
                    {...tableProSet}
                />
            </Modal>
            <div className="clothe_table_select_pro_btn">
                <div className="clothe_table_select_pro_btn_list">
                    {arrList}
                </div>
                <div className="clothe_table_select_pro_btn_body">
                    <BarsOutlined onClick={showModal}/>
                </div>
            </div>
        </Fragment>
    );
})

TableSelectPro.propTypes = {

};
TableSelectPro.defaultProps = {
    width:"900px",
    showField:"name",

};
export default TableSelectPro;
