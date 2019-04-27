import { Button, Card, Form, Icon, Input, notification, Tooltip, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Cookies from 'js-cookie';
import React, { useState } from 'react';

import './index.less';

import WorkflowFrame from '~components/workflowFrame';

import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { MsgType } from '~server/app/util/interface/common';
import { FileInfo } from '~server/app/util/interface/file';
import { WorkOrderType, WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

import { uploadFilesToFileInfos } from '~utils/file';
import { createCommonWorkOrder } from './request';

const csrfToken = Cookies.get('csrfToken');

export interface CommonWorkOrderSubmitData {
    comments?: string;
    workOrderType: WorkOrderType;
    accessory?: FileInfo[];
}

interface CommonWorkflowProps extends FormComponentProps {
    workOrderType: WorkOrderType;
}

function CommonWorkflow ({ workOrderType, form }: CommonWorkflowProps) {
    const { getFieldDecorator, validateFields } = form;

    const [ currentWorkOrder, setCurrentWorkOrder ] = useState<WorkOrderWithUserInfo>();

    async function handleSubmitCommonWorkOrder (payload: CommonWorkOrderSubmitData) {
        try {
            const resp = await createCommonWorkOrder(payload);
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setCurrentWorkOrder(resp.data);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    function validateDataAndSubmit () {
        validateFields(async (errors, formData) => {
            if (errors) {
                console.warn('Warning: Fields validation failed:', errors);
                return;
            }

            const submitData: CommonWorkOrderSubmitData = {
                comments: formData.comments,
                workOrderType,
                accessory: uploadFilesToFileInfos(formData.accessory)
            };

            handleSubmitCommonWorkOrder(submitData);
        });
    }

    function normFile (e: UploadChangeParam | UploadFile[]) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    function getWorkOrderTitle () {
        switch (workOrderType) {
            case WorkOrderType.DisableOrExport:
                return '新建销户/转出申请工单';
            case WorkOrderType.Freeze:
                return '新建冻结申请工单';
            case WorkOrderType.Unfreeze:
                return '新建解除冻结申请工单';
            case WorkOrderType.RemoveSubUser:
                return '新建移除/转出子账户工单';
        }
    }

    function getCardExtraInfo () {
        if (currentWorkOrder) {
            return (
                <div>
                    <span className="id-zone">工单唯一标识：</span>
                    <span className="id-zone">{currentWorkOrder._id}</span>
                </div>
            );
        }
        return null;
    }

    return (
        <div className="common-workflow-container">
            <Card title={getWorkOrderTitle()} bodyStyle={{ height: '100%', width: '100%' }} extra={getCardExtraInfo()}>
                <WorkflowFrame data={currentWorkOrder}>
                    <Form
                        style={{
                            width: '50%',
                            height: '100%',
                            padding: '16px 0'
                        }}
                    >
                        <Form.Item label="备注信息">
                            {getFieldDecorator('comments', {
                                rules: [ { required: true, message: '请填写申请备注' } ]
                            })(<Input.TextArea autosize={{ minRows: 4 }} />)}
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip
                                    title={
                                        <div>
                                            <div>单个文件大小 ≤ 4MB</div>
                                            <div>
                                                支持的格式：.jpg / .jpeg / .png / .gif / .bmp / .wbmp / .webp / .tif / .psd /
                                                .svg / .js / .jsx / .json / .css / .less / .html / .htm / .xml / .zip /
                                                .gz / .tgz / .gzip / .mp3 / .mp4 / .avi / .rar / .iso / .doc / .docx /
                                                .ppt / .pptx / .xls / .xlsx / .wps / .txt / .pdf
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
                            <Button type="primary" style={{ width: '100%' }} onClick={validateDataAndSubmit}>
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                </WorkflowFrame>
            </Card>
        </div>
    );
}

export default Form.create()(CommonWorkflow);
