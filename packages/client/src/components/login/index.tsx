import { Button, Card, Form, Icon, Input, notification, Row } from 'antd';
import React from 'react';

import './index.less';

import { FormComponentProps } from 'antd/lib/form';

import { MsgType } from '~server/app/util/interface/common';
import { login } from './request';

function LoginView (props: FormComponentProps) {
    const { getFieldDecorator, validateFields } = props.form;

    function onSubmit () {
        validateFields(async (errors, formData) => {
            if (errors) {
                console.warn('Warning: Fields validation failed:', errors);
                return;
            }

            try {
                const resp = await login(formData.username, formData.password);
                if (resp.message !== MsgType.LOGIN_SUCCESS) {
                    throw new Error(resp.message);
                }
                setTimeout(() => {
                    location.href = '/web/account/info';
                }, 300);
            } catch (error) {
                notification.error({
                    message: (error as Error).message
                });
            }
        });
    }

    return (
        <div className="login-container">
            <Card
                className="login-card"
                title={
                    <div>
                        <Icon type="home" style={{ marginRight: 8 }} />
                        <span>住房公积金管理系统 - 登陆</span>
                    </div>
                }
                style={{ width: 350 }}
                bodyStyle={{ height: '100%', width: '100%' }}
            >
                <Form
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    className="login-form"
                >
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [ { required: true, message: '请输入身份证号码/统一社会信用代码' } ]
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="身份证号码/统一社会信用代码"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [ { required: true, message: '请输入密码' } ]
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                                onPressEnter={onSubmit}
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" className="login-form-button" onClick={onSubmit}>
                            登陆
                        </Button>
                    </Form.Item>
                    <Row type="flex" justify="end" align="middle">
                        <a href="/signup">账户申请</a>
                    </Row>
                </Form>
            </Card>
        </div>
    );
}

export default Form.create()(LoginView);
