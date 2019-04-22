// tslint:disable: no-string-literal

import { Controller } from 'egg';

import { CommonWorkOrderSubmitData } from '../../../client/src/components/commonWorkflow';
import { EnterpriseSubUserAddSubmitData } from '../../../client/src/components/enterpriseSubUserAddWorkflow/enterpriseSubUserAddForm';
import { EnterpriseSubUserRemoveSubmitData } from '../../../client/src/components/enterpriseSubUserRemoveWorkflow';
import { EnterpriseFundBackSubmitData } from '../../../client/src/components/fundBackWorkflow/enterpriseFundBackForm';
import { PersonalFundBackSubmitData } from '../../../client/src/components/fundBackWorkflow/personalFundBackForm';
import { PersonalFundDrawSubmitData } from '../../../client/src/components/fundDrawWorkflow/personalFundDrawForm';
import { EnterpriseFundRemitSubmitData } from '../../../client/src/components/fundRemitWorkflow/enterpriseFundRemitForm';
import { SignUpSubmitData } from '../../../client/src/components/signup';
import { MsgType, ResponseData } from '../util/interface/common';
import { PersonType, User, UserInDB, UserType } from '../util/interface/user';
import {
    AuditOperationType,
    WorkOrder,
    WorkOrderInDB,
    WorkOrderStatus,
    WorkOrderType,
    WorkOrderWithUserInfo
} from '../util/interface/workOrder';

interface WorkOrderAuditSubmitData {
    workOrderID: string;
    comments: string;
    opType: AuditOperationType;
}

export default class WorkOrderController extends Controller {
    public async getAllWorkOrder() {
        const { ctx } = this;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrderWithUserInfo[] | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as User;
        if (userInfo.type !== UserType.Admin) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            const docs = (await ctx.model.WorkOrder.find().sort({ createdAt: -1 })) as WorkOrder[];
            const docsWithUserInfo = await Promise.all(
                docs.map(async doc => {
                    const docUserInfo = (await ctx.model.User.findOne({ _id: doc.owner })) as User;
                    const newDoc = {
                        _id: doc['_id'],
                        status: doc['status'],
                        type: doc['type'],
                        owner: {
                            username: docUserInfo.username,
                            type: docUserInfo.type,
                            status: docUserInfo.status
                        },
                        payload: doc['payload'],
                        createdAt: doc['createdAt'],
                        updatedAt: doc['updatedAt'],
                        __v: doc['__v']
                    };
                    return newDoc as WorkOrderWithUserInfo;
                })
            );

            response.message = MsgType.OPT_SUCCESS;
            response.data = docsWithUserInfo;
        }
        ctx.body = response;
    }

    public async getPersonalWorkOrder() {
        const { ctx } = this;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrder[] | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as User;
        if (userInfo.workOrders && userInfo.workOrders.length !== 0) {
            const workOrderData = await Promise.all(
                userInfo.workOrders.map(async id => {
                    return (await ctx.model.WorkOrder.findOne({ _id: id })) as WorkOrder;
                })
            );

            response.message = MsgType.OPT_SUCCESS;
            response.data = workOrderData.reverse();
        } else {
            response.message = MsgType.OPT_SUCCESS;
            response.data = [];
        }

        ctx.body = response;
    }

    public async getWorkOrder() {
        const { ctx } = this;
        const { username } = ctx.session;
        const { workOrderID } = ctx.queries;

        const response: ResponseData<WorkOrderWithUserInfo | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as User;
        const workOrderInfo = (await ctx.model.WorkOrder.findOne({ _id: workOrderID })) as WorkOrder;
        const workOrderOwnerInfo = (await ctx.model.User.findOne({ _id: workOrderInfo.owner })) as User;
        const retDoc = {
            _id: workOrderInfo['_id'],
            status: workOrderInfo['status'],
            type: workOrderInfo['type'],
            owner: {
                username: workOrderOwnerInfo.username,
                type: workOrderOwnerInfo.type,
                status: workOrderOwnerInfo.status
            },
            comments: workOrderInfo['comments'],
            auditer: workOrderInfo['auditer'],
            payload: workOrderInfo['payload'],
            createdAt: workOrderInfo['createdAt'],
            updatedAt: workOrderInfo['updatedAt'],
            __v: workOrderInfo['__v']
        };

        if (`${userInfo['_id']}` === `${workOrderInfo.owner}`) {
            response.message = MsgType.OPT_SUCCESS;
            response.data = retDoc;
        } else {
            if (userInfo.type === UserType.Admin) {
                response.message = MsgType.OPT_SUCCESS;
                response.data = retDoc;
            } else {
                response.message = MsgType.NO_PERMISSION;
            }
        }
        ctx.body = response;
    }

    public async handleWorkOrder() {
        const { ctx } = this;
        const { username } = ctx.session;
        const { workOrderID, opType, comments } = ctx.request.body as WorkOrderAuditSubmitData;

        const response: ResponseData<null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as User;

        if (userInfo.type !== UserType.Admin) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            const workOrderInfo = (await ctx.model.WorkOrder.findOne({ _id: workOrderID })) as WorkOrder;

            const dateNow = new Date();
            if (opType === AuditOperationType.Granted) {
                workOrderInfo.status = WorkOrderStatus.Granted;
                workOrderInfo.auditTimestamp = dateNow;
            } else if (opType === AuditOperationType.Rejected) {
                workOrderInfo.status = WorkOrderStatus.Rejected;
                workOrderInfo.auditTimestamp = dateNow;
            } else {
                response.message = MsgType.ILLEGAL_ARGS;
                ctx.body = response;
                return;
            }
            workOrderInfo.auditer = userInfo['_id'];
            workOrderInfo.comments = comments;

            if (opType === AuditOperationType.Granted) {
                const err = await ctx.service.workOrder.workOrderExecuter(workOrderInfo);
                if (err !== null) {
                    response.message = err;
                    ctx.body = response;
                    return;
                }
            }

            await ctx.model.WorkOrder.update({ _id: workOrderID }, workOrderInfo);
            response.message = MsgType.OPT_SUCCESS;
        }

        ctx.body = response;
    }

    public async creactEnterpriseFundBackWorkOrder() {
        const { ctx } = this;
        const { amountMap, comments, accessory } = ctx.request.body as EnterpriseFundBackSubmitData;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrder | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as User;
        if (userInfo.type !== UserType.Enterprise) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            if (amountMap && Array.isArray(amountMap)) {
                const targetUserInfos: UserInDB[] = [];
                try {
                    await Promise.all(
                        amountMap.map(async amountItem => {
                            await Promise.all(
                                amountItem.usernames.map(async targetUsername => {
                                    const targetUserInfo = await ctx.model.User.findOne({ username: targetUsername });
                                    if (targetUserInfo) {
                                        targetUserInfos.push(targetUserInfo);
                                    } else {
                                        response.message = MsgType.USER_NOT_DOUND;
                                        ctx.body = response;
                                        throw new Error(MsgType.USER_NOT_DOUND);
                                    }
                                })
                            );
                        })
                    );
                } catch (error) {
                    if (error.message === MsgType.USER_NOT_DOUND) {
                        response.message = MsgType.USER_NOT_DOUND;
                        ctx.body = response;
                        return;
                    }
                    throw new Error(error);
                }

                const isTargetUserLegal = targetUserInfos.every(targetUserInfo => {
                    return (userInfo.subUser as string[]).indexOf(targetUserInfo._id) !== -1;
                });

                if (!isTargetUserLegal) {
                    response.message = MsgType.OPT_ILLEGAL;
                    ctx.body = response;
                    return;
                }
            } else {
                response.message = MsgType.ILLEGAL_ARGS;
                ctx.body = response;
                return;
            }

            const payload = JSON.stringify({ amountMap, comments, accessory });
            const workOrder: WorkOrder = {
                status: WorkOrderStatus.Open,
                type: WorkOrderType.EnterpriseBack,
                owner: userInfo['_id'],
                payload
            };

            try {
                const createdDoc = await ctx.model.WorkOrder.create(workOrder);
                if (userInfo.workOrders) {
                    userInfo.workOrders.push(createdDoc['_id']);
                } else {
                    userInfo.workOrders = [ createdDoc['_id'] ];
                }
                await ctx.model.User.update({ _id: userInfo['_id'] }, userInfo);

                response.message = MsgType.OPT_SUCCESS;
                response.data = createdDoc;
            } catch (error) {
                console.error(error);
                response.message = MsgType.OPT_FAILED;
            }
        }
        ctx.body = response;
    }

    public async creactPersonalFundBackWorkOrder() {
        const { ctx } = this;
        const { amount, comments, accessory } = ctx.request.body as PersonalFundBackSubmitData;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrder | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as User;
        if (userInfo.type !== UserType.Common) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            const payload = JSON.stringify({ amount, comments, accessory });
            const workOrder: WorkOrder = {
                status: WorkOrderStatus.Open,
                type: WorkOrderType.PersonalBack,
                owner: userInfo['_id'],
                payload
            };

            try {
                const createdDoc = await ctx.model.WorkOrder.create(workOrder);
                if (userInfo.workOrders) {
                    userInfo.workOrders.push(createdDoc['_id']);
                } else {
                    userInfo.workOrders = [ createdDoc['_id'] ];
                }
                await ctx.model.User.update({ _id: userInfo['_id'] }, userInfo);

                response.message = MsgType.OPT_SUCCESS;
                response.data = createdDoc;
            } catch (error) {
                console.error(error);
                response.message = MsgType.OPT_FAILED;
            }
        }
        ctx.body = response;
    }

    public async createEnterpriseFundRemitWorkOrder() {
        const { ctx } = this;
        const { month, amountMap, comments, accessory } = ctx.request.body as EnterpriseFundRemitSubmitData;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrder | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as User;
        if (userInfo.type !== UserType.Enterprise) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            if (amountMap && Array.isArray(amountMap)) {
                const targetUserInfos: UserInDB[] = [];
                try {
                    await Promise.all(
                        amountMap.map(async amountItem => {
                            await Promise.all(
                                amountItem.usernames.map(async targetUsername => {
                                    const targetUserInfo = await ctx.model.User.findOne({ username: targetUsername });
                                    if (targetUserInfo) {
                                        targetUserInfos.push(targetUserInfo);
                                    } else {
                                        response.message = MsgType.USER_NOT_DOUND;
                                        ctx.body = response;
                                        throw new Error(MsgType.USER_NOT_DOUND);
                                    }
                                })
                            );
                        })
                    );
                } catch (error) {
                    if (error.message === MsgType.USER_NOT_DOUND) {
                        response.message = MsgType.USER_NOT_DOUND;
                        ctx.body = response;
                        return;
                    }
                    throw new Error(error);
                }

                const isTargetUserLegal = targetUserInfos.every(targetUserInfo => {
                    return (userInfo.subUser as string[]).indexOf(targetUserInfo._id) !== -1;
                });

                if (!isTargetUserLegal) {
                    response.message = MsgType.OPT_ILLEGAL;
                    ctx.body = response;
                    return;
                }
            } else {
                response.message = MsgType.ILLEGAL_ARGS;
                ctx.body = response;
                return;
            }

            const payload = JSON.stringify({ month, amountMap, comments, accessory });
            const workOrder: WorkOrder = {
                status: WorkOrderStatus.Open,
                type: WorkOrderType.Remit,
                owner: userInfo['_id'],
                payload
            };

            try {
                const createdDoc = await ctx.model.WorkOrder.create(workOrder);
                if (userInfo.workOrders) {
                    userInfo.workOrders.push(createdDoc['_id']);
                } else {
                    userInfo.workOrders = [ createdDoc['_id'] ];
                }
                await ctx.model.User.update({ _id: userInfo['_id'] }, userInfo);

                response.message = MsgType.OPT_SUCCESS;
                response.data = createdDoc;
            } catch (error) {
                console.error(error);
                response.message = MsgType.OPT_FAILED;
            }
        }
        ctx.body = response;
    }

    public async createPersonalFundDrawWorkOrder() {
        const { ctx } = this;
        const { amount, comments, accessory } = ctx.request.body as PersonalFundDrawSubmitData;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrder | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (userInfo.type !== UserType.Common) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            const payload = JSON.stringify({ amount, comments, accessory });
            const workOrder: WorkOrder = {
                status: WorkOrderStatus.Open,
                type: WorkOrderType.Draw,
                owner: userInfo._id,
                payload
            };

            try {
                const createdDoc = await ctx.model.WorkOrder.create(workOrder);
                if (userInfo.workOrders) {
                    userInfo.workOrders.push(createdDoc._id);
                } else {
                    userInfo.workOrders = [ createdDoc._id ];
                }
                await ctx.model.User.update({ _id: userInfo._id }, userInfo);

                response.message = MsgType.OPT_SUCCESS;
                response.data = createdDoc;
            } catch (error) {
                console.error(error);
                response.message = MsgType.OPT_FAILED;
            }
        }
        ctx.body = response;
    }

    public async createCommonWorkOrder() {
        const { ctx } = this;
        const { comments, workOrderType, accessory } = ctx.request.body as CommonWorkOrderSubmitData;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrder | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (userInfo.type === UserType.Admin) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            const payload = JSON.stringify({ comments, accessory, workOrderType });
            const workOrder: WorkOrder = {
                status: WorkOrderStatus.Open,
                type: workOrderType,
                owner: userInfo._id,
                payload
            };

            try {
                const createdDoc = await ctx.model.WorkOrder.create(workOrder);
                if (userInfo.workOrders) {
                    userInfo.workOrders.push(createdDoc._id);
                } else {
                    userInfo.workOrders = [ createdDoc._id ];
                }
                await ctx.model.User.update({ _id: userInfo._id }, userInfo);

                response.message = MsgType.OPT_SUCCESS;
                response.data = createdDoc;
            } catch (error) {
                console.error(error);
                response.message = MsgType.OPT_FAILED;
            }
        }
        ctx.body = response;
    }

    public async createEnterpriseSubUserRemoveWorkOrder() {
        const { ctx } = this;
        const { comments, userID, accessory } = ctx.request.body as EnterpriseSubUserRemoveSubmitData;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrder | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (userInfo.type !== UserType.Enterprise) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            const payload = JSON.stringify({ comments, userID, accessory });
            const workOrder: WorkOrder = {
                status: WorkOrderStatus.Open,
                type: WorkOrderType.RemoveSubUser,
                owner: userInfo._id,
                payload
            };

            try {
                const createdDoc = await ctx.model.WorkOrder.create(workOrder);
                if (userInfo.workOrders) {
                    userInfo.workOrders.push(createdDoc._id);
                } else {
                    userInfo.workOrders = [ createdDoc._id ];
                }
                await ctx.model.User.update({ _id: userInfo._id }, userInfo);

                response.message = MsgType.OPT_SUCCESS;
                response.data = createdDoc;
            } catch (error) {
                console.error(error);
                response.message = MsgType.OPT_FAILED;
            }
        }
        ctx.body = response;
    }

    public async createEnterpriseSubUserAddWorkOrder() {
        const { ctx } = this;
        const { usernames, comments, accessory } = ctx.request.body as EnterpriseSubUserAddSubmitData;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrder | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (userInfo.type !== UserType.Enterprise) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            if (usernames && Array.isArray(usernames)) {
                try {
                    await Promise.all(
                        usernames.map(async targetUsername => {
                            const targetUserInfo = (await ctx.model.User.findOne({
                                username: targetUsername
                            })) as UserInDB;
                            if (!targetUserInfo) {
                                throw new Error(MsgType.USER_NOT_DOUND);
                            }
                            (userInfo.subUser as string[]).some(subUserID => {
                                if (String(targetUserInfo._id) === String(subUserID)) {
                                    throw new Error(MsgType.ALREADY_IN_SUB_USERS);
                                }
                                return true;
                            });
                        })
                    );
                } catch (error) {
                    if (error.message === MsgType.USER_NOT_DOUND) {
                        response.message = MsgType.USER_NOT_DOUND;
                        ctx.body = response;
                        return;
                    }
                    if (error.message === MsgType.ALREADY_IN_SUB_USERS) {
                        response.message = MsgType.ALREADY_IN_SUB_USERS;
                        ctx.body = response;
                        return;
                    }
                    throw new Error(error);
                }
            } else {
                response.message = MsgType.ILLEGAL_ARGS;
                ctx.body = response;
                return;
            }

            const payload = JSON.stringify({ usernames, comments, accessory });
            const workOrder: WorkOrder = {
                status: WorkOrderStatus.Open,
                type: WorkOrderType.AddSubUser,
                owner: userInfo._id,
                payload
            };

            try {
                const createdDoc = (await ctx.model.WorkOrder.create(workOrder)) as WorkOrderInDB;
                if (userInfo.workOrders) {
                    userInfo.workOrders.push(createdDoc._id);
                } else {
                    userInfo.workOrders = [ createdDoc._id ];
                }
                await ctx.model.User.update({ _id: userInfo._id }, userInfo);

                response.message = MsgType.OPT_SUCCESS;
                response.data = createdDoc;
            } catch (error) {
                ctx.logger.error(error);
                response.message = MsgType.OPT_FAILED;
            }
        }
        ctx.body = response;
    }

    public async createSignUpWorkOrder() {
        const { ctx } = this;
        const {
            username,
            password,
            name,
            cardNo,
            employeeID,
            type,
            entType,
            personType,
            entID,
            balance,
            comments,
            accessory
        } = ctx.request.body as SignUpSubmitData;

        const response: ResponseData<WorkOrder | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        if (type === UserType.Common || type === UserType.Enterprise) {
            const isUserExists = (await ctx.model.User.findOne({ username })) as UserInDB;
            if (isUserExists) {
                response.message = MsgType.USERNAME_EXISTS;
                ctx.body = response;
                return;
            }

            if (type === UserType.Common && personType === PersonType.Employees) {
                if (!entID) {
                    response.message = MsgType.ILLEGAL_ARGS;
                    ctx.body = response;
                    return;
                }
                const isEntExists = (await ctx.model.User.findOne({ username: entID })) as UserInDB;
                if (!isEntExists) {
                    response.message = MsgType.ENTERPRISE_NOT_FOUND;
                    ctx.body = response;
                    return;
                }
            }

            if (type !== UserType.Common && balance) {
                response.message = MsgType.ILLEGAL_ARGS;
                ctx.body = response;
                return;
            }

            const payload = JSON.stringify({
                username,
                password,
                name,
                cardNo,
                employeeID,
                type,
                entType,
                entID,
                personType,
                balance,
                comments,
                accessory
            });
            const guestAccount = await ctx.service.user.getGuestAccount();
            const workOrder: WorkOrder = {
                status: WorkOrderStatus.Open,
                type: WorkOrderType.SignUp,
                owner: guestAccount._id,
                payload
            };

            try {
                const createdDoc = await ctx.model.WorkOrder.create(workOrder);
                if (guestAccount.workOrders) {
                    guestAccount.workOrders.push(createdDoc._id);
                } else {
                    guestAccount.workOrders = [ createdDoc._id ];
                }
                await ctx.model.User.update({ _id: guestAccount._id }, guestAccount);

                response.message = MsgType.OPT_SUCCESS;
                response.data = createdDoc;
            } catch (error) {
                ctx.logger.error(error);
                response.message = MsgType.OPT_FAILED;
            }
        } else {
            response.message = MsgType.ILLEGAL_ARGS;
        }
        ctx.body = response;
    }
}
