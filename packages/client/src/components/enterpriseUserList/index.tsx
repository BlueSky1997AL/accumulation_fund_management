// tslint:disable: no-string-literal

import { Button, Card, notification, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { UserStatus, UserType } from '~server/app/util/interface/user';
import { moneyToHumanReadable, userStatusToString, userTypeToString } from '~utils/user';

import { UserInfoRespData } from '~server/app/controller/user';
import { MsgType } from '~server/app/util/interface/common';
import { getSubUsers } from './request';

function EnterpriseUserList () {
    const [ subUsers, setSubUsers ] = useState<UserInfoRespData[]>([]);

    async function fetchAndSetAllUsers () {
        try {
            const resp = await getSubUsers();
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setSubUsers(resp.data);
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
            title: '用户ID',
            align: 'center',
            dataIndex: 'id'
        },
        {
            title: '用户名',
            align: 'center',
            dataIndex: 'username'
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
                return moneyToHumanReadable(value);
            }
        },
        {
            title: '操作',
            key: 'operation',
            align: 'center',
            render(record: UserInfoRespData) {
                return (
                    <Link style={linkStyle} to={`/account/enterprise/${record.id}/remove`}>
                        移除/转出
                    </Link>
                );
            }
        }
    ] as ColumnProps<UserInfoRespData>[];

    return (
        <div className="user-admin-list-container">
            <Card title={'账户列表'} bodyStyle={{ height: '100%', width: '100%' }}>
                <Row type="flex" justify="end" align="middle" style={{ marginBottom: 20 }}>
                    <Button type="primary">
                        <Link to="/account/create">添加用户</Link>
                    </Button>
                </Row>
                <Table rowKey="_id" columns={columns} dataSource={subUsers} />
            </Card>
        </div>
    );
}

export default EnterpriseUserList;
