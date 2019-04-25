import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';
import { WorkOrderInDB } from '~server/app/util/interface/workOrder';
import { SignUpSubmitData } from './index';

export async function signup (payload: SignUpSubmitData) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<ResponseData<WorkOrderInDB>>('/api/signup', payload, {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}
