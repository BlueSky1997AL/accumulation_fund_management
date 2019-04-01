import { Service } from 'egg';

import { EnterpriseFundBackSubmitData } from '../../../client/src/components/fundBackWorkflow/enterpriseFundBackForm';
import { PersonalFundBackSubmitData } from '../../../client/src/components/fundBackWorkflow/personalFundBackForm';
import { PersonalFundDrawSubmitData } from '../../../client/src/components/fundDrawWorkflow/personalFundDrawForm';
import { EnterpriseFundRemitSubmitData } from '../../../client/src/components/fundRemitWorkflow/enterpriseFundRemitForm';
import { MsgType } from '../util/interface/common';
import { UserInDB, UserStatus } from '../util/interface/user';
import { WorkOrder, WorkOrderType } from '../util/interface/workOrder';

export default class WorkOrderService extends Service {
    public async workOrderExecuter(workOrder: WorkOrder): Promise<MsgType | null> {
        switch (workOrder.type) {
            case WorkOrderType.PersonalBack: {
                return await this.execPersonalBack(workOrder);
            }
            case WorkOrderType.EnterpriseBack: {
                return await this.execEnterpriseBack(workOrder);
            }
            case WorkOrderType.Remit: {
                return await this.execEnterpriseRemit(workOrder);
            }
            case WorkOrderType.Draw: {
                return await this.execPersonalDraw(workOrder);
            }
            case WorkOrderType.DisableOrExport: {
                return await this.execChangeUserStatus(workOrder);
            }
            case WorkOrderType.Freeze: {
                return await this.execChangeUserStatus(workOrder);
            }
            case WorkOrderType.Unfreeze: {
                return await this.execChangeUserStatus(workOrder);
            }
        }
        return null;
    }

    public async execPersonalBack(workOrder: WorkOrder) {
        const { ctx } = this;
        const { payload, owner } = workOrder;
        if (payload) {
            const ownerInfo = (await ctx.model.User.findOne({ _id: owner })) as UserInDB;
            const execData = JSON.parse(payload) as PersonalFundBackSubmitData;

            await ctx.model.User.update({ _id: owner }, { balance: ownerInfo.balance + execData.amount });
        }
        return null;
    }

    public async execEnterpriseBack(workOrder: WorkOrder) {
        const { ctx } = this;
        const { payload } = workOrder;
        if (payload) {
            const execData = JSON.parse(payload) as EnterpriseFundBackSubmitData;

            await Promise.all(
                execData.amountMap.map(async amountInfo => {
                    const amount = amountInfo.amount;
                    await Promise.all(
                        amountInfo.usernames.map(async username => {
                            const targetUserInfo = await ctx.model.User.findOne({ username });
                            await ctx.model.User.update({ username }, { balance: targetUserInfo.balance + amount });
                        })
                    );
                })
            );
        }
        return null;
    }

    public async execEnterpriseRemit(workOrder: WorkOrder) {
        const { ctx } = this;
        const { payload } = workOrder;
        if (payload) {
            const execData = JSON.parse(payload) as EnterpriseFundRemitSubmitData;

            await Promise.all(
                execData.amountMap.map(async amountInfo => {
                    const amount = amountInfo.amount;
                    await Promise.all(
                        amountInfo.usernames.map(async username => {
                            const targetUserInfo = await ctx.model.User.findOne({ username });
                            await ctx.model.User.update({ username }, { balance: targetUserInfo.balance + amount });
                        })
                    );
                })
            );
        }
        return null;
    }

    public async execPersonalDraw(workOrder: WorkOrder) {
        const { ctx } = this;
        const { payload, owner } = workOrder;
        if (payload) {
            const ownerInfo = (await ctx.model.User.findOne({ _id: owner })) as UserInDB;
            const execData = JSON.parse(payload) as PersonalFundDrawSubmitData;

            if (ownerInfo.balance < execData.amount) {
                return MsgType.INSUFFICIENT_BALANCE;
            }

            await ctx.model.User.update({ _id: owner }, { balance: ownerInfo.balance - execData.amount });
        }
        return null;
    }

    public async execChangeUserStatus(workOrder: WorkOrder) {
        const { ctx } = this;
        const { payload, owner } = workOrder;
        if (payload) {
            const ownerInfo = (await ctx.model.User.findOne({ _id: owner })) as UserInDB;

            let targetUserStatus = ownerInfo.status;
            switch (workOrder.type) {
                case WorkOrderType.DisableOrExport: {
                    targetUserStatus = UserStatus.Disabled;
                    break;
                }
                case WorkOrderType.Freeze: {
                    targetUserStatus = UserStatus.Frozen;
                    break;
                }
                case WorkOrderType.Unfreeze: {
                    targetUserStatus = UserStatus.Normal;
                    break;
                }
                default: {
                    ctx.logger.error(MsgType.ILLEGAL_ARGS, workOrder);
                    return MsgType.ILLEGAL_ARGS;
                }
            }

            await ctx.model.User.update({ _id: owner }, { status: targetUserStatus });
        }
        return null;
    }
}
