import { WorkOrderStatus, WorkOrderType } from '~server/app/util/interface/workOrder';

export function workOrderStatusToString (workOrderStatus?: WorkOrderStatus) {
    switch (workOrderStatus) {
        case WorkOrderStatus.Closed:
            return '用户已关闭';
        case WorkOrderStatus.Granted:
            return '已通过';
        case WorkOrderStatus.Open:
            return '待审核';
        case WorkOrderStatus.Rejected:
            return '审核未通过';
        default:
            return '未知工单状态';
    }
}

export function workOrderTypeToString (workOrderType?: WorkOrderType) {
    switch (workOrderType) {
        case WorkOrderType.PersonalBack:
            return '个人补缴';
        case WorkOrderType.EnterpriseBack:
            return '企业补缴';
        case WorkOrderType.Remit:
            return '企业汇缴';
        case WorkOrderType.Draw:
            return '个人支取';
        case WorkOrderType.DisableOrExport:
            return '注销/调出';
        case WorkOrderType.Freeze:
            return '账户冻结';
        case WorkOrderType.Unfreeze:
            return '解除冻结';
        case WorkOrderType.RemoveSubUser:
            return '移除子账户';
        case WorkOrderType.AddSubUser:
            return '添加子账户';
        case WorkOrderType.SignUp:
            return '账户创建';
        default:
            return '未知工单类型';
    }
}
