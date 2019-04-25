import { Button, Collapse, Divider, Form, Icon, Input, InputNumber, Radio, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

const RadioGroup = Radio.Group;
const { Panel } = Collapse;

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

const customPanelStyle = {
    background: '#f1f1f1',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden'
};

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
                <Panel header="支取说明" key="instruction" style={customPanelStyle}>
                    <p>
                        <b>部分提取</b>
                    </p>
                    <p className="first-line-indent">公积金部分提取是指公积金的缴存人按照公积金部分提取的要求，申办公积金的部分提取。最高可提取额为账户总金额减10元。</p>
                    <p>
                        <b>提取条件</b>
                    </p>
                    <p>职工有下列情形之一的，可申请提取住房公积金。</p>
                    <p className="first-line-indent">（一）购买自住住房的，提供购房合同、协议或者其他证明；</p>
                    <p className="first-line-indent">（二）购买自住住房的，提供建设、土地等行政主管部门的批准文件或者其他证明文件；</p>
                    <p className="first-line-indent">（三）翻建、大修自住住房的，提供规划行政等主管部门的批准文件或者其他证明文件；</p>
                    <p className="first-line-indent">（四）退休的，提供退休证明；</p>
                    <p className="first-line-indent">（五）完全丧失劳动能力并与单位终止劳动关系的，提供完全丧失劳动能力鉴定证明和终止劳动关系证明；</p>
                    <p className="first-line-indent">（六）与单位终止劳动关系后，未重新就业满五年的，提供未就业证明；</p>
                    <p className="first-line-indent">（七）出境定居的，提供出境定居证明；</p>
                    <p className="first-line-indent">（八）户口迁出本省行政区域的，提供迁移证明；</p>
                    <p className="first-line-indent">（九）偿还购房贷款本息的，提供购房贷款合同；</p>
                    <p className="first-line-indent">（十）支付房租的，提供工资收入证明和住房租赁合同；</p>
                    <p className="first-line-indent">（十一）进城务工人员与单位解除劳动关系，提供户口证明和解除劳动关系的证明；</p>
                    <p className="first-line-indent">（十二）住房公积金管理中心规定提取的其他情形。</p>
                    <p>
                        <b>销户提取</b>
                    </p>
                    <p>符合公积金提取的销户提取的条件</p>
                    <p className="first-line-indent">（一）离退休：离退休证或劳动部门的相关证明、提取人身份证；</p>
                    <p className="first-line-indent">（二）户口迁出本市：公安部门出具的户口迁出证明、提取人身份证；</p>
                    <p className="first-line-indent">（三）出国定居：户口注销证明；</p>
                    <p className="first-line-indent">（四）丧失劳动能力且解除劳动合同：劳动部门提供的职工丧失劳动能力鉴定及单位解除劳动合同证明、提取人身份证；</p>
                    <p className="first-line-indent">（五）进城务工人员与单位解除劳动关系：提供户口证明和解除劳动关系的证明；</p>
                    <p className="first-line-indent">（六）职工在职期间被判处死刑、无期徒刑或有期徒刑刑期期满时达到国家法定退休年龄：应当提供人民法院判决书；</p>
                    <p className="first-line-indent">
                        （7）职工死亡或者被宣告死亡：应当提供职工死亡证明若其继承人、受遗赠人提取的，还需提供公证部门对该继承权或受遗赠权出具的公证书或人民法院做出的判决书、裁定书或调解书。
                    </p>
                    <i>请将上述材料以附件的形式上传至系统并填写相关表单及备注</i>
                </Panel>
            </Collapse>
            <Divider orientation="left">信息填写</Divider>
            <Form>
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
        </div>
    );
}

export default Form.create()(PersonalFundDrawForm);
