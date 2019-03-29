import { UserType } from '~server/app/util/interface/user';

export function userTypeToString (userType: UserType) {
    switch (userType) {
        case UserType.Admin:
            return '管理员';
        case UserType.Enterprise:
            return '企业账户';
        case UserType.Common:
            return '个人账户';
        default:
            return '未知账户类型';
    }
}
