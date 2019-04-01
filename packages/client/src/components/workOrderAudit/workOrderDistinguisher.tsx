import React from 'react';
import { WorkOrderType } from '~server/app/util/interface/workOrder';

import CommonWorkOrder from './workOrderTypes/commonWorkOrder';
import EnterpriseFundBack from './workOrderTypes/enterpriseFundBack';
import EnterpriseFundRemit from './workOrderTypes/enterpriseFundRemit';
import EnterpriseSubUserAdd from './workOrderTypes/enterpriseSubUserAdd';
import EnterpriseSubUserRemove from './workOrderTypes/enterpriseSubUserRemove';
import PersonalFundBack from './workOrderTypes/personalFundBack';
import PersonalFundDraw from './workOrderTypes/personalFundDraw';

export default function (contentSpan: number, labelSpan: number, jsonStr?: string, workOrderType?: WorkOrderType) {
    switch (workOrderType) {
        case WorkOrderType.PersonalBack:
            return <PersonalFundBack contentSpan={contentSpan} labelSpan={labelSpan} jsonStr={jsonStr} />;
        case WorkOrderType.EnterpriseBack:
            return <EnterpriseFundBack contentSpan={contentSpan} labelSpan={labelSpan} jsonStr={jsonStr} />;
        case WorkOrderType.Remit:
            return <EnterpriseFundRemit contentSpan={contentSpan} labelSpan={labelSpan} jsonStr={jsonStr} />;
        case WorkOrderType.Draw:
            return <PersonalFundDraw contentSpan={contentSpan} labelSpan={labelSpan} jsonStr={jsonStr} />;
        case WorkOrderType.DisableOrExport:
            return <CommonWorkOrder contentSpan={contentSpan} labelSpan={labelSpan} jsonStr={jsonStr} />;
        case WorkOrderType.Freeze:
            return <CommonWorkOrder contentSpan={contentSpan} labelSpan={labelSpan} jsonStr={jsonStr} />;
        case WorkOrderType.Unfreeze:
            return <CommonWorkOrder contentSpan={contentSpan} labelSpan={labelSpan} jsonStr={jsonStr} />;
        case WorkOrderType.RemoveSubUser:
            return <EnterpriseSubUserRemove contentSpan={contentSpan} labelSpan={labelSpan} jsonStr={jsonStr} />;
        case WorkOrderType.AddSubUser:
            return <EnterpriseSubUserAdd contentSpan={contentSpan} labelSpan={labelSpan} jsonStr={jsonStr} />;
        default:
            return null;
    }
}
