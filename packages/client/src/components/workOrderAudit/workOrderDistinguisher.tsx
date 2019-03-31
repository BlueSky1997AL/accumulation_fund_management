import React from 'react';
import { WorkOrderType } from '~server/app/util/interface/workOrder';

import EnterpriseFundBack from './workOrderTypes/enterpriseFundBack';
import PersonalFundBack from './workOrderTypes/personalFundBack';

export default function (contentSpan: number, labelSpan: number, jsonStr?: string, workOrderType?: WorkOrderType,) {
    switch (workOrderType) {
        case WorkOrderType.PersonalBack:
            return <PersonalFundBack contentSpan={contentSpan} labelSpan={labelSpan} jsonStr={jsonStr} />;
        case WorkOrderType.EnterpriseBack:
            return <EnterpriseFundBack contentSpan={contentSpan} labelSpan={labelSpan} jsonStr={jsonStr} />;
        default:
            return null;
    }
}
