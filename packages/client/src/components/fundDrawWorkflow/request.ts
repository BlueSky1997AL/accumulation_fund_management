import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';
import { WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';
import { PersonalFundDrawSubmitData } from './personalFundDrawForm';

export async function createPersonalFundDrawWorkOrder (payload: PersonalFundDrawSubmitData) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<
        ResponseData<WorkOrderWithUserInfo>
    >('/api/work_order/fund/draw/personal/create', payload, {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}
