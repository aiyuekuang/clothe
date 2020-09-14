import React from "react";

export default function TabSelectDom(props) {
  const {label} = props
  return (
    <div className={`up_tab_select`}>
      <div className="up_tab_select_label">
        {label}：
      </div>
      <div className="up_tab_select_list_2">
        {props.children}
      </div>
    </div>
  )
}