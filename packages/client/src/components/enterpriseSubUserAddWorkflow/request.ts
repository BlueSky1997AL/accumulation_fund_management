import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';
import { WorkOrder } from '~server/app/util/interface/workOrder';
import { EnterpriseSubUserAddSubmitData } from './enterpriseSubUserAddForm';

export async function createEnterpriseSubUserAddWorkOrder (payload: EnterpriseSubUserAddSubmitData) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<ResponseData<WorkOrder>>('/api/work_order/account/enterprise/subuser/add', payload, {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}
