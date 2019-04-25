import { Card, notification } from 'antd';
import React, { useState } from 'react';

import './index.less';

import WorkflowFrame from '~components/workflowFrame';
import EnterpriseFundBackForm, { EnterpriseFundBackSubmitData } from './enterpriseFundBackForm';
import PersonalFundBackForm, { PersonalFundBackSubmitData } from './personalFundBackForm';

import { MsgType } from '~server/app/util/interface/common';
import { WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

import { UserType } from '~server/app/util/interface/user';
import { createEnterpriseFundBackWorkOrder, createPersonalFundBackWorkOrder } from './request';

function FundBackWorkflow () {
    const [ currentWorkOrder, setCurrentWorkOrder ] = useState<WorkOrderWithUserInfo>();

    async function handleSubmitEnterpriseFundBackWorkOrder (payload: EnterpriseFundBackSubmitData) {
        try {
            const resp = await createEnterpriseFundBackWorkOrder(payload);
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setCurrentWorkOrder(resp.data);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    async function handleSubmitPersonalFundBackWorkOrder (payload: PersonalFundBackSubmitData) {
        try {
            const resp = await createPersonalFundBackWorkOrder(payload);
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setCurrentWorkOrder(resp.data);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    function getFundBackForm () {
        const userType = window.userType as UserType;
        switch (userType) {
            case UserType.Common:
                return <PersonalFundBackForm onSubmit={data => handleSubmitPersonalFundBackWorkOrder(data)} />;
            case UserType.Enterprise:
                return <EnterpriseFundBackForm onSubmit={data => handleSubmitEnterpriseFundBackWorkOrder(data)} />;
            default:
                return '不正确的用户类型';
        }
    }

    function getCardExtraInfo () {
        if (currentWorkOrder) {
            return (
                <div>
                    <span className="id-zone">工单唯一标识：</span>
                    <span className="id-zone">{currentWorkOrder._id}</span>
                </div>
            );
        }
        return null;
    }

    return (
        <div className="fund-back-workflow-container">
            <Card title="新建补缴工单" bodyStyle={{ height: '100%', width: '100%' }} extra={getCardExtraInfo()}>
                <WorkflowFrame data={currentWorkOrder}>{getFundBackForm()}</WorkflowFrame>
            </Card>
        </div>
    );
}

export default FundBackWorkflow;
