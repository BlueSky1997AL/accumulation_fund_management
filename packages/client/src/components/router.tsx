import { Exception } from 'ant-design-pro';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Frame from '~components/frame';
import FundBackWorkflow from '~components/fundBackWorkflow';
import WorkOrderAudit from '~components/workOrderAudit';
import WorkOrderList from '~components/workOrderList';
import WorkflowFrame from './workflowFrame';

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
                    <Route exact={true} path="/" component={Page404} />
                    <Route exact={true} path="/account/info" component={Page404} />
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
                            return <WorkflowFrame workOrderID={match.params.workOrderID} />;
                        }}
                    />

                    <Route exact={true} path="/fund/remit" component={Page404} />
                    <Route exact={true} path="/fund/back" component={FundBackWorkflow} />
                    <Route exact={true} path="/fund/draw" component={Page404} />
                    <Route exact={true} path="/fund/in_out" component={Page404} />

                    <Route exact={true} path="/record/trace" component={Page404} />

                    <Route component={Page404} />
                </Switch>
            </Frame>
        </BrowserRouter>
    );
}
