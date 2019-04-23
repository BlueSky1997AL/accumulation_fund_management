import { Col, Divider, notification, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import FileDownloadButton from '~components/fileDownloadButton';
import { AmountInfo, EnterpriseFundBackSubmitData } from '~components/fundBackWorkflow/enterpriseFundBackForm';
import { UserInfoRespData } from '~server/app/controller/user';
import { MsgType } from '~server/app/util/interface/common';
import { WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

import { getTargetSubUserInfo } from '~components/enterpriseSubUserRemoveWorkflow/request';
import { enterpriseTypeToString, moneyToHumanReadable, userStatusToString } from '~utils/user';

interface EnterpriseFundBackProps {
    workOrder?: WorkOrderWithUserInfo;
    labelSpan: number;
    contentSpan: number;
}

const downloadBtnStyle: React.CSSProperties = {
    marginBottom: 10,
    marginRight: 10
};

function EnterpriseFundBack ({ workOrder, labelSpan, contentSpan }: EnterpriseFundBackProps) {
    const [ data, setData ] = useState<EnterpriseFundBackSubmitData>();
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
        if (data && data.amountMap) {
            await Promise.all(
                data.amountMap.map(async amountInfo => {
                    try {
                        const resp = await getTargetSubUserInfo(undefined, amountInfo.username);
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

    function getMonth () {
        if (data) {
            return moment(data.month).format('YYYY-MM');
        }
        return null;
    }

    const infoTableColumns = [
        {
            title: '身份证号码',
            align: 'center',
            dataIndex: 'username'
        },
        {
            title: '工号',
            align: 'center',
            key: 'employeeID',
            render(empty, record) {
                const userInfo = targetUserInfo.get(record.username);
                return userInfo && userInfo.employeeID;
            }
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
        },
        {
            title: '补缴金额',
            align: 'center',
            dataIndex: 'amount',
            render(value: number) {
                return `${moneyToHumanReadable(value)}元`;
            }
        }
    ] as ColumnProps<AmountInfo>[];

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
                    补缴月份：
                </Col>
                <Col span={contentSpan} className="info-text">
                    {getMonth()}
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
                补缴信息
            </Divider>
            <Table
                dataSource={data && data.amountMap}
                columns={infoTableColumns}
                rowKey={record => {
                    return record.username;
                }}
                size="small"
                style={{ margin: '0 auto' }}
            />
        </div>
    );
}

export default EnterpriseFundBack;
