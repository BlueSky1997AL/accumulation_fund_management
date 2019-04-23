import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';
import { WorkOrderWithUserInfo } from '~server/app/util/interface/workOrder';
import { EnterpriseFundBackSubmitData } from './enterpriseFundBackForm';
import { PersonalFundBackSubmitData } from './personalFundBackForm';

export async function createEnterpriseFundBackWorkOrder (payload: EnterpriseFundBackSubmitData) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<
        ResponseData<WorkOrderWithUserInfo>
    >('/api/work_order/fund/back/enterprise/create', payload, {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}

export async function createPersonalFundBackWorkOrder (payload: PersonalFundBackSubmitData) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<
        ResponseData<WorkOrderWithUserInfo>
    >('/api/work_order/fund/back/personal/create', payload, {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}
