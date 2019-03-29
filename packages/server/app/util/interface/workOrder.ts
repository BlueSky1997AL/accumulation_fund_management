type objectID = string;

export interface WorkOrder {
    status: WorkOrderStatus;
    type: WorkOrderType;
    owner: objectID;
    desc: string;
    comments?: string;
    auditer?: objectID;
    payload?: string;
}

export enum WorkOrderStatus {
    Open,
    Closed,
    Granted,
    Rejected
}

export enum WorkOrderType {
    Back,
    Remit,
    Draw,
    InOrOut
}
