import { Col, Row } from 'antd/es/grid';
import React, { useEffect, useState } from 'react';

import FileDownloadButton from '~components/fileDownloadButton';

import { PersonalFundDrawSubmitData } from '~components/fundDrawWorkflow/personalFundDrawForm';
import { PersonType } from '~server/app/util/interface/user';
import { WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

import { enterpriseTypeToString, moneyToHumanReadable, personTypeToString, userStatusToString } from '~utils/user';
import { drawTypeToString } from '~utils/workOrder';

interface PersonalFundDrawProps {
    workOrder?: WorkOrderWithUserInfo;
    labelSpan: number;
    contentSpan: number;
}

const downloadBtnStyle: React.CSSProperties = {
    marginBottom: 10,
    marginRight: 10
};

function PersonalFundDraw ({ workOrder, labelSpan, contentSpan }: PersonalFundDrawProps) {
    const [ data, setData ] = useState<PersonalFundDrawSubmitData>();

    useEffect(
        () => {
            if (workOrder && workOrder.payload) {
                setData(JSON.parse(workOrder.payload));
            }
        },
        [ workOrder ]
    );

    function getEntUsernameRow () {
        if (workOrder && workOrder.owner.personType === PersonType.Employees) {
            return (
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        所在企业统一社会信用代码：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {data && data.entInfo && data.entInfo.username}
                    </Col>
                </Row>
            );
        }
        return null;
    }

    function getEntNameRow () {
        if (workOrder && workOrder.owner.personType === PersonType.Employees) {
            return (
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        所在企业名称：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {data && data.entInfo && data.entInfo.name}
                    </Col>
                </Row>
            );
        }
        return null;
    }

    function getEntCardNoRow () {
        if (workOrder && workOrder.owner.personType === PersonType.Employees) {
            return (
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        所在企业银行卡号：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {data && data.entInfo && data.entInfo.cardNo}
                    </Col>
                </Row>
            );
        }
        return null;
    }

    function getEntTypeRow () {
        if (workOrder && workOrder.owner.personType === PersonType.Employees) {
            return (
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        所在企业类型：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {enterpriseTypeToString(data && data.entInfo && data.entInfo.entType)}
                    </Col>
                </Row>
            );
        }
        return null;
    }

    function getEntStatusRow () {
        if (workOrder && workOrder.owner.personType === PersonType.Employees) {
            return (
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        所在企业状态：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {userStatusToString(data && data.entInfo && data.entInfo.status)}
                    </Col>
                </Row>
            );
        }
        return null;
    }

    return (
        <div>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    姓名：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {workOrder && workOrder.owner.name}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    个人账户类型：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {personTypeToString(workOrder && workOrder.owner.personType)}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    银行卡账号：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {workOrder && workOrder.owner.cardNo}
                </Col>
            </Row>
            {getEntNameRow()}
            {getEntUsernameRow()}
            {getEntStatusRow()}
            {getEntTypeRow()}
            {getEntCardNoRow()}
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    支取类型：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {drawTypeToString(data && data.type)}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    支取金额：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {`${moneyToHumanReadable(data && data.amount)}元`}
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

export default PersonalFundDraw;
