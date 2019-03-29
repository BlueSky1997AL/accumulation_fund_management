import { Button, Form, Icon, Input, InputNumber, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';

import './index.less';

interface FundBackSubmitData {
    amount: number;
    comments?: string;
}

interface FundBackFormProps extends FormComponentProps {
    onSubmit: (data: FundBackSubmitData) => void;
}

function FundBackForm (props: FundBackFormProps) {
    const { getFieldDecorator, validateFields } = props.form;

    function onSubmit () {
        validateFields(async (errors, formData: FundBackSubmitData) => {
            if (errors) {
                console.warn('Warning: Fields validation failed:', errors);
                return;
            }

            props.onSubmit(formData);
        });
    }

    function normFile (e: any) {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    return (
        <Form
            style={{
                width: '50%',
                height: '100%',
                padding: '16px 0'
            }}
            className="login-form"
        >
            <Form.Item label="补缴金额">
                {getFieldDecorator('amount', {
                    rules: [ { required: true, message: '请输入补缴金额' }, { type: 'number', message: '补缴金额应为数值' } ]
                })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item label="备注">
                {getFieldDecorator('comments', {
                    rules: []
                })(<Input.TextArea autosize={true} />)}
            </Form.Item>
            <Form.Item label="相关材料">
                {getFieldDecorator('data', {
                    valuePropName: 'fileList',
                    getValueFromEvent: normFile
                })(
                    <Upload action="">
                        <Button>
                            <Icon type="upload" /> 上传
                        </Button>
                    </Upload>
                )}
            </Form.Item>
            <Form.Item>
                <Button type="primary" style={{ width: '100%' }} onClick={onSubmit}>
                    提交
                </Button>
            </Form.Item>
        </Form>
    );
}

export default Form.create()(FundBackForm);
