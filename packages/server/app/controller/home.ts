import { Controller } from 'egg';
import { UserStatus, UserType } from '../util/interface/user';

export default class HomeController extends Controller {
    public async index() {
        const { ctx } = this;
        await ctx.render('index.html', {
            username: ctx.session.username,
            userType: ctx.session.userType,
            personType: typeof ctx.session.personType === 'number' ? ctx.session.personType : 'undefined',
            name: ctx.session.name
        });
    }

    public async login() {
        const { ctx } = this;
        await ctx.render('login.html');
    }

    public async signup() {
        const { ctx } = this;
        await ctx.render('signup.html');
    }

    // 测试专用接口，上线前应清除
    public async test() {
        const { ctx } = this;

        // await ctx.model.User.updateOne(
        //     {
        //         username: '142303121212312'
        //     },
        //     { cardNo: '888888888' }
        // );

        // await ctx.model.User.create({
        //     username: 'admin',
        //     password: 'adminadmin',
        //     name: '超级管理员',
        //     type: UserType.Admin,
        //     status: UserStatus.Normal
        // });

        ctx.body = {
            msg: 'ok'
        };
    }
}
