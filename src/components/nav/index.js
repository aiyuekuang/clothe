/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, useEffect , useState } from 'react';
import {Breadcrumb, Button, Tabs} from "antd"
const { TabPane } = Tabs;

let defaultProps={}

export default function Index(prop) {
    let props={
        ...defaultProps,...prop
    }
    const { routerActData, routerMinusDispatch,history } = props;
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

        return () => {};
    }, [routerActData, remove]);


    let routerNavs = routerActData.map((data, i) => {
        if (data.name) {
            let breadLi = data.layer.map((value, t) => {
                return <Breadcrumb.Item key={t}>{value.name}</Breadcrumb.Item>;
            });

            return (
              <TabPane tab={data.name} key={data.url}>
                  <div className="anup_home_body_tabs_body">
                      <Breadcrumb>{breadLi}</Breadcrumb>
                  </div>
              </TabPane>
            );
        }
    });


    return (
      <div className="anup_home_body_tabs">
          <Tabs
            hideAdd
            type="editable-card"
            onEdit={(data) => {
                routerMinusDispatch(data);
                setRemove(true);
            }}
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
}
