import { Card, notification } from 'antd';
import React, { useState } from 'react';

import './index.less';

import WorkflowFrame from '~components/workflowFrame';
import EnterpriseSubUserAddForm, { EnterpriseSubUserAddSubmitData } from './enterpriseSubUserAddForm';

import { MsgType } from '~server/app/util/interface/common';
import { WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

import { createEnterpriseSubUserAddWorkOrder } from './request';

function EnterpriseSubUserAddWorkflow () {
    const [ currentWorkOrder, setCurrentWorkOrder ] = useState<WorkOrderWithUserInfo>();

    async function handleSubmitPersonalFundBackWorkOrder (payload: EnterpriseSubUserAddSubmitData) {
        try {
            const resp = await createEnterpriseSubUserAddWorkOrder(payload);
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
        <div className="enterprise-sub-user-add-workflow-container">
            <Card title="新建添加子账户工单" bodyStyle={{ height: '100%', width: '100%' }} extra={getCardExtraInfo()}>
                <WorkflowFrame data={currentWorkOrder}>
                    <EnterpriseSubUserAddForm onSubmit={data => handleSubmitPersonalFundBackWorkOrder(data)} />
                </WorkflowFrame>
            </Card>
        </div>
    );
}

export default EnterpriseSubUserAddWorkflow;
