import { Button, Form, Icon, Input, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';

import AmountMapInput, { AmountMap } from './amountMapInput';

export interface EnterpriseFundBackSubmitData {
    amountMap: AmountMap[];
    comments?: string;
}

interface EnterpriseFundBackFormProps extends FormComponentProps {
    onSubmit: (data: EnterpriseFundBackSubmitData) => void;
}

let id = 1;

function FundBackForm (props: EnterpriseFundBackFormProps) {
    const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } = props.form;

    function onSubmit () {
        validateFields(async (errors, formData: EnterpriseFundBackSubmitData) => {
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

    function remove (k: number) {
        const currentKeys = getFieldValue('keys') as number[];
        if (currentKeys.length === 1) {
            return;
        }

        setFieldsValue({
            keys: currentKeys.filter(key => key !== k)
        });
    }

    function add () {
        const currentKeys = getFieldValue('keys') as number[];
        const nextKeys = currentKeys.concat(id++);
        setFieldsValue({
            keys: nextKeys
        });
    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 }
        }
    };
    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 }
        }
    };

    getFieldDecorator('keys', { initialValue: [ 0 ] });

    const keys = getFieldValue('keys') as number[];
    const formItems = keys.map((k, index) => (
        <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? '员工信息' : ''}
            required={true}
            key={k}
        >
            {getFieldDecorator(`amountMap[${k}]`, {
                rules: [
                    {
                        validator: (rule, value: AmountMap, callback) => {
                            if (!value || !value.usernames.length) {
                                callback('请输入员工用户名或删除该条目');
                                return;
                            }
                            if (!value.amount) {
                                callback('请输入金额');
                                return;
                            }
                            callback();
                        }
                    }
                ]
            })(<AmountMapInput />)}
            {keys.length > 1 ? (
                <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => remove(k)} />
            ) : null}
        </Form.Item>
    ));

    return (
        <Form
            style={{
                width: '70%',
                height: '100%',
                padding: '16px 0'
            }}
        >
            {formItems}
            <Form.Item {...formItemLayoutWithOutLabel}>
                <Button type="dashed" onClick={add} style={{ width: '100%' }}>
                    <Icon type="plus" /> 添加员工信息
                </Button>
            </Form.Item>
            <Form.Item {...formItemLayout} label="备注">
                {getFieldDecorator('comments', {
                    rules: []
                })(<Input.TextArea autosize={true} />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="相关材料">
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
            <Form.Item {...formItemLayoutWithOutLabel}>
                <Button type="primary" style={{ width: '100%' }} onClick={onSubmit}>
                    提交
                </Button>
            </Form.Item>
        </Form>
    );
}

export default Form.create()(FundBackForm);
