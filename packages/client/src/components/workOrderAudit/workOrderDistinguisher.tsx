import React from 'react';
import { WorkOrderType, WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

import CommonWorkOrder from './workOrderTypes/commonWorkOrder';
import EnterpriseFundBack from './workOrderTypes/enterpriseFundBack';
import EnterpriseFundRemit from './workOrderTypes/enterpriseFundRemit';
import EnterpriseSubUserAdd from './workOrderTypes/enterpriseSubUserAdd';
import EnterpriseSubUserRemove from './workOrderTypes/enterpriseSubUserRemove';
import PersonalFundBack from './workOrderTypes/personalFundBack';
import PersonalFundDeposit from './workOrderTypes/personalFundDeposit';
import PersonalFundDraw from './workOrderTypes/personalFundDraw';
import SignUp from './workOrderTypes/signup';

export default function (contentSpan: number, labelSpan: number, workOrder?: WorkOrderWithUserInfo) {
    switch (workOrder && workOrder.type) {
        case WorkOrderType.PersonalBack:
            return <PersonalFundBack contentSpan={contentSpan} labelSpan={labelSpan} workOrder={workOrder} />;
        case WorkOrderType.PersonalDeposit:
            return <PersonalFundDeposit contentSpan={contentSpan} labelSpan={labelSpan} workOrder={workOrder} />;
        case WorkOrderType.EnterpriseBack:
            return <EnterpriseFundBack contentSpan={contentSpan} labelSpan={labelSpan} workOrder={workOrder} />;
        case WorkOrderType.Remit:
            return <EnterpriseFundRemit contentSpan={contentSpan} labelSpan={labelSpan} workOrder={workOrder} />;
        case WorkOrderType.Draw:
            return <PersonalFundDraw contentSpan={contentSpan} labelSpan={labelSpan} workOrder={workOrder} />;
        case WorkOrderType.DisableOrExport:
            return (
                <CommonWorkOrder
                    contentSpan={contentSpan}
                    labelSpan={labelSpan}
                    jsonStr={workOrder && workOrder.payload}
                />
            );
        case WorkOrderType.Freeze:
            return (
                <CommonWorkOrder
                    contentSpan={contentSpan}
                    labelSpan={labelSpan}
                    jsonStr={workOrder && workOrder.payload}
                />
            );
        case WorkOrderType.Unfreeze:
            return (
                <CommonWorkOrder
                    contentSpan={contentSpan}
                    labelSpan={labelSpan}
                    jsonStr={workOrder && workOrder.payload}
                />
            );
        case WorkOrderType.RemoveSubUser:
            return <EnterpriseSubUserRemove contentSpan={contentSpan} labelSpan={labelSpan} workOrder={workOrder} />;
        case WorkOrderType.AddSubUser:
            return <EnterpriseSubUserAdd contentSpan={contentSpan} labelSpan={labelSpan} workOrder={workOrder} />;
        case WorkOrderType.SignUp:
            return <SignUp contentSpan={contentSpan} labelSpan={labelSpan} workOrder={workOrder} />;
        default:
            return null;
    }
}
