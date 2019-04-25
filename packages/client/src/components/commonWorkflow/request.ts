import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';
import { WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';
import { CommonWorkOrderSubmitData } from './index';

export async function createCommonWorkOrder (payload: CommonWorkOrderSubmitData) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<ResponseData<WorkOrderWithUserInfo>>('/api/work_order/common/create', payload, {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}
