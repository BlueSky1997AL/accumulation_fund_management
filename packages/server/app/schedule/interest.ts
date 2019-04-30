import { Application, Context } from 'egg';

import { AmountChangeInDB, AmountChangeSource, AmountChangeType } from '../util/interface/amountChange';
import { UserInDB, UserStatus, UserType } from '../util/interface/user';

export default (app: Application) => {
    const { cron, type, rate } = app.config.schedule.interest;
    const dailyRate = rate / 360;
    return {
        schedule: {
            cron,
            type
        },
        async task(ctx: Context) {
            const allUsers = (await ctx.model.User.find()) as UserInDB[];
            await Promise.all(
                allUsers.map(async user => {
                    if (
                        user.type === UserType.Common &&
                        (user.status === UserStatus.Normal || user.status === UserStatus.Lost)
                    ) {
                        try {
                            const amountChange = (await ctx.model.AmountChange.create({
                                owner: user._id,
                                amount: user.balance * dailyRate,
                                type: AmountChangeType.Positive,
                                source: AmountChangeSource.Interest
                            })) as AmountChangeInDB;
                            const newBalance = user.balance + user.balance * dailyRate;

                            await ctx.model.User.update(
                                { _id: user._id },
                                { balance: newBalance, amountChanges: [ ...user.amountChanges!, amountChange._id ] }
                            );
                            ctx.logger.info(
                                'updated user balance by schedule workder, username: %s, original balance: %s, new balance: %s, yearly rate: %s, interest: %s, amount change ID: %s',
                                user.username,
                                user.balance,
                                newBalance,
                                rate,
                                user.balance * dailyRate,
                                amountChange._id
                            );
                        } catch (error) {
                            ctx.logger.error(error);
                        }
                    }
                })
            );
        }
    };
};
