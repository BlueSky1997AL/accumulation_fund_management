import { Controller } from 'egg';

import { AmountChangeInDB, AmountChangeInDBWithOwnerInfo } from '../util/interface/amountChange';
import { MsgType, ResponseData } from '../util/interface/common';
import { UserInDB, UserType } from '../util/interface/user';

export default class AmountChangeController extends Controller {
    public async getAllAmountChangesByQuery() {
        const { ctx } = this;
        const { username } = ctx.session;
        const { id, owner, amount, type, source, ownerUsername } = ctx.query;

        const response: ResponseData<AmountChangeInDBWithOwnerInfo[] | null> = {
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
            if (ownerUsername) {
                const targetOwnerInfo = (await ctx.model.User.findOne({ username: ownerUsername })) as UserInDB;
                query.owner = targetOwnerInfo && targetOwnerInfo._id;
            }
            if (type) {
                query.type = type;
            }
            if (source) {
                query.source = source;
            }

            const docs = (await ctx.model.AmountChange.find(query).sort({ createdAt: -1 })) as AmountChangeInDB[];
            const docsWithOwnerInfo = await Promise.all(
                docs.map(async doc => {
                    const ownerInfo = await ctx.model.User.findOne({ _id: doc.owner });
                    return {
                        owner: doc.owner,
                        amount: doc.amount,
                        type: doc.type,
                        source: doc.source,
                        payload: doc.payload,
                        _id: doc._id,
                        createdAt: doc.createdAt,
                        updatedAt: doc.updatedAt,
                        ownerInfo: {
                            username: ownerInfo.username,
                            name: ownerInfo.name,
                            cardNo: ownerInfo.cardNo,
                            employeeID: ownerInfo.employeeID,
                            employerID: ownerInfo.employerID,
                            type: ownerInfo.type,
                            entType: ownerInfo.entType,
                            personType: ownerInfo.personType,
                            status: ownerInfo.status
                        }
                    } as AmountChangeInDBWithOwnerInfo;
                })
            );

            response.message = MsgType.OPT_SUCCESS;
            response.data = docsWithOwnerInfo;
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
