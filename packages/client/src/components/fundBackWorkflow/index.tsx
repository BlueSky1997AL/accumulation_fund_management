import { Button, Card, Form, Icon, Input, notification, Steps } from 'antd';
import React, { useEffect, useState } from 'react';

const { Step } = Steps;

import './index.less';

import { FormComponentProps } from 'antd/lib/form';

import WorkflowFrame from '~components/workflowFrame';

import { WorkOrder, WorkOrderStatus, WorkOrderType } from '~server/app/util/interface/workOrder';

// import { MsgType } from '~server/app/util/interface/common';
// import { login } from './request';

function FundBackWorkflow (props: FormComponentProps) {
    // const { getFieldDecorator, validateFields } = props.form;

    // function onSubmit () {
    //     validateFields(async (errors, formData) => {
    //         if (errors) {
    //             console.warn('Warning: Fields validation failed:', errors);
    //             return;
    //         }

    //         try {
    //             const resp = await login(formData.username, formData.password);
    //             if (resp.message !== MsgType.LOGIN_SUCCESS) {
    //                 throw new Error(resp.message);
    //             }
    //             setTimeout(() => {
    //                 location.href = '/web';
    //             }, 300);
    //         } catch (error) {
    //             notification.error({
    //                 message: (error as Error).message
    //             });
    //         }
    //     });
    // }

    return (
        <div className="fund-back-workflow-container">
            <Card title="新建补缴工单" bodyStyle={{ height: '100%', width: '100%' }}>
                <WorkflowFrame />
                {/* <Form
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
                                onPressEnter={onSubmit}
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" className="login-form-button" onClick={onSubmit}>
                            登陆
                        </Button>
                    </Form.Item>
                </Form> */}
            </Card>
        </div>
    );
}

export default Form.create()(FundBackWorkflow);
