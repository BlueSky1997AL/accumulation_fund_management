import { Service } from 'egg';

import { EnterpriseFundBackSubmitData } from '../../../client/src/components/fundBackWorkflow/enterpriseFundBackForm';
import { PersonalFundBackSubmitData } from '../../../client/src/components/fundBackWorkflow/personalFundBackForm';
import { EnterpriseFundRemitSubmitData } from '../../../client/src/components/fundRemitWorkflow/enterpriseFundRemitForm';
import { UserInDB } from '../util/interface/user';
import { WorkOrder, WorkOrderType } from '../util/interface/workOrder';

export default class WorkOrderService extends Service {
    public async workOrderExecuter(workOrder: WorkOrder) {
        switch (workOrder.type) {
            case WorkOrderType.PersonalBack: {
                await this.execPersonalBack(workOrder);
                break;
            }
            case WorkOrderType.EnterpriseBack: {
                await this.execEnterpriseBack(workOrder);
                break;
            }
            case WorkOrderType.Remit: {
                await this.execEnterpriseRemit(workOrder);
            }
        }
    }

    public async execPersonalBack(workOrder: WorkOrder) {
        const { ctx } = this;
        const { payload, owner } = workOrder;
        if (payload) {
            const ownerInfo = (await ctx.model.User.findOne({ _id: owner })) as UserInDB;
            const execData = JSON.parse(payload) as PersonalFundBackSubmitData;

            await ctx.model.User.update({ _id: owner }, { balance: ownerInfo.balance + execData.amount });

            return;
        }
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

            return;
        }
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

            return;
        }
    }
}
