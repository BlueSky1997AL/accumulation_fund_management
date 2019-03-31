// tslint:disable: no-string-literal

import { Controller } from 'egg';

import { EnterpriseFundBackSubmitData } from '../../../client/src/components/fundBackWorkflow/enterpriseFundBackForm';
import { PersonalFundBackSubmitData } from '../../../client/src/components/fundBackWorkflow/personalFundBackForm';
import { EnterpriseFundRemitSubmitData } from '../../../client/src/components/fundRemitWorkflow/enterpriseFundRemitForm';
import { MsgType, ResponseData } from '../util/interface/common';
import { User, UserType } from '../util/interface/user';
import { WorkOrder, WorkOrderStatus, WorkOrderType, WorkOrderWithUserInfo } from '../util/interface/workOrder';

interface WorkOrderAuditSubmitData {
    workOrderID: string;
    comments: string;
    opType: OperationType;
}

enum OperationType {
    Granted,
    Rejected
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

            if (opType === OperationType.Granted) {
                workOrderInfo.status = WorkOrderStatus.Granted;
            } else if (opType === OperationType.Rejected) {
                workOrderInfo.status = WorkOrderStatus.Rejected;
            } else {
                ctx.body = response;
                return;
            }
            workOrderInfo.auditer = userInfo['_id'];
            workOrderInfo.comments = comments;

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
        const { amountMap, comments, accessory } = ctx.request.body as EnterpriseFundRemitSubmitData;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrder | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as User;
        if (userInfo.type !== UserType.Enterprise) {
            response.message = MsgType.NO_PERMISSION;
        } else {
            const payload = JSON.stringify({ amountMap, comments, accessory });
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
}
