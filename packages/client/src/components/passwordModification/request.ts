import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';
import { PasswordModificationSubmitData } from './index';

export async function updatePassword (payload: PasswordModificationSubmitData) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<ResponseData<null>>('/api/password', payload, {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}
