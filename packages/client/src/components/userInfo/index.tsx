import { Card, Col, Divider, Icon, notification, Popconfirm, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './index.less';

import { UserInfoRespData } from '~server/app/controller/user';
import { MsgType } from '~server/app/util/interface/common';

import { UserStatus, UserType } from '~server/app/util/interface/user';
import { getUserInfo } from '~utils/commonRequest';
import { moneyToHumanReadable, userStatusToString, userTypeToString } from '~utils/user';
import {userLost} from './request';
;

function UserInfo () {
    const [ userInfo, setUserInfo ] = useState<UserInfoRespData>();

    async function fetchUserInfo () {
        try {
            const resp = await getUserInfo();
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setUserInfo(resp.data);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    async function handleUserLost () {
        try {
            const resp = await userLost();
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            fetchUserInfo();
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    useEffect(() => {
        fetchUserInfo();
    }, []);

    function getAccountOperations () {
        if (userInfo && userInfo.type !== UserType.Admin) {
            switch (userInfo.status) {
                case UserStatus.Normal: {
                    return [
                        <Divider key="diviver" style={{ marginTop: 35 }} orientation="left">
                            账号操作
                        </Divider>,
                        <Card key="operation-cards">
                            <Card.Grid style={cardGridStyle}>
                                <Popconfirm title="确认要挂失该账户？" onConfirm={() => handleUserLost()}>
                                    <div
                                        className="card-grid-button"
                                        onClick={() => {
                                            console.log('hello');
                                        }}
                                    >
                                        <Icon style={opIconStyle} type="disconnect" />
                                        <span>挂失</span>
                                    </div>
                                </Popconfirm>
                            </Card.Grid>
                            <Card.Grid style={cardGridStyle}>
                                <Link className="card-grid-button" to="/account/freeze">
                                    <Icon style={opIconStyle} type="lock" />
                                    <span>冻结</span>
                                </Link>
                            </Card.Grid>
                            <Card.Grid style={cardGridStyle}>
                                <Link className="card-grid-button" to="/account/disable">
                                    <Icon style={opIconStyle} type="delete" />
                                    <span>销户/转出</span>
                                </Link>
                            </Card.Grid>
                        </Card>
                    ];
                }
                case UserStatus.Frozen: {
                    return [
                        <Divider key="diviver" style={{ marginTop: 35 }} orientation="left">
                            账号操作
                        </Divider>,
                        <Card key="operation-cards">
                            <Card.Grid style={cardGridStyle}>
                                <Popconfirm title="确认要挂失该账户？" onConfirm={() => handleUserLost()}>
                                    <div
                                        className="card-grid-button"
                                        onClick={() => {
                                            console.log('hello');
                                        }}
                                    >
                                        <Icon style={opIconStyle} type="disconnect" />
                                        <span>挂失</span>
                                    </div>
                                </Popconfirm>
                            </Card.Grid>
                            <Card.Grid style={cardGridStyle}>
                                <Link className="card-grid-button" to="/account/unfreeze">
                                    <Icon style={opIconStyle} type="lock" />
                                    <span>解除冻结</span>
                                </Link>
                            </Card.Grid>
                            <Card.Grid style={cardGridStyle}>
                                <Link className="card-grid-button" to="/account/disable">
                                    <Icon style={opIconStyle} type="delete" />
                                    <span>销户/转出</span>
                                </Link>
                            </Card.Grid>
                        </Card>
                    ];
                }
            }
        }
        return null;
    }

    function getBalanceRow () {
        if (userInfo && userInfo.type !== UserType.Admin && userInfo.status !== UserStatus.Lost) {
            return (
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        账户余额：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {moneyToHumanReadable(userInfo && userInfo.balance)}（元/人民币）
                    </Col>
                </Row>
            );
        }
        return null;
    }

    const labelSpan = 3;
    const contentSpan = 24 - labelSpan;

    const opIconStyle: React.CSSProperties = {
        fontSize: 24
    };

    const cardGridStyle: React.CSSProperties = {
        width: '33.33%',
        padding: 0
    };

    return (
        <div className="user-info-container">
            <Card title={'账户信息'} bodyStyle={{ height: '100%', width: '100%' }}>
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        账户ID：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {userInfo && userInfo.id}
                    </Col>
                </Row>
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        账户名称：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {userInfo && userInfo.username}
                    </Col>
                </Row>
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        账户类型：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {userTypeToString(userInfo && userInfo.type)}
                    </Col>
                </Row>
                <Row className="info-row">
                    <Col span={labelSpan} className="info-text info-label">
                        账户状态：
                    </Col>
                    <Col span={contentSpan} className="info-text">
                        {userStatusToString(userInfo && userInfo.status)}
                    </Col>
                </Row>
                {getBalanceRow()}
                {getAccountOperations()}
            </Card>
        </div>
    );
}

export default UserInfo;
