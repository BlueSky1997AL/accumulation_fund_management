import { Button, Form, Icon, Input, InputNumber, Radio, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

const RadioGroup = Radio.Group;

import { FileInfo } from '~server/app/util/interface/file';
import { EnterpriseType, UserStatus } from '~server/app/util/interface/user';
import { uploadFilesToFileInfos } from '~utils/file';

export enum DrawType {
    Partial,
    Cancellation
}

export interface PersonalFundDrawSubmitData {
    type: DrawType;
    amount: number;
    comments?: string;
    accessory?: FileInfo[];
    entInfo?: {
        username: string;
        name: string;
        cardNo: string;
        entType: EnterpriseType;
        status: UserStatus;
    };
}

interface PersonalFundDrawFormProps extends FormComponentProps {
    onSubmit: (data: PersonalFundDrawSubmitData) => void;
}

const csrfToken = Cookies.get('csrfToken');

function PersonalFundDrawForm (props: PersonalFundDrawFormProps) {
    const { getFieldDecorator, validateFields, getFieldValue } = props.form;

    const [ showAmountInput, setAmountInputShowStatus ] = useState(true);

    useEffect(() => {
        const drawType = getFieldValue('type');

        if (drawType === DrawType.Cancellation) {
            setAmountInputShowStatus(false);
        } else {
            setAmountInputShowStatus(true);
        }
    });

    function onSubmit () {
        validateFields(async (errors, formData) => {
            if (errors) {
                console.warn('Warning: Fields validation failed:', errors);
                return;
            }

            const submitData: PersonalFundDrawSubmitData = {
                type: formData.type,
                amount: formData.amount * 100,
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

    function getAmountInputFormItem () {
        if (showAmountInput) {
            return (
                <Form.Item label="支取金额（元/人民币）">
                    {getFieldDecorator('amount', {
                        rules: [ { required: true, message: '请输入支取金额' }, { type: 'number', message: '支取金额应为数值' } ]
                    })(<InputNumber style={{ width: '100%' }} />)}
                </Form.Item>
            );
        }
        return null;
    }

    return (
        <Form
            style={{
                width: '50%',
                height: '100%',
                padding: '16px 0'
            }}
        >
            <Form.Item label="支取类型">
                {getFieldDecorator('type', {
                    rules: [ { required: true, message: '请选择个人账户类型' } ],
                    initialValue: DrawType.Partial
                })(
                    <RadioGroup>
                        <Radio value={DrawType.Partial}>部分提取</Radio>
                        <Radio value={DrawType.Cancellation}>销户提取</Radio>
                    </RadioGroup>
                )}
            </Form.Item>
            {getAmountInputFormItem()}
            <Form.Item label="备注">
                {getFieldDecorator('comments', {
                    rules: [ { required: true, message: '请填写申请备注' } ]
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

export default Form.create()(PersonalFundDrawForm);
