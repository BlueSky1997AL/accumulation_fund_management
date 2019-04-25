import { Controller } from 'egg';
import { MsgType, ResponseData } from '../util/interface/common';
import { UserInDB, UserStatus, UserType } from '../util/interface/user';

export interface SysOverviewInfo {
    totalUserCount: number;
    commonUserCount: number;
    enterpriseUserCount: number;
    adminUserCount: number;
    guestUserCount: number;
    totalBalance: number;
}

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

    public async getSysOverviewInfo() {
        const { ctx } = this;
        const { username } = ctx.session;

        const response: ResponseData<SysOverviewInfo | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const operatorInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (operatorInfo.type !== UserType.Admin) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            const respData = {} as SysOverviewInfo;
            let totalBalance = 0;

            const allUsers = (await ctx.model.User.find()) as UserInDB[];
            const adminUsers = allUsers
                .map(user => {
                    if (user.type === UserType.Admin) {
                        return user;
                    }
                })
                .filter(user => !!user) as UserInDB[];
            const commonUsers = allUsers
                .map(user => {
                    if (user.type === UserType.Common) {
                        totalBalance += user.balance;
                        return user;
                    }
                })
                .filter(user => !!user) as UserInDB[];
            const enterpriseUsers = allUsers
                .map(user => {
                    if (user.type === UserType.Enterprise) {
                        return user;
                    }
                })
                .filter(user => !!user) as UserInDB[];
            const guestUsers = allUsers
                .map(user => {
                    if (user.type === UserType.Guest) {
                        return user;
                    }
                })
                .filter(user => !!user) as UserInDB[];

            respData.totalUserCount = allUsers.length;
            respData.adminUserCount = adminUsers.length;
            respData.commonUserCount = commonUsers.length;
            respData.enterpriseUserCount = enterpriseUsers.length;
            respData.guestUserCount = guestUsers.length;
            respData.totalBalance = totalBalance;

            response.message = MsgType.OPT_SUCCESS;
            response.data = respData;
        }
        ctx.body = response;
    }

    // 测试专用接口，上线前应清除
    // public async test() {
    //     const { ctx } = this;

    //     await ctx.model.User.create({
    //         username: 'admin',
    //         password: 'adminadmin',
    //         name: '超级管理员',
    //         type: UserType.Admin,
    //         status: UserStatus.Normal
    //     });

    //     ctx.body = {
    //         msg: 'ok'
    //     };
    // }
}
