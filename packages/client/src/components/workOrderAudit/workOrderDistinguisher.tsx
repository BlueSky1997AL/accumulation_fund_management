import React from 'react';
import { WorkOrderType } from '~server/app/util/interface/workOrder';

import PersonalFundBack from './workOrderTypes/personalFundBack';

export default function (contentSpan: number, labelSpan: number, jsonStr?: string, workOrderType?: WorkOrderType,) {
    switch (workOrderType) {
        case WorkOrderType.PersonalBack:
            return <PersonalFundBack contentSpan={contentSpan} labelSpan={labelSpan} jsonStr={jsonStr} />;
        default:
            return null;
    }
}
