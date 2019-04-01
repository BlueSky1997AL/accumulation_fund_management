import { Service } from 'egg';
import { UserInDB, UserStatus, UserType } from '../util/interface/user';

export default class UserService extends Service {
    public async getGuestAccount() {
        const { ctx } = this;

        const guestAccountInfo = (await ctx.model.User.findOne({ username: 'Guest' })) as UserInDB;
        if (!guestAccountInfo) {
            return await ctx.model.User.create({
                username: 'Guest',
                password: Math.random().toString(36).substr(2),
                type: UserType.Guest,
                status: UserStatus.Normal,
                balance: 0
            }) as UserInDB;
        }
        return guestAccountInfo;
    }
}
