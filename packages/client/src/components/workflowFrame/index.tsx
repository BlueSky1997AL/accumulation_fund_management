import { Steps } from 'antd';
import React, { useEffect, useState } from 'react';
const { Step } = Steps;

import './index.less';

import { WorkOrder, WorkOrderStatus } from '~server/app/util/interface/workOrder';

function workOrderStatusToStepCount (status: WorkOrderStatus) {
    switch (status) {
        case WorkOrderStatus.Open:
            return 1;
        case WorkOrderStatus.Closed:
            return 1;
        case WorkOrderStatus.Granted:
            return 2;
        case WorkOrderStatus.Rejected:
            return 2;
        default:
            return 0;
    }
}

function workOrderStatusToWorkflowStatus (status: WorkOrderStatus) {
    switch (status) {
        case WorkOrderStatus.Closed:
            return 'error';
        case WorkOrderStatus.Granted:
            return 'finish';
        case WorkOrderStatus.Open:
            return 'process';
        case WorkOrderStatus.Rejected:
            return 'error';
        default:
            return 'wait';
    }
}

interface WorkflowFrameProps {
    data?: WorkOrder;
    children?: JSX.Element | string;
}

function WorkflowFrame ({ data, children }: WorkflowFrameProps) {
    const [ currentStep, setCurrentStep ] = useState(0);
    const [ currentStatus, setCurrentStatus ] = useState<'wait' | 'process' | 'finish' | 'error'>('wait');

    useEffect(
        () => {
            if (data) {
                setCurrentStep(workOrderStatusToStepCount(data.status));
                setCurrentStatus(workOrderStatusToWorkflowStatus(data.status));
            } else {
                setCurrentStep(0);
                setCurrentStatus('process');
            }
        },
        [ data ]
    );

    const steps: { title: string; content: JSX.Element | string }[] = [
        {
            title: '提交工单',
            content: children || '请提交工单'
        },
        {
            title: '工单审核',
            content: <div className="step-message">工单已提交，请耐心等候管理员审核</div>
        },
        {
            title: '工单结果',
            content: (
                <div className="step-message">
                    <div className="audit-result">
                        审核结果：{data && data.status === WorkOrderStatus.Granted ? '审核已通过' : '审核未通过'}
                    </div>
                    <div className="audit-comment">附加信息：{data && data.comments}</div>
                </div>
            )
        }
    ];

    return (
        <div className="workflow-frame-container">
            <Steps status={currentStatus} current={currentStep}>
                {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className="steps-content">{steps[currentStep].content}</div>
        </div>
    );
}

export default WorkflowFrame;
