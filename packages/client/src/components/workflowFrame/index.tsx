import { Result } from 'ant-design-pro';
import { Col, notification, Row, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
const { Step } = Steps;

import './index.less';

import { MsgType } from '~server/app/util/interface/common';
import { WorkOrder, WorkOrderStatus, WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';
import getWorkOrderDetailComponent from '../workOrderAudit/workOrderDistinguisher';

import { getWorkOrderInfo } from '~utils/commonRequest';
import { workOrderStatusToString, workOrderTypeToString } from '~utils/workOrder';

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
    data?: WorkOrder | WorkOrderWithUserInfo;
    workOrderID?: string;
    children?: JSX.Element | string;
}

function WorkflowFrame ({ data, children, workOrderID }: WorkflowFrameProps) {
    const [ workOrderData, setWorkOrderData ] = useState<WorkOrder | WorkOrderWithUserInfo>();
    const [ currentStep, setCurrentStep ] = useState(0);
    const [ currentStatus, setCurrentStatus ] = useState<'wait' | 'process' | 'finish' | 'error'>('wait');
    const [ currentDisplayStep, setCurrentDisplayStep ] = useState(0);

    async function fetchAndSetWorkOrderData (id: string) {
        try {
            const resp = await getWorkOrderInfo(id);
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            const respData = resp.data;
            setWorkOrderData(respData);
            setCurrentStep(workOrderStatusToStepCount(respData.status));
            setCurrentStatus(workOrderStatusToWorkflowStatus(respData.status));
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    useEffect(
        () => {
            if (data) {
                setWorkOrderData(data);
                setCurrentStep(workOrderStatusToStepCount(data.status));
                setCurrentStatus(workOrderStatusToWorkflowStatus(data.status));
            } else if (workOrderID) {
                fetchAndSetWorkOrderData(workOrderID);
            } else {
                setCurrentStep(0);
                setCurrentStatus('process');
            }
        },
        [ data, workOrderID ]
    );

    useEffect(
        () => {
            setCurrentDisplayStep(currentStep);
        },
        [ currentStep ]
    );

    const labelSpan = 12;
    const contentSpan = 24 - labelSpan;

    function getOrderAuditStatusIconType () {
        switch (workOrderData && workOrderData.status) {
            case WorkOrderStatus.Open:
                return 'success';
            case WorkOrderStatus.Granted:
                return 'success';
            case WorkOrderStatus.Rejected:
                return 'error';
            case WorkOrderStatus.Closed:
                return 'error';
            default:
                return 'error';
        }
    }

    function getOrderAuditStatusTipMsg () {
        switch (workOrderData && workOrderData.status) {
            case WorkOrderStatus.Open:
                return '工单已提交成功，请耐心等候审核结果';
            case WorkOrderStatus.Granted:
                return '审核已通过';
            case WorkOrderStatus.Rejected:
                return '审核未通过';
            case WorkOrderStatus.Closed:
                return '工单已关闭';
            default:
                return '未知工单状态';
        }
    }

    function getAuditComments () {
        if (workOrderData && workOrderData.comments) {
            return <div className="audit-comment">审核附加信息：{workOrderData && workOrderData.comments}</div>;
        }
        return null;
    }

    const steps: { title: string; onClick?: () => void; content: JSX.Element | string }[] = [
        {
            title: '提交工单',
            content: children || '请提交工单'
        },
        {
            title: '工单审核',
            onClick: () => {
                if (workOrderData) {
                    setCurrentDisplayStep(1);
                }
            },
            content: (
                <Result
                    type="success"
                    title="提交成功"
                    description={
                        <div>
                            <div>工单已提交成功，请耐心等候审核结果</div>
                        </div>
                    }
                    extra={
                        <div className="info-container">
                            <Row className="info-row">
                                <Col span={labelSpan} className="info-text info-label">
                                    状态：
                                </Col>
                                <Col span={contentSpan} className="info-text">
                                    {workOrderStatusToString(workOrderData && workOrderData.status)}
                                </Col>
                            </Row>
                            <Row className="info-row">
                                <Col span={labelSpan} className="info-text info-label">
                                    类型：
                                </Col>
                                <Col span={contentSpan} className="info-text">
                                    {workOrderTypeToString(workOrderData && workOrderData.type)}
                                </Col>
                            </Row>
                            {getWorkOrderDetailComponent(
                                contentSpan,
                                labelSpan,
                                workOrderData && workOrderData.payload,
                                workOrderData && workOrderData.type
                            )}
                        </div>
                    }
                    style={{
                        marginTop: 24
                    }}
                />
            )
        },
        {
            title: '工单结果',
            onClick: () => {
                if (workOrderData) {
                    setCurrentDisplayStep(2);
                }
            },
            content: (
                <Result
                    type={getOrderAuditStatusIconType()}
                    title={getOrderAuditStatusTipMsg()}
                    extra={getAuditComments()}
                    style={{
                        marginTop: 24
                    }}
                />
            )
        }
    ];

    return (
        <div className="workflow-frame-container">
            <Steps status={currentStatus} current={currentStep}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} onClick={item.onClick} style={{ cursor: 'pointer' }} />
                ))}
            </Steps>
            <div className="steps-content">{steps[currentDisplayStep].content}</div>
        </div>
    );
}

export default WorkflowFrame;
