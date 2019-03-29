import { Card } from 'antd';
import React from 'react';

import './index.less';

import WorkflowFrame from '~components/workflowFrame';
import FundBackForm from './fundBackForm';

function FundBackWorkflow () {
    return (
        <div className="fund-back-workflow-container">
            <Card title="新建补缴工单" bodyStyle={{ height: '100%', width: '100%' }}>
                <WorkflowFrame>
                    <FundBackForm
                        onSubmit={data => {
                            console.log(data);
                        }}
                    />
                </WorkflowFrame>
            </Card>
        </div>
    );
}

export default FundBackWorkflow;
