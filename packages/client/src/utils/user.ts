import { EnterpriseType, PersonType, UserStatus, UserType } from '~server/app/util/interface/user';

export function userTypeToString (userType?: UserType) {
    switch (userType) {
        case UserType.Admin:
            return '管理员';
        case UserType.Enterprise:
            return '企业账户';
        case UserType.Common:
            return '个人账户';
        case UserType.Guest:
            return '访客账户';
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

export function enterpriseTypeToString (entType?: EnterpriseType) {
    switch (entType) {
        case EnterpriseType.SOES:
            return '国有企业';
        case EnterpriseType.CO:
            return '集体所有制';
        case EnterpriseType.PE:
            return '私营企业';
        case EnterpriseType.CE:
            return '股份制企业';
        case EnterpriseType.LP:
            return '有限合伙企业';
        case EnterpriseType.JV:
            return '联营企业';
        case EnterpriseType.FIE:
            return '外商投资企业';
        case EnterpriseType.SP:
            return '个人独资企业';
        case EnterpriseType.HMT:
            return '港、澳、台';
        case EnterpriseType.JSE:
            return '股份合作企业';
        default:
            return '未知企业类型';
    }
}

export function personTypeToString (personType?: PersonType) {
    switch (personType) {
        case PersonType.Employees:
            return '企业职员';
        case PersonType.IndividualBusiness:
            return '个体工商户';
        default:
            return '未知个人账户类型';
    }
}

export function moneyToHumanReadable (amount?: number) {
    return amount ? (amount / 100).toFixed(2) : '0.00';
}
