// tslint:disable: no-string-literal

import { Button, Card, Input, InputNumber, notification, Row, Select } from 'antd';
import Form, { FormComponentProps } from 'antd/lib/form';
import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

const { Option } = Select;

import './index.less';

import { MsgType } from '~server/app/util/interface/common';
import { UserInDB, UserStatus, UserType } from '~server/app/util/interface/user';

import { userStatusToString, userTypeToString } from '~utils/user';
import { createUser } from './request';

interface AccountModificationProps extends FormComponentProps, RouteComponentProps {}

function AccountCreateForm ({ form, history }: AccountModificationProps) {
    const { getFieldDecorator, getFieldsValue, getFieldValue } = form;

    const [ showBalanceFormItem, setShowBalanceFormItem ] = useState(false);
    const [ showSubUserFormItem, setShowSubUserFormItem ] = useState(false);

    async function handleCreateUser () {
        try {
            const fieldsValue = getFieldsValue() as UserInDB;

            const resp = await createUser(fieldsValue);
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            notification.success({
                message: resp.message
            });
            history.goBack();
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    useEffect(() => {
        const userType = getFieldValue('type') as UserType;

        if (userType !== undefined && userType !== UserType.Admin) {
            setShowBalanceFormItem(true);
        } else {
            setShowBalanceFormItem(false);
        }

        if (userType === UserType.Enterprise) {
            setShowSubUserFormItem(true);
        } else {
            setShowSubUserFormItem(false);
        }
    });

    function getSubUserFormItem () {
        if (showSubUserFormItem) {
            return (
                <Form.Item label="子账户ID">
                    {getFieldDecorator('subUser', {})(
                        <Select
                            mode="tags"
                            open={false}
                            allowClear={true}
                            tokenSeparators={[ ',', '，', ' ' ]}
                            placeholder="多个用户ID请使用逗号或空格分割"
                        />
                    )}
                </Form.Item>
            );
        }
        return null;
    }

    function getBalanceFormItem () {
        if (showBalanceFormItem) {
            return (
                <Form.Item label="账户余额（分/人名币）">
                    {getFieldDecorator('balance', {
                        rules: [ { required: true, message: '账户余额不能为空' }, { type: 'number', message: '账户余额必须为数字' } ]
                    })(<InputNumber style={{ width: '100%' }} />)}
                </Form.Item>
            );
        }
        return null;
    }

    const buttonStyle: React.CSSProperties = {
        width: 150
    };

    return (
        <div className="user-info-container">
            <Card title="新建账户" bodyStyle={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Form
                    style={{
                        width: '50%',
                        height: '100%',
                        padding: '16px 0'
                    }}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                >
                    <Form.Item label="用户名">
                        {getFieldDecorator('username', {
                            rules: [ { required: true, message: '用户名不能为空' } ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="密码">
                        {getFieldDecorator('password', {
                            rules: [ { required: true, message: '密码不能为空' } ]
                        })(<Input type="password" />)}
                    </Form.Item>
                    <Form.Item label="账户类型">
                        {getFieldDecorator('type', {
                            rules: [ { required: true, message: '请选择账户类型' } ]
                        })(
                            <Select>
                                <Option value={UserType.Admin}>{userTypeToString(UserType.Admin)}</Option>
                                <Option value={UserType.Common}>{userTypeToString(UserType.Common)}</Option>
                                <Option value={UserType.Enterprise}>{userTypeToString(UserType.Enterprise)}</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="账户状态">
                        {getFieldDecorator('status', {
                            rules: [ { required: true, message: '请选择账户状态' } ]
                        })(
                            <Select>
                                <Option value={UserStatus.Disabled}>{userStatusToString(UserStatus.Disabled)}</Option>
                                <Option value={UserStatus.Frozen}>{userStatusToString(UserStatus.Frozen)}</Option>
                                <Option value={UserStatus.Lost}>{userStatusToString(UserStatus.Lost)}</Option>
                                <Option value={UserStatus.Normal}>{userStatusToString(UserStatus.Normal)}</Option>
                            </Select>
                        )}
                    </Form.Item>
                    {getBalanceFormItem()}
                    {getSubUserFormItem()}
                    <Row type="flex" justify="space-around">
                        <Button type="default" style={buttonStyle}>
                            <Link to="/account/list">取消</Link>
                        </Button>
                        <Button type="primary" style={buttonStyle} onClick={handleCreateUser}>
                            提交
                        </Button>
                    </Row>
                </Form>
            </Card>
        </div>
    );
}

export default withRouter(Form.create()(AccountCreateForm));
