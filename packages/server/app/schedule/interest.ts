import { Application, Context } from 'egg';

import { UserInDB, UserStatus } from '../util/interface/user';

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
                    if (user.status === UserStatus.Normal || user.status === UserStatus.Lost) {
                        const newBalance = user.balance + user.balance * dailyRate;
                        try {
                            await ctx.model.User.update({ _id: user._id }, { balance: newBalance });
                            ctx.logger.info(
                                'updated user balance by schedule workder, username: %s, original balance: %s, new balance: %s, yearly rate: %s, interest: %s',
                                user.username,
                                user.balance,
                                newBalance,
                                rate,
                                user.balance * dailyRate
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
