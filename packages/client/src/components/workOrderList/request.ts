import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';
import { WorkOrder, WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

export async function getAllWorkOrders () {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.get<ResponseData<WorkOrderWithUserInfo[]>>('/api/work_order/all', {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}

export async function getPersonalWorkOrders () {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.get<ResponseData<WorkOrder[]>>('/api/work_order/mine', {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}
