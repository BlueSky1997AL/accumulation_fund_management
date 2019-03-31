import { Context } from 'egg';

import { MsgType } from '../util/interface/common';
import { User, UserStatus } from '../util/interface/user';

export default function UserProtectionMiddleware (): any {
    return async (ctx: Context, next: () => Promise<any>) => {
        const { username } = ctx.session;

        const userInfo = (await ctx.model.User.findOne({ username })) as User;
        if (userInfo && userInfo.status === UserStatus.Normal) {
            await next();
        } else {
            ctx.body = {
                message: MsgType.OPT_NOT_ALLOWED,
                data: null
            };
        }
    };
}
