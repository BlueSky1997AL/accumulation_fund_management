import { Exception } from 'ant-design-pro';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './router.less';

import { PersonType, UserType } from '~server/app/util/interface/user';
import { WorkOrderType } from '~server/app/util/interface/workOrder';

import { Card } from 'antd';
import AccountCreateForm from './accountCreateForm';
import AccountModificationForm from './accountModificationForm';
import CommonWorkflow from './commonWorkflow';
import EnterpriseSubUserAddWorkflow from './enterpriseSubUserAddWorkflow';
import EnterpriseSubUserRemoveWorkflow from './enterpriseSubUserRemoveWorkflow';
import EnterpriseUserList from './enterpriseUserList';
import Frame from './frame';
import FundBackWorkflow from './fundBackWorkflow';
import FundDepositWorkflow from './fundDepositWorkflow';
import FundDrawWorkFlow from './fundDrawWorkflow';
import FundRemitWorkflow from './fundRemitWorkflow';
import PasswordModification from './passwordModification';
import UserAdminList from './userAdminList';
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

function FreezeWorkflow () {
    return <CommonWorkflow workOrderType={WorkOrderType.Freeze} />;
}

function UnfreezeWorkflow () {
    return <CommonWorkflow workOrderType={WorkOrderType.Unfreeze} />;
}

function DisableWorkflow () {
    return <CommonWorkflow workOrderType={WorkOrderType.DisableOrExport} />;
}

export default function () {
    const userType = window.userType as UserType;
    const personType = window.personType as PersonType;

    function getRoutesByUserType (type: UserType) {
        switch (type) {
            case UserType.Admin: {
                return [
                    <Route key="/account/list" exact={true} path="/account/list" component={UserAdminList} />,
                    <Route key="/account/create" exact={true} path="/account/create" component={AccountCreateForm} />,
                    <Route
                        key="/account/password"
                        exact={true}
                        path="/account/password"
                        component={PasswordModification}
                    />,
                    <Route
                        key="/account/:userID/edit"
                        path="/account/:userID/edit"
                        render={({ match }) => {
                            return <AccountModificationForm userID={match.params.userID} />;
                        }}
                    />,
                    <Route
                        key="/work_order/audit"
                        exact={true}
                        path="/work_order/audit"
                        component={WorkOrderAuditList}
                    />,
                    <Route
                        key="/work_order/:workOrderID/audit"
                        path="/work_order/:workOrderID/audit"
                        render={({ match }) => {
                            return <WorkOrderAudit workOrderID={match.params.workOrderID} />;
                        }}
                    />
                ];
            }
            case UserType.Common: {
                if (personType === PersonType.IndividualBusiness) {
                    return [
                        <Route key="/account/freeze" exact={true} path="/account/freeze" component={FreezeWorkflow} />,
                        <Route
                            key="/account/password"
                            exact={true}
                            path="/account/password"
                            component={PasswordModification}
                        />,
                        <Route
                            key="/account/unfreeze"
                            exact={true}
                            path="/account/unfreeze"
                            component={UnfreezeWorkflow}
                        />,
                        <Route
                            key="/account/disable"
                            exact={true}
                            path="/account/disable"
                            component={DisableWorkflow}
                        />,
                        <Route
                            key="/work_order/mine"
                            exact={true}
                            path="/work_order/mine"
                            component={MineWorkOrderList}
                        />,
                        <Route
                            key="/work_order/:workOrderID/detail"
                            path="/work_order/:workOrderID/detail"
                            render={({ match }) => {
                                return (
                                    <Card
                                        title="工单详情"
                                        extra={
                                            <div>
                                                <span className="id-zone">工单唯一标识：</span>
                                                <span className="id-zone">{match.params.workOrderID}</span>
                                            </div>
                                        }
                                    >
                                        <WorkflowFrame workOrderID={match.params.workOrderID} />
                                    </Card>
                                );
                            }}
                        />,
                        <Route key="/fund/deposit" exact={true} path="/fund/deposit" component={FundDepositWorkflow} />,
                        <Route key="/fund/back" exact={true} path="/fund/back" component={FundBackWorkflow} />,
                        <Route key="/fund/draw" exact={true} path="/fund/draw" component={FundDrawWorkFlow} />
                    ];
                }
                return [
                    <Route key="/account/freeze" exact={true} path="/account/freeze" component={FreezeWorkflow} />,
                    <Route
                        key="/account/password"
                        exact={true}
                        path="/account/password"
                        component={PasswordModification}
                    />,
                    <Route
                        key="/account/unfreeze"
                        exact={true}
                        path="/account/unfreeze"
                        component={UnfreezeWorkflow}
                    />,
                    <Route key="/account/disable" exact={true} path="/account/disable" component={DisableWorkflow} />,
                    <Route key="/work_order/mine" exact={true} path="/work_order/mine" component={MineWorkOrderList} />,
                    <Route
                        key="/work_order/:workOrderID/detail"
                        path="/work_order/:workOrderID/detail"
                        render={({ match }) => {
                            return (
                                <Card
                                    title="工单详情"
                                    extra={
                                        <div>
                                            <span className="id-zone">工单唯一标识：</span>
                                            <span className="id-zone">{match.params.workOrderID}</span>
                                        </div>
                                    }
                                >
                                    <WorkflowFrame workOrderID={match.params.workOrderID} />
                                </Card>
                            );
                        }}
                    />,
                    <Route key="/fund/draw" exact={true} path="/fund/draw" component={FundDrawWorkFlow} />
                ];
            }
            case UserType.Enterprise: {
                return [
                    <Route key="/account/list" exact={true} path="/account/list" component={EnterpriseUserList} />,
                    <Route
                        key="/account/password"
                        exact={true}
                        path="/account/password"
                        component={PasswordModification}
                    />,
                    <Route key="/account/freeze" exact={true} path="/account/freeze" component={FreezeWorkflow} />,
                    <Route
                        key="/account/unfreeze"
                        exact={true}
                        path="/account/unfreeze"
                        component={UnfreezeWorkflow}
                    />,
                    <Route key="/account/disable" exact={true} path="/account/disable" component={DisableWorkflow} />,
                    <Route
                        key="/account/enterprise/:userID/remove"
                        path="/account/enterprise/:userID/remove"
                        render={({ match }) => {
                            return <EnterpriseSubUserRemoveWorkflow userID={match.params.userID} />;
                        }}
                    />,
                    <Route
                        key="/account/enterprise/create"
                        exact={true}
                        path="/account/enterprise/create"
                        component={EnterpriseSubUserAddWorkflow}
                    />,
                    <Route key="/work_order/mine" exact={true} path="/work_order/mine" component={MineWorkOrderList} />,
                    <Route
                        key="/work_order/:workOrderID/detail"
                        path="/work_order/:workOrderID/detail"
                        render={({ match }) => {
                            return (
                                <Card
                                    title="工单详情"
                                    extra={
                                        <div>
                                            <span className="id-zone">工单唯一标识：</span>
                                            <span className="id-zone">{match.params.workOrderID}</span>
                                        </div>
                                    }
                                >
                                    <WorkflowFrame workOrderID={match.params.workOrderID} />
                                </Card>
                            );
                        }}
                    />,
                    <Route key="/fund/remit" exact={true} path="/fund/remit" component={FundRemitWorkflow} />,
                    <Route key="/fund/back" exact={true} path="/fund/back" component={FundBackWorkflow} />
                ];
            }
        }
        return null;
    }

    return (
        <BrowserRouter basename="/web">
            <Frame>
                <Switch>
                    <Route exact={true} path="/" component={UserInfo} />
                    <Route exact={true} path="/account/info" component={UserInfo} />

                    {getRoutesByUserType(userType)}

                    <Route component={Page404} />
                </Switch>
            </Frame>
        </BrowserRouter>
    );
}
