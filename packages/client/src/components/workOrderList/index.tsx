import { Card, List, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './index.less';

import { MsgType } from '~server/app/util/interface/common';
import { WorkOrderStatus, WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

import { userTypeToString } from '~utils/user';
import { workOrderStatusToString, workOrderTypeToString } from '~utils/workOrder';
import { getAllWorkOrders } from './request';

type WorkOrderListType = 'audit' | 'mine';
interface WorkOrderListProps {
    type: WorkOrderListType;
}

function WorkOrderList ({ type }: WorkOrderListProps) {
    const [ workOrders, setWorkOrders ] = useState<WorkOrderWithUserInfo[]>([]);

    async function fetchAllWorkOrders () {
        try {
            const resp = await getAllWorkOrders();
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setWorkOrders(resp.data);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    useEffect(() => {
        fetchAllWorkOrders();
    }, []);

    function getCardTitle (workOrderType: WorkOrderListType) {
        switch (workOrderType) {
            case 'audit':
                return '工单审核';
            case 'mine':
                return '我的工单';
            default:
                return '未知工单操作';
        }
    }

    function getListItemDesc (data: WorkOrderWithUserInfo) {
        const userType = userTypeToString(data.owner.type);
        const workOrderType = workOrderTypeToString(data.type);

        return `${userType} - ${data.owner.username} - ${workOrderType}`;
    }

    function getWorkOrderStatus (workOrderStatu: WorkOrderStatus) {
        return workOrderStatusToString(workOrderStatu);
    }

    return (
        <div className="work-order-list-container">
            <Card title={getCardTitle(type)} bodyStyle={{ height: '100%', width: '100%' }}>
                <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={workOrders}
                    renderItem={(item: WorkOrderWithUserInfo) => (
                        <List.Item
                            actions={[
                                <Link key="detail" to={`/work_order/${(item as any)._id}/audit`}>
                                    详情
                                </Link>
                            ]}
                        >
                            <List.Item.Meta title={getListItemDesc(item)} />
                            <div>{getWorkOrderStatus(item.status)}</div>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
}

export default WorkOrderList;
