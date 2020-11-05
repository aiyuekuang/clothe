/**
 * Created by zengtao on 2018/12/20.
 */
import React, {forwardRef} from 'react';
import lang from "./locales/zh-CN"


import formAdd from "./form/form_adds"
import searchTable from "./form/form_search"
import table from "./table"
import upTree from "./tree/tree"
import TreeEidt from "./tree/tree_eidt"
import Ueditor_ from "./ueditor"
import Upbraft from "./ueditor/braft"
import UPupload from "./upload/upload_form"
import Pagin_ from "./paginaction"
import Chart_ from "./g2"
import Line_ from "./g2/line"
import Pie_ from "./g2/pie"
import Quan_ from "./g2/quan"
import Groupchart from "./g2/group_chart"
import Duopie from "./g2/duo_pie"
import Ani_ from "./ani"
import Treeselectup_ from "./tree/tree_select"
import Monthselect from "./date/month"
import Dayselect from "./date/day"
import Rangselect from "./date/rang"
import Tableselect from "./table/table_select"
import TableInForm_ from "./table/tableInForm"
import MenuUp_ from "./menu"
import ModalWarp_ from "./modal/modalWarp"
import modalUp from "./modal/modalUp"
import ModalSimple_ from "./modal"
import select from "./select"
import QuestionAddForm_ from "./form/questionAddFormAll"
import questionAddForm from "./form/questionAddForm"
import FormCustom_ from "./form/formCustom"
import TreeFromAjax_ from "./tree/treeFromAjax"
import TreeEditAjax_ from "./tree/treeEditAjax"
import ConfigProviderUp_ from "./configProvider"
import TabSelect_ from "./select/tabSelect"
import radioUp from "./select/radio"
import _CheckboxUp from "./checkbox"
import _CheckboxUpGroup from "./checkbox/group"
import _transfer from "./transfer"
import _urlTransfer from "./transfer/urlTransfer"
import _modalUrlTransfer from "./transfer/modalUrlTransfer"
import _cascader from "./cascader"
import _tabSelectDom from "./select/tabSelectDom"
import formCustomTwo from "./form/formCustomTwo"
import dashboard from "./g2/dashboard"
import thermograph from "./g2/thermograph"
import radar from "./g2/radar"
import remoteSearch from "./select/remoteSearch"
import editableCell from "./table/editableCell"
import nav from "./nav"
// import _excel from "./excel"

let upConfig = {

};


let Hoc = function wrapWithUsername(WrappedFunc) {
  let newFunc = forwardRef((props, ref) => {
    const _props = {...{clotheLang: lang}, ...upConfig, ...props}
    return <WrappedFunc {..._props} ref={ref}/>
  });
  return newFunc;
}


export const clotheInit = (data = {}) => {
  upConfig = data
}

export const TableCommon = Hoc(table);
export const FormAdd = Hoc(formAdd)
export const SearchTable = Hoc(searchTable)
export const TreeCommon = Hoc(upTree)
export const Tree_eidt = Hoc(TreeEidt)
export const Ueditor = Hoc(Ueditor_)
export const UP_upload = Hoc(UPupload)
export const Pagin = Hoc(Pagin_)
export const Chart = Hoc(Chart_)
export const Line = Hoc(Line_)
export const Pie = Hoc(Pie_)
export const Quan = Hoc(Quan_)
export const Group_chart = Hoc(Groupchart)
export const Duo_pie = Hoc(Duopie)
export const Up_braft = Hoc(Upbraft)
export const Ani = Hoc(Ani_)
export const Treeselectup = Hoc(Treeselectup_)
export const Month_select = Hoc(Monthselect)
export const Day_select = Hoc(Dayselect)
export const Rang_select = Hoc(Rangselect)
export const Table_select = Hoc(Tableselect)
export const MenuUp = Hoc(MenuUp_)
export const ModalWarp = Hoc(ModalWarp_)
export const Selectup = Hoc(select)
export const QuestionAddForm = Hoc(QuestionAddForm_)
export const QuestionAddFormIn = Hoc(questionAddForm)
export const FormCustom = Hoc(FormCustom_)
export const TableInForm = Hoc(TableInForm_)
export const TreeFromAjax = Hoc(TreeFromAjax_)
export const TreeEditAjax = Hoc(TreeEditAjax_)
export const ModalSimple = Hoc(ModalSimple_)
export const ConfigProviderUp = Hoc(ConfigProviderUp_)
export const TabSelect = Hoc(TabSelect_)
export const RadioUp = Hoc(radioUp)
export const CheckboxUp = Hoc(_CheckboxUp)
export const CheckboxUpGroup = Hoc(_CheckboxUpGroup)
export const Transfer = Hoc(_transfer)
export const UrlTransfer = Hoc(_urlTransfer)
export const ModalUrlTransfer = Hoc(_modalUrlTransfer)
export const TabSelectDom = Hoc(_tabSelectDom)
export const Cascader = Hoc(_cascader)
export const FormCustomTwo = Hoc(formCustomTwo)
export const Dashboard = Hoc(dashboard)
export const Thermograph = Hoc(thermograph)
export const RemoteSearch = Hoc(remoteSearch)
export const Radar = Hoc(radar)
export const EditableCell = Hoc(editableCell)
export const ModalUp = Hoc(modalUp)
export const NavUp = Hoc(nav)
// export const Excel = Hoc(_excel)

