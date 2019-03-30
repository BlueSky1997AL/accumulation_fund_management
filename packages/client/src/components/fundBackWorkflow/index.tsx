import { Card, notification } from 'antd';
import React, { useState } from 'react';

import './index.less';

import WorkflowFrame from '~components/workflowFrame';
import EnterpriseFundBackForm, {EnterpriseFundBackSubmitData} from './enterpriseFundBackForm';

import { MsgType } from '~server/app/util/interface/common';
import { WorkOrder } from '~server/app/util/interface/workOrder';

import { createEnterpriseFundBackWorkOrder } from './request';

function FundBackWorkflow () {
    const [ currentWorkOrder, setCurrentWorkOrder ] = useState<WorkOrder>()

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

    return (
        <div className="fund-back-workflow-container">
            <Card title="新建补缴工单" bodyStyle={{ height: '100%', width: '100%' }}>
                <WorkflowFrame data={currentWorkOrder}>
                    <EnterpriseFundBackForm
                        onSubmit={data => handleSubmitEnterpriseFundBackWorkOrder(data)}
                    />
                </WorkflowFrame>
            </Card>
        </div>
    );
}

export default FundBackWorkflow;
