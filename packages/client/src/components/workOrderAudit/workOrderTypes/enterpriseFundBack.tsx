import { Col, Row } from 'antd/es/grid';
import React, { useEffect, useState } from 'react';

import FileDownloadButton from '~components/fileDownloadButton';

import { EnterpriseFundBackSubmitData } from '~components/fundBackWorkflow/enterpriseFundBackForm';

import { moneyToHumanReadable } from '~utils/user';

interface EnterpriseFundBackProps {
    jsonStr?: string;
    labelSpan: number;
    contentSpan: number;
}

const downloadBtnStyle: React.CSSProperties = {
    marginBottom: 10,
    marginRight: 10
};

function EnterpriseFundBack ({ jsonStr, labelSpan, contentSpan }: EnterpriseFundBackProps) {
    const [ data, setData ] = useState<EnterpriseFundBackSubmitData>();

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
                    用户信息（元/人民币）：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {data &&
                        data.amountMap.map((item, index) => {
                            return (
                                <div key={`amount-map-${index}`}>
                                    用户名：{item.usernames.join('，')}； 金额：{moneyToHumanReadable(item.amount)}
                                </div>
                            );
                        })}
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

export default EnterpriseFundBack;
