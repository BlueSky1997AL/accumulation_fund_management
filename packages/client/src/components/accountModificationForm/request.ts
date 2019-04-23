import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';
import { UserInDB } from '~server/app/util/interface/user';

export async function getFullUserInfo (id?: string, username?: string) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.get<ResponseData<UserInDB>>('/api/user/full_info', {
        headers: {
            'x-csrf-token': csrfToken
        },
        params: { id, username }
    });
    return resp.data;
}

export async function updateUserInfo (userData: UserInDB) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<ResponseData<null>>('/api/user/update', userData, {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}
