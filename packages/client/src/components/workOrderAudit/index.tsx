import { Button, Card, Col, Divider, Input, notification, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import './index.less';

import { MsgType } from '~server/app/util/interface/common';
import { WorkOrderStatus, WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

import { getWorkOrderInfo } from '~utils/commonRequest';
import { userStatusToString, userTypeToString } from '~utils/user';
import { workOrderStatusToString, workOrderTypeToString } from '~utils/workOrder';
import { auditWorkOrder } from './request';
import getWorkOrderDetailComponent from './workOrderDistinguisher';

export interface WorkOrderAuditSubmitData {
    workOrderID: string;
    comments: string;
    opType: OperationType;
}

export enum OperationType {
    Granted,
    Rejected
}

interface WorkOrderAuditProps extends RouteComponentProps {
    workOrderID: string;
}

function WorkOrderAudit ({ workOrderID, history }: WorkOrderAuditProps) {
    const [ workOrderInfo, setWorkOrderInfo ] = useState<WorkOrderWithUserInfo>();
    const [ comments, setComments ] = useState<string>('');

    async function fetchWorkOrderInfo (id: string) {
        try {
            const resp = await getWorkOrderInfo(id);
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setWorkOrderInfo(resp.data);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    async function handleAudit (data: WorkOrderAuditSubmitData) {
        try {
            const resp = await auditWorkOrder(data);
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }

            notification.success({
                message: resp.message
            });
            setTimeout(() => {
                history.push('/work_order/audit');
            }, 100);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    useEffect(() => {
        fetchWorkOrderInfo(workOrderID);
    }, []);

    function getOperationButtons (workOrderStatus?: WorkOrderStatus) {
        if (workOrderStatus === WorkOrderStatus.Open) {
            return (
                <Row type="flex" align="middle" justify="space-around" style={{ marginTop: 20 }}>
                    <Button
                        className="op-btn"
                        type="danger"
                        onClick={() => handleAudit({ workOrderID, comments, opType: OperationType.Rejected })}
                    >
                        驳回
                    </Button>
                    <Button
                        className="op-btn"
                        type="primary"
                        onClick={() => handleAudit({ workOrderID, comments, opType: OperationType.Granted })}
                    >
                        通过
                    </Button>
                </Row>
            );
        }
        return null;
    }

    function getCommentBox (workOrderInfoData?: WorkOrderWithUserInfo) {
        if (workOrderInfoData && workOrderInfoData.status === WorkOrderStatus.Open) {
            return (
                <div>
                    <Divider orientation="left">备注</Divider>
                    <Input.TextArea
                        autosize={{
                            minRows: 4
                        }}
                        placeholder="输入审核备注内容"
                        value={comments}
                        onChange={e => setComments(e.target.value)}
                    />
                </div>
            );
        }
        return (
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    审核备注：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {workOrderInfo && workOrderInfo.comments}
                </Col>
            </Row>
        );
    }

    const labelSpan = 9;
    const contentSpan = 24 - labelSpan;

    return (
        <div className="work-order-audit-container">
            <Card
                title="工单审核"
                bodyStyle={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <div className="info-container">
                    <Row className="info-row">
                        <Col span={labelSpan} className="info-text info-label">
                            创建人：
                        </Col>
                        <Col span={contentSpan} className="info-text">
                            {workOrderInfo && workOrderInfo.owner.username}
                        </Col>
                    </Row>
                    <Row className="info-row">
                        <Col span={labelSpan} className="info-text info-label">
                            创建人账户类型：
                        </Col>
                        <Col span={contentSpan} className="info-text">
                            {userTypeToString(workOrderInfo && workOrderInfo.owner.type)}
                        </Col>
                    </Row>
                    <Row className="info-row">
                        <Col span={labelSpan} className="info-text info-label">
                            创建人账户状态：
                        </Col>
                        <Col span={contentSpan} className="info-text">
                            {userStatusToString(workOrderInfo && workOrderInfo.owner.status)}
                        </Col>
                    </Row>
                    <Row className="info-row">
                        <Col span={labelSpan} className="info-text info-label">
                            状态：
                        </Col>
                        <Col span={contentSpan} className="info-text">
                            {workOrderStatusToString(workOrderInfo && workOrderInfo.status)}
                        </Col>
                    </Row>
                    <Row className="info-row">
                        <Col span={labelSpan} className="info-text info-label">
                            类型：
                        </Col>
                        <Col span={contentSpan} className="info-text">
                            {workOrderTypeToString(workOrderInfo && workOrderInfo.type)}
                        </Col>
                    </Row>
                    {getWorkOrderDetailComponent(contentSpan, labelSpan, workOrderInfo)}
                    {getCommentBox(workOrderInfo)}
                    {getOperationButtons(workOrderInfo && workOrderInfo.status)}
                </div>
            </Card>
        </div>
    );
}

export default withRouter(WorkOrderAudit);
