import { Button, Form, Icon, Input, Select, Tooltip, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import Cookies from 'js-cookie';
import React from 'react';

import { FileInfo } from '~server/app/util/interface/file';
import { uploadFilesToFileInfos } from '~utils/file';

export interface EnterpriseSubUserAddSubmitData {
    usernames: string[];
    employeeIDs: string[];
    comments?: string;
    accessory?: FileInfo[];
}

interface EnterpriseSubUserAddFormProps extends FormComponentProps {
    onSubmit: (data: EnterpriseSubUserAddSubmitData) => void;
}

const csrfToken = Cookies.get('csrfToken');

function EnterpriseSubUserAddForm (props: EnterpriseSubUserAddFormProps) {
    const { getFieldDecorator, validateFields, getFieldValue } = props.form;

    function onSubmit () {
        validateFields(async (errors, formData) => {
            if (errors) {
                console.warn('Warning: Fields validation failed:', errors);
                return;
            }

            const submitData: EnterpriseSubUserAddSubmitData = {
                usernames: formData.usernames,
                employeeIDs: formData.employeeIDs,
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
            <Form.Item label="对应员工新工号">
                {getFieldDecorator('employeeIDs', {
                    rules: [
                        { required: true, message: '请输入对应员工新工号' },
                        {
                            validator(rule, value: string[], callback) {
                                const usernames = getFieldValue('usernames') as string[];
                                if (!value.length) {
                                    callback();
                                    return;
                                }
                                if (usernames.length !== value.length) {
                                    callback('身份证号与员工新工号需要对应，请检查填写的信息');
                                    return;
                                }
                                callback();
                            }
                        }
                    ]
                })(
                    <Select
                        mode="tags"
                        open={false}
                        allowClear={true}
                        tokenSeparators={[ ',', '，', ' ' ]}
                        placeholder="输入对应员工新工号，多个号码请使用逗号或空格分割"
                    />
                )}
            </Form.Item>
            <Form.Item label="备注">
                {getFieldDecorator('comments', {
                    rules: [ { required: true, message: '请填写申请备注' } ]
                })(<Input.TextArea autosize={true} />)}
            </Form.Item>
            <Form.Item
                label={
                    <Tooltip
                        title={
                            <div>
                                <div>单个文件大小 ≤ 4MB</div>
                                <div>
                                    支持的格式：.jpg / .jpeg / .png / .gif / .bmp / .wbmp / .webp / .tif / .psd / .svg / .js /
                                    .jsx / .json / .css / .less / .html / .htm / .xml / .zip / .gz / .tgz / .gzip / .mp3
                                    / .mp4 / .avi / .rar / .iso / .doc / .docx / .ppt / .pptx / .xls / .xlsx / .wps /
                                    .txt / .pdf
                                </div>
                            </div>
                        }
                    >
                        相关材料 <Icon style={{ color: 'rgba(0, 0, 0, 0.35)' }} type="info-circle" />
                    </Tooltip>
                }
            >
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
