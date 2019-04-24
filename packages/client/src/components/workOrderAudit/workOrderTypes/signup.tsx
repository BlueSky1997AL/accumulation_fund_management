import { Col, Divider, notification, Row } from 'antd';
import React, { useEffect, useState } from 'react';

import FileDownloadButton from '~components/fileDownloadButton';

import { SignUpSubmitData } from '~components/signup';
import { MsgType } from '~server/app/util/interface/common';
import { PersonType, UserInDB, UserType } from '~server/app/util/interface/user';
import { WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

import { getFullUserInfo } from '~components/accountModificationForm/request';
import { enterpriseTypeToString, moneyToHumanReadable, personTypeToString, userTypeToString } from '~utils/user';

interface SignUpProps {
    workOrder?: WorkOrderWithUserInfo;
    labelSpan: number;
    contentSpan: number;
}

const downloadBtnStyle: React.CSSProperties = {
    marginBottom: 10,
    marginRight: 10
};

function SignUp ({ workOrder, labelSpan, contentSpan }: SignUpProps) {
    const [ data, setData ] = useState<SignUpSubmitData>();
    const [ employerInfo, setEmployerInfo ] = useState<UserInDB>();

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
            if (data && data.type === UserType.Common && data.personType === PersonType.Employees) {
                getAndSetEmployerInfo(undefined, data.entID);
            }
        },
        [ data ]
    );

    async function getAndSetEmployerInfo (id?: string, username?: string) {
        try {
            const resp = await getFullUserInfo(id, username);
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setEmployerInfo(resp.data);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    function getUsernameRowLabel () {
        switch (data && data.type) {
            case UserType.Enterprise: {
                return '统一社会信用代码';
            }
            case UserType.Common: {
                return '身份证号';
            }
            default: {
                return '用户名';
            }
        }
    }

    function getNameRowLabel () {
        switch (data && data.type) {
            case UserType.Enterprise: {
                return '企业名称';
            }
            case UserType.Common: {
                return '姓名';
            }
            default: {
                return '名称';
            }
        }
    }

    function getCardNoRow () {
        if (data && (data.type === UserType.Common || data.type === UserType.Enterprise)) {
            return (
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        银行卡号：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {data && data.cardNo}
                    </Col>
                </Row>
            );
        }
    }

    function getEmployeeIDRow () {
        if (data && data.type === UserType.Common && data.personType === PersonType.Employees) {
            return (
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        所在企业工号：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {data && data.employeeID}
                    </Col>
                </Row>
            );
        }
    }

    function getEntTypeRow () {
        if (data && data.type === UserType.Enterprise) {
            return (
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        企业类型：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {enterpriseTypeToString(data && data.entType)}
                    </Col>
                </Row>
            );
        }
    }

    function getPersonTypeRow () {
        if (data && data.type === UserType.Common) {
            return (
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        个人账户类型：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {personTypeToString(data && data.personType)}
                    </Col>
                </Row>
            );
        }
    }

    function getEntUsernameRow () {
        if (data && data.type === UserType.Common && data.personType === PersonType.Employees) {
            return (
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        所在企业统一社会信用代码：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {employerInfo && employerInfo.username}
                    </Col>
                </Row>
            );
        }
    }

    function getEntNameRow () {
        if (data && data.type === UserType.Common && data.personType === PersonType.Employees) {
            return (
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        所在企业名称：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {employerInfo && employerInfo.name}
                    </Col>
                </Row>
            );
        }
    }

    function getEntCardNoRow () {
        if (data && data.type === UserType.Common && data.personType === PersonType.Employees) {
            return (
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        所在企业银行卡账号：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {employerInfo && employerInfo.cardNo}
                    </Col>
                </Row>
            );
        }
    }

    function getEmployerEntTypeRow () {
        if (data && data.type === UserType.Common && data.personType === PersonType.Employees) {
            return (
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        所在企业类型：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {enterpriseTypeToString(employerInfo && employerInfo.entType)}
                    </Col>
                </Row>
            );
        }
    }

    return (
        <div>
            <Divider orientation="left">账户信息</Divider>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    账户类型：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {userTypeToString(data && data.type)}
                </Col>
            </Row>
            {getEntTypeRow()}
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    {getUsernameRowLabel()}：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {data && data.username}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    {getNameRowLabel()}：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {data && data.name}
                </Col>
            </Row>
            {getCardNoRow()}
            {getPersonTypeRow()}
            {getEntUsernameRow()}
            {getEmployeeIDRow()}
            {getEntNameRow()}
            {getEntCardNoRow()}
            {getEmployerEntTypeRow()}
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    账户初始额：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {`${moneyToHumanReadable(data && data.balance)}元`}
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
