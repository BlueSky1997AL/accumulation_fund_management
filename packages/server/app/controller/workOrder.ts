// tslint:disable: no-string-literal

import { Controller } from 'egg';

import { CommonWorkOrderSubmitData } from '../../../client/src/components/commonWorkflow';
import { EnterpriseSubUserAddSubmitData } from '../../../client/src/components/enterpriseSubUserAddWorkflow/enterpriseSubUserAddForm';
import { EnterpriseSubUserRemoveSubmitData } from '../../../client/src/components/enterpriseSubUserRemoveWorkflow';
import { EnterpriseFundBackSubmitData } from '../../../client/src/components/fundBackWorkflow/enterpriseFundBackForm';
import { PersonalFundBackSubmitData } from '../../../client/src/components/fundBackWorkflow/personalFundBackForm';
import { PersonalFundDepositSubmitData } from '../../../client/src/components/fundDepositWorkflow/personalFundDepositForm';
import {
    DrawType,
    PersonalFundDrawSubmitData
} from '../../../client/src/components/fundDrawWorkflow/personalFundDrawForm';
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
    public async getAllWorkOrdersByQuery() {
        const { ctx } = this;
        const { username } = ctx.session;
        const { id, status, type, owner, ownerUsername, auditer, auditerUsername } = ctx.query;

        const response: ResponseData<WorkOrderWithUserInfo[] | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (userInfo.type !== UserType.Admin) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            const query = {} as WorkOrderInDB;
            if (id) {
                query._id = id;
            }
            if (status) {
                query.status = status;
            }
            if (type) {
                query.type = type;
            }
            if (owner) {
                query.owner = owner;
            }
            if (ownerUsername) {
                const ownerInfo = (await ctx.model.User.findOne({ username: ownerUsername })) as UserInDB;
                query.owner = ownerInfo && ownerInfo._id;
            }
            if (auditer) {
                query.auditer = auditer;
            }
            if (auditerUsername) {
                const auditerInfo = (await ctx.model.User.findOne({ username: auditerUsername })) as UserInDB;
                query.auditer = auditerInfo && auditerInfo._id;
            }

            const docs = (await ctx.model.WorkOrder.find(query).sort({ createdAt: -1 })) as WorkOrderInDB[];
            const docsWithUserInfo = await Promise.all(
                docs.map(async doc => {
                    const docUserInfo = (await ctx.model.User.findOne({ _id: doc.owner })) as User;
                    const newDoc = {
                        _id: doc._id,
                        status: doc.status,
                        type: doc.type,
                        owner: {
                            username: docUserInfo.username,
                            name: docUserInfo.name,
                            cardNo: docUserInfo.cardNo,
                            employeeID: docUserInfo.employeeID,
                            employerID: docUserInfo.employerID,
                            type: docUserInfo.type,
                            entType: docUserInfo.entType,
                            personType: docUserInfo.personType,
                            status: docUserInfo.status
                        },
                        payload: doc.payload,
                        createdAt: doc.createdAt,
                        updatedAt: doc.updatedAt
                    } as WorkOrderWithUserInfo;
                    return newDoc;
                })
            );

            response.message = MsgType.OPT_SUCCESS;
            response.data = docsWithUserInfo;
        }
        ctx.body = response;
    }

    public async getPersonalWorkOrdersByQuery() {
        const { ctx } = this;
        const { username } = ctx.session;
        const { id, status, type, auditer, auditerUsername } = ctx.query;

        const response: ResponseData<WorkOrderWithUserInfo[] | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (userInfo.workOrders && userInfo.workOrders.length !== 0) {
            const query = {} as WorkOrderInDB;
            if (id) {
                query._id = id;
            }
            if (status) {
                query.status = status;
            }
            if (type) {
                query.type = type;
            }
            if (auditer) {
                query.auditer = auditer;
            }
            if (auditerUsername) {
                const auditerInfo = (await ctx.model.User.findOne({ username: auditerUsername })) as UserInDB;
                query.auditer = auditerInfo && auditerInfo._id;
            }

            const docs = (await ctx.model.WorkOrder
                .find({ owner: userInfo._id, ...query })
                .sort({ createdAt: -1 })) as WorkOrderInDB[];
            const docsWithUserInfo = await Promise.all(
                docs.map(async doc => {
                    const docUserInfo = (await ctx.model.User.findOne({ _id: doc.owner })) as User;
                    const newDoc = {
                        _id: doc._id,
                        status: doc.status,
                        type: doc.type,
                        owner: {
                            username: docUserInfo.username,
                            name: docUserInfo.name,
                            cardNo: docUserInfo.cardNo,
                            employeeID: docUserInfo.employeeID,
                            employerID: docUserInfo.employerID,
                            type: docUserInfo.type,
                            entType: docUserInfo.entType,
                            personType: docUserInfo.personType,
                            status: docUserInfo.status
                        },
                        payload: doc.payload,
                        createdAt: doc.createdAt,
                        updatedAt: doc.updatedAt
                    } as WorkOrderWithUserInfo;
                    return newDoc;
                })
            );

            response.message = MsgType.OPT_SUCCESS;
            response.data = docsWithUserInfo;
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

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        const workOrderInfo = (await ctx.model.WorkOrder.findOne({ _id: workOrderID })) as WorkOrderInDB;
        const workOrderOwnerInfo = (await ctx.model.User.findOne({ _id: workOrderInfo.owner })) as UserInDB;
        const retDoc = {
            _id: workOrderInfo._id,
            status: workOrderInfo.status,
            type: workOrderInfo.type,
            owner: {
                username: workOrderOwnerInfo.username,
                name: workOrderOwnerInfo.name,
                cardNo: workOrderOwnerInfo.cardNo,
                employeeID: workOrderOwnerInfo.employeeID,
                employerID: workOrderOwnerInfo.employerID,
                type: workOrderOwnerInfo.type,
                entType: workOrderOwnerInfo.entType,
                personType: workOrderOwnerInfo.personType,
                status: workOrderOwnerInfo.status
            },
            comments: workOrderInfo.comments,
            auditer: workOrderInfo.auditer,
            payload: workOrderInfo.payload,
            createdAt: workOrderInfo.createdAt,
            updatedAt: workOrderInfo.updatedAt,
            auditTimestamp: workOrderInfo.auditTimestamp
        };

        if (`${userInfo._id}` === `${workOrderInfo.owner}`) {
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
        const { month, amountMap, comments, accessory } = ctx.request.body as EnterpriseFundBackSubmitData;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrderWithUserInfo | null> = {
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
                            const targetUserInfo = await ctx.model.User.findOne({ username: amountItem.username });
                            if (targetUserInfo) {
                                targetUserInfos.push(targetUserInfo);
                            } else {
                                response.message = MsgType.USER_NOT_DOUND;
                                ctx.body = response;
                                throw new Error(MsgType.USER_NOT_DOUND);
                            }
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
                type: WorkOrderType.EnterpriseBack,
                owner: userInfo['_id'],
                payload
            };

            try {
                const createdDoc = (await ctx.model.WorkOrder.create(workOrder)) as WorkOrderInDB;
                if (userInfo.workOrders) {
                    userInfo.workOrders.push(createdDoc['_id']);
                } else {
                    userInfo.workOrders = [ createdDoc['_id'] ];
                }
                await ctx.model.User.update({ _id: userInfo['_id'] }, userInfo);

                response.message = MsgType.OPT_SUCCESS;
                response.data = {
                    _id: createdDoc._id,
                    status: createdDoc.status,
                    type: createdDoc.type,
                    owner: {
                        username: userInfo.username,
                        name: userInfo.name,
                        cardNo: userInfo.cardNo,
                        employeeID: userInfo.employeeID,
                        employerID: userInfo.employerID,
                        type: userInfo.type,
                        entType: userInfo.entType,
                        personType: userInfo.personType,
                        status: userInfo.status
                    },
                    comments: createdDoc.comments,
                    auditer: createdDoc.auditer,
                    payload: createdDoc.payload,
                    createdAt: createdDoc.createdAt,
                    updatedAt: createdDoc.updatedAt
                };
            } catch (error) {
                console.error(error);
                response.message = MsgType.OPT_FAILED;
            }
        }
        ctx.body = response;
    }

    public async creactPersonalFundDepositWorkOrder() {
        const { ctx } = this;
        const { month, amount, comments, accessory } = ctx.request.body as PersonalFundDepositSubmitData;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrderWithUserInfo | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as User;
        if (userInfo.type === UserType.Common && userInfo.personType === PersonType.IndividualBusiness) {
            const payload = JSON.stringify({ month, amount, comments, accessory });
            const workOrder: WorkOrder = {
                status: WorkOrderStatus.Open,
                type: WorkOrderType.PersonalDeposit,
                owner: userInfo['_id'],
                payload
            };

            try {
                const createdDoc = (await ctx.model.WorkOrder.create(workOrder)) as WorkOrderInDB;
                if (userInfo.workOrders) {
                    userInfo.workOrders.push(createdDoc['_id']);
                } else {
                    userInfo.workOrders = [ createdDoc['_id'] ];
                }
                await ctx.model.User.update({ _id: userInfo['_id'] }, userInfo);

                response.message = MsgType.OPT_SUCCESS;
                response.data = {
                    _id: createdDoc._id,
                    status: createdDoc.status,
                    type: createdDoc.type,
                    owner: {
                        username: userInfo.username,
                        name: userInfo.name,
                        cardNo: userInfo.cardNo,
                        employeeID: userInfo.employeeID,
                        employerID: userInfo.employerID,
                        type: userInfo.type,
                        entType: userInfo.entType,
                        personType: userInfo.personType,
                        status: userInfo.status
                    },
                    comments: createdDoc.comments,
                    auditer: createdDoc.auditer,
                    payload: createdDoc.payload,
                    createdAt: createdDoc.createdAt,
                    updatedAt: createdDoc.updatedAt
                };
            } catch (error) {
                console.error(error);
                response.message = MsgType.OPT_FAILED;
            }
        } else {
            response.message = MsgType.NO_PERMISSION;
        }
        ctx.body = response;
    }

    public async creactPersonalFundBackWorkOrder() {
        const { ctx } = this;
        const { month, amount, comments, accessory } = ctx.request.body as PersonalFundBackSubmitData;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrderWithUserInfo | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as User;
        if (userInfo.type === UserType.Common && userInfo.personType === PersonType.IndividualBusiness) {
            const payload = JSON.stringify({ month, amount, comments, accessory });
            const workOrder: WorkOrder = {
                status: WorkOrderStatus.Open,
                type: WorkOrderType.PersonalBack,
                owner: userInfo['_id'],
                payload
            };

            try {
                const createdDoc = (await ctx.model.WorkOrder.create(workOrder)) as WorkOrderInDB;
                if (userInfo.workOrders) {
                    userInfo.workOrders.push(createdDoc['_id']);
                } else {
                    userInfo.workOrders = [ createdDoc['_id'] ];
                }
                await ctx.model.User.update({ _id: userInfo['_id'] }, userInfo);

                response.message = MsgType.OPT_SUCCESS;
                response.data = {
                    _id: createdDoc._id,
                    status: createdDoc.status,
                    type: createdDoc.type,
                    owner: {
                        username: userInfo.username,
                        name: userInfo.name,
                        cardNo: userInfo.cardNo,
                        employeeID: userInfo.employeeID,
                        employerID: userInfo.employerID,
                        type: userInfo.type,
                        entType: userInfo.entType,
                        personType: userInfo.personType,
                        status: userInfo.status
                    },
                    comments: createdDoc.comments,
                    auditer: createdDoc.auditer,
                    payload: createdDoc.payload,
                    createdAt: createdDoc.createdAt,
                    updatedAt: createdDoc.updatedAt
                };
            } catch (error) {
                console.error(error);
                response.message = MsgType.OPT_FAILED;
            }
        } else {
            response.message = MsgType.NO_PERMISSION;
        }
        ctx.body = response;
    }

    public async createEnterpriseFundRemitWorkOrder() {
        const { ctx } = this;
        const { month, amountMap, comments, accessory } = ctx.request.body as EnterpriseFundRemitSubmitData;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrderWithUserInfo | null> = {
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
                            const targetUserInfo = await ctx.model.User.findOne({ username: amountItem.username });
                            if (targetUserInfo) {
                                targetUserInfos.push(targetUserInfo);
                            } else {
                                response.message = MsgType.USER_NOT_DOUND;
                                ctx.body = response;
                                throw new Error(MsgType.USER_NOT_DOUND);
                            }
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
                const createdDoc = (await ctx.model.WorkOrder.create(workOrder)) as WorkOrderInDB;
                if (userInfo.workOrders) {
                    userInfo.workOrders.push(createdDoc['_id']);
                } else {
                    userInfo.workOrders = [ createdDoc['_id'] ];
                }
                await ctx.model.User.update({ _id: userInfo['_id'] }, userInfo);

                response.message = MsgType.OPT_SUCCESS;
                response.data = {
                    _id: createdDoc._id,
                    status: createdDoc.status,
                    type: createdDoc.type,
                    owner: {
                        username: userInfo.username,
                        name: userInfo.name,
                        cardNo: userInfo.cardNo,
                        employeeID: userInfo.employeeID,
                        employerID: userInfo.employerID,
                        type: userInfo.type,
                        entType: userInfo.entType,
                        personType: userInfo.personType,
                        status: userInfo.status
                    },
                    comments: createdDoc.comments,
                    auditer: createdDoc.auditer,
                    payload: createdDoc.payload,
                    createdAt: createdDoc.createdAt,
                    updatedAt: createdDoc.updatedAt
                };
            } catch (error) {
                console.error(error);
                response.message = MsgType.OPT_FAILED;
            }
        }
        ctx.body = response;
    }

    public async createPersonalFundDrawWorkOrder() {
        const { ctx } = this;
        const { type, amount, comments, accessory } = ctx.request.body as PersonalFundDrawSubmitData;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrderWithUserInfo | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
        if (userInfo.type !== UserType.Common) {
            response.message = MsgType.NO_PERMISSION;
        } else if (type === DrawType.Cancellation || type === DrawType.Partial) {
            if (amount && amount > userInfo.balance) {
                (response.message = MsgType.INSUFFICIENT_BALANCE), (ctx.body = response);
                return;
            }

            // 公积金的部分提取：最高可提取额为账户总金额减10元
            if (type === DrawType.Partial && amount > userInfo.balance - 1000) {
                response.message = MsgType.EXCEED_MAXIMUM_AMOUNT;
                ctx.body = response;
                return;
            }

            let targetAmount = 0;
            if (type === DrawType.Partial) {
                targetAmount = amount;
            }
            if (type === DrawType.Cancellation) {
                targetAmount = userInfo.balance;
            }

            const entInfoInDB = (await ctx.model.User.findOne({ _id: userInfo.employerID })) as UserInDB;
            const entInfo = {
                username: entInfoInDB.username,
                name: entInfoInDB.name,
                cardNo: entInfoInDB.cardNo,
                entType: entInfoInDB.entType,
                status: entInfoInDB.status
            };

            const payload = JSON.stringify({ type, amount: targetAmount, comments, accessory, entInfo });
            const workOrder: WorkOrder = {
                status: WorkOrderStatus.Open,
                type: WorkOrderType.Draw,
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
                response.data = {
                    _id: createdDoc._id,
                    status: createdDoc.status,
                    type: createdDoc.type,
                    owner: {
                        username: userInfo.username,
                        name: userInfo.name,
                        cardNo: userInfo.cardNo,
                        employeeID: userInfo.employeeID,
                        employerID: userInfo.employerID,
                        type: userInfo.type,
                        entType: userInfo.entType,
                        personType: userInfo.personType,
                        status: userInfo.status
                    },
                    comments: createdDoc.comments,
                    auditer: createdDoc.auditer,
                    payload: createdDoc.payload,
                    createdAt: createdDoc.createdAt,
                    updatedAt: createdDoc.updatedAt
                };
            } catch (error) {
                console.error(error);
                response.message = MsgType.OPT_FAILED;
            }
        } else {
            response.message = MsgType.ILLEGAL_ARGS;
        }
        ctx.body = response;
    }

    public async createCommonWorkOrder() {
        const { ctx } = this;
        const { comments, workOrderType, accessory } = ctx.request.body as CommonWorkOrderSubmitData;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrderWithUserInfo | null> = {
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
                const createdDoc = (await ctx.model.WorkOrder.create(workOrder)) as WorkOrderInDB;
                if (userInfo.workOrders) {
                    userInfo.workOrders.push(createdDoc._id);
                } else {
                    userInfo.workOrders = [ createdDoc._id ];
                }
                await ctx.model.User.update({ _id: userInfo._id }, userInfo);

                response.message = MsgType.OPT_SUCCESS;
                response.data = {
                    _id: createdDoc._id,
                    status: createdDoc.status,
                    type: createdDoc.type,
                    owner: {
                        username: userInfo.username,
                        name: userInfo.name,
                        cardNo: userInfo.cardNo,
                        employeeID: userInfo.employeeID,
                        employerID: userInfo.employerID,
                        type: userInfo.type,
                        entType: userInfo.entType,
                        personType: userInfo.personType,
                        status: userInfo.status
                    },
                    comments: createdDoc.comments,
                    auditer: createdDoc.auditer,
                    payload: createdDoc.payload,
                    createdAt: createdDoc.createdAt,
                    updatedAt: createdDoc.updatedAt
                };
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

        const response: ResponseData<WorkOrderWithUserInfo | null> = {
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
                const createdDoc = (await ctx.model.WorkOrder.create(workOrder)) as WorkOrderInDB;
                if (userInfo.workOrders) {
                    userInfo.workOrders.push(createdDoc._id);
                } else {
                    userInfo.workOrders = [ createdDoc._id ];
                }
                await ctx.model.User.update({ _id: userInfo._id }, userInfo);

                response.message = MsgType.OPT_SUCCESS;
                response.data = {
                    _id: createdDoc._id,
                    status: createdDoc.status,
                    type: createdDoc.type,
                    owner: {
                        username: userInfo.username,
                        name: userInfo.name,
                        cardNo: userInfo.cardNo,
                        employeeID: userInfo.employeeID,
                        employerID: userInfo.employerID,
                        type: userInfo.type,
                        entType: userInfo.entType,
                        personType: userInfo.personType,
                        status: userInfo.status
                    },
                    comments: createdDoc.comments,
                    auditer: createdDoc.auditer,
                    payload: createdDoc.payload,
                    createdAt: createdDoc.createdAt,
                    updatedAt: createdDoc.updatedAt
                };
            } catch (error) {
                console.error(error);
                response.message = MsgType.OPT_FAILED;
            }
        }
        ctx.body = response;
    }

    public async createEnterpriseSubUserAddWorkOrder() {
        const { ctx } = this;
        const { usernames, employeeIDs, comments, accessory } = ctx.request.body as EnterpriseSubUserAddSubmitData;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrderWithUserInfo | null> = {
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

            const payload = JSON.stringify({ usernames, employeeIDs, comments, accessory });
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
                response.data = {
                    _id: createdDoc._id,
                    status: createdDoc.status,
                    type: createdDoc.type,
                    owner: {
                        username: userInfo.username,
                        name: userInfo.name,
                        cardNo: userInfo.cardNo,
                        employeeID: userInfo.employeeID,
                        employerID: userInfo.employerID,
                        type: userInfo.type,
                        entType: userInfo.entType,
                        personType: userInfo.personType,
                        status: userInfo.status
                    },
                    comments: createdDoc.comments,
                    auditer: createdDoc.auditer,
                    payload: createdDoc.payload,
                    createdAt: createdDoc.createdAt,
                    updatedAt: createdDoc.updatedAt
                };
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

        const response: ResponseData<WorkOrderInDB | null> = {
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
                const createdDoc = (await ctx.model.WorkOrder.create(workOrder)) as WorkOrderInDB;
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
