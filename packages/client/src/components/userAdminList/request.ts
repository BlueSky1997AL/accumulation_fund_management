import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';
import { UserInDB, UserStatus } from '~server/app/util/interface/user';

export async function getAllUsers () {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.get<ResponseData<UserInDB[]>>('/api/user/all', {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}

export async function updateUserStatus (id: string, status: UserStatus) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<ResponseData<null>>(
        '/api/user/update_status',
        { id, status },
        {
            headers: {
                'x-csrf-token': csrfToken
            }
        }
    );
    return resp.data;
}
