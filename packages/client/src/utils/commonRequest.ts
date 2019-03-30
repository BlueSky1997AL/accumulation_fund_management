import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';
import { WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';

export async function getWorkOrderInfo (workOrderID: string) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.get<ResponseData<WorkOrderWithUserInfo>>('/api/work_order/detail', {
        headers: {
            'x-csrf-token': csrfToken
        },
        params: {
            workOrderID
        }
    });
    return resp.data;
}
