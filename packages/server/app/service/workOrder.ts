import { Service } from 'egg';

import { EnterpriseSubUserAddSubmitData } from '../../../client/src/components/enterpriseSubUserAddWorkflow/enterpriseSubUserAddForm';
import { EnterpriseSubUserRemoveSubmitData } from '../../../client/src/components/enterpriseSubUserRemoveWorkflow';
import { EnterpriseFundBackSubmitData } from '../../../client/src/components/fundBackWorkflow/enterpriseFundBackForm';
import { PersonalFundBackSubmitData } from '../../../client/src/components/fundBackWorkflow/personalFundBackForm';
import { PersonalFundDrawSubmitData } from '../../../client/src/components/fundDrawWorkflow/personalFundDrawForm';
import { EnterpriseFundRemitSubmitData } from '../../../client/src/components/fundRemitWorkflow/enterpriseFundRemitForm';
import { SignUpSubmitData } from '../../../client/src/components/signup';
import { AmountChangeInDB, AmountChangeSource, AmountChangeType } from '../util/interface/amountChange';
import { MsgType } from '../util/interface/common';
import { PersonType, UserInDB, UserStatus, UserType } from '../util/interface/user';
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
            case WorkOrderType.RemoveSubUser: {
                return await this.execRemoveEnterpriseSubUser(workOrder);
            }
            case WorkOrderType.AddSubUser: {
                return await this.execAddEnterpriseSubUser(workOrder);
            }
            case WorkOrderType.SignUp: {
                return await this.execSignUp(workOrder);
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

            const amountChange = (await ctx.model.AmountChange.create({
                owner,
                amount: execData.amount,
                type: AmountChangeType.Positive,
                source: AmountChangeSource.PersonalBack,
                payload: JSON.stringify({
                    month: execData.month
                })
            })) as AmountChangeInDB;
            await ctx.model.User.update(
                { _id: owner },
                {
                    balance: ownerInfo.balance + execData.amount,
                    amountChanges: [ ...ownerInfo.amountChanges!, amountChange._id ]
                }
            );
        }
        return null;
    }

    public async execEnterpriseBack(workOrder: WorkOrder) {
        const { ctx } = this;
        const { payload, owner } = workOrder;
        if (payload) {
            const execData = JSON.parse(payload) as EnterpriseFundBackSubmitData;

            await Promise.all(
                execData.amountMap.map(async amountInfo => {
                    const amount = amountInfo.amount * 2;
                    await Promise.all(
                        amountInfo.usernames.map(async username => {
                            const targetUserInfo = await ctx.model.User.findOne({ username });

                            const amountChange = (await ctx.model.AmountChange.create({
                                owner: targetUserInfo._id,
                                amount,
                                type: AmountChangeType.Positive,
                                source: AmountChangeSource.EnterpriseBack,
                                payload: JSON.stringify({
                                    month: execData.month,
                                    entID: owner
                                })
                            })) as AmountChangeInDB;
                            await ctx.model.User.update(
                                { username },
                                {
                                    balance: targetUserInfo.balance + amount,
                                    amountChanges: [ ...targetUserInfo.amountChanges!, amountChange._id ]
                                }
                            );
                        })
                    );
                })
            );
        }
        return null;
    }

    public async execEnterpriseRemit(workOrder: WorkOrder) {
        const { ctx } = this;
        const { payload, owner } = workOrder;
        if (payload) {
            const execData = JSON.parse(payload) as EnterpriseFundRemitSubmitData;

            await Promise.all(
                execData.amountMap.map(async amountInfo => {
                    const amount = amountInfo.amount * 2;
                    await Promise.all(
                        amountInfo.usernames.map(async username => {
                            const targetUserInfo = (await ctx.model.User.findOne({ username })) as UserInDB;

                            const amountChange = (await ctx.model.AmountChange.create({
                                owner: targetUserInfo._id,
                                amount,
                                type: AmountChangeType.Positive,
                                source: AmountChangeSource.EnterpriseRemit,
                                payload: JSON.stringify({
                                    month: execData.month,
                                    entID: owner
                                })
                            })) as AmountChangeInDB;
                            await ctx.model.User.update(
                                { username },
                                {
                                    balance: targetUserInfo.balance + amount,
                                    amountChanges: [ ...targetUserInfo.amountChanges!, amountChange._id ]
                                }
                            );
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

    public async execRemoveEnterpriseSubUser(workOrder: WorkOrder) {
        const { ctx } = this;
        const { payload, owner } = workOrder;
        if (payload) {
            const ownerInfo = (await ctx.model.User.findOne({ _id: owner })) as UserInDB;
            const execData = JSON.parse(payload) as EnterpriseSubUserRemoveSubmitData;

            const newSubUsers = (ownerInfo.subUser as string[])
                .map(subUserID => {
                    if (String(subUserID) !== execData.userID) {
                        return subUserID;
                    }
                })
                .filter(item => !!item) as string[];

            await ctx.model.User.updateOne({ _id: owner }, { subUser: newSubUsers });
        }
        return null;
    }

    public async execAddEnterpriseSubUser(workOrder: WorkOrder) {
        const { ctx } = this;
        const { payload, owner } = workOrder;
        if (payload) {
            const ownerInfo = (await ctx.model.User.findOne({ _id: owner })) as UserInDB;
            const execData = JSON.parse(payload) as EnterpriseSubUserAddSubmitData;

            const newSubUserIDs = await Promise.all(
                execData.usernames.map(async username => {
                    const targetUserInfo = (await ctx.model.User.findOne({ username })) as UserInDB;
                    return targetUserInfo._id;
                })
            );

            const newSubUsers = [ ...(ownerInfo.subUser as string[]), ...newSubUserIDs ];

            await ctx.model.User.updateOne({ _id: owner }, { subUser: newSubUsers });
        }
        return null;
    }

    public async execSignUp(workOrder: WorkOrder) {
        const { ctx } = this;
        const { payload } = workOrder;
        const { username } = ctx.session;

        if (payload) {
            const execData = JSON.parse(payload) as SignUpSubmitData;

            try {
                const createdUser = (await ctx.model.User.create({
                    username: execData.username,
                    password: execData.password,
                    name: execData.name,
                    cardNo: execData.cardNo,
                    employeeID: execData.employeeID,
                    type: execData.type,
                    entType: execData.entType,
                    personType: execData.personType,
                    status: UserStatus.Normal,
                    balance: execData.balance
                })) as UserInDB;

                if (execData.type === UserType.Common && execData.personType === PersonType.Employees) {
                    const entUser = (await ctx.model.User.findOne({ username: execData.entID })) as UserInDB;
                    await ctx.model.User.updateOne({ _id: createdUser._id }, { employerID: entUser._id });
                    await ctx.model.User.updateOne(
                        { username: execData.entID },
                        { subUser: [ ...entUser.subUser!, createdUser._id ] }
                    );
                }

                if (execData.balance) {
                    const amountChange = (await ctx.model.AmountChange.create({
                        owner: createdUser._id,
                        amount: execData.balance,
                        type: AmountChangeType.Positive,
                        source: AmountChangeSource.AccountCreation
                    })) as AmountChangeInDB;

                    await ctx.model.User.updateOne(
                        { username: createdUser.username },
                        { amountChanges: [ ...createdUser.amountChanges!, amountChange._id ] }
                    );
                }
            } catch (error) {
                ctx.logger.error(error);
                return MsgType.OPT_FAILED;
            }
        }
        return null;
    }
}
