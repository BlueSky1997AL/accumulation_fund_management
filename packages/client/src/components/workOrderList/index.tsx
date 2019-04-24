import { Card, List, notification } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './index.less';

import { EnterpriseSubUserAddSubmitData } from '~components/enterpriseSubUserAddWorkflow/enterpriseSubUserAddForm';
import { EnterpriseSubUserRemoveSubmitData } from '~components/enterpriseSubUserRemoveWorkflow';
import { EnterpriseFundBackSubmitData } from '~components/fundBackWorkflow/enterpriseFundBackForm';
import { PersonalFundBackSubmitData } from '~components/fundBackWorkflow/personalFundBackForm';
import { PersonalFundDepositSubmitData } from '~components/fundDepositWorkflow/personalFundDepositForm';
import { PersonalFundDrawSubmitData } from '~components/fundDrawWorkflow/personalFundDrawForm';
import { EnterpriseFundRemitSubmitData } from '~components/fundRemitWorkflow/enterpriseFundRemitForm';
import { SignUpSubmitData } from '~components/signup';
import { MsgType } from '~server/app/util/interface/common';
import { UserType } from '~server/app/util/interface/user';
import { WorkOrderStatus, WorkOrderType, WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

import { moneyToHumanReadable, personTypeToString, userTypeToString } from '~utils/user';
import { drawTypeToString, workOrderStatusToString, workOrderTypeToString } from '~utils/workOrder';
import {
    getAllWorkOrdersByQuery,
    getPersonalWorkOrdersByQuery,
    WorkOrderAdminQuery,
    WorkOrderUserQuery
} from './request';

type WorkOrderListType = 'audit' | 'mine' | 'notAuditedAdmin' | 'notAuditedUser';
interface WorkOrderListProps {
    type: WorkOrderListType;
    workOrderType?: WorkOrderType;
}

function WorkOrderList ({ type, workOrderType }: WorkOrderListProps) {
    const [ workOrders, setWorkOrders ] = useState<WorkOrderWithUserInfo[]>([]);

    async function fetchAllWorkOrdersByQuery (query: WorkOrderAdminQuery) {
        try {
            const resp = await getAllWorkOrdersByQuery(query);
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

    async function fetchPersonalWorkOrdersByQuery (query: WorkOrderUserQuery) {
        try {
            const resp = await getPersonalWorkOrdersByQuery(query);
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
        switch (type) {
            case 'audit': {
                fetchAllWorkOrdersByQuery({ type: workOrderType });
                break;
            }
            case 'mine': {
                fetchPersonalWorkOrdersByQuery({ type: workOrderType });
                break;
            }
            case 'notAuditedAdmin': {
                fetchAllWorkOrdersByQuery({ status: WorkOrderStatus.Open });
                break;
            }
            case 'notAuditedUser': {
                fetchPersonalWorkOrdersByQuery({ status: WorkOrderStatus.Open });
            }
        }
    }, []);

    function getCardTitle (listType: WorkOrderListType) {
        switch (listType) {
            case 'audit':
                return `${workOrderTypeToString(workOrderType)}工单审核`;
            case 'mine':
                return `${workOrderTypeToString(workOrderType)}工单`;
            case 'notAuditedAdmin':
                return '未审核工单';
            case 'notAuditedUser':
                return '未审核工单';
            default:
                return '未知工单操作';
        }
    }

    function getListItemDesc (info: WorkOrderWithUserInfo) {
        switch (type) {
            case 'audit': {
                return `${moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss')} - [${getWorkOrderDescAdmin(info)}]`;
            }
            case 'notAuditedAdmin': {
                return `${moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss')} -【${workOrderTypeToString(
                    info.type
                )}工单】[${getWorkOrderDescAdmin(info)}]`;
            }
            case 'notAuditedUser': {
                return `${moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss')} -【${workOrderTypeToString(
                    info.type
                )}工单】[${getWorkOrderDescUser(info)}]`;
            }
            case 'mine': {
                return `${moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss')} - [${getWorkOrderDescUser(info)}]`;
            }
            default:
                return null;
        }
    }

    function getWorkOrderDescAdmin (info: WorkOrderWithUserInfo) {
        switch (info.type) {
            case WorkOrderType.EnterpriseBack: {
                const payload = JSON.parse(info.payload!) as EnterpriseFundBackSubmitData;
                return `企业名称：${info.owner.name} / 统一社会信用代码：${info.owner.username} / 补缴月份：${moment(payload.month).format(
                    'YYYY-MM'
                )} / 补缴人数：${payload.amountMap.length}`;
            }
            case WorkOrderType.Remit: {
                const payload = JSON.parse(info.payload!) as EnterpriseFundRemitSubmitData;
                return `企业名称：${info.owner.name} / 统一社会信用代码：${info.owner.username} / 汇缴月份：${moment(payload.month).format(
                    'YYYY-MM'
                )} / 汇缴人数：${payload.amountMap.length}`;
            }
            case WorkOrderType.RemoveSubUser: {
                const payload = JSON.parse(info.payload!) as EnterpriseSubUserRemoveSubmitData;
                return `企业名称：${info.owner.name} / 统一社会信用代码：${info.owner.username} / 目标员工唯一标识：${payload.userID}`;
            }
            case WorkOrderType.AddSubUser: {
                const payload = JSON.parse(info.payload!) as EnterpriseSubUserAddSubmitData;
                return `企业名称：${info.owner.name} / 统一社会信用代码：${info.owner.username} / 目标员工身份证号码：${payload.usernames &&
                    payload.usernames.join('；')}`;
            }
            case WorkOrderType.PersonalBack: {
                const payload = JSON.parse(info.payload!) as PersonalFundBackSubmitData;
                return `姓名：${info.owner.name} / 身份证号：${info.owner.username} / 补缴月份：${moment(payload.month).format(
                    'YYYY-MM'
                )} / 补缴金额：${moneyToHumanReadable(payload.amount)}元`;
            }
            case WorkOrderType.PersonalDeposit: {
                const payload = JSON.parse(info.payload!) as PersonalFundDepositSubmitData;
                return `姓名：${info.owner.name} / 身份证号：${info.owner.username} / 缴存月份：${moment(payload.month).format(
                    'YYYY-MM'
                )} / 缴存金额：${moneyToHumanReadable(payload.amount)}元`;
            }
            case WorkOrderType.Draw: {
                const payload = JSON.parse(info.payload!) as PersonalFundDrawSubmitData;
                return `姓名：${info.owner.name} / 身份证号：${info.owner.username} / 支取类别：${drawTypeToString(
                    payload.type
                )} / 支取金额：${moneyToHumanReadable(payload.amount)}元`;
            }
            case WorkOrderType.DisableOrExport: {
                switch (info.owner.type) {
                    case UserType.Common: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 个人账户类型：${personTypeToString(
                            info.owner.personType
                        )} / 姓名：${info.owner.name} / 身份证号：${info.owner.username}`;
                    }
                    case UserType.Enterprise: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 企业名称：${info.owner.name} / 统一社会信用代码：${info
                            .owner.username}`;
                    }
                    default: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 用户名称：${info.owner.name} /用户名：${info.owner
                            .username}`;
                    }
                }
            }
            case WorkOrderType.Freeze: {
                switch (info.owner.type) {
                    case UserType.Common: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 个人账户类型：${personTypeToString(
                            info.owner.personType
                        )} / 姓名：${info.owner.name} / 身份证号：${info.owner.username}`;
                    }
                    case UserType.Enterprise: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 企业名称：${info.owner.name} / 统一社会信用代码：${info
                            .owner.username}`;
                    }
                    default: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 用户名称：${info.owner.name} /用户名：${info.owner
                            .username}`;
                    }
                }
            }
            case WorkOrderType.Unfreeze: {
                switch (info.owner.type) {
                    case UserType.Common: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 个人账户类型：${personTypeToString(
                            info.owner.personType
                        )} / 姓名：${info.owner.name} / 身份证号：${info.owner.username}`;
                    }
                    case UserType.Enterprise: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 企业名称：${info.owner.name} / 统一社会信用代码：${info
                            .owner.username}`;
                    }
                    default: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 用户名称：${info.owner.name} /用户名：${info.owner
                            .username}`;
                    }
                }
            }
            case WorkOrderType.SignUp: {
                const payload = JSON.parse(info.payload!) as SignUpSubmitData;
                switch (payload.type) {
                    case UserType.Common: {
                        return `账户类型：${userTypeToString(payload.type)} / 个人账户类型：${personTypeToString(
                            payload.personType
                        )} / 姓名：${payload.name} / 身份证号：${payload.username}`;
                    }
                    case UserType.Enterprise: {
                        return `账户类型：${userTypeToString(
                            payload.type
                        )} / 企业名称：${payload.name} / 统一社会信用代码：${payload.username}`;
                    }
                    default: {
                        return `账户类型：${userTypeToString(payload.type)} / 用户名称：${payload.name} /用户名：${payload.username}`;
                    }
                }
            }
        }
    }

    function getWorkOrderDescUser (info: WorkOrderWithUserInfo) {
        switch (info.type) {
            case WorkOrderType.EnterpriseBack: {
                const payload = JSON.parse(info.payload!) as EnterpriseFundBackSubmitData;
                return `补缴月份：${moment(payload.month).format('YYYY-MM')} / 补缴人数：${payload.amountMap.length}`;
            }
            case WorkOrderType.Remit: {
                const payload = JSON.parse(info.payload!) as EnterpriseFundRemitSubmitData;
                return `汇缴月份：${moment(payload.month).format('YYYY-MM')} / 汇缴人数：${payload.amountMap.length}`;
            }
            case WorkOrderType.RemoveSubUser: {
                const payload = JSON.parse(info.payload!) as EnterpriseSubUserRemoveSubmitData;
                return `目标员工唯一标识：${payload.userID}`;
            }
            case WorkOrderType.AddSubUser: {
                const payload = JSON.parse(info.payload!) as EnterpriseSubUserAddSubmitData;
                return `目标员工身份证号码：${payload.usernames && payload.usernames.join('；')}`;
            }
            case WorkOrderType.PersonalBack: {
                const payload = JSON.parse(info.payload!) as PersonalFundBackSubmitData;
                return `补缴月份：${moment(payload.month).format('YYYY-MM')} / 补缴金额：${moneyToHumanReadable(
                    payload.amount
                )}元`;
            }
            case WorkOrderType.PersonalDeposit: {
                const payload = JSON.parse(info.payload!) as PersonalFundDepositSubmitData;
                return `缴存月份：${moment(payload.month).format('YYYY-MM')} / 缴存金额：${moneyToHumanReadable(
                    payload.amount
                )}元`;
            }
            case WorkOrderType.Draw: {
                const payload = JSON.parse(info.payload!) as PersonalFundDrawSubmitData;
                return `支取类别：${drawTypeToString(payload.type)} / 支取金额：${moneyToHumanReadable(payload.amount)}元`;
            }
            case WorkOrderType.DisableOrExport: {
                switch (info.owner.type) {
                    case UserType.Common: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 个人账户类型：${personTypeToString(
                            info.owner.personType
                        )} / 姓名：${info.owner.name} / 身份证号：${info.owner.username}`;
                    }
                    case UserType.Enterprise: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 企业名称：${info.owner.name} / 统一社会信用代码：${info
                            .owner.username}`;
                    }
                    default: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 用户名称：${info.owner.name} /用户名：${info.owner
                            .username}`;
                    }
                }
            }
            case WorkOrderType.Freeze: {
                switch (info.owner.type) {
                    case UserType.Common: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 个人账户类型：${personTypeToString(
                            info.owner.personType
                        )} / 姓名：${info.owner.name} / 身份证号：${info.owner.username}`;
                    }
                    case UserType.Enterprise: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 企业名称：${info.owner.name} / 统一社会信用代码：${info
                            .owner.username}`;
                    }
                    default: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 用户名称：${info.owner.name} /用户名：${info.owner
                            .username}`;
                    }
                }
            }
            case WorkOrderType.Unfreeze: {
                switch (info.owner.type) {
                    case UserType.Common: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 个人账户类型：${personTypeToString(
                            info.owner.personType
                        )} / 姓名：${info.owner.name} / 身份证号：${info.owner.username}`;
                    }
                    case UserType.Enterprise: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 企业名称：${info.owner.name} / 统一社会信用代码：${info
                            .owner.username}`;
                    }
                    default: {
                        return `账户类型：${userTypeToString(info.owner.type)} / 用户名称：${info.owner.name} /用户名：${info.owner
                            .username}`;
                    }
                }
            }
        }
    }

    function getAuditStatusColor (status: WorkOrderStatus) {
        switch (status) {
            case WorkOrderStatus.Closed:
                return 'rgba(0, 0, 0, 0.25)';
            case WorkOrderStatus.Granted:
                return '#52c41a';
            case WorkOrderStatus.Rejected:
                return '#f5222d';
            case WorkOrderStatus.Open:
                return '#faad14';
            default:
                return '#000';
        }
    }

    return (
        <div className="work-order-list-container">
            <Card title={getCardTitle(type)} bodyStyle={{ height: '100%', width: '100%' }}>
                <List
                    itemLayout="horizontal"
                    dataSource={workOrders}
                    bordered={true}
                    renderItem={(item: WorkOrderWithUserInfo) => (
                        <List.Item
                            actions={[
                                <Link
                                    key="detail"
                                    to={
                                        type === 'audit' || type === 'notAuditedAdmin' ? (
                                            `/work_order/${item._id}/audit`
                                        ) : (
                                            `/work_order/${item._id}/detail`
                                        )
                                    }
                                >
                                    详情
                                </Link>
                            ]}
                        >
                            <List.Item.Meta title={getListItemDesc(item)} />
                            <div style={{ color: getAuditStatusColor(item.status) }}>
                                {workOrderStatusToString(item.status)}
                            </div>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
}

export default WorkOrderList;
