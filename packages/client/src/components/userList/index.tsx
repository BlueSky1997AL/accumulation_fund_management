// tslint:disable: no-string-literal

import { Button, Card, notification, Popconfirm, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { User, UserInDB, UserStatus, UserType } from '~server/app/util/interface/user';
import { balanceToHumanReadable, userStatusToString, userTypeToString } from '~utils/user';
import './index.less';

import { MsgType } from '~server/app/util/interface/common';
import { getAllUsers, updateUserStatus } from './request';

function UserInfo () {
    const [ allUsers, setAllUsers ] = useState<User[]>([]);
    const [ subUsers ] = useState<User[]>([]);

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

    function getUserType () {
        return window.userType as UserType;
    }

    function getDataSource () {
        const userType = getUserType();
        switch (userType) {
            case UserType.Admin:
                return allUsers;
            case UserType.Enterprise:
                return subUsers;
            default:
                return [];
        }
    }

    useEffect(() => {
        const userType = getUserType();
        switch (userType) {
            case UserType.Admin: {
                fetchAndSetAllUsers();
                break;
            }
        }
    }, []);

    const linkStyle: React.CSSProperties = {
        marginRight: 5
    };

    const columns = [
        {
            title: '用户名',
            align: 'center',
            dataIndex: 'username'
        },
        {
            title: '用户ID',
            align: 'center',
            dataIndex: '_id'
        },
        {
            title: '账户类型',
            align: 'center',
            dataIndex: 'type',
            render(value: UserType) {
                return userTypeToString(value);
            }
        },
        {
            title: '账户状态',
            align: 'center',
            dataIndex: 'status',
            render(value: UserStatus) {
                return userStatusToString(value);
            }
        },
        {
            title: '账户余额（元/人民币）',
            align: 'center',
            dataIndex: 'balance',
            render(value: number) {
                return balanceToHumanReadable(value);
            }
        },
        {
            title: '子账户数量',
            align: 'center',
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
    ] as ColumnProps<User>[];

    return (
        <div className="user-info-container">
            <Card title={'账户列表'} bodyStyle={{ height: '100%', width: '100%' }}>
                <Row type="flex" justify="end" align="middle" style={{ marginBottom: 20 }}>
                    <Button type="primary">
                        <Link to="/account/create">添加用户</Link>
                    </Button>
                </Row>
                <Table rowKey="_id" columns={columns} dataSource={getDataSource()} />
            </Card>
        </div>
    );
}

export default UserInfo;
