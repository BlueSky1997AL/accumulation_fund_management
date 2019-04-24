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

function NotAuditedWorkOrderAuditList () {
    return <WorkOrderList type="notAuditedAdmin" />;
}
function EnterpriseBackWorkOrderAuditList () {
    return <WorkOrderList type="audit" workOrderType={WorkOrderType.EnterpriseBack} />;
}
function PersonalBackWorkOrderAuditList () {
    return <WorkOrderList type="audit" workOrderType={WorkOrderType.PersonalBack} />;
}
function PersonalDepositWorkOrderAuditList () {
    return <WorkOrderList type="audit" workOrderType={WorkOrderType.PersonalDeposit} />;
}
function RemitWorkOrderAuditList () {
    return <WorkOrderList type="audit" workOrderType={WorkOrderType.Remit} />;
}
function DrawWorkOrderAuditList () {
    return <WorkOrderList type="audit" workOrderType={WorkOrderType.Draw} />;
}
function DisableOrExportWorkOrderAuditList () {
    return <WorkOrderList type="audit" workOrderType={WorkOrderType.DisableOrExport} />;
}
function FreezeWorkOrderAuditList () {
    return <WorkOrderList type="audit" workOrderType={WorkOrderType.Freeze} />;
}
function UnfreezeWorkOrderAuditList () {
    return <WorkOrderList type="audit" workOrderType={WorkOrderType.Unfreeze} />;
}
function RemoveSubUserWorkOrderAuditList () {
    return <WorkOrderList type="audit" workOrderType={WorkOrderType.RemoveSubUser} />;
}
function AddSubUserWorkOrderAuditList () {
    return <WorkOrderList type="audit" workOrderType={WorkOrderType.AddSubUser} />;
}
function SignUpWorkOrderAuditList () {
    return <WorkOrderList type="audit" workOrderType={WorkOrderType.SignUp} />;
}

function PersonalBackWorkOrderList () {
    return <WorkOrderList type="mine" workOrderType={WorkOrderType.PersonalBack} />;
}
function PersonalDepositWorkOrderList () {
    return <WorkOrderList type="mine" workOrderType={WorkOrderType.PersonalDeposit} />;
}
function DrawWorkOrderList () {
    return <WorkOrderList type="mine" workOrderType={WorkOrderType.Draw} />;
}

function EnterpriseBackWorkOrderList () {
    return <WorkOrderList type="mine" workOrderType={WorkOrderType.EnterpriseBack} />;
}
function RemitWorkOrderList () {
    return <WorkOrderList type="mine" workOrderType={WorkOrderType.Remit} />;
}
function RemoveSubUserWorkOrderList () {
    return <WorkOrderList type="mine" workOrderType={WorkOrderType.RemoveSubUser} />;
}
function AddSubUserWorkOrderList () {
    return <WorkOrderList type="mine" workOrderType={WorkOrderType.AddSubUser} />;
}

function NotAuditedWorkOrderList () {
    return <WorkOrderList type="notAuditedUser" />;
}
function DisableOrExportWorkOrderList () {
    return <WorkOrderList type="mine" workOrderType={WorkOrderType.DisableOrExport} />;
}
function FreezeWorkOrderList () {
    return <WorkOrderList type="mine" workOrderType={WorkOrderType.Freeze} />;
}
function UnfreezeWorkOrderList () {
    return <WorkOrderList type="mine" workOrderType={WorkOrderType.Unfreeze} />;
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
                        key="/work_order/not_audited"
                        exact={true}
                        path="/work_order/not_audited"
                        component={NotAuditedWorkOrderAuditList}
                    />,
                    <Route
                        key="/work_order/enterprise/back"
                        exact={true}
                        path="/work_order/enterprise/back"
                        component={EnterpriseBackWorkOrderAuditList}
                    />,
                    <Route
                        key="/work_order/enterprise/remit"
                        exact={true}
                        path="/work_order/enterprise/remit"
                        component={RemitWorkOrderAuditList}
                    />,
                    <Route
                        key="/work_order/enterprise/sub_user_remove"
                        exact={true}
                        path="/work_order/enterprise/sub_user_remove"
                        component={RemoveSubUserWorkOrderAuditList}
                    />,
                    <Route
                        key="/work_order/enterprise/sub_user_add"
                        exact={true}
                        path="/work_order/enterprise/sub_user_add"
                        component={AddSubUserWorkOrderAuditList}
                    />,
                    <Route
                        key="/work_order/personal/back"
                        exact={true}
                        path="/work_order/personal/back"
                        component={PersonalBackWorkOrderAuditList}
                    />,
                    <Route
                        key="/work_order/personal/deposit"
                        exact={true}
                        path="/work_order/personal/deposit"
                        component={PersonalDepositWorkOrderAuditList}
                    />,
                    <Route
                        key="/work_order/personal/draw"
                        exact={true}
                        path="/work_order/personal/draw"
                        component={DrawWorkOrderAuditList}
                    />,
                    <Route
                        key="/work_order/account/disable_export"
                        exact={true}
                        path="/work_order/account/disable_export"
                        component={DisableOrExportWorkOrderAuditList}
                    />,
                    <Route
                        key="/work_order/account/freeze"
                        exact={true}
                        path="/work_order/account/freeze"
                        component={FreezeWorkOrderAuditList}
                    />,
                    <Route
                        key="/work_order/account/unfreeze"
                        exact={true}
                        path="/work_order/account/unfreeze"
                        component={UnfreezeWorkOrderAuditList}
                    />,
                    <Route
                        key="/work_order/account/signup"
                        exact={true}
                        path="/work_order/account/signup"
                        component={SignUpWorkOrderAuditList}
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
                            key="/work_order/not_audited"
                            exact={true}
                            path="/work_order/not_audited"
                            component={NotAuditedWorkOrderList}
                        />,
                        <Route
                            key="/work_order/fund/back"
                            exact={true}
                            path="/work_order/fund/back"
                            component={PersonalBackWorkOrderList}
                        />,
                        <Route
                            key="/work_order/fund/deposit"
                            exact={true}
                            path="/work_order/fund/deposit"
                            component={PersonalDepositWorkOrderList}
                        />,
                        <Route
                            key="/work_order/fund/draw"
                            exact={true}
                            path="/work_order/fund/draw"
                            component={DrawWorkOrderList}
                        />,
                        <Route
                            key="/work_order/account/disable_export"
                            exact={true}
                            path="/work_order/account/disable_export"
                            component={DisableOrExportWorkOrderList}
                        />,
                        <Route
                            key="/work_order/account/freeze"
                            exact={true}
                            path="/work_order/account/freeze"
                            component={FreezeWorkOrderList}
                        />,
                        <Route
                            key="/work_order/account/unfreeze"
                            exact={true}
                            path="/work_order/account/unfreeze"
                            component={UnfreezeWorkOrderList}
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
                    <Route
                        key="/work_order/not_audited"
                        exact={true}
                        path="/work_order/not_audited"
                        component={NotAuditedWorkOrderList}
                    />,
                    <Route
                        key="/work_order/fund/draw"
                        exact={true}
                        path="/work_order/fund/draw"
                        component={DrawWorkOrderList}
                    />,
                    <Route
                        key="/work_order/account/disable_export"
                        exact={true}
                        path="/work_order/account/disable_export"
                        component={DisableOrExportWorkOrderList}
                    />,
                    <Route
                        key="/work_order/account/freeze"
                        exact={true}
                        path="/work_order/account/freeze"
                        component={FreezeWorkOrderList}
                    />,
                    <Route
                        key="/work_order/account/unfreeze"
                        exact={true}
                        path="/work_order/account/unfreeze"
                        component={UnfreezeWorkOrderList}
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
                    <Route
                        key="/work_order/not_audited"
                        exact={true}
                        path="/work_order/not_audited"
                        component={NotAuditedWorkOrderList}
                    />,
                    <Route
                        key="/work_order/fund/back"
                        exact={true}
                        path="/work_order/fund/back"
                        component={EnterpriseBackWorkOrderList}
                    />,
                    <Route
                        key="/work_order/fund/remit"
                        exact={true}
                        path="/work_order/fund/remit"
                        component={RemitWorkOrderList}
                    />,
                    <Route
                        key="/work_order/sub_user/remove"
                        exact={true}
                        path="/work_order/sub_user/remove"
                        component={RemoveSubUserWorkOrderList}
                    />,
                    <Route
                        key="/work_order/sub_user/add"
                        exact={true}
                        path="/work_order/sub_user/add"
                        component={AddSubUserWorkOrderList}
                    />,
                    <Route
                        key="/work_order/account/disable_export"
                        exact={true}
                        path="/work_order/account/disable_export"
                        component={DisableOrExportWorkOrderList}
                    />,
                    <Route
                        key="/work_order/account/freeze"
                        exact={true}
                        path="/work_order/account/freeze"
                        component={FreezeWorkOrderList}
                    />,
                    <Route
                        key="/work_order/account/unfreeze"
                        exact={true}
                        path="/work_order/account/unfreeze"
                        component={UnfreezeWorkOrderList}
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
