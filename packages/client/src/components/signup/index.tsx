import { Result } from 'ant-design-pro';
import { Button, Card, Form, Icon, Input, InputNumber, notification, Row, Select, Upload } from 'antd';
import Cookies from 'js-cookie';
import React, { useState } from 'react';

const { Option } = Select;

import './index.less';

import { FormComponentProps } from 'antd/lib/form';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { MsgType } from '~server/app/util/interface/common';
import { FileInfo } from '~server/app/util/interface/file';
import { UserType } from '~server/app/util/interface/user';

import { uploadFilesToFileInfos } from '~utils/file';
import { userTypeToString } from '~utils/user';
import { signup } from './request';

const csrfToken = Cookies.get('csrfToken');

export interface SignUpSubmitData {
    username: string;
    password: string;
    type: UserType;
    balance: number;
    comments: string;
    accessory: FileInfo[];
}

function SignUpView (props: FormComponentProps) {
    const { getFieldDecorator, validateFields, getFieldValue } = props.form;
    const [ submitted, setSubmitted ] = useState(false);

    function handleSubmit () {
        validateFields(async (errors, formData) => {
            if (errors) {
                console.warn('Warning: Fields validation failed:', errors);
                return;
            }

            const submitData: SignUpSubmitData = {
                username: formData.username,
                password: formData.password,
                type: formData.type,
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

    function getCardContent () {
        if (submitted) {
            return (
                <Result
                    type="success"
                    title="提交成功"
                    description={
                        <div>
                            <div>工单已提交成功，请耐心等候审核结果</div>
                            <div>审批通过后您即可使用该用户名和密码登陆</div>
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
                    <Form.Item label="用户名">
                        {getFieldDecorator('username', {
                            rules: [ { required: true, message: '请输入用户名' } ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="密码">
                        {getFieldDecorator('password', {
                            rules: [ { required: true, message: '请输入密码' } ]
                        })(<Input type="password" />)}
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
                        })(<Input type="password" />)}
                    </Form.Item>
                    <Form.Item label="账户类型">
                        {getFieldDecorator('type', {
                            rules: [ { required: true, message: '请选择账户类型' } ]
                        })(
                            <Select>
                                <Option value={UserType.Common}>{userTypeToString(UserType.Common)}</Option>
                                <Option value={UserType.Enterprise}>{userTypeToString(UserType.Enterprise)}</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="账户初始额（元/人名币）">
                        {getFieldDecorator('balance', {
                            rules: [
                                { required: true, message: '账户初始额不能为空' },
                                { type: 'number', message: '账户初始额必须为数字' }
                            ]
                        })(<InputNumber style={{ width: '100%' }} />)}
                    </Form.Item>
                    <Form.Item label="申请备注">
                        {getFieldDecorator('comments', {
                            rules: []
                        })(<Input.TextArea autosize={{ minRows: 4 }} />)}
                    </Form.Item>
                    <Form.Item label="相关材料">
                        {getFieldDecorator('accessory', {
                            valuePropName: 'fileList',
                            getValueFromEvent: normFile
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
            <Card title="账户创建申请" style={{ width: 768 }} bodyStyle={{ height: '100%', width: '100%' }}>
                {getCardContent()}
            </Card>
        </div>
    );
}

export default Form.create()(SignUpView);
