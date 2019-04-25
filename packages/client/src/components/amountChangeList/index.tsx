import { Card, List, notification } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { AmountChangeInDB, AmountChangeSource } from '~server/app/util/interface/amountChange';
import { MsgType } from '~server/app/util/interface/common';
import { amountChangeSourceToString, amountChangeTypeToString } from '~utils/amountChange';
import { moneyToHumanReadable } from '~utils/user';
import { AmountChangeUserQuery, getPersonalAmountChangesByQuery } from './request';

export default function AmountChangeList () {
    const [ amountChanges, setAmountChanges ] = useState<AmountChangeInDB[]>();

    useEffect(() => {
        fetchPersonalAmountChangesByQuery();
    }, []);

    async function fetchPersonalAmountChangesByQuery (query?: AmountChangeUserQuery) {
        try {
            const resp = await getPersonalAmountChangesByQuery(query);
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setAmountChanges(resp.data);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    function getAmountChangeDetailDescUser (info: AmountChangeInDB) {
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

    function getListItemDesc (info: AmountChangeInDB) {
        return `${moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss')} - [${amountChangeTypeToString(
            info.type
        )} / ${amountChangeSourceToString(info.source)} / ${moneyToHumanReadable(
            info.amount
        )}元${getAmountChangeDetailDescUser(info)}]`;
    }

    return (
        <div className="work-order-list-container">
            <Card title="流水明细" bodyStyle={{ height: '100%', width: '100%' }}>
                <List
                    itemLayout="horizontal"
                    dataSource={amountChanges}
                    bordered={true}
                    renderItem={(item: AmountChangeInDB) => (
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
