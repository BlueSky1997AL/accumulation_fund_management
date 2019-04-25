import axios from 'axios';
import Cookies from 'js-cookie';

import { AmountChangeInDB, AmountChangeSource, AmountChangeType } from '~server/app/util/interface/amountChange';
import { ResponseData } from '~server/app/util/interface/common';

type objectID = string;
export interface AmountChangeUserQuery {
    id?: objectID;
    amount?: number;
    type?: AmountChangeType;
    source?: AmountChangeSource;
}

export async function getPersonalAmountChangesByQuery (query?: AmountChangeUserQuery) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.get<ResponseData<AmountChangeInDB[]>>('/api/amount_change/query_user', {
        headers: {
            'x-csrf-token': csrfToken
        },
        params: query
    });
    return resp.data;
}
