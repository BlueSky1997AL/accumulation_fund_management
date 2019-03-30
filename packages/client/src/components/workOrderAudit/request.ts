import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';
import { WorkOrderAuditSubmitData } from './index';

export async function auditWorkOrder (data: WorkOrderAuditSubmitData) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<ResponseData<null>>('/api/work_order/audit', data, {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}
