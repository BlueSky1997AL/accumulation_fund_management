import { AmountChangeSource, AmountChangeType } from '~server/app/util/interface/amountChange';

export function amountChangeTypeToString (type?: AmountChangeType) {
    switch (type) {
        case AmountChangeType.Positive:
            return '汇入';
        case AmountChangeType.Negative:
            return '汇出';
        default:
            return '未知金额变动类型';
    }
}

export function amountChangeSourceToString (source: AmountChangeSource) {
    switch (source) {
        case AmountChangeSource.AccountCreation:
            return '账户创建';
        case AmountChangeSource.EnterpriseRemit:
            return '企业汇缴';
        case AmountChangeSource.EnterpriseBack:
            return '企业补缴';
        case AmountChangeSource.PersonalBack:
            return '个人补缴';
        case AmountChangeSource.PersonalDeposit:
            return '个人缴存';
        case AmountChangeSource.PersonalPartialDraw:
            return '部分支取';
        case AmountChangeSource.PersonalCancellationDraw:
            return '销户支取';
        case AmountChangeSource.AdminUserCreate:
            return '账户创建（管理员）';
        case AmountChangeSource.Interest:
            return '余额计息';
        default:
            return '未知金额变动来源';
    }
}
