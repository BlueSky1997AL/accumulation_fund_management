import { Card, notification } from 'antd';
import React, { useState } from 'react';

import './index.less';

import WorkflowFrame from '~components/workflowFrame';
import PersonalFundDrawForm, { PersonalFundDrawSubmitData } from './personalFundDrawForm';

import { MsgType } from '~server/app/util/interface/common';
import { WorkOrder } from '~server/app/util/interface/workOrder';

import { createPersonalFundDrawWorkOrder } from './request';

function FundBackWorkflow () {
    const [ currentWorkOrder, setCurrentWorkOrder ] = useState<WorkOrder>();

    async function handleSubmitPersonalFundBackWorkOrder (payload: PersonalFundDrawSubmitData) {
        try {
            const resp = await createPersonalFundDrawWorkOrder(payload);
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

    return (
        <div className="fund-draw-workflow-container">
            <Card title="新建支取工单" bodyStyle={{ height: '100%', width: '100%' }}>
                <WorkflowFrame data={currentWorkOrder}>
                    <PersonalFundDrawForm onSubmit={data => handleSubmitPersonalFundBackWorkOrder(data)} />
                </WorkflowFrame>
            </Card>
        </div>
    );
}

export default FundBackWorkflow;
