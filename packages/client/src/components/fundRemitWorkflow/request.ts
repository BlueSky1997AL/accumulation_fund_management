import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';
import { WorkOrder } from '~server/app/util/interface/workOrder';
import { EnterpriseFundRemitSubmitData } from './enterpriseFundRemitForm';

export async function createEnterpriseFundRemitWorkOrder (payload: EnterpriseFundRemitSubmitData) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<ResponseData<WorkOrder>>('/api/work_order/fund/remit/enterprise/create', payload, {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}
