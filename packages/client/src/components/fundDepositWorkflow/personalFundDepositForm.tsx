import { Button, DatePicker, Form, Icon, Input, InputNumber, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

const { MonthPicker } = DatePicker;

import { FileInfo } from '~server/app/util/interface/file';
import { uploadFilesToFileInfos } from '~utils/file';
import { moneyToHumanReadable } from '~utils/user';

export interface PersonalFundDepositSubmitData {
    month: string;
    amount: number;
    comments?: string;
    accessory?: FileInfo[];
}

interface PersonalFundDepositFormProps extends FormComponentProps {
    onSubmit: (data: PersonalFundDepositSubmitData) => void;
}

const csrfToken = Cookies.get('csrfToken');

function PersonalFundDepositForm (props: PersonalFundDepositFormProps) {
    const { getFieldDecorator, validateFields, getFieldValue } = props.form;
    const [ amount, setAmount ] = useState<number | undefined>();

    useEffect(() => {
        const baseAmount = getFieldValue('baseAmount');
        const ratio = getFieldValue('ratio');

        if (baseAmount && ratio && ratio >= 5 && ratio <= 12) {
            const newAmount = Math.round(baseAmount * ratio * 2);
            if (newAmount > 609600) {
                setAmount(609600);
            } else {
                setAmount(newAmount);
            }
        }
    });

    function onSubmit () {
        validateFields(async (errors, formData) => {
            if (errors) {
                console.warn('Warning: Fields validation failed:', errors);
                return;
            }

            const submitData: PersonalFundDepositSubmitData = {
                month: formData.month,
                amount: amount!,
                comments: formData.comments,
                accessory: uploadFilesToFileInfos(formData.accessory)
            };

            props.onSubmit(submitData);
        });
    }

    function normFile (e: UploadChangeParam | UploadFile[]) {
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
            <Form.Item label="缴存月份">
                {getFieldDecorator('month', {
                    rules: [ { required: true, message: '请选择缴存月份' } ]
                })(<MonthPicker placeholder="选择缴存月份" />)}
            </Form.Item>
            <Form.Item label="缴存基数（元/人民币）">
                {getFieldDecorator('baseAmount', {
                    rules: [ { required: true, message: '请输入缴存基数' }, { type: 'number', message: '缴存基数应为数值' } ]
                })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item label="缴存比例（元/人民币）">
                {getFieldDecorator('ratio', {
                    rules: [ { required: true, message: '请输入缴存金额' }, { type: 'number', message: '缴存金额应为数值' } ]
                })(<InputNumber max={12} min={5} style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item label="应缴额（元/人民币）">
                <Input
                    value={moneyToHumanReadable(amount)}
                    disabled={true}
                    max={12}
                    min={5}
                    style={{ width: '100%' }}
                />
            </Form.Item>
            <Form.Item label="备注">
                {getFieldDecorator('comments', {
                    rules: [ { required: true, message: '请输入相关备注内容' } ]
                })(<Input.TextArea autosize={true} />)}
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
            <Form.Item>
                <Button type="primary" style={{ width: '100%' }} onClick={onSubmit}>
                    提交
                </Button>
            </Form.Item>
        </Form>
    );
}

export default Form.create()(PersonalFundDepositForm);
