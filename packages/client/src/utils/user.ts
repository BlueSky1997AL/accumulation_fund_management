import { UserStatus, UserType } from '~server/app/util/interface/user';

export function userTypeToString (userType?: UserType) {
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

export function userStatusToString (userStatus?: UserStatus) {
    switch (userStatus) {
        case UserStatus.Disabled:
            return '注销';
        case UserStatus.Frozen:
            return '冻结';
        case UserStatus.Lost:
            return '挂失';
        case UserStatus.Normal:
            return '正常';
        default:
            return '未知账户状态';
    }
}

export function balanceToHumanReadable (amount?: number) {
    return amount ? (amount / 100).toFixed(2) : '0.00';
}
