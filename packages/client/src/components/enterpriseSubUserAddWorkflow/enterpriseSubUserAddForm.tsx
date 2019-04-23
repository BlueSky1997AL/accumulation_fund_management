import { Button, Form, Icon, Input, Select, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import Cookies from 'js-cookie';
import React from 'react';

import { FileInfo } from '~server/app/util/interface/file';
import { uploadFilesToFileInfos } from '~utils/file';

export interface EnterpriseSubUserAddSubmitData {
    usernames: string[];
    comments?: string;
    accessory?: FileInfo[];
}

interface EnterpriseSubUserAddFormProps extends FormComponentProps {
    onSubmit: (data: EnterpriseSubUserAddSubmitData) => void;
}

const csrfToken = Cookies.get('csrfToken');

function EnterpriseSubUserAddForm (props: EnterpriseSubUserAddFormProps) {
    const { getFieldDecorator, validateFields } = props.form;

    function onSubmit () {
        validateFields(async (errors, formData) => {
            if (errors) {
                console.warn('Warning: Fields validation failed:', errors);
                return;
            }

            const submitData: EnterpriseSubUserAddSubmitData = {
                usernames: formData.usernames,
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
            <Form.Item label="员工身份证号">
                {getFieldDecorator('usernames', {
                    rules: [ { required: true, message: '请输入员工身份证号码' } ]
                })(
                    <Select
                        mode="tags"
                        open={false}
                        allowClear={true}
                        tokenSeparators={[ ',', '，', ' ' ]}
                        placeholder="输入员工身份证号，多个号码请使用逗号或空格分割"
                    />
                )}
            </Form.Item>
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

export default Form.create()(EnterpriseSubUserAddForm);
