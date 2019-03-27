import { Context } from 'egg';

import { MsgType } from '../util/interface/common';
import { User } from '../util/interface/user';

export default function AuthCheckMiddleware (): any {
    return async (ctx: Context, next: () => Promise<any>) => {
        const { username, password } = ctx.session;

        const userInfo = (await ctx.model.User.findOne({ username })) as User;
        if (userInfo && userInfo.password === password) {
            await next();
        } else {
            if (ctx.request.method === 'GET') {
                ctx.redirect('/login');
            } else {
                ctx.status = 401;
                ctx.body = {
                    message: MsgType.UNAUTHORIZED,
                    data: null
                };
            }
        }
    };
}
