import { Button, Card, Input, InputNumber, notification, Radio, Row, Select } from 'antd';
import Form, { FormComponentProps } from 'antd/lib/form';
import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

const { Option } = Select;
const RadioGroup = Radio.Group;

import './index.less';

import { MsgType } from '~server/app/util/interface/common';
import { EnterpriseType, PersonType, UserInDB, UserStatus, UserType } from '~server/app/util/interface/user';

import idNoChecker from '~server/app/util/idNoChecker';
import { enterpriseTypeToString, moneyToHumanReadable, userStatusToString, userTypeToString } from '~utils/user';
import { getFullUserInfo, updateUserInfo } from './request';

interface AccountModificationFormProps extends FormComponentProps, RouteComponentProps {
    userID: string;
}

function AccountModificationForm ({ userID, form, history }: AccountModificationFormProps) {
    const { getFieldDecorator, getFieldValue, validateFields } = form;

    const [ fullUserInfo, setFullUserInfo ] = useState<UserInDB>();
    const [ currentUserType, setCurrentUserType ] = useState<UserType>();
    const [ currentPersonType, setCurrentPersonType ] = useState<PersonType>();

    useEffect(() => {
        const userType = getFieldValue('type') as UserType;
        const personType = getFieldValue('personType') as PersonType;

        setCurrentUserType(userType);
        setCurrentPersonType(personType);
    });

    useEffect(
        () => {
            if (fullUserInfo) {
                setCurrentUserType(fullUserInfo.type);
                setCurrentPersonType(fullUserInfo.personType);
            }
        },
        [ fullUserInfo ]
    );

    useEffect(() => {
        fetchFullUserInfo(userID);
    }, []);

    async function fetchFullUserInfo (id: string) {
        try {
            const resp = await getFullUserInfo(id);
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setFullUserInfo(resp.data);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    async function handleUpdateUserInfo () {
        validateFields(async (errors, formData: UserInDB) => {
            if (errors) {
                console.warn('Warning: Fields validation failed:', errors);
                return;
            }

            try {
                formData.balance = Math.floor(formData.balance * 100);

                const resp = await updateUserInfo(formData);
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
        });
    }

    function getSubUserFormItem () {
        if (currentUserType === UserType.Enterprise) {
            return (
                <Form.Item label="子账户ID">
                    {getFieldDecorator('subUser', {
                        initialValue: fullUserInfo && fullUserInfo.subUser
                    })(
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

    function getIDFormItem () {
        switch (currentUserType) {
            case UserType.Common: {
                return (
                    <Form.Item label="身份证号">
                        {getFieldDecorator('username', {
                            initialValue: fullUserInfo && fullUserInfo.username,
                            rules: [
                                { required: true, message: '请输入身份证号码' },
                                {
                                    validator(rule, value, callback) {
                                        if (!value || idNoChecker(value)) {
                                            callback();
                                        }
                                        callback('身份证号码不合法，请检查您的输入是否正确');
                                    }
                                }
                            ]
                        })(<Input placeholder="公民身份证号码" />)}
                    </Form.Item>
                );
            }
            case UserType.Enterprise: {
                return (
                    <Form.Item label="统一社会信用代码">
                        {getFieldDecorator('username', {
                            initialValue: fullUserInfo && fullUserInfo.username,
                            rules: [ { required: true, message: '请输入统一社会信用代码' } ]
                        })(<Input placeholder="企业统一社会信用代码" />)}
                    </Form.Item>
                );
            }
            default:
                return (
                    <Form.Item label="用户名">
                        {getFieldDecorator('username', {
                            initialValue: fullUserInfo && fullUserInfo.username,
                            rules: [ { required: true, message: '请输入用户名' } ]
                        })(<Input placeholder="企业用户名" />)}
                    </Form.Item>
                );
        }
    }

    function getNameFormItem () {
        switch (currentUserType) {
            case UserType.Common: {
                return (
                    <Form.Item label="姓名">
                        {getFieldDecorator('name', {
                            initialValue: fullUserInfo && fullUserInfo.name,
                            rules: [
                                { required: true, message: '请输入姓名' },
                                {
                                    validator(rule, value, callback) {
                                        if (!value || /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(value)) {
                                            callback();
                                        }
                                        callback('姓名不合法，请检查您的输入是否正确');
                                    }
                                }
                            ]
                        })(<Input placeholder="公民姓名" />)}
                    </Form.Item>
                );
            }
            case UserType.Enterprise: {
                return (
                    <Form.Item label="企业名称">
                        {getFieldDecorator('name', {
                            initialValue: fullUserInfo && fullUserInfo.name,
                            rules: [ { required: true, message: '请输入企业名称' } ]
                        })(<Input placeholder="企业注册名称" />)}
                    </Form.Item>
                );
            }
            default:
                return (
                    <Form.Item label="用户名称">
                        {getFieldDecorator('name', {
                            initialValue: fullUserInfo && fullUserInfo.name,
                            rules: [ { required: true, message: '请输入用户名称' } ]
                        })(<Input placeholder="用户名称" />)}
                    </Form.Item>
                );
        }
    }

    function getEmployeeIDFormItem () {
        if (currentUserType === UserType.Common && currentPersonType === PersonType.Employees) {
            return (
                <Form.Item label="工号">
                    {getFieldDecorator('employeeID', {
                        initialValue: fullUserInfo && fullUserInfo.employeeID,
                        rules: [ { required: true, message: '请输入工号' } ]
                    })(<Input placeholder="所在企业工号" />)}
                </Form.Item>
            );
        }
        return null;
    }

    function getInitialAmountFormItem () {
        if (currentUserType === UserType.Common) {
            return (
                <Form.Item label="账户余额（元/人名币）">
                    {getFieldDecorator('balance', {
                        initialValue: moneyToHumanReadable(fullUserInfo && fullUserInfo.balance),
                        rules: [ { required: true, message: '账户余额不能为空' } ]
                    })(<InputNumber disabled={true} placeholder="非转入账户请填写0" style={{ width: '100%' }} />)}
                </Form.Item>
            );
        }
        return null;
    }

    function getPersonalTypeFormItem () {
        if (currentUserType === UserType.Common) {
            return (
                <Form.Item label="个人账户类型">
                    {getFieldDecorator('personType', {
                        initialValue: fullUserInfo && fullUserInfo.personType,
                        rules: [ { required: true, message: '请选择个人账户类型' } ]
                    })(
                        <RadioGroup>
                            <Radio value={PersonType.Employees}>企业职员</Radio>
                            <Radio value={PersonType.IndividualBusiness}>个体工商户 / 自由职业者</Radio>
                        </RadioGroup>
                    )}
                </Form.Item>
            );
        }
        return null;
    }

    function getEnterpriseIDFormItem () {
        if (currentUserType === UserType.Common && currentPersonType === PersonType.Employees) {
            return (
                <Form.Item label="所在企业唯一标识">
                    {getFieldDecorator('employerID', {
                        initialValue: fullUserInfo && fullUserInfo.employerID,
                        rules: [ { required: true, message: '请输入所在企业唯一标识' } ]
                    })(<Input placeholder="所在企业唯一标识" />)}
                </Form.Item>
            );
        }
        return null;
    }

    function getEnterpriseTypeFormItem () {
        if (currentUserType === UserType.Enterprise) {
            return (
                <Form.Item label="企业类型">
                    {getFieldDecorator('entType', {
                        initialValue: fullUserInfo && fullUserInfo.entType,
                        rules: [ { required: true, message: '请选择企业类型' } ]
                    })(
                        <Select placeholder="请选择">
                            <Option value={EnterpriseType.SOES}>{enterpriseTypeToString(EnterpriseType.SOES)}</Option>
                            <Option value={EnterpriseType.CO}>{enterpriseTypeToString(EnterpriseType.CO)}</Option>
                            <Option value={EnterpriseType.PE}>{enterpriseTypeToString(EnterpriseType.PE)}</Option>
                            <Option value={EnterpriseType.CE}>{enterpriseTypeToString(EnterpriseType.CE)}</Option>
                            <Option value={EnterpriseType.LP}>{enterpriseTypeToString(EnterpriseType.LP)}</Option>
                            <Option value={EnterpriseType.JV}>{enterpriseTypeToString(EnterpriseType.JV)}</Option>
                            <Option value={EnterpriseType.FIE}>{enterpriseTypeToString(EnterpriseType.FIE)}</Option>
                            <Option value={EnterpriseType.SP}>{enterpriseTypeToString(EnterpriseType.SP)}</Option>
                            <Option value={EnterpriseType.HMT}>{enterpriseTypeToString(EnterpriseType.HMT)}</Option>
                            <Option value={EnterpriseType.JSE}>{enterpriseTypeToString(EnterpriseType.JSE)}</Option>
                        </Select>
                    )}
                </Form.Item>
            );
        }
        return null;
    }

    function getCardNoFormItem () {
        if (currentUserType === UserType.Common || currentUserType === UserType.Enterprise) {
            return (
                <Form.Item label="银行卡号">
                    {getFieldDecorator('cardNo', {
                        initialValue: fullUserInfo && fullUserInfo.cardNo,
                        rules: [
                            { required: true, message: '请输入银行卡号' },
                            {
                                validator(rule, value, callback) {
                                    if (!value) {
                                        callback();
                                    }
                                    if (/^([1-9]{1})(\d{14}|\d{18})$/.test(value)) {
                                        callback();
                                    }
                                    callback('银行卡号不合法，请检查您的输入是否正确');
                                }
                            }
                        ]
                    })(<Input placeholder="请输入银行卡号" />)}
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
            <Card
                title={'账户修改'}
                bodyStyle={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}
            >
                <Form
                    style={{
                        width: '50%',
                        height: '100%',
                        padding: '16px 0'
                    }}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    className="login-form"
                >
                    <Form.Item label="账户唯一标识">
                        {getFieldDecorator('_id', {
                            initialValue: fullUserInfo && fullUserInfo._id,
                            rules: [ { required: true, message: '非法操作，账户唯一标识不能为空' } ]
                        })(<Input disabled={true} />)}
                    </Form.Item>
                    <Form.Item label="账户类型">
                        {getFieldDecorator('type', {
                            initialValue: fullUserInfo && fullUserInfo.type,
                            rules: [ { required: true, message: '请选择账户类型' } ]
                        })(
                            <Select placeholder="请选择" disabled={true}>
                                <Option value={UserType.Admin}>{userTypeToString(UserType.Admin)}</Option>
                                <Option value={UserType.Common}>{userTypeToString(UserType.Common)}</Option>
                                <Option value={UserType.Enterprise}>{userTypeToString(UserType.Enterprise)}</Option>
                                <Option value={UserType.Guest}>{userTypeToString(UserType.Guest)}</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="账户状态">
                        {getFieldDecorator('status', {
                            initialValue: fullUserInfo && fullUserInfo.status,
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
                    {getEnterpriseTypeFormItem()}
                    {getIDFormItem()}
                    {getNameFormItem()}
                    <Form.Item label="密码">
                        {getFieldDecorator('password', {
                            initialValue: fullUserInfo && fullUserInfo.password,
                            rules: [
                                { required: true, message: '请输入密码' },
                                { min: 6, message: '密码长度不能小于6位' },
                                { max: 16, message: '密码长度不能大于16位' }
                            ]
                        })(<Input type="password" placeholder="6 - 16位密码" />)}
                    </Form.Item>
                    {getCardNoFormItem()}
                    {getPersonalTypeFormItem()}
                    {getEnterpriseIDFormItem()}
                    {getEmployeeIDFormItem()}
                    {getInitialAmountFormItem()}
                    {getSubUserFormItem()}
                    <Row type="flex" justify="space-around">
                        <Button type="default" style={buttonStyle}>
                            <Link to="/account/list">取消</Link>
                        </Button>
                        <Button type="primary" style={buttonStyle} onClick={handleUpdateUserInfo}>
                            提交
                        </Button>
                    </Row>
                </Form>
            </Card>
        </div>
    );
}

export default withRouter(Form.create()(AccountModificationForm));
