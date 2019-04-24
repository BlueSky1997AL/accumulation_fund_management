import { Col, Divider, notification, Row } from 'antd';
import React, { useEffect, useState } from 'react';

import FileDownloadButton from '~components/fileDownloadButton';

import { EnterpriseSubUserRemoveSubmitData } from '~components/enterpriseSubUserRemoveWorkflow';
import { UserInfoRespData } from '~server/app/controller/user';
import { MsgType } from '~server/app/util/interface/common';
import { WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

import { getTargetSubUserInfo } from '~components/enterpriseSubUserRemoveWorkflow/request';
import { enterpriseTypeToString, moneyToHumanReadable, userStatusToString, userTypeToString } from '~utils/user';

interface EnterpriseSubUserRemoveProps {
    workOrder?: WorkOrderWithUserInfo;
    labelSpan: number;
    contentSpan: number;
}

const downloadBtnStyle: React.CSSProperties = {
    marginBottom: 10,
    marginRight: 10
};

function EnterpriseSubUserRemove ({ workOrder, labelSpan, contentSpan }: EnterpriseSubUserRemoveProps) {
    const [ data, setData ] = useState<EnterpriseSubUserRemoveSubmitData>();
    const [ targetUserInfo, setTargetUserInfo ] = useState<UserInfoRespData>();

    async function getTargetUserInfo (id: string) {
        try {
            const resp = await getTargetSubUserInfo(id);
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setTargetUserInfo(resp.data);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    useEffect(
        () => {
            if (workOrder && workOrder.payload) {
                setData(JSON.parse(workOrder.payload));
            }
        },
        [ workOrder ]
    );

    useEffect(
        () => {
            if (data) {
                getTargetUserInfo(data.userID);
            }
        },
        [ data ]
    );

    return (
        <div>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    企业名称：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {workOrder && workOrder.owner.name}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    企业类型：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {enterpriseTypeToString(workOrder && workOrder.owner.entType)}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    企业银行卡号：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {workOrder && workOrder.owner.cardNo}
                </Col>
            </Row>
            <Divider orientation="left">目标账户信息</Divider>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    账户唯一标识：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {targetUserInfo && targetUserInfo.id}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    身份证号码：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {targetUserInfo && targetUserInfo.username}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    姓名：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {targetUserInfo && targetUserInfo.name}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    工号：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {targetUserInfo && targetUserInfo.employeeID}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    银行卡号：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {targetUserInfo && targetUserInfo.cardNo}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    账户余额：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {`${moneyToHumanReadable(targetUserInfo && targetUserInfo.balance)}元`}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    账户类型：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {userTypeToString(targetUserInfo && targetUserInfo.type)}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    账户状态：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {userStatusToString(targetUserInfo && targetUserInfo.status)}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    申请备注：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {data && data.comments}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    申请材料：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {data &&
                        data.accessory &&
                        data.accessory.map(item => (
                            <FileDownloadButton style={downloadBtnStyle} key={item.id} data={item} />
                        ))}
                </Col>
            </Row>
        </div>
    );
}

export default EnterpriseSubUserRemove;
