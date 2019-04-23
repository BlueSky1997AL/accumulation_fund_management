import { Button, Card, Form, Icon, Input, notification, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Cookies from 'js-cookie';
import React, { useState } from 'react';

import './index.less';

import WorkflowFrame from '~components/workflowFrame';

import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { MsgType } from '~server/app/util/interface/common';
import { FileInfo } from '~server/app/util/interface/file';
import { WorkOrder, WorkOrderType } from '~server/app/util/interface/workOrder';

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

    const [ currentWorkOrder, setCurrentWorkOrder ] = useState<WorkOrder>();

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

    return (
        <div className="common-workflow-container">
            <Card title={getWorkOrderTitle()} bodyStyle={{ height: '100%', width: '100%' }}>
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
