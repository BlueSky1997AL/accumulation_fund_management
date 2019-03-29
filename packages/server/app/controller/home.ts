import { Controller } from 'egg';

import { UserStatus, UserType } from '../util/interface/user';

export default class HomeController extends Controller {
    public async index() {
        const { ctx } = this;
        await ctx.render('index.html', {
            username: ctx.session.username,
            userType: ctx.session.userType
        });
    }

    public async login() {
        const { ctx } = this;
        await ctx.render('login.html');
    }

    // 测试专用接口，上线前应清除
    public async test() {
        const { ctx } = this;
        ctx.model.User.create({
            username: '2',
            password: '2',
            type: UserType.Common,
            status: UserStatus.Normal,
            balance: 20000
        });
        ctx.body = {
            msg: 'ok'
        };
    }
}
