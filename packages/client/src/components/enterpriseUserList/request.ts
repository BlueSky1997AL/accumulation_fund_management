import axios from 'axios';
import Cookies from 'js-cookie';

import { UserInfoRespData } from '~server/app/controller/user';
import { ResponseData } from '~server/app/util/interface/common';

export async function getSubUsers () {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.get<ResponseData<UserInfoRespData[]>>('/api/user/sub_users', {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}
