import { Button, Form, Icon, Input, InputNumber, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import Cookies from 'js-cookie';
import React from 'react';

import { FileInfo } from '~server/app/util/interface/file';
import { uploadFilesToFileInfos } from '~utils/file';

export interface PersonalFundDrawSubmitData {
    amount: number;
    comments?: string;
    accessory?: FileInfo[];
}

interface PersonalFundBackFormProps extends FormComponentProps {
    onSubmit: (data: PersonalFundDrawSubmitData) => void;
}

const csrfToken = Cookies.get('csrfToken');

function PersonalFundBackForm (props: PersonalFundBackFormProps) {
    const { getFieldDecorator, validateFields } = props.form;

    function onSubmit () {
        validateFields(async (errors, formData) => {
            if (errors) {
                console.warn('Warning: Fields validation failed:', errors);
                return;
            }

            const submitData: PersonalFundDrawSubmitData = {
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

    return (
        <Form
            style={{
                width: '50%',
                height: '100%',
                padding: '16px 0'
            }}
            className="login-form"
        >
            <Form.Item label="支取金额（元/人民币）">
                {getFieldDecorator('amount', {
                    rules: [ { required: true, message: '请输入支取金额' }, { type: 'number', message: '支取金额应为数值' } ]
                })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item label="备注">
                {getFieldDecorator('comments', {
                    rules: []
                })(<Input.TextArea autosize={true} />)}
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
            <Form.Item>
                <Button type="primary" style={{ width: '100%' }} onClick={onSubmit}>
                    提交
                </Button>
            </Form.Item>
        </Form>
    );
}

export default Form.create()(PersonalFundBackForm);
