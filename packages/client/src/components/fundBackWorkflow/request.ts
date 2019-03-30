import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';
import { WorkOrder } from '~server/app/util/interface/workOrder';
import { EnterpriseFundBackSubmitData } from './enterpriseFundBackForm';

export async function createEnterpriseFundBackWorkOrder (payload: EnterpriseFundBackSubmitData) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<ResponseData<WorkOrder>>(
        '/api/fund/back/enterprise/create',
        payload,
        {
            headers: {
                'x-csrf-token': csrfToken
            }
        }
    );
    return resp.data;
}
