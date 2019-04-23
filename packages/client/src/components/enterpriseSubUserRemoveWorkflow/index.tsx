import { Button, Card, Col, Divider, Form, Icon, Input, notification, Row, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

import './index.less';

import WorkflowFrame from '~components/workflowFrame';

import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { UserInfoRespData } from '~server/app/controller/user';
import { MsgType } from '~server/app/util/interface/common';
import { FileInfo } from '~server/app/util/interface/file';
import { WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

import { uploadFilesToFileInfos } from '~utils/file';
import { userStatusToString, userTypeToString } from '~utils/user';
import { createEnterpriseSubUserRemoveWorkOrder, getTargetSubUserInfo } from './request';

const csrfToken = Cookies.get('csrfToken');

export interface EnterpriseSubUserRemoveSubmitData {
    userID: string;
    comments?: string;
    accessory?: FileInfo[];
}

interface EnterpriseSubUserRemoveWorkflowProps extends FormComponentProps {
    userID: string;
}

function EnterpriseSubUserRemoveWorkflow ({ userID, form }: EnterpriseSubUserRemoveWorkflowProps) {
    const { getFieldDecorator, validateFields } = form;

    const [ currentWorkOrder, setCurrentWorkOrder ] = useState<WorkOrderWithUserInfo>();
    const [ targetUserInfo, setTargetUserInfo ] = useState<UserInfoRespData>();

    async function fetchUserInfo (id: string) {
        try {
            const resp = await getTargetSubUserInfo(id);
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setTargetUserInfo(resp.data);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    async function handleSubmitWorkOrder (payload: EnterpriseSubUserRemoveSubmitData) {
        try {
            const resp = await createEnterpriseSubUserRemoveWorkOrder(payload);
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

    useEffect(() => {
        fetchUserInfo(userID);
    }, []);

    function validateDataAndSubmit () {
        validateFields(async (errors, formData) => {
            if (errors) {
                console.warn('Warning: Fields validation failed:', errors);
                return;
            }

            const submitData: EnterpriseSubUserRemoveSubmitData = {
                userID,
                comments: formData.comments,
                accessory: uploadFilesToFileInfos(formData.accessory)
            };

            handleSubmitWorkOrder(submitData);
        });
    }

    function normFile (e: UploadChangeParam | UploadFile[]) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    const labelSpan = 6;
    const contentSpan = 24 - labelSpan;

    return (
        <div className="enterprise-sub-user-remove-workflow-container">
            <Card title="新建移除/转出子账户工单" bodyStyle={{ height: '100%', width: '100%' }}>
                <WorkflowFrame data={currentWorkOrder}>
                    <div
                        style={{
                            width: '50%',
                            height: '100%',
                            padding: '16px 0'
                        }}
                    >
                        <Divider orientation="left" style={{ marginBottom: 20 }}>
                            被操作用户信息
                        </Divider>
                        <Row className="info-row">
                            <Col span={labelSpan} className="info-text info-label">
                                账户唯一标识：
                            </Col>
                            <Col span={contentSpan} className="info-text">
                                {targetUserInfo && targetUserInfo.id}
                            </Col>
                        </Row>
                        <Row className="info-row">
                            <Col span={labelSpan} className="info-text info-label">
                                身份证号码：
                            </Col>
                            <Col span={contentSpan} className="info-text">
                                {targetUserInfo && targetUserInfo.username}
                            </Col>
                        </Row>
                        <Row className="info-row">
                            <Col span={labelSpan} className="info-text info-label">
                                姓名：
                            </Col>
                            <Col span={contentSpan} className="info-text">
                                {targetUserInfo && targetUserInfo.name}
                            </Col>
                        </Row>
                        <Row className="info-row">
                            <Col span={labelSpan} className="info-text info-label">
                                账户类型：
                            </Col>
                            <Col span={contentSpan} className="info-text">
                                {userTypeToString(targetUserInfo && targetUserInfo.type)}
                            </Col>
                        </Row>
                        <Row className="info-row">
                            <Col span={labelSpan} className="info-text info-label">
                                账户状态：
                            </Col>
                            <Col span={contentSpan} className="info-text">
                                {userStatusToString(targetUserInfo && targetUserInfo.status)}
                            </Col>
                        </Row>
                        <Row className="info-row">
                            <Col span={labelSpan} className="info-text info-label">
                                工号：
                            </Col>
                            <Col span={contentSpan} className="info-text">
                                {targetUserInfo && targetUserInfo.employeeID}
                            </Col>
                        </Row>
                        <Row className="info-row">
                            <Col span={labelSpan} className="info-text info-label">
                                银行卡号：
                            </Col>
                            <Col span={contentSpan} className="info-text">
                                {targetUserInfo && targetUserInfo.cardNo}
                            </Col>
                        </Row>
                        <Divider orientation="left" style={{ marginTop: 20 }}>
                            填写信息
                        </Divider>
                        <Form>
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
                    </div>
                </WorkflowFrame>
            </Card>
        </div>
    );
}

export default Form.create()(EnterpriseSubUserRemoveWorkflow);
