import { Button, Card, Divider, Form, Input, List, notification, Row, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const { Option } = Select;

import './index.less';

import { UserInfoRespData } from '~server/app/controller/user';
import { MsgType } from '~server/app/util/interface/common';
import { PersonType, UserType } from '~server/app/util/interface/user';
import { WorkOrderStatus, WorkOrderType, WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

import { getAuditStatusColor, getWorkOrderDescAdmin, getWorkOrderDescUser } from '~components/workOrderList';
import { getUserInfo } from '~utils/commonRequest';
import { workOrderStatusToString, workOrderTypeToString } from '~utils/workOrder';
import {
    getAllWorkOrdersByQuery,
    getPersonalWorkOrdersByQuery,
    WorkOrderAdminQuery,
    WorkOrderUserQuery
} from './request';

interface WorkOrderListProps extends FormComponentProps {
    type: 'admin' | 'user';
}

function WorkOrderList ({ type, form }: WorkOrderListProps) {
    const { getFieldDecorator, getFieldsValue } = form;

    const [ workOrders, setWorkOrders ] = useState<WorkOrderWithUserInfo[]>([]);
    const [ currentUserInfo, setCurrentUserInfo ] = useState<UserInfoRespData>();

    useEffect(() => {
        fetchCurrentUserInfo();
    }, []);

    async function fetchCurrentUserInfo () {
        try {
            const resp = await getUserInfo();
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setCurrentUserInfo(resp.data);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

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

    function handleQuery () {
        const query = getFieldsValue();

        switch (type) {
            case 'admin': {
                fetchAllWorkOrdersByQuery(query);
                break;
            }
            case 'user': {
                fetchPersonalWorkOrdersByQuery(query);
                break;
            }
            default: {
                return;
            }
        }
    }

    function getListItemDesc (info: WorkOrderWithUserInfo) {
        switch (type) {
            case 'admin': {
                return `${moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss')} -【${workOrderTypeToString(
                    info.type
                )}工单】[${getWorkOrderDescAdmin(info)}]`;
            }
            case 'user': {
                return `${moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss')} -【${workOrderTypeToString(
                    info.type
                )}工单】[${getWorkOrderDescUser(info)}]`;
            }
            default:
                return null;
        }
    }

    function getWorkOrderTypeRow () {
        switch (type) {
            case 'admin': {
                return (
                    <Form.Item label="工单类型">
                        {getFieldDecorator('type', {})(
                            <Select allowClear={true} placeholder="请选择工单状态">
                                <Option value={WorkOrderType.Remit}>
                                    {workOrderTypeToString(WorkOrderType.Remit)}
                                </Option>
                                <Option value={WorkOrderType.EnterpriseBack}>
                                    {workOrderTypeToString(WorkOrderType.EnterpriseBack)}
                                </Option>
                                <Option value={WorkOrderType.RemoveSubUser}>
                                    {workOrderTypeToString(WorkOrderType.RemoveSubUser)}
                                </Option>
                                <Option value={WorkOrderType.AddSubUser}>
                                    {workOrderTypeToString(WorkOrderType.AddSubUser)}
                                </Option>
                                <Option value={WorkOrderType.Draw}>{workOrderTypeToString(WorkOrderType.Draw)}</Option>
                                <Option value={WorkOrderType.PersonalDeposit}>
                                    {workOrderTypeToString(WorkOrderType.PersonalDeposit)}
                                </Option>
                                <Option value={WorkOrderType.PersonalBack}>
                                    {workOrderTypeToString(WorkOrderType.PersonalBack)}
                                </Option>
                                <Option value={WorkOrderType.DisableOrExport}>
                                    {workOrderTypeToString(WorkOrderType.DisableOrExport)}
                                </Option>
                                <Option value={WorkOrderType.Freeze}>
                                    {workOrderTypeToString(WorkOrderType.Freeze)}
                                </Option>
                                <Option value={WorkOrderType.Unfreeze}>
                                    {workOrderTypeToString(WorkOrderType.Unfreeze)}
                                </Option>
                                <Option value={WorkOrderType.SignUp}>
                                    {workOrderTypeToString(WorkOrderType.SignUp)}
                                </Option>
                            </Select>
                        )}
                    </Form.Item>
                );
            }
            case 'user': {
                switch (currentUserInfo && currentUserInfo.type) {
                    case UserType.Common: {
                        if (currentUserInfo!.personType === PersonType.IndividualBusiness) {
                            return (
                                <Form.Item label="工单类型">
                                    {getFieldDecorator('type', {})(
                                        <Select allowClear={true} placeholder="请选择工单状态">
                                            <Option value={WorkOrderType.Draw}>
                                                {workOrderTypeToString(WorkOrderType.Draw)}
                                            </Option>
                                            <Option value={WorkOrderType.PersonalDeposit}>
                                                {workOrderTypeToString(WorkOrderType.PersonalDeposit)}
                                            </Option>
                                            <Option value={WorkOrderType.PersonalBack}>
                                                {workOrderTypeToString(WorkOrderType.PersonalBack)}
                                            </Option>
                                            <Option value={WorkOrderType.DisableOrExport}>
                                                {workOrderTypeToString(WorkOrderType.DisableOrExport)}
                                            </Option>
                                            <Option value={WorkOrderType.Freeze}>
                                                {workOrderTypeToString(WorkOrderType.Freeze)}
                                            </Option>
                                            <Option value={WorkOrderType.Unfreeze}>
                                                {workOrderTypeToString(WorkOrderType.Unfreeze)}
                                            </Option>
                                            <Option value={WorkOrderType.SignUp}>
                                                {workOrderTypeToString(WorkOrderType.SignUp)}
                                            </Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            );
                        }
                        return (
                            <Form.Item label="工单类型">
                                {getFieldDecorator('type', {})(
                                    <Select allowClear={true} placeholder="请选择工单状态">
                                        <Option value={WorkOrderType.Draw}>
                                            {workOrderTypeToString(WorkOrderType.Draw)}
                                        </Option>
                                        <Option value={WorkOrderType.DisableOrExport}>
                                            {workOrderTypeToString(WorkOrderType.DisableOrExport)}
                                        </Option>
                                        <Option value={WorkOrderType.Freeze}>
                                            {workOrderTypeToString(WorkOrderType.Freeze)}
                                        </Option>
                                        <Option value={WorkOrderType.Unfreeze}>
                                            {workOrderTypeToString(WorkOrderType.Unfreeze)}
                                        </Option>
                                        <Option value={WorkOrderType.SignUp}>
                                            {workOrderTypeToString(WorkOrderType.SignUp)}
                                        </Option>
                                    </Select>
                                )}
                            </Form.Item>
                        );
                    }
                    case UserType.Enterprise: {
                        return (
                            <Form.Item label="工单类型">
                                {getFieldDecorator('type', {})(
                                    <Select allowClear={true} placeholder="请选择工单状态">
                                        <Option value={WorkOrderType.Remit}>
                                            {workOrderTypeToString(WorkOrderType.Remit)}
                                        </Option>
                                        <Option value={WorkOrderType.EnterpriseBack}>
                                            {workOrderTypeToString(WorkOrderType.EnterpriseBack)}
                                        </Option>
                                        <Option value={WorkOrderType.RemoveSubUser}>
                                            {workOrderTypeToString(WorkOrderType.RemoveSubUser)}
                                        </Option>
                                        <Option value={WorkOrderType.AddSubUser}>
                                            {workOrderTypeToString(WorkOrderType.AddSubUser)}
                                        </Option>
                                        <Option value={WorkOrderType.DisableOrExport}>
                                            {workOrderTypeToString(WorkOrderType.DisableOrExport)}
                                        </Option>
                                        <Option value={WorkOrderType.Freeze}>
                                            {workOrderTypeToString(WorkOrderType.Freeze)}
                                        </Option>
                                        <Option value={WorkOrderType.Unfreeze}>
                                            {workOrderTypeToString(WorkOrderType.Unfreeze)}
                                        </Option>
                                        <Option value={WorkOrderType.SignUp}>
                                            {workOrderTypeToString(WorkOrderType.SignUp)}
                                        </Option>
                                    </Select>
                                )}
                            </Form.Item>
                        );
                    }
                    default:
                        return null;
                }
            }
            default:
                return null;
        }
    }

    function getWorkOrderOwnerRow () {
        if (type === 'admin') {
            return (
                <Form.Item label="创建人唯一标识">
                    {getFieldDecorator('owner', {})(
                        <Input onPressEnter={handleQuery} allowClear={true} placeholder="请输入账户唯一标识" />
                    )}
                </Form.Item>
            );
        }
        return null;
    }

    function getWorkOrderOwnerUsernameRow () {
        if (type === 'admin') {
            return (
                <Form.Item label="创建人用户名">
                    {getFieldDecorator('ownerUsername', {})(
                        <Input onPressEnter={handleQuery} allowClear={true} placeholder="身份证号 / 统一社会信用代码 / 用户名" />
                    )}
                </Form.Item>
            );
        }
        return null;
    }

    return (
        <div className="work-order-list-container">
            <Card title="工单查询" bodyStyle={{ height: '100%', width: '100%' }}>
                <Form labelCol={{ span: 10 }} wrapperCol={{ span: 6 }}>
                    <Form.Item label="工单唯一标识">
                        {getFieldDecorator('id', {})(
                            <Input onPressEnter={handleQuery} allowClear={true} placeholder="请输入工单唯一标识" />
                        )}
                    </Form.Item>
                    <Form.Item label="工单状态">
                        {getFieldDecorator('status', {})(
                            <Select allowClear={true} placeholder="请选择工单状态">
                                <Option value={WorkOrderStatus.Granted}>
                                    {workOrderStatusToString(WorkOrderStatus.Granted)}
                                </Option>
                                <Option value={WorkOrderStatus.Rejected}>
                                    {workOrderStatusToString(WorkOrderStatus.Rejected)}
                                </Option>
                                <Option value={WorkOrderStatus.Open}>
                                    {workOrderStatusToString(WorkOrderStatus.Open)}
                                </Option>
                            </Select>
                        )}
                    </Form.Item>
                    {getWorkOrderTypeRow()}
                    {getWorkOrderOwnerRow()}
                    {getWorkOrderOwnerUsernameRow()}
                    <Form.Item label="审核人唯一标识">
                        {getFieldDecorator('auditer', {})(
                            <Input onPressEnter={handleQuery} allowClear={true} placeholder="请输入审核人唯一标识" />
                        )}
                    </Form.Item>
                    <Form.Item label="审核人用户名">
                        {getFieldDecorator('auditerUsername', {})(
                            <Input onPressEnter={handleQuery} allowClear={true} placeholder="请输入审核人用户名" />
                        )}
                    </Form.Item>
                    <Row type="flex" justify="center">
                        <Button type="primary" icon="search" style={{ width: 100 }} onClick={handleQuery}>
                            查询
                        </Button>
                    </Row>
                </Form>
                <Divider orientation="left">查询结果</Divider>
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
                                        type === 'admin' ? (
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

export default Form.create()(WorkOrderList);
