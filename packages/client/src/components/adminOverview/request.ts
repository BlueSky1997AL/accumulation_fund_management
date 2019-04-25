import axios from 'axios';
import Cookies from 'js-cookie';

import { SysOverviewInfo } from '~server/app/controller/home';
import {
    AmountChangeInDBWithOwnerInfo,
    AmountChangeSource,
    AmountChangeType
} from '~server/app/util/interface/amountChange';
import { ResponseData } from '~server/app/util/interface/common';

export async function getSysOverviewInfo () {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.get<ResponseData<SysOverviewInfo>>('/api/sys_overview', {
        headers: {
            'x-csrf-token': csrfToken
        }
    });
    return resp.data;
}

type objectID = string;
export interface AmountChangeAdminQuery {
    id?: objectID;
    owner?: objectID;
    ownerUsername?: string;
    amount?: number;
    type?: AmountChangeType;
    source?: AmountChangeSource;
}

export async function getAllAmountChangesByQuery (query?: AmountChangeAdminQuery) {
    const csrfToken = Cookies.get('csrfToken');
    const resp = await axios.get<ResponseData<AmountChangeInDBWithOwnerInfo[]>>('/api/amount_change/query_admin', {
        headers: {
            'x-csrf-token': csrfToken
        },
        params: query
    });
    return resp.data;
}
