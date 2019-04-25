import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';
import { WorkOrder, WorkOrderStatus, WorkOrderType, WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

type objectID = string;
export interface WorkOrderAdminQuery {
    id?: objectID;
    status?: WorkOrderStatus;
    type?: WorkOrderType;
    owner?: objectID;
    ownerUsername?: string;
    auditer?: objectID;
    auditerUsername?: string;
}

export async function getAllWorkOrdersByQuery (query: WorkOrderAdminQuery) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.get<ResponseData<WorkOrderWithUserInfo[]>>('/api/work_order/query_admin', {
        headers: {
            'x-csrf-token': csrfToken
        },
        params: query
    });
    return resp.data;
}

export interface WorkOrderUserQuery {
    id?: objectID;
    status?: WorkOrderStatus;
    type?: WorkOrderType;
    auditer?: objectID;
    auditerUsername?: string;
}

export async function getPersonalWorkOrdersByQuery (query: WorkOrderUserQuery) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.get<ResponseData<WorkOrderWithUserInfo[]>>('/api/work_order/query_user', {
        headers: {
            'x-csrf-token': csrfToken
        },
        params: query
    });
    return resp.data;
}
