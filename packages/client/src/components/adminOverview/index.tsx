import F2 from '@antv/f2/lib/index-all';
import G2 from '@antv/g2';
import { NumberInfo } from 'ant-design-pro';
import { Button, Card, Divider, Form, Input, InputNumber, List, notification, Row, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

import { SysOverviewInfo } from '~server/app/controller/home';
import {
    AmountChangeInDBWithOwnerInfo,
    AmountChangeSource,
    AmountChangeType
} from '~server/app/util/interface/amountChange';
import { MsgType } from '~server/app/util/interface/common';

import { amountChangeSourceToString, amountChangeTypeToString } from '~utils/amountChange';
import { moneyToHumanReadable } from '~utils/user';
import { getAllAmountChangesByQuery, getSysOverviewInfo } from './request';

interface PieChartDataItem {
    category: string;
    count: number;
    const: 'const';
}

interface LineChartDataItem {
    time: string;
    type: '汇入' | '汇出';
    amount: number;
}

const emptyPieChartData: PieChartDataItem[] = [
    {
        category: '管理员账户',
        count: 0,
        const: 'const'
    },
    {
        category: '个人账户',
        count: 0,
        const: 'const'
    },
    {
        category: '企业账户',
        count: 0,
        const: 'const'
    },
    {
        category: '访客账户',
        count: 0,
        const: 'const'
    }
];

export interface PasswordModificationSubmitData {
    oldPassword: string;
    newPassword: string;
}

function AdminOverview ({ form }: FormComponentProps) {
    const [ sysOverviewInfo, setSysOverviewInfo ] = useState<SysOverviewInfo>();
    const [ pieChartInstance, setPieChartInstance ] = useState<any>();
    const [ lineChartInstance, setLineChartInstance ] = useState<G2.Chart>();
    const [ allAmountChanges, setAllAmountChanges ] = useState<AmountChangeInDBWithOwnerInfo[]>();
    const [ currentQueryResult, setCurrentQueryResult ] = useState<AmountChangeInDBWithOwnerInfo[]>();

    const { getFieldDecorator, getFieldsValue } = form;

    useEffect(() => {
        const instance = new F2.Chart({
            id: 'user-distribution-pie-chart',
            pixelRatio: window.devicePixelRatio
        });

        instance.source(emptyPieChartData);
        instance.coord('polar', {
            transposed: true,
            radius: 0.75
        });
        instance.legend(false);
        instance.axis(false);
        instance.tooltip(false);
        instance.pieLabel({
            sidePadding: 40,
            label1: function label1 (data: PieChartDataItem, color: string) {
                return {
                    text: data.category,
                    fill: color
                };
            },
            label2: function label2 (data: PieChartDataItem) {
                return {
                    text: `${data.count}人`,
                    fill: '#808080',
                    fontWeight: 'bold'
                };
            }
        });
        instance
            .interval()
            .position('const*count')
            .color('category', [ '#1890FF', '#13C2C2', '#2FC25B', '#FACC14' ])
            .adjust('stack');
        instance.render();

        setPieChartInstance(instance);
    }, []);

    useEffect(() => {
        const instance = new G2.Chart({
            container: 'amount-change-line-chart',
            height: 380,
            width: 800
        });

        instance.source([], {
            time: {
                range: [ 0, 1 ]
            }
        });
        instance.tooltip({
            crosshairs: {
                type: 'line'
            }
        });
        instance.axis('amount', {
            label: {
                formatter: function formatter (val) {
                    return `${val} 元`;
                }
            }
        });
        instance.line().position('time*amount').color('type');
        instance.point().position('time*amount').color('type').size(4).shape('circle').style({
            stroke: '#fff',
            lineWidth: 1
        });
        instance.render();

        setLineChartInstance(instance);
    }, []);

    useEffect(() => {
        fetchSysOverviewInfo();
        fetchAllAmountChanges();
    }, []);

    useEffect(
        () => {
            if (sysOverviewInfo && pieChartInstance) {
                const newData: PieChartDataItem[] = [
                    {
                        category: '管理员账户',
                        count: sysOverviewInfo.adminUserCount,
                        const: 'const'
                    },
                    {
                        category: '个人账户',
                        count: sysOverviewInfo.commonUserCount,
                        const: 'const'
                    },
                    {
                        category: '企业账户',
                        count: sysOverviewInfo.enterpriseUserCount,
                        const: 'const'
                    },
                    {
                        category: '访客账户',
                        count: sysOverviewInfo.guestUserCount,
                        const: 'const'
                    }
                ];
                pieChartInstance.changeData(newData);
            }
        },
        [ sysOverviewInfo ]
    );

    useEffect(
        () => {
            if (allAmountChanges && lineChartInstance) {
                const newData: LineChartDataItem[] = [];
                allAmountChanges.map(amountChange => {
                    newData.push({
                        amount: parseFloat(moneyToHumanReadable(amountChange.amount)),
                        type: amountChange.type === AmountChangeType.Positive ? '汇入' : '汇出',
                        time: moment(amountChange.createdAt).format('YYYY-MM-DD HH:mm:ss')
                    });
                });

                lineChartInstance.changeData(newData.reverse());
            }
        },
        [ allAmountChanges ]
    );

    async function fetchSysOverviewInfo () {
        try {
            const resp = await getSysOverviewInfo();
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setSysOverviewInfo(resp.data);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    async function fetchAllAmountChanges () {
        try {
            const resp = await getAllAmountChangesByQuery();
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setAllAmountChanges(resp.data);
            setCurrentQueryResult(resp.data);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    async function handleQuery () {
        try {
            const query = getFieldsValue();
            if (typeof query.amount === 'number') {
                query.amount = Math.round(query.amount * 100);
            }

            const resp = await getAllAmountChangesByQuery(query);
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setCurrentQueryResult(resp.data);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    function getAmountChangeDetailDescUser (info: AmountChangeInDBWithOwnerInfo) {
        const payload =
            info.payload &&
            (JSON.parse(info.payload) as { month: string; entID?: string; entName?: string; entUsername?: string });
        switch (info.source) {
            case AmountChangeSource.EnterpriseRemit:
                return ` / 汇缴月份：${moment(payload && payload.month).format('YYYY-MM')} / 汇缴企业名称：${payload &&
                    payload.entName} / 汇缴企业社会统一信用代码：${payload && payload.entUsername}`;
            case AmountChangeSource.EnterpriseBack:
                return ` / 补缴月份：${moment(payload && payload.month).format('YYYY-MM')} / 汇缴企业名称：${payload &&
                    payload.entName} / 汇缴企业社会统一信用代码：${payload && payload.entUsername}`;
            case AmountChangeSource.PersonalBack:
                return ` / 补缴月份：${moment(payload && payload.month).format('YYYY-MM')}`;
            case AmountChangeSource.PersonalDeposit:
                return ` / 缴存月份：${moment(payload && payload.month).format('YYYY-MM')}`;
            default:
                return '';
        }
    }

    function getListItemDesc (info: AmountChangeInDBWithOwnerInfo) {
        return `${moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss')} - [${amountChangeTypeToString(
            info.type
        )} / ${info.ownerInfo.name} / ${info.ownerInfo.username} / ${amountChangeSourceToString(
            info.source
        )} / ${moneyToHumanReadable(info.amount)}元${getAmountChangeDetailDescUser(info)}]`;
    }

    return (
        <div className="admin-overview-container">
            <Card
                title="用户 / 金额"
                bodyStyle={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }}
            >
                <canvas id="user-distribution-pie-chart" />
                <div style={{ height: '100px', width: '0.5px', backgroundColor: 'rgba(0, 0, 0, 0.15)' }} />
                <div className="number-info">
                    <NumberInfo subTitle="总用户数" total={sysOverviewInfo && sysOverviewInfo.totalUserCount} />
                    <NumberInfo
                        subTitle="系统总金额"
                        total={`${moneyToHumanReadable(sysOverviewInfo && sysOverviewInfo.totalBalance)}元`}
                        style={{ marginTop: 16 }}
                    />
                </div>
            </Card>
            <Card
                title="日流水"
                style={{ marginTop: 16 }}
                bodyStyle={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }}
            >
                <div id="amount-change-line-chart" />
            </Card>
            <Card
                title="流水细则 / 查询"
                style={{ marginTop: 16 }}
                bodyStyle={{
                    height: '100%',
                    width: '100%'
                }}
            >
                <Form labelCol={{ span: 10 }} wrapperCol={{ span: 6 }}>
                    <Form.Item label="流水唯一标识">
                        {getFieldDecorator('id', {})(
                            <Input onPressEnter={handleQuery} allowClear={true} placeholder="请输入流水唯一标识" />
                        )}
                    </Form.Item>
                    <Form.Item label="所属用户唯一标识">
                        {getFieldDecorator('owner', {})(
                            <Input onPressEnter={handleQuery} allowClear={true} placeholder="请输入流水所属用户唯一标识" />
                        )}
                    </Form.Item>
                    <Form.Item label="所属用户用户名">
                        {getFieldDecorator('ownerUsername', {})(
                            <Input onPressEnter={handleQuery} allowClear={true} placeholder="请输入流水所属用户用户名" />
                        )}
                    </Form.Item>
                    <Form.Item label="流水金额（元）">
                        {getFieldDecorator('amount', {})(
                            <InputNumber style={{ width: '100%' }} placeholder="请输入流水金额" />
                        )}
                    </Form.Item>
                    <Form.Item label="流水类型">
                        {getFieldDecorator('type', {})(
                            <Select allowClear={true} placeholder="流水类型">
                                <Option value={AmountChangeType.Positive}>
                                    {amountChangeTypeToString(AmountChangeType.Positive)}
                                </Option>
                                <Option value={AmountChangeType.Negative}>
                                    {amountChangeTypeToString(AmountChangeType.Negative)}
                                </Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="流水来源">
                        {getFieldDecorator('source', {})(
                            <Select allowClear={true} placeholder="流水类型">
                                <Option value={AmountChangeSource.AccountCreation}>
                                    {amountChangeSourceToString(AmountChangeSource.AccountCreation)}
                                </Option>
                                <Option value={AmountChangeSource.EnterpriseRemit}>
                                    {amountChangeSourceToString(AmountChangeSource.EnterpriseRemit)}
                                </Option>
                                <Option value={AmountChangeSource.EnterpriseBack}>
                                    {amountChangeSourceToString(AmountChangeSource.EnterpriseBack)}
                                </Option>
                                <Option value={AmountChangeSource.PersonalBack}>
                                    {amountChangeSourceToString(AmountChangeSource.PersonalBack)}
                                </Option>
                                <Option value={AmountChangeSource.PersonalDeposit}>
                                    {amountChangeSourceToString(AmountChangeSource.PersonalDeposit)}
                                </Option>
                                <Option value={AmountChangeSource.PersonalPartialDraw}>
                                    {amountChangeSourceToString(AmountChangeSource.PersonalPartialDraw)}
                                </Option>
                                <Option value={AmountChangeSource.PersonalCancellationDraw}>
                                    {amountChangeSourceToString(AmountChangeSource.PersonalCancellationDraw)}
                                </Option>
                                <Option value={AmountChangeSource.AdminUserCreate}>
                                    {amountChangeSourceToString(AmountChangeSource.AdminUserCreate)}
                                </Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Row type="flex" justify="center">
                        <Button type="primary" icon="search" style={{ width: 100 }} onClick={handleQuery}>
                            查询
                        </Button>
                    </Row>
                </Form>
                <Divider orientation="left">查询结果</Divider>
                <List
                    itemLayout="horizontal"
                    dataSource={currentQueryResult}
                    bordered={true}
                    renderItem={(item: AmountChangeInDBWithOwnerInfo) => (
                        <List.Item>
                            <List.Item.Meta title={getListItemDesc(item)} />
                            <div style={{ color: 'rgba(0, 0, 0, 0.35)' }}>{`流水唯一标识：${item._id}`}</div>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
}

export default Form.create()(AdminOverview);
