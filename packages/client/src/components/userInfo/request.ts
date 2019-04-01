import axios from 'axios';
import Cookies from 'js-cookie';

import { UserInfoRespData } from '~server/app/controller/user';
import { ResponseData } from '~server/app/util/interface/common';

export async function getUserInfo () {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.get<ResponseData<UserInfoRespData>>('/api/user/info', {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}

export async function userLost () {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<ResponseData<UserInfoRespData>>('/api/user/lost', null, {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}
