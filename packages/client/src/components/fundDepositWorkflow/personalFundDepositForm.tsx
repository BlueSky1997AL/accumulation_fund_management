import { Button, Collapse, DatePicker, Divider, Form, Icon, Input, InputNumber, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

const { MonthPicker } = DatePicker;
const { Panel } = Collapse;

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

const customPanelStyle = {
    background: '#f1f1f1',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden'
};

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
        <div
            style={{
                width: '50%',
                height: '100%',
                padding: '16px 0'
            }}
        >
            <Collapse
                bordered={false}
                defaultActiveKey={[ 'instruction' ]}
                expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
            >
                <Panel header="缴存说明" key="instruction" style={customPanelStyle}>
                    <p>
                        <b>缴存对象</b>
                    </p>
                    <p className="first-line-indent">具有完全民事行为能力的城镇个体工商户、自由职业人员，女18周岁-55周岁、男18周岁-60周岁。</p>
                    <p>
                        <b>应提供资料</b>
                    </p>
                    <p className="first-line-indent">1、个职人员身份证、本人银行结算账户。</p>
                    <p className="first-line-indent">2、自由职业人员提供本人身份证、本人银行结算账户。</p>
                    <i>请将上述材料以附件的形式上传至系统并填写相关表单及备注</i>
                </Panel>
            </Collapse>
            <Divider orientation="left">信息填写</Divider>
            <Form>
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
        </div>
    );
}

export default Form.create()(PersonalFundDepositForm);
