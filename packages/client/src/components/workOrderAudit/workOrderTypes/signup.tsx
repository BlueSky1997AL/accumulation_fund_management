import { Col, Divider, Row } from 'antd';
import React, { useEffect, useState } from 'react';

import FileDownloadButton from '~components/fileDownloadButton';

import { SignUpSubmitData } from '~components/signup';

import { moneyToHumanReadable, userTypeToString } from '~utils/user';

interface SignUpProps {
    jsonStr?: string;
    labelSpan: number;
    contentSpan: number;
}

const downloadBtnStyle: React.CSSProperties = {
    marginBottom: 10,
    marginRight: 10
};

function SignUp ({ jsonStr, labelSpan, contentSpan }: SignUpProps) {
    const [ data, setData ] = useState<SignUpSubmitData>();

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
            <Divider orientation="left">账户信息</Divider>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    用户名：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {data && data.username}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    账户类型：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {userTypeToString(data && data.type)}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    账户余额：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {moneyToHumanReadable(data && data.balance)}
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

export default SignUp;
