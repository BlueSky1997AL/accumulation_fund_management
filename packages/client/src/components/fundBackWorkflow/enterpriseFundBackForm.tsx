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

export interface EnterpriseFundBackSubmitData {
    month: string;
    amountMap: AmountInfo[];
    comments?: string;
    accessory?: FileInfo[];
}

interface EnterpriseFundBackFormProps extends FormComponentProps {
    onSubmit: (data: EnterpriseFundBackSubmitData) => void;
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

function FundBackForm (props: EnterpriseFundBackFormProps) {
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

            const submitData: EnterpriseFundBackSubmitData = {
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
                <Panel header="补缴说明" key="instruction" style={customPanelStyle}>
                    <p>
                        <b>补缴条件</b>
                    </p>
                    <p className="first-line-indent">当单位发生集体缴存以前年度缓缴公积金及应缴未缴的公积金、职工个人漏缴公积金等情况时，需通过补缴方式完成。</p>
                    <p>
                        <b>补缴手续</b>
                    </p>
                    <p className="first-line-indent">1、单位填写公积金管理中心统一印制的《公积金补缴书》。</p>
                    <p className="first-line-indent">2、单位填写管理中心统一印制的《公积金补缴清册》一式两份，加盖单位印章。</p>
                    <p className="first-line-indent">3、补缴原因需另附说明的，报补缴说明一份，加盖单位公章。</p>
                    <p>
                        <b>补缴办理</b>
                    </p>
                    <p className="first-line-indent">
                        1、单位填制公积金管理中心统一印制的《公积金补缴书》、《公积金补缴清册》及与《公积金补缴书》金额一致的转账支票，到管理部办理补缴手续。对于未在《公积金补缴清册》中列明补缴原因的，还应报补缴说明一份。
                    </p>
                    <p className="first-line-indent">
                        2、管理部接柜人员对《公积金补缴书》、《公积金补缴清册》及转账支票进行审核，补缴确认后，接柜人员打印《公积金补缴书》一式两份，盖章后一份退单位经办人，一份留存。
                    </p>
                    <i>请将上述材料以附件的形式上传至系统并填写相关表单及备注</i>
                </Panel>
            </Collapse>
            <Divider orientation="left">信息填写</Divider>
            <Form>
                <Form.Item {...formItemLayout} label="补缴月份">
                    {getFieldDecorator('month', {
                        rules: [ { required: true, message: '请选择补缴月份' } ]
                    })(<MonthPicker placeholder="选择补缴月份" />)}
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

export default Form.create()(FundBackForm);
