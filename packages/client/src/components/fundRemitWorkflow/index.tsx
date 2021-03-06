import { Card, notification } from 'antd';
import React, { useState } from 'react';

import './index.less';

import WorkflowFrame from '~components/workflowFrame';
import EnterpriseFundRemitForm, { EnterpriseFundRemitSubmitData } from './enterpriseFundRemitForm';

import { MsgType } from '~server/app/util/interface/common';
import { WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

import { createEnterpriseFundRemitWorkOrder } from './request';

function FundRemitWorkflow () {
    const [ currentWorkOrder, setCurrentWorkOrder ] = useState<WorkOrderWithUserInfo>();

    async function handleSubmitEnterpriseFundBackWorkOrder (payload: EnterpriseFundRemitSubmitData) {
        try {
            const resp = await createEnterpriseFundRemitWorkOrder(payload);
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
        <div className="fund-remit-workflow-container">
            <Card title="新建汇缴工单" bodyStyle={{ height: '100%', width: '100%' }} extra={getCardExtraInfo()}>
                <WorkflowFrame data={currentWorkOrder}>
                    <EnterpriseFundRemitForm onSubmit={data => handleSubmitEnterpriseFundBackWorkOrder(data)} />
                </WorkflowFrame>
            </Card>
        </div>
    );
}

export default FundRemitWorkflow;
