/**
 * Created by zengtao on 2017/5/19.
 */
import React, {forwardRef, useEffect, useState} from 'react';
import {Breadcrumb, Tabs} from "antd"
import PropTypes from "prop-types";

const {TabPane} = Tabs;

let defaultProps = {

}

let listen = true;

const NavPro = forwardRef((props,ref) => {

    const {routerActData, routerMinusDispatch, history, hasBreadcrumb} = props;
    const [remove, setRemove] = useState(false);

    useEffect(() => {
        // Update the document title using the browser API
        // history.push(routerActData[0]);
        let index = routerActData.findIndex((data, i) => {
            return data.url === location.pathname;
        });

        if (index === -1 && remove) {
            let url =
                routerActData[routerActData.length - 1] &&
                routerActData[routerActData.length - 1].url
                    ? routerActData[routerActData.length - 1].url
                    : "/";
            history.push(url);
            setRemove(false);
        }

        return () => {
        };
    }, [routerActData, remove]);


    let routerNavs = routerActData.map((data, i) => {
        if (data.name) {
            let breadLi = data.layer.map((value, t) => {
                return <Breadcrumb.Item key={t}>{value.name}</Breadcrumb.Item>;
            });

            return (
                <TabPane tab={data.name} key={data.url}>
                    {hasBreadcrumb ? <div className="anup_home_body_tabs_body">
                        <Breadcrumb>{breadLi}</Breadcrumb>
                    </div> : null}
                </TabPane>
            );
        }
    });

    let removeFun = (data) => {
        routerMinusDispatch(data);
        setRemove(true);
    }

    let keyUp = (e) => {
        if (e.keyCode === 27) {
            let index = routerActData.find((data, i) => {
                return data.url === location.pathname;
            });
            removeFun(index)
        }
    }
    if (listen) {
        listen = document.addEventListener('keydown', keyUp)
    }

    return (
        <div className="anup_home_body_tabs">
            <Tabs
                hideAdd
                type="editable-card"
                onEdit={(data) => removeFun(data)}
                onChange={(data) => {
                    if (data !== location.pathname) {
                        history.push(data);
                    }
                }}
                activeKey={location.pathname}
            >
                {routerNavs}
                ))}
            </Tabs>
        </div>
    );
})

NavPro.propTypes = {
    /** react-router-pro对应的缓存路由的值 */
    routerActData:PropTypes.array,
    /** 点击nav上的x的处理函数，配合react-router-pro使用的，将react-router-pro的routerMinusDispatch函数传递进来就可以了 */
    routerMinusDispatch: PropTypes.func,
    /** react-router-pro的history对象传递进来 */
    history: PropTypes.object,
    /** 是否通过esc按钮进行关闭tab */
    escClose: PropTypes.bool,
    /** 是否有面包屑 */
    hasBreadcrumb: PropTypes.bool
};
NavPro.defaultProps = {
    /** react-router-pro对应的缓存路由的值 */
    routerActData: [],
    /** 点击nav上的x的处理函数，配合react-router-pro使用的，将react-router-pro的routerMinusDispatch函数传递进来就可以了 */
    routerMinusDispatch: (data) => {
    },
    /** react-router-pro的history对象传递进来 */
    history: {},
    /** 是否通过esc按钮进行关闭tab */
    escClose: true,
    /** 是否有面包屑 */
    hasBreadcrumb: true
};
export default NavPro;
