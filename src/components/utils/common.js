/**
 * Created by zengtao on 2018/8/1.
 */
import React, {Fragment, Component, PureComponent} from 'react';
import NProgress from 'nprogress';
import {Button, Input, Alert, notification, Form, Table, message} from 'antd';
import {getData, postData} from "./fetchData"
import {qus} from "esn";
//整合的一个get请求，
//url:请求的地址
//param：参数对象
//chenggong：请求成功后的回调
//all_fun：请求无论成功失败都会调用的一个回调，用于如loading的显示与消除
//erro：错误的回调

export const ajax = async (url = "", param = {}, chenggong = () => {
}, all_fun = () => {
}, erro = () => {
}) => {
    NProgress.start();
    let response = await postData("/mock" + url, param);
    //await console.log(response.data)
    await function (response) {
        if (response.data.key === 1) {
            all_fun();
            chenggong(response.data);
            NProgress.done();
        } else {
            all_fun();
            notification['error']({
                message: '接口提示',
                description: response.data.value
            });
        }
        NProgress.done();
    }(response)
}

//临时下载插件
export let createScriptDom = (url, callback, type = 'js') => {
    let isInclude = (name) => {
        var js = /js$/i.test(name);
        var es = document.getElementsByTagName(js ? 'script' : 'link');
        for (var i = 0; i < es.length; i++)
            if (es[i][js ? 'src' : 'href'].indexOf(name) != -1) return true;
        return false;
    }

    if (isInclude(url.split("/")[url.split("/").length - 1])) {
        let scriptDom = null;
        if (type == "js") {
            scriptDom = document.createElement('script');
            scriptDom.type = 'text/javascript';
            scriptDom.async = true;
            scriptDom.src = url;
            document.body.appendChild(scriptDom);
        } else {
            var head = document.getElementsByTagName('head')[0];
            scriptDom = document.createElement('link');
            scriptDom.href = url;
            scriptDom.rel = 'stylesheet';
            scriptDom.type = 'text/css';
            head.appendChild(scriptDom);
        }

        scriptDom.onload = function () {
            callback();
        }
    }
}

export let uid = () => {
    const now = +(new Date());
    return `bee-${now}`;
}

export let getTextByJs = (arr) => {
    let str = "";
    for (let i = 0; i < arr.length; i++) {
        str += arr[i] + ",";
    }
    //去掉最后一个逗号(如果不需要去掉，就不用写)
    if (str.length > 0) {
        str = str.substr(0, str.length - 1);
    }
    return str;
}

//数组根据字段判断是不是需要转成字符串
export let form_value = (list,formValueString,props) => {
    let str = formValueString?"":[];
    if (list && list.length > 0) {
        for (let i of list) {
            if (i.response && props.apiKey(i.response)) {
                if(formValueString){
                    str += (str.length > 2 ? "," : "") + props.apiSet(i.response)
                }else {
                    str.push(props.apiSet(i.response))
                }
            }
        }
    }
    console.log(list,formValueString,str)
    return str;
}


//图片地址可能是数组也可能是字符串，转成数组转图片对象
export let turn_data = (arr,arr_obj=null) => {
    if (arr) {
        if (typeof arr == 'string') {
            arr = arr.split(",");
        }
        if (arr instanceof Array && arr.length > 0) {
            if(arr_obj){
                return arr.map((data, i) => {
                    return arr_obj(data, i)
                })
            }
            return arr;
        } else {
            return []
        }
    } else {
        return []
    }
}

export let valueFormat=(value,title)=>{
    try {
        if (value) {
            return value;
        } else {
            return title;
        }
    } catch (e) {
        return title;
    }
}

export let diff = (x, y) => {
// If both x and y are null or undefined and exactly the same
    if (x === y) {
        return true;
    }

// If they are not strictly equal, they both need to be Objects
    if (!(x instanceof Object) || !(y instanceof Object)) {
        return false;
    }

//They must have the exact same prototype chain,the closest we can do is
//test the constructor.
    if (x.constructor !== y.constructor) {
        return false;
    }

    for (var p in x) {
        //Inherited properties were tested using x.constructor === y.constructor
        if (x.hasOwnProperty(p)) {
            // Allows comparing x[ p ] and y[ p ] when set to undefined
            if (!y.hasOwnProperty(p)) {
                return false;
            }

            // If they have the same strict value or identity then they are equal
            if (x[p] === y[p]) {
                continue;
            }

            // Numbers, Strings, Functions, Booleans must be strictly equal
            if (typeof (x[p]) !== "object") {
                return false;
            }

            // Objects and Arrays must be tested recursively
            if (!Object.equals(x[p], y[p])) {
                return false;
            }
        }
    }

    for (p in y) {
        // allows x[ p ] to be set to undefined
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
            return false;
        }
    }
    return true;
}


/**
 * 深度递归搜索
 * @param {Array} arr 你要搜索的数组
 * @param {Function} condition 回调函数，必须返回谓词，判断是否找到了。会传入(item, index, level)三个参数
 * @param {String} children 子数组的key
 */
export const deepFind = (arr, condition, children) => {
    // 即将返回的数组
    let main = []

    // 用try方案方便直接中止所有递归的程序
    try {
        // 开始轮询
        (function poll(arr, level) {
            // 如果传入非数组
            if (!Array.isArray(arr)) return

            // 遍历数组
            for (let i = 0; i < arr.length; i++) {
                // 获取当前项
                const item = arr[i]

                // 先占位预设值
                main.length = level
                main[level] = item

                // 检验是否已经找到了
                const isFind = condition && condition(item, i, level) || false
                // 如果已经找到了
                if (isFind) {
                    // 直接抛出错误中断所有轮询
                    throw Error

                    // 如果存在children，那么深入递归
                } else if (children && item[children] && item[children].length) {
                    poll(item[children], level + 1)

                    // 如果是最后一个且没有找到值，那么通过修改数组长度来删除当前项
                } else if (i === arr.length - 1) {
                    // 删除占位预设值
                    main.length = main.length - 1
                }
            }
        })(arr, 0)
        // 使用try/catch是为了中止所有轮询中的任务
    } catch (err) {}

    // 返回最终数组
    return main
}
