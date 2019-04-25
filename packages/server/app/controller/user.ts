// tslint:disable: no-string-literal

import { Controller } from 'egg';

import { MsgType, ResponseData } from '../util/interface/common';
import { EnterpriseType, PersonType, UserInDB, UserStatus, UserType } from '../util/interface/user';

import { PasswordModificationSubmitData } from '../../../client/src/components/passwordModification';

export interface UserInfoRespData {
    id: string;
    username: string;
    name: string;
    cardNo?: string;
    employeeID?: string;
    type: UserType;
    entType?: EnterpriseType;
    entInfo?: {
        name: string;
        username: string;
    };
    personType?: PersonType;
    status: UserStatus;
    balance: number;
    subUserCount: number;
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
        if (userInfo && userInfo.status !== UserStatus.Disabled && userInfo.password === password) {
            ctx.session.username = username;
            ctx.session.password = password;
            ctx.session.userType = userInfo.type;
            ctx.session.personType = userInfo.personType;
            ctx.session.name = userInfo.name;
            response.message = MsgType.LOGIN_SUCCESS;
        } else if (!userInfo) {
            response.message = MsgType.INCORRECT_USERNAME;
        } else if (userInfo.status === UserStatus.Disabled) {
            response.message = MsgType.USER_DISABLED;
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
        let entInfo: UserInDB = {} as any;
        if (userInfo.type === UserType.Common && userInfo.personType === PersonType.Employees) {
            entInfo = (await ctx.model.User.findById(userInfo.employerID)) as UserInDB;
        }
        response.message = MsgType.OPT_SUCCESS;
        response.data = {
            id: userInfo._id,
            username: userInfo.username,
            name: userInfo.name,
            cardNo: userInfo.cardNo,
            employeeID: userInfo.employeeID,
            type: userInfo.type,
            entType: userInfo.entType,
            entInfo: {
                name: entInfo && entInfo.name,
                username: entInfo && entInfo.username
            },
            personType: userInfo.personType,
            status: userInfo.status,
            balance: userInfo.balance,
            subUserCount: userInfo.subUser!.length
        };

        ctx.body = response;
    }

    public async getTargetUserInfo() {
        const { ctx } = this;
        const { username } = ctx.session;
        const { userID, username: targetUsername } = ctx.query;

        const response: ResponseData<UserInfoRespData | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const queryInfo: { [propName: string]: string } = {};
        if (userID) {
            queryInfo._id = userID;
        }
        if (targetUsername) {
            queryInfo.username = targetUsername;
        }

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        const targetUserInfo = (await ctx.model.User.findOne(queryInfo)) as UserInDB;

        if (!targetUserInfo) {
            response.message = MsgType.INCORRECT_USERNAME;
            ctx.body = response;
            return;
        }

        if (userInfo.type === UserType.Admin || userInfo.type === UserType.Enterprise) {
            response.data = {
                id: targetUserInfo._id,
                username: targetUserInfo.username,
                name: targetUserInfo.name,
                cardNo: targetUserInfo.cardNo,
                employeeID: targetUserInfo.employeeID,
                type: targetUserInfo.type,
                entType: targetUserInfo.entType,
                personType: targetUserInfo.personType,
                status: targetUserInfo.status,
                balance: targetUserInfo.balance,
                subUserCount: targetUserInfo.subUser!.length
            };
            response.message = MsgType.OPT_SUCCESS;
        } else {
            response.message = MsgType.NO_PERMISSION;
        }

        ctx.body = response;
    }

    public async getFullUserInfo() {
        const { ctx } = this;
        const { username } = ctx.session;
        const { id, username: targetUsername } = ctx.query;

        const response: ResponseData<UserInDB | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (userInfo.type !== UserType.Admin) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            const queryInfo: { [propName: string]: string } = {};
            if (id) {
                queryInfo._id = id;
            }
            if (targetUsername) {
                queryInfo.username = targetUsername;
            }

            const targetUserInfo = (await ctx.model.User.findOne(queryInfo)) as UserInDB;
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

    public async getSubUserInfo() {
        const { ctx } = this;
        const { username } = ctx.session;

        const response: ResponseData<UserInfoRespData[] | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (userInfo.type !== UserType.Enterprise) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            const subsUserIDs = userInfo.subUser!;
            const retData = await Promise.all(
                subsUserIDs.map(async userID => {
                    const targetUserInfo = (await ctx.model.User.findOne({ _id: userID })) as UserInDB;
                    return {
                        id: targetUserInfo._id,
                        username: targetUserInfo.username,
                        name: targetUserInfo.name,
                        cardNo: targetUserInfo.cardNo,
                        employeeID: targetUserInfo.employeeID,
                        status: targetUserInfo.status,
                        balance: targetUserInfo.balance
                    } as UserInfoRespData;
                })
            );

            response.message = MsgType.OPT_SUCCESS;
            response.data = retData;
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

    public async handleUserLost() {
        const { ctx } = this;
        const { username } = ctx.session;

        const response: ResponseData<null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        try {
            await ctx.model.User.updateOne({ username }, { status: UserStatus.Lost });
            response.message = MsgType.OPT_SUCCESS;
        } catch (error) {
            ctx.logger.error(error);
        }

        ctx.body = response;
    }

    public async updatePassword() {
        const { ctx } = this;
        const { username } = ctx.session;
        const { oldPassword, newPassword } = ctx.request.body as PasswordModificationSubmitData;

        const response: ResponseData<null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (oldPassword === userInfo.password) {
            try {
                await ctx.model.User.update({ username }, { password: newPassword });
                response.message = MsgType.OPT_SUCCESS;
            } catch (error) {
                ctx.logger.error(error);
                response.message = MsgType.OPT_FAILED;
            }
        } else {
            response.message = MsgType.INCORRECT_PASSWORD;
        }

        ctx.body = response;
    }
}
