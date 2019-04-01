import { Col, Row } from 'antd/es/grid';
import React, { useEffect, useState } from 'react';

import FileDownloadButton from '~components/fileDownloadButton';

import { EnterpriseSubUserAddSubmitData } from '~components/enterpriseSubUserAddWorkflow/enterpriseSubUserAddForm';

interface EnterpriseSubUserAddProps {
    jsonStr?: string;
    labelSpan: number;
    contentSpan: number;
}

const downloadBtnStyle: React.CSSProperties = {
    marginBottom: 10,
    marginRight: 10
};

function EnterpriseSubUserAdd ({ jsonStr, labelSpan, contentSpan }: EnterpriseSubUserAddProps) {
    const [ data, setData ] = useState<EnterpriseSubUserAddSubmitData>();

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
                    目标用户名：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {data && data.usernames.join('，')}
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

export default EnterpriseSubUserAdd;
