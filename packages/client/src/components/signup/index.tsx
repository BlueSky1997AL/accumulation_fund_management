import { Result } from 'ant-design-pro';
import { Button, Card, Form, Icon, Input, InputNumber, notification, Radio, Row, Select, Upload } from 'antd';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

const { Option } = Select;
const RadioGroup = Radio.Group;

import './index.less';

import { FormComponentProps } from 'antd/lib/form';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { MsgType } from '~server/app/util/interface/common';
import { FileInfo } from '~server/app/util/interface/file';
import { EnterpriseType, PersonType, UserType } from '~server/app/util/interface/user';

import idNoChecker from '~server/app/util/idNoChecker';
import { uploadFilesToFileInfos } from '~utils/file';
import { enterpriseTypeToString, userTypeToString } from '~utils/user';
import { signup } from './request';

const csrfToken = Cookies.get('csrfToken');

export interface SignUpSubmitData {
    username: string;
    password: string;
    name: string;
    employeeID?: string;
    type: UserType;
    entType?: EnterpriseType;
    personType?: PersonType;
    entID?: string;
    balance: number;
    comments: string;
    accessory: FileInfo[];
}

function SignUpView (props: FormComponentProps) {
    const { getFieldDecorator, validateFields, getFieldValue } = props.form;
    const [ submitted, setSubmitted ] = useState(false);
    const [ currentUserType, setCurrentUserType ] = useState<UserType>();
    const [ currentPersonType, setCurrentPersonType ] = useState<PersonType>();

    useEffect(() => {
        const userType = getFieldValue('type') as UserType;
        const personType = getFieldValue('personType') as PersonType;

        setCurrentUserType(userType);
        setCurrentPersonType(personType);
    });

    function handleSubmit () {
        validateFields(async (errors, formData) => {
            if (errors) {
                console.warn('Warning: Fields validation failed:', errors);
                return;
            }

            const submitData: SignUpSubmitData = {
                username: formData.username,
                password: formData.password,
                name: formData.name,
                employeeID: formData.employeeID,
                type: formData.type,
                entType: formData.entType,
                personType: formData.personType,
                entID: formData.entID,
                balance: formData.balance * 100,
                comments: formData.comments,
                accessory: uploadFilesToFileInfos(formData.accessory)
            };

            try {
                const resp = await signup(submitData);
                if (resp.message !== MsgType.OPT_SUCCESS) {
                    throw new Error(resp.message);
                }
                setSubmitted(true);
            } catch (error) {
                notification.error({
                    message: (error as Error).message
                });
            }
        });
    }

    function normFile (e: UploadChangeParam | UploadFile[]) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    function goToLoginPage () {
        location.href = '/web/login';
    }

    function getIDFormItem () {
        switch (currentUserType) {
            case UserType.Common: {
                return (
                    <Form.Item label="身份证号">
                        {getFieldDecorator('username', {
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
                            rules: [ { required: true, message: '请输入统一社会信用代码' } ]
                        })(<Input placeholder="企业统一社会信用代码" />)}
                    </Form.Item>
                );
            }
            default:
                return null;
        }
    }

    function getNameFormItem () {
        switch (currentUserType) {
            case UserType.Common: {
                return (
                    <Form.Item label="姓名">
                        {getFieldDecorator('name', {
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
                            rules: [ { required: true, message: '请输入企业名称' } ]
                        })(<Input placeholder="企业注册名称" />)}
                    </Form.Item>
                );
            }
            default:
                return null;
        }
    }

    function getEmployeeIDFormItem () {
        if (currentUserType === UserType.Common && currentPersonType === PersonType.Employees) {
            return (
                <Form.Item label="工号">
                    {getFieldDecorator('employeeID', {
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
                <Form.Item label="账户初始额（元/人名币）">
                    {getFieldDecorator('balance', {
                        rules: [ { required: true, message: '账户初始额不能为空' }, { type: 'number', message: '账户初始额必须为数字' } ]
                    })(<InputNumber placeholder="非转入账户请填写0" style={{ width: '100%' }} />)}
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
                        rules: [ { required: true, message: '请选择个人账户类型' } ],
                        initialValue: PersonType.Employees
                    })(
                        <RadioGroup>
                            <Radio value={PersonType.Employees}>企业职员</Radio>
                            <Radio value={PersonType.IndividualBusiness}>个体工商户</Radio>
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
                <Form.Item label="企业统一社会信用代码">
                    {getFieldDecorator('entID', {
                        rules: [ { required: true, message: '请输入统一社会信用代码' } ]
                    })(<Input placeholder="所在企业统一社会信用代码" />)}
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

    function getCardContent () {
        if (submitted) {
            return (
                <Result
                    type="success"
                    title="提交成功"
                    description={
                        <div>
                            <div>工单已提交成功，请耐心等候审核结果</div>
                            <div>审批通过后您即可使用身份证号/统一社会信用代码和密码登陆</div>
                        </div>
                    }
                    actions={
                        <Row>
                            <Button onClick={goToLoginPage}>返回登陆页</Button>
                        </Row>
                    }
                />
            );
        } else {
            return (
                <Form labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} className="form-container">
                    <Form.Item label="账户类型">
                        {getFieldDecorator('type', {
                            rules: [ { required: true, message: '请选择账户类型' } ]
                        })(
                            <Select placeholder="请选择">
                                <Option value={UserType.Common}>{userTypeToString(UserType.Common)}</Option>
                                <Option value={UserType.Enterprise}>{userTypeToString(UserType.Enterprise)}</Option>
                            </Select>
                        )}
                    </Form.Item>
                    {getEnterpriseTypeFormItem()}
                    {getIDFormItem()}
                    {getNameFormItem()}
                    <Form.Item label="密码">
                        {getFieldDecorator('password', {
                            rules: [
                                { required: true, message: '请输入密码' },
                                { min: 6, message: '密码长度不能小于6位' },
                                { max: 16, message: '密码长度不能大于16位' }
                            ]
                        })(<Input type="password" placeholder="6 - 16位密码" />)}
                    </Form.Item>
                    <Form.Item label="确认密码">
                        {getFieldDecorator('passwordConfirm', {
                            rules: [
                                { required: true, message: '请确认您的密码' },
                                {
                                    validator(rule, value, callback) {
                                        if (!value) {
                                            callback();
                                        }
                                        if (getFieldValue('password') !== value) {
                                            callback('两次输入的密码不一致');
                                        }
                                        callback();
                                    }
                                }
                            ]
                        })(<Input type="password" placeholder="确认您的密码" />)}
                    </Form.Item>
                    {getPersonalTypeFormItem()}
                    {getEnterpriseIDFormItem()}
                    {getEmployeeIDFormItem()}
                    {getInitialAmountFormItem()}
                    <Form.Item label="申请备注">
                        {getFieldDecorator('comments', {
                            rules: [ { required: true, message: '请填写申请备注' } ]
                        })(<Input.TextArea placeholder="输入附加信息" autosize={{ minRows: 4 }} />)}
                    </Form.Item>
                    <Form.Item label="相关材料">
                        {getFieldDecorator('accessory', {
                            valuePropName: 'fileList',
                            getValueFromEvent: normFile,
                            rules: [ { required: true, message: '请上传相关材料' } ]
                        })(
                            <Upload action={`/api/file/upload?_csrf=${csrfToken}`}>
                                <Button>
                                    <Icon type="upload" /> 上传
                                </Button>
                            </Upload>
                        )}
                    </Form.Item>
                    <Row type="flex" justify="space-around">
                        <Button type="default" style={buttonStyle} onClick={goToLoginPage}>
                            取消
                        </Button>
                        <Button type="primary" style={buttonStyle} onClick={handleSubmit}>
                            提交
                        </Button>
                    </Row>
                </Form>
            );
        }
    }

    const buttonStyle: React.CSSProperties = {
        width: 150
    };

    return (
        <div className="signup-container">
            <Card
                className="signup-card"
                title="账户创建申请"
                style={{ width: 768 }}
                bodyStyle={{ height: '100%', width: '100%' }}
            >
                {getCardContent()}
            </Card>
        </div>
    );
}

export default Form.create()(SignUpView);
