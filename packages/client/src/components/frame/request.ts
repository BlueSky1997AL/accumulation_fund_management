import axios from 'axios';
import Cookies from 'js-cookie';

import { ResponseData } from '~server/app/util/interface/common';

export async function logout () {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.post<ResponseData<null>>(
        '/api/logout',
        null,
        {
            headers: {
                'x-csrf-token': csrfToken
            }
        }
    );
    return resp.data;
}
