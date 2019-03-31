// tslint:disable: no-string-literal

import { Controller } from 'egg';

import { MsgType, ResponseData } from '../util/interface/common';
import { UserInDB, UserStatus, UserType } from '../util/interface/user';

export interface UserInfoRespData {
    id: string;
    username: string;
    type: UserType;
    status: UserStatus;
    balance: number;
}

export default class UserController extends Controller {
    public async login() {
        const { ctx } = this;
        const { username, password } = ctx.request.body;

        const response: ResponseData<null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (userInfo && userInfo.password === password) {
            ctx.session.username = username;
            ctx.session.password = password;
            ctx.session.userType = userInfo.type;
            response.message = MsgType.LOGIN_SUCCESS;
        } else if (!userInfo) {
            response.message = MsgType.INCORRECT_USERNAME;
        } else {
            response.message = MsgType.INCORRECT_PASSWORD;
        }

        ctx.body = response;
    }

    public async logout() {
        const { ctx } = this;

        const response: ResponseData<null> = {
            message: MsgType.OPT_SUCCESS,
            data: null
        };

        ctx.session.username = '';
        ctx.session.password = '';
        ctx.session.userType = '';

        ctx.body = response;
    }

    public async getUserInfo() {
        const { ctx } = this;
        const { username } = ctx.session;

        const response: ResponseData<UserInfoRespData | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        response.message = MsgType.OPT_SUCCESS;
        response.data = {
            id: (userInfo as any)['_id'],
            username: userInfo.username,
            type: userInfo.type,
            status: userInfo.status,
            balance: userInfo.balance
        };

        ctx.body = response;
    }

    public async getFullUserInfo() {
        const { ctx } = this;
        const { username } = ctx.session;
        const { id } = ctx.queries;

        const response: ResponseData<UserInDB | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (userInfo.type !== UserType.Admin) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            const targetUserInfo = (await ctx.model.User.findOne({ _id: id })) as UserInDB;
            response.message = MsgType.OPT_SUCCESS;
            response.data = targetUserInfo;
        }

        ctx.body = response;
    }

    public async getAllUserInfo() {
        const { ctx } = this;
        const { username } = ctx.session;

        const response: ResponseData<UserInDB[] | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (userInfo.type !== UserType.Admin) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            const allUsers = (await ctx.model.User.find()) as UserInDB[];
            response.message = MsgType.OPT_SUCCESS;
            response.data = allUsers;
        }

        ctx.body = response;
    }

    public async createUser() {
        const { ctx } = this;
        const { username } = ctx.session;
        const { username: targetUsername, status, password, balance, subUser, type } = ctx.request.body as UserInDB;

        const response: ResponseData<null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (userInfo.type !== UserType.Admin) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            const userData: { [propName: string]: any } = {
                username: targetUsername,
                password,
                status,
                type
            };
            if (type !== UserType.Admin) {
                userData['balance'] = balance;
            }
            if (type === UserType.Enterprise) {
                userData['subUser'] = subUser;
            }

            await ctx.model.User.create(userData);
            response.message = MsgType.OPT_SUCCESS;
        }

        ctx.body = response;
    }

    public async updateUserStatus() {
        const { ctx } = this;
        const { username } = ctx.session;
        const { id, status } = ctx.request.body as { id: string; status: UserStatus };

        const response: ResponseData<null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (status === UserStatus.Frozen && userInfo._id === id) {
            await ctx.model.User.updateOne({ _id: id }, { status: UserStatus.Frozen });
            response.message = MsgType.OPT_SUCCESS;
        } else if (userInfo.type === UserType.Admin) {
            await ctx.model.User.updateOne({ _id: id }, { status });
            response.message = MsgType.OPT_SUCCESS;
        } else {
            response.message = MsgType.NO_PERMISSION;
        }

        ctx.body = response;
    }

    public async updateUserInfo() {
        const { ctx } = this;
        const { username } = ctx.session;
        const { _id, username: targetUsername, status, password, balance, subUser } = ctx.request.body;

        const response: ResponseData<null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        const targetUserInfo = (await ctx.model.User.findOne({ _id })) as UserInDB;
        if (userInfo.type !== UserType.Admin) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            const updateData: { [propName: string]: any } = {
                username: targetUsername,
                password,
                status
            };
            if (targetUserInfo.type !== UserType.Admin) {
                updateData['balance'] = balance;
            }
            if (targetUserInfo.type === UserType.Enterprise) {
                updateData['subUser'] = subUser;
            }

            await ctx.model.User.update({ _id }, updateData);
            response.message = MsgType.OPT_SUCCESS;
        }

        ctx.body = response;
    }
}
