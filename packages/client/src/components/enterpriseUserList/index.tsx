// tslint:disable: no-string-literal

import { Button, Card, notification, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { UserStatus } from '~server/app/util/interface/user';
import { moneyToHumanReadable, userStatusToString } from '~utils/user';

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
            title: '账户唯一标识',
            align: 'center',
            dataIndex: 'id',
            render(value: string) {
                return <div style={{ color: 'rgba(0, 0, 0, 0.35)' }}>{value}</div>;
            }
        },
        {
            title: '工号',
            align: 'center',
            dataIndex: 'employeeID'
        },
        {
            title: '姓名',
            align: 'center',
            dataIndex: 'name'
        },
        {
            title: '身份证号',
            align: 'center',
            dataIndex: 'username'
        },
        {
            title: '银行卡号',
            align: 'center',
            dataIndex: 'cardNo'
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
            title: '账户余额',
            align: 'center',
            dataIndex: 'balance',
            render(value: number) {
                return `${moneyToHumanReadable(value)}元`;
            }
        },
        {
            title: '操作',
            key: 'operation',
            align: 'center',
            render(record: UserInfoRespData) {
                return (
                    <Link style={linkStyle} to={`/account/enterprise/${record.id}/remove`}>
                        转出
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
                        <Link to="/account/enterprise/create">添加员工</Link>
                    </Button>
                </Row>
                <Table rowKey="id" columns={columns} dataSource={subUsers} />
            </Card>
        </div>
    );
}

export default EnterpriseUserList;
