import { Col, Row } from 'antd/es/grid';
import React, { useEffect, useState } from 'react';

import FileDownloadButton from '~components/fileDownloadButton';

import { PersonalFundBackSubmitData } from '~components/fundBackWorkflow/personalFundBackForm';

import { moneyToHumanReadable } from '~utils/user';

interface PersonalFundBackProps {
    jsonStr?: string;
    labelSpan: number;
    contentSpan: number;
}

const downloadBtnStyle: React.CSSProperties = {
    marginBottom: 10,
    marginRight: 10
};

function PersonalFundBack ({ jsonStr, labelSpan, contentSpan }: PersonalFundBackProps) {
    const [ data, setData ] = useState<PersonalFundBackSubmitData>();

    useEffect(
        () => {
            if (jsonStr) {
                setData(JSON.parse(jsonStr));
            }
        },
        [ jsonStr ]
    );

    return (
        <div>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    金额（元/人民币）：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {moneyToHumanReadable(data && data.amount)}
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
