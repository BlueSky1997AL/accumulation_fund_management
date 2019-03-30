import { WorkOrderStatus, WorkOrderType } from '~server/app/util/interface/workOrder';

export function workOrderStatusToString (workOrderStatus: WorkOrderStatus) {
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

export function workOrderTypeToString (workOrderType: WorkOrderType) {
    switch (workOrderType) {
        case WorkOrderType.PersonalBack:
            return '个人补缴';
        case WorkOrderType.EnterpriseBack:
            return '企业补缴';
        case WorkOrderType.Remit:
            return '汇缴';
        case WorkOrderType.Draw:
            return '支取';
        case WorkOrderType.EnterpriseInOrOut:
            return '企业转入/转出';
        case WorkOrderType.PersonalInOrOut:
            return '个人转入/转出';
        default:
            return '未知工单类型';
    }
}
