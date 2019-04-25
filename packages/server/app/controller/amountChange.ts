import { Controller } from 'egg';

import { AmountChangeInDB } from '../util/interface/amountChange';
import { MsgType, ResponseData } from '../util/interface/common';
import { UserInDB, UserType } from '../util/interface/user';

export default class AmountChangeController extends Controller {
    public async getAllAmountChangesByQuery() {
        const { ctx } = this;
        const { username } = ctx.session;
        const { id, owner, amount, type, source } = ctx.query;

        const response: ResponseData<AmountChangeInDB[] | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (userInfo.type !== UserType.Admin) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            const query = {} as AmountChangeInDB;
            if (id) {
                query._id = id;
            }
            if (amount) {
                query.amount = parseInt(amount, 10);
            }
            if (owner) {
                query.owner = owner;
            }
            if (type) {
                query.type = type;
            }
            if (source) {
                query.source = source;
            }

            const docs = (await ctx.model.AmountChange.find(query).sort({ createdAt: -1 })) as AmountChangeInDB[];

            response.message = MsgType.OPT_SUCCESS;
            response.data = docs;
        }
        ctx.body = response;
    }

    public async getPersonalAmountChangesByQuery() {
        const { ctx } = this;
        const { username } = ctx.session;
        const { id, amount, type, source } = ctx.query;

        const response: ResponseData<AmountChangeInDB[] | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (userInfo && userInfo.amountChanges!.length !== 0) {
            const query = {
                owner: userInfo._id
            } as AmountChangeInDB;
            if (id) {
                query._id = id;
            }
            if (amount) {
                query.amount = parseInt(amount, 10);
            }
            if (type) {
                query.type = type;
            }
            if (source) {
                query.source = source;
            }

            const docs = (await ctx.model.AmountChange.find(query).sort({ createdAt: -1 })) as AmountChangeInDB[];

            response.message = MsgType.OPT_SUCCESS;
            response.data = docs;
        } else {
            response.message = MsgType.OPT_SUCCESS;
            response.data = [];
        }

        ctx.body = response;
    }
}
