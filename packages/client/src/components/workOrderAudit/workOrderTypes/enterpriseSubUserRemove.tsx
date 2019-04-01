import { Col, Divider, notification, Row } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

import FileDownloadButton from '~components/fileDownloadButton';

import { EnterpriseSubUserRemoveSubmitData } from '~components/enterpriseSubUserRemoveWorkflow';

import { MsgType, ResponseData } from '~server/app/util/interface/common';
import { UserInDB } from '~server/app/util/interface/user';
import { moneyToHumanReadable, userStatusToString, userTypeToString } from '~utils/user';

interface EnterpriseSubUserRemoveProps {
    jsonStr?: string;
    labelSpan: number;
    contentSpan: number;
}

const downloadBtnStyle: React.CSSProperties = {
    marginBottom: 10,
    marginRight: 10
};

function EnterpriseSubUserRemove ({ jsonStr, labelSpan, contentSpan }: EnterpriseSubUserRemoveProps) {
    const [ data, setData ] = useState<EnterpriseSubUserRemoveSubmitData>();
    const [ targetUserInfo, setTargetUserInfo ] = useState<UserInDB>();

    async function fetchFullUserInfo (id: string) {
        try {
            const resp = await getFullUserInfo(id);
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

    async function getFullUserInfo (id: string) {
        const csrfToken = Cookies.get('csrfToken');
        const resp = await axios.get<ResponseData<UserInDB>>('/api/user/full_info', {
            headers: {
                'x-csrf-token': csrfToken
            },
            params: { id }
        });
        return resp.data;
    }

    useEffect(
        () => {
            if (jsonStr) {
                setData(JSON.parse(jsonStr));
            }
        },
        [ jsonStr ]
    );

    useEffect(
        () => {
            if (data) {
                fetchFullUserInfo(data.userID);
            }
        },
        [ data ]
    );

    return (
        <div>
            <Divider orientation="left">目标账户信息</Divider>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    账户ID：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {targetUserInfo && targetUserInfo._id}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    用户名：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {targetUserInfo && targetUserInfo.username}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    账户余额：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {moneyToHumanReadable(targetUserInfo && targetUserInfo.balance)}
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
