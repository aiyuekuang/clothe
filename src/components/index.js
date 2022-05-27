/**
 * Created by zengtao on 2018/12/20.
 */
import React, {forwardRef} from 'react';
import lang from "./locales/zh-CN"


import formAdd from "./form/FormAdd"
import searchTable from "./form/SearchFrom"
import table from "./table/TablePro"
import upTree from "./tree/TreePro"
import treeEdit from "./tree/TreeEdit"
import Ueditor_ from "./ueditor/UEditorPro"
import Upbraft from "./ueditor/RichText"
import UPupload from "./upload/UploadPro"
import Pagin_ from "./paginaction"
import Chart_ from "./g2"
import Line_ from "./g2/line"
import Pie_ from "./g2/pie"
import Quan_ from "./g2/quan"
import Groupchart from "./g2/group_chart"
import Duopie from "./g2/duo_pie"
import Ani_ from "./ani"
import Treeselectup_ from "./tree/TreeSelectPro"
import Rangselect from "./date/RangSelect"
import Tableselect from "./table/TableSelect"
import TableInForm_ from "./table/TableInForm"
import MenuUp_ from "./menu/MenuPro"
import ModalWarp_ from "./modal/ModalWarp"
import modalUp from "./modal/modalUp"
import ModalSimple_ from "./modal"
import select from "./select/SelectPro"
import QuestionAddForm_ from "./form/QuestionAddForm"
import questionAddFormIn from "./form/QuestionAddFormIn"
import FormCustom_ from "./form/FormCustom"
import TreeFromAjax_ from "./tree/TreeFromAjax"
import TreeEditAjax_ from "./tree/TreeEditAjax"
import ConfigProviderUp_ from "./configProvider/ConfigProviderPro"
import TabSelect_ from "./select/TabSelect"
import radioUp from "./select/RadioPro"
import _CheckboxUp from "./checkbox/CheckboxPro"
import _CheckboxUpGroup from "./checkbox/GroupPro"
import _transfer from "./transfer/TransferPro"
import _urlTransfer from "./transfer/UrlTransfer"
import _modalUrlTransfer from "./transfer/ModalUrlTransfer"
import cascaderAjax from "./cascader/CascaderAjaxPro"
import cascader from "./cascader/Cascader"
import _tabSelectDom from "./select/tabSelectDom"
import formCustomTwo from "./form/FormCustomTwo"
import dashboard from "./g2/dashboard"
import thermograph from "./g2/thermograph"
import radar from "./g2/radar"
import remoteSearch from "./select/RemoteSearch"
import editableCell from "./table/EditableCell"
import nav from "./nav/NavPro"
import date from "./date/DatePro"
import code from "./code/CodePro"
import treeInForm from "./tree/TreeInForm"
import loading from "./loading/LoadingPro"
import iconSvg from "./icon/IconSvg"
import treeInFormCascader from "./tree/treeInFormCascader"
import boolPro from "./bool"
import tableSelectPro from "./table/TableSelectPro"

let upConfig = {

};


let Hoc = function wrapWithUsername(WrappedFunc) {
  return forwardRef((props, ref) => {
    const _props = {...{clotheLang: lang}, ...upConfig, ...props}
    return <WrappedFunc {..._props} ref={ref}/>
  });
}


export const clotheInit = (data = {}) => {
  upConfig = data
}

export const TablePro = Hoc(table);
export const FormAdd = Hoc(formAdd)
export const SearchFrom = Hoc(searchTable)
export const TreePro = Hoc(upTree)
export const TreeEdit = Hoc(treeEdit)
export const UEditorPro = Hoc(Ueditor_)
export const UploadPro = Hoc(UPupload)
export const Page = Hoc(Pagin_)
export const ChartPro = Hoc(Chart_)
export const Line = Hoc(Line_)
export const Pie = Hoc(Pie_)
export const Circle = Hoc(Quan_)
export const GroupChart = Hoc(Groupchart)
export const PieSmall = Hoc(Duopie)
export const RichText = Hoc(Upbraft)
export const Ani = Hoc(Ani_)
export const TreeSelectPro = Hoc(Treeselectup_)
export const RangSelect = Hoc(Rangselect)
export const TableSelect = Hoc(Tableselect)
export const MenuPro = Hoc(MenuUp_)
export const ModalWarp = Hoc(ModalWarp_)
export const SelectPro = Hoc(select)
export const QuestionAddForm = Hoc(QuestionAddForm_)
export const QuestionAddFormIn = Hoc(questionAddFormIn)
export const FormCustom = Hoc(FormCustom_)
export const TableInForm = Hoc(TableInForm_)
export const TreeFromAjax = Hoc(TreeFromAjax_)
export const TreeEditAjax = Hoc(TreeEditAjax_)
export const ModalSimple = Hoc(ModalSimple_)
export const ConfigProviderPro = Hoc(ConfigProviderUp_)
export const TabSelect = Hoc(TabSelect_)
export const RadioPro = Hoc(radioUp)
export const CheckboxPro = Hoc(_CheckboxUp)
export const CheckboxProGroup = Hoc(_CheckboxUpGroup)
export const Transfer = Hoc(_transfer)
export const UrlTransfer = Hoc(_urlTransfer)
export const ModalUrlTransfer = Hoc(_modalUrlTransfer)
export const TabSelectDom = Hoc(_tabSelectDom)
export const CascaderPro = Hoc(cascader)
export const CascaderAjaxPro = Hoc(cascaderAjax)
export const FormCustomTwo = Hoc(formCustomTwo)
export const Dashboard = Hoc(dashboard)
export const Thermograph = Hoc(thermograph)
export const RemoteSearch = Hoc(remoteSearch)
export const Radar = Hoc(radar)
export const EditableCell = Hoc(editableCell)
export const ModalPro = Hoc(modalUp)
export const NavPro = Hoc(nav)
export const DatePro = Hoc(date)
export const CodePro = Hoc(code)
export const TreeInForm = Hoc(treeInForm)
export const LoadingPro = Hoc(loading)
export const IconSvg = Hoc(iconSvg)
export const TreeInFormCascader = Hoc(treeInFormCascader)
export const BoolPro = Hoc(boolPro)
export const TableSelectPro = Hoc(tableSelectPro)


