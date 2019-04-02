import { Button, Card, Form, Icon, Input, notification, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import { FormComponentProps } from 'antd/lib/form';

import { MsgType } from '~server/app/util/interface/common';
import { updatePassword } from './request';

export interface PasswordModificationSubmitData {
    oldPassword: string;
    newPassword: string;
}

function PasswordModification (props: FormComponentProps) {
    const { getFieldDecorator, validateFields, getFieldValue, getFieldsValue } = props.form;

    function handleSubmit () {
        validateFields(async errors => {
            if (errors) {
                console.warn('Warning: Fields validation failed:', errors);
                return;
            }

            const submitData = getFieldsValue([ 'oldPassword', 'newPassword' ]) as PasswordModificationSubmitData;

            try {
                const resp = await updatePassword(submitData);
                if (resp.message !== MsgType.OPT_SUCCESS) {
                    throw new Error(resp.message);
                }
                alert('密码已修改，请重新登陆');
                location.href = '/login';
            } catch (error) {
                notification.error({
                    message: (error as Error).message
                });
            }
        });
    }

    const buttonStyle: React.CSSProperties = {
        width: 150
    };

    return (
        <Card title="修改密码" bodyStyle={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Form
                style={{
                    width: '50%',
                    height: '100%',
                    padding: '16px 0'
                }}
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 12 }}
            >
                <Form.Item label="原密码">
                    {getFieldDecorator('oldPassword', {
                        rules: [ { required: true, message: '请输入原密码' } ]
                    })(<Input type="password" />)}
                </Form.Item>
                <Form.Item label="新密码">
                    {getFieldDecorator('newPassword', {
                        rules: [ { required: true, message: '请输入新密码' } ]
                    })(<Input type="password" />)}
                </Form.Item>
                <Form.Item label="确认密码">
                    {getFieldDecorator('confirmPassword', {
                        rules: [
                            { required: true, message: '请输入新密码' },
                            {
                                validator(rule, value, callback) {
                                    if (!value) {
                                        callback();
                                    }
                                    if (getFieldValue('newPassword') !== value) {
                                        callback('两次输入的密码不一致');
                                    }
                                    callback();
                                }
                            }
                        ]
                    })(<Input type="password" onPressEnter={handleSubmit} />)}
                </Form.Item>
                <Row type="flex" justify="space-around">
                    <Button type="default" style={buttonStyle}>
                        <Link to="/account/info">取消</Link>
                    </Button>
                    <Button type="primary" style={buttonStyle} onClick={handleSubmit}>
                        提交
                    </Button>
                </Row>
            </Form>
        </Card>
    );
}

export default Form.create()(PasswordModification);
