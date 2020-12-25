/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, useEffect , useState,forwardRef } from 'react';
import {Button} from "antd"
import index from "@components/tree/treeInForm";


let defaultProps={}

function index(prop, ref) {
    const [count, setCount] = useState(0);

    let props={
        ...defaultProps,...prop
    }
    const {} = props;

    useEffect(() => {

        return ()=>{
        }
    },[]);



    return (
        <div>

        </div>
    );
}
export default forwardRef(index)