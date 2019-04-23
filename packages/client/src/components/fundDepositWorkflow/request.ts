import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';
import { WorkOrder } from '~server/app/util/interface/workOrder';
import { PersonalFundDepositSubmitData } from './personalFundDepositForm';

export async function createPersonalFundDepositWorkOrder (payload: PersonalFundDepositSubmitData) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<ResponseData<WorkOrder>>('/api/work_order/fund/deposit/personal/create', payload, {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}
