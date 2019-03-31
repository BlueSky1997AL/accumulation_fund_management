import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';
import { UserInDB } from '~server/app/util/interface/user';

export async function createUser (userData: UserInDB) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<ResponseData<null>>('/api/user/create', userData, {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}
