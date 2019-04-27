import { Button, Collapse, DatePicker, Divider, Form, Icon, Input, Tooltip, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import Cookies from 'js-cookie';
import { Moment } from 'moment';
import React from 'react';
import { FileInfo } from '~server/app/util/interface/file';

const { MonthPicker } = DatePicker;
const { Panel } = Collapse;

import { uploadFilesToFileInfos } from '~utils/file';

import AmountMapInput, { AmountMap } from './amountMapInput';

export interface AmountInfo {
    username: string;
    amount: number;
}

export interface EnterpriseFundRemitSubmitData {
    month: string;
    amountMap: AmountInfo[];
    comments?: string;
    accessory?: FileInfo[];
}

interface EnterpriseFundRemitFormProps extends FormComponentProps {
    onSubmit: (data: EnterpriseFundRemitSubmitData) => void;
}

let id = 1;

const csrfToken = Cookies.get('csrfToken');

const customPanelStyle = {
    background: '#f1f1f1',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden'
};

function FundRemitForm (props: EnterpriseFundRemitFormProps) {
    const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } = props.form;

    function onSubmit () {
        validateFields(async (errors, formData) => {
            if (errors) {
                console.warn('Warning: Fields validation failed:', errors);
                return;
            }

            const amountMap: AmountInfo[] = [];
            formData.amountMap.map((item: AmountMap) => {
                item.usernames.map(username => {
                    amountMap.push({
                        username,
                        amount: Math.round(item.amount * 100)
                    });
                });
            });

            const submitData: EnterpriseFundRemitSubmitData = {
                month: (formData.month as Moment).toISOString(),
                amountMap,
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
                                callback('请输入员工身份证号或删除该条目');
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
        <div
            style={{
                width: '70%',
                height: '100%',
                padding: '16px 0'
            }}
        >
            <Collapse
                bordered={false}
                defaultActiveKey={[ 'instruction' ]}
                expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
            >
                <Panel header="汇缴说明" key="instruction" style={customPanelStyle}>
                    <p className="first-line-indent">
                        公积金缴存是由职工个人公积金缴存和职工所在单位为职工公积金缴存的公积金两部分构成，属于职工个人所有。个人公积金缴存的月缴存额为职工本人上一年度月平均工资乘以职工的公积金缴存比例；单位为职工缴存的公积金的月缴存额为职工本人上一年度月平均工资乘以单位公积金缴存比例。
                    </p>
                    <p>
                        <b>办理要件：</b>
                    </p>
                    <p className="first-line-indent">1、单位住房公积金缴存登记表；</p>
                    <p className="first-line-indent">2、批准设立单位的文件原件及复印件，企业营业执照副本原件及复印件，机构代码证原件及复印件。</p>
                    <i>请将上述材料以附件的形式上传至系统并填写相关表单及备注</i>
                </Panel>
            </Collapse>
            <Divider orientation="left">信息填写</Divider>
            <Form>
                <Form.Item {...formItemLayout} label="缴存月份">
                    {getFieldDecorator('month', {
                        rules: [ { required: true, message: '请选择缴存月份' } ]
                    })(<MonthPicker placeholder="选择缴存月份" />)}
                </Form.Item>
                {formItems}
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={add} style={{ width: '100%' }}>
                        <Icon type="plus" /> 添加员工信息
                    </Button>
                </Form.Item>
                <Form.Item {...formItemLayout} label="备注">
                    {getFieldDecorator('comments', {
                        rules: [ { required: true, message: '请输入相关备注内容' } ]
                    })(<Input.TextArea autosize={true} />)}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label={
                        <Tooltip
                            title={
                                <div>
                                    <div>单个文件大小 ≤ 4MB</div>
                                    <div>
                                        支持的格式：.jpg / .jpeg / .png / .gif / .bmp / .wbmp / .webp / .tif / .psd / .svg /
                                        .js / .jsx / .json / .css / .less / .html / .htm / .xml / .zip / .gz / .tgz /
                                        .gzip / .mp3 / .mp4 / .avi / .rar / .iso / .doc / .docx / .ppt / .pptx / .xls /
                                        .xlsx / .wps / .txt / .pdf
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
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="primary" style={{ width: '100%' }} onClick={onSubmit}>
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Form.create()(FundRemitForm);
