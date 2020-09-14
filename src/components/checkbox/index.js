/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, useEffect , useState } from 'react';
import {Checkbox} from "antd"
const CheckboxGroup = Checkbox.Group;

let defaultProps={
    value:false,
    onChange:(bool)=>{

    },
    otherSet:{}
}

export default function Index(prop) {
    const [count, setCount] = useState(0);

    let props={
        ...defaultProps,...prop
    }
    const {children,value,onChange,otherSet} = props;

    useEffect(() => {

        return ()=>{
        }
    },[]);

    function onChanges(e) {
        onChange(e.target.checked)
    }

    return (
      <Checkbox onChange={onChanges} checked={value} {...otherSet}>{children}</Checkbox>
    );
}
