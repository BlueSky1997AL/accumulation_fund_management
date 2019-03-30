// tslint:disable: no-string-literal

import { Controller } from 'egg';

import { EnterpriseFundBackSubmitData } from '../../../client/src/components/fundBackWorkflow/enterpriseFundBackForm';
// import { PersonalFundBackSubmitData } from '../../../client/src/components/fundBackWorkflow/personalFundBackForm';
import { MsgType, ResponseData } from '../util/interface/common';
import { User, UserType } from '../util/interface/user';
import { WorkOrder, WorkOrderStatus, WorkOrderType } from '../util/interface/workOrder';

export default class WorkOrderController extends Controller {
    public async creactEnterpriseFundBackWorkOrder() {
        const { ctx } = this;
        const { amountMap, comments } = ctx.request.body as EnterpriseFundBackSubmitData;
        const { username } = ctx.session;

        const response: ResponseData<WorkOrder | null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        const userInfo = (await ctx.model.User.findOne({ username })) as User;
        if (userInfo.type !==UserType.Enterprise) {
            response.message = MsgType.NO_PERMISSION
        } else {
            const payload = JSON.stringify({ amountMap, comments });
            const workOrder: WorkOrder = {
                status: WorkOrderStatus.Open,
                type: WorkOrderType.EnterpriseBack,
                owner: userInfo['_id'],
                payload
            }

            try {
                const createdDoc = await ctx.model.WorkOrder.create(workOrder);
                if (userInfo.workOrders) {
                    userInfo.workOrders.push(createdDoc['_id'])
                } else {
                    userInfo.workOrders = [createdDoc['_id']];
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
