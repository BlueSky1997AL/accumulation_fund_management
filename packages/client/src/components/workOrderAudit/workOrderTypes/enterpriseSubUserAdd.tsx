import { Col, Divider, notification, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';

import { EnterpriseSubUserAddSubmitData } from '~components/enterpriseSubUserAddWorkflow/enterpriseSubUserAddForm';
import FileDownloadButton from '~components/fileDownloadButton';
import { UserInfoRespData } from '~server/app/controller/user';
import { MsgType } from '~server/app/util/interface/common';
import { WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

import { getTargetSubUserInfo } from '~components/enterpriseSubUserRemoveWorkflow/request';
import { enterpriseTypeToString, moneyToHumanReadable, userStatusToString } from '~utils/user';

interface EnterpriseSubUserAddProps {
    workOrder?: WorkOrderWithUserInfo;
    labelSpan: number;
    contentSpan: number;
}

const downloadBtnStyle: React.CSSProperties = {
    marginBottom: 10,
    marginRight: 10
};

function EnterpriseSubUserAdd ({ workOrder, labelSpan, contentSpan }: EnterpriseSubUserAddProps) {
    const [ data, setData ] = useState<EnterpriseSubUserAddSubmitData>();
    const [ targetUserInfo, setTargetUserInfo ] = useState(new Map<string, UserInfoRespData>());

    useEffect(
        () => {
            if (workOrder && workOrder.payload) {
                setData(JSON.parse(workOrder.payload));
            }
        },
        [ workOrder ]
    );

    useEffect(
        () => {
            getAndSetTargetUserInfo();
        },
        [ data ]
    );

    async function getAndSetTargetUserInfo () {
        const dataMap = new Map<string, UserInfoRespData>();
        if (data && data.usernames) {
            await Promise.all(
                data.usernames.map(async username => {
                    try {
                        const resp = await getTargetSubUserInfo(undefined, username);
                        if (resp.message !== MsgType.OPT_SUCCESS) {
                            throw new Error(resp.message);
                        }
                        dataMap.set(resp.data.username, resp.data);
                    } catch (error) {
                        notification.error({
                            message: (error as Error).message
                        });
                    }
                })
            );
        }
        setTargetUserInfo(dataMap);
    }

    const infoTableColumns = [
        {
            title: '身份证号码',
            align: 'center',
            dataIndex: 'username'
        },
        {
            title: '姓名',
            align: 'center',
            key: 'name',
            render(empty, record) {
                const userInfo = targetUserInfo.get(record.username);
                return userInfo && userInfo.name;
            }
        },
        {
            title: '新工号',
            align: 'center',
            dataIndex: 'employeeID'
        },
        {
            title: '银行卡号',
            align: 'center',
            key: 'cardNo',
            render(empty, record) {
                const userInfo = targetUserInfo.get(record.username);
                return userInfo && userInfo.cardNo;
            }
        },
        {
            title: '账户状态',
            align: 'center',
            key: 'status',
            render(empty, record) {
                const userInfo = targetUserInfo.get(record.username);
                return userStatusToString(userInfo && userInfo.status);
            }
        }
    ] as ColumnProps<{ username: string }>[];

    return (
        <div>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    企业名称：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {workOrder && workOrder.owner.name}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    企业类型：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {enterpriseTypeToString(workOrder && workOrder.owner.entType)}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    企业银行卡号：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {workOrder && workOrder.owner.cardNo}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    申请备注：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {data && data.comments}
                </Col>
            </Row>
            <Row className="info-row">
                <Col span={labelSpan} className="info-text info-label">
                    申请材料：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {data &&
                        data.accessory &&
                        data.accessory.map(item => (
                            <FileDownloadButton style={downloadBtnStyle} key={item.id} data={item} />
                        ))}
                </Col>
            </Row>
            <Divider orientation="left" style={{ width: '50%' }}>
                目标子账户（员工）信息
            </Divider>
            <Table
                dataSource={
                    data &&
                    data.usernames.map((username, index) => {
                        return { username, employeeID: data.employeeIDs[index] };
                    })
                }
                columns={infoTableColumns}
                rowKey={record => record.username}
                size="small"
                style={{ margin: '0 auto' }}
            />
        </div>
    );
}

export default EnterpriseSubUserAdd;
