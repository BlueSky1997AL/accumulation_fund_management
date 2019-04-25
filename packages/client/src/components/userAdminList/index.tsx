// tslint:disable: no-string-literal

import { Button, Card, Icon, notification, Popconfirm, Row, Table, Tooltip } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { MsgType } from '~server/app/util/interface/common';
import { UserInDB, UserStatus, UserType } from '~server/app/util/interface/user';

import {
    enterpriseTypeToString,
    moneyToHumanReadable,
    personTypeToString,
    userStatusToString,
    userTypeToString
} from '~utils/user';
import { getAllUsers, updateUserStatus } from './request';

function UserAdminList () {
    const [ allUsers, setAllUsers ] = useState<UserInDB[]>([]);

    async function fetchAndSetAllUsers () {
        try {
            const resp = await getAllUsers();
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setAllUsers(resp.data);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    async function updateUserStatusAndRefresh (id: string, status: UserStatus) {
        try {
            const resp = await updateUserStatus(id, status);
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            notification.success({
                message: resp.message
            });
            fetchAndSetAllUsers();
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    useEffect(() => {
        fetchAndSetAllUsers();
    }, []);

    const linkStyle: React.CSSProperties = {
        marginRight: 5
    };

    const columns = [
        {
            title() {
                return (
                    <Tooltip title="用户名 / 身份证号码 / 统一社会信用代码 [用户唯一标识]">
                        用户名 <Icon style={{ color: 'rgba(0, 0, 0, 0.35)' }} type="info-circle" />
                    </Tooltip>
                );
            },
            align: 'center',
            dataIndex: 'username',
            render(value: string, userInfo) {
                return (
                    <div>
                        <span>{value}</span> <span style={{ color: 'rgba(0, 0, 0, 0.35)' }}>[{userInfo._id}]</span>
                    </div>
                );
            }
        },
        {
            title() {
                return (
                    <Tooltip title="用户名称 / 姓名 / 企业名称">
                        名称 <Icon style={{ color: 'rgba(0, 0, 0, 0.35)' }} type="info-circle" />
                    </Tooltip>
                );
            },
            align: 'center',
            dataIndex: 'name'
        },
        {
            title: '类型',
            align: 'center',
            width: 150,
            dataIndex: 'type',
            render(value: UserType, userInfo) {
                if (value === UserType.Common) {
                    return (
                        <Tooltip title={personTypeToString(userInfo.personType)}>
                            {userTypeToString(value)}&nbsp;
                            <Icon style={{ color: 'rgba(0, 0, 0, 0.35)' }} type="info-circle" />
                        </Tooltip>
                    );
                }
                if (value === UserType.Enterprise) {
                    return (
                        <Tooltip title={enterpriseTypeToString(userInfo.entType)}>
                            {userTypeToString(value)}&nbsp;
                            <Icon style={{ color: 'rgba(0, 0, 0, 0.35)' }} type="info-circle" />
                        </Tooltip>
                    );
                }
                return userTypeToString(value);
            }
        },
        {
            title: '状态',
            align: 'center',
            width: 60,
            dataIndex: 'status',
            render(value: UserStatus) {
                return userStatusToString(value);
            }
        },
        {
            title: '余额',
            align: 'center',
            dataIndex: 'balance',
            render(value: number) {
                return `${moneyToHumanReadable(value)}元`;
            }
        },
        {
            title: '银行卡号',
            align: 'center',
            dataIndex: 'cardNo'
        },
        {
            title: '子账户数量',
            align: 'center',
            width: 80,
            dataIndex: 'subUser',
            render(value: string[]) {
                if (Array.isArray(value)) {
                    return value.length;
                }
                return '未知';
            }
        },
        {
            title: '操作',
            key: 'operation',
            width: 100,
            align: 'center',
            render(record: UserInDB) {
                return [
                    <Link style={linkStyle} key="op-0" to={`/account/${record._id}/edit`}>
                        修改
                    </Link>,
                    <Popconfirm
                        key="op-1"
                        title="确认要注销该账户？"
                        onConfirm={() => updateUserStatusAndRefresh(record._id, UserStatus.Disabled)}
                    >
                        <a style={linkStyle}>注销</a>
                    </Popconfirm>,
                    <Popconfirm
                        key="op-2"
                        title="确认要冻结该账户？"
                        onConfirm={() => updateUserStatusAndRefresh(record._id, UserStatus.Frozen)}
                    >
                        <a style={linkStyle}>冻结</a>
                    </Popconfirm>,
                    <Popconfirm
                        key="op-3"
                        title="确认要挂失该账户？"
                        onConfirm={() => updateUserStatusAndRefresh(record._id, UserStatus.Lost)}
                    >
                        <a style={linkStyle}>挂失</a>
                    </Popconfirm>
                ];
            }
        }
    ] as ColumnProps<UserInDB>[];

    return (
        <div className="user-admin-list-container">
            <Card title={'账户列表'} bodyStyle={{ height: '100%', width: '100%' }}>
                <Row type="flex" justify="end" align="middle" style={{ marginBottom: 20 }}>
                    <Button type="primary">
                        <Link to="/account/create">添加用户</Link>
                    </Button>
                </Row>
                <Table rowKey="_id" columns={columns} dataSource={allUsers} />
            </Card>
        </div>
    );
}

export default UserAdminList;
