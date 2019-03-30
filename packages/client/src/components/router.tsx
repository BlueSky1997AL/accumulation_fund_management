import { Exception } from 'ant-design-pro';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Card } from 'antd';
import Frame from './frame';
import FundBackWorkflow from './fundBackWorkflow';
import UserInfo from './userInfo';
import WorkflowFrame from './workflowFrame';
import WorkOrderAudit from './workOrderAudit';
import WorkOrderList from './workOrderList';

function Page404 () {
    return <Exception type="404" backText="返回首页" redirect="/web" />;
}

function WorkOrderAuditList () {
    return <WorkOrderList type="audit" />;
}

function MineWorkOrderList () {
    return <WorkOrderList type="mine" />;
}

export default function () {
    return (
        <BrowserRouter basename="/web">
            <Frame>
                <Switch>
                    <Route exact={true} path="/" component={UserInfo} />
                    <Route exact={true} path="/account/info" component={UserInfo} />
                    <Route exact={true} path="/account/list" component={Page404} />

                    <Route exact={true} path="/work_order/audit" component={WorkOrderAuditList} />
                    <Route exact={true} path="/work_order/mine" component={MineWorkOrderList} />
                    <Route
                        path="/work_order/:workOrderID/audit"
                        render={({ match }) => {
                            return <WorkOrderAudit workOrderID={match.params.workOrderID} />;
                        }}
                    />
                    <Route
                        path="/work_order/:workOrderID/detail"
                        render={({ match }) => {
                            return (
                                <Card title="工单详情">
                                    <WorkflowFrame workOrderID={match.params.workOrderID} />
                                </Card>
                            );
                        }}
                    />

                    <Route exact={true} path="/fund/remit" component={Page404} />
                    <Route exact={true} path="/fund/back" component={FundBackWorkflow} />
                    <Route exact={true} path="/fund/draw" component={Page404} />
                    <Route exact={true} path="/fund/in_out" component={Page404} />

                    {/* <Route exact={true} path="/record/trace" component={Page404} /> */}

                    <Route component={Page404} />
                </Switch>
            </Frame>
        </BrowserRouter>
    );
}
