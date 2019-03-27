import { Button, Card, Form, Icon, Input, notification } from 'antd';
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
                location.href = '/web';
            } catch (error) {
                notification.error({
                    message: (error as Error).message
                });
            }
        });
    }

    return (
        <div className="login-container">
            <Card title="登陆" style={{ width: 350, height: 290 }} bodyStyle={{ height: '100%', width: '100%' }}>
                <Form
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    className="login-form"
                >
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [ { required: true, message: '请输入用户名' } ]
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
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
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" className="login-form-button" onClick={onSubmit}>
                            登陆
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default Form.create()(LoginView);