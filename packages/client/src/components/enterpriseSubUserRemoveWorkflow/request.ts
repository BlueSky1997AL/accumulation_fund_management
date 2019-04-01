import axios from 'axios';
import Cookies from 'js-cookie';

import { UserInfoRespData } from '~server/app/controller/user';
import { ResponseData } from '~server/app/util/interface/common';
import { WorkOrder } from '~server/app/util/interface/workOrder';
import { EnterpriseSubUserRemoveSubmitData } from './index';

export async function createEnterpriseSubUserRemoveWorkOrder (payload: EnterpriseSubUserRemoveSubmitData) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<ResponseData<WorkOrder>>('/api/user/enterprise/remove', payload, {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}

export async function getTargetSubUserInfo (userID: string) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.get<ResponseData<UserInfoRespData>>('/api/user/sub_user/info', {
        headers: {
            'x-csrf-token': csrfToken
        },
        params: { userID }
    });
    return resp.data;
}
