import { Col, Row } from 'antd/es/grid';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import FileDownloadButton from '~components/fileDownloadButton';

import { PersonalFundBackSubmitData } from '~components/fundBackWorkflow/personalFundBackForm';
import { WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

import { moneyToHumanReadable, personTypeToString } from '~utils/user';

interface PersonalFundBackProps {
    workOrder?: WorkOrderWithUserInfo;
    labelSpan: number;
    contentSpan: number;
}

const downloadBtnStyle: React.CSSProperties = {
    marginBottom: 10,
    marginRight: 10
};

function PersonalFundBack ({ workOrder, labelSpan, contentSpan }: PersonalFundBackProps) {
    const [ data, setData ] = useState<PersonalFundBackSubmitData>();

    useEffect(
        () => {
            if (workOrder && workOrder.payload) {
                setData(JSON.parse(workOrder.payload));
            }
        },
        [ workOrder ]
    );

    function getMonth () {
        if (data) {
            return moment(data.month).format('YYYY-MM');
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
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    补缴月份：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {getMonth()}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    补缴金额：
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

export default PersonalFundBack;
