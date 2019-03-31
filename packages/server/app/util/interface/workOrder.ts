import { UserStatus, UserType } from './user';

type objectID = string;

export interface WorkOrder {
    status: WorkOrderStatus;
    type: WorkOrderType;
    owner: objectID;
    comments?: string;
    auditer?: objectID;
    payload?: string;
}

export interface WorkOrderInDB extends WorkOrder {
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface WorkOrderWithUserInfo {
    status: WorkOrderStatus;
    type: WorkOrderType;
    owner: {
        username: string;
        type: UserType;
        status: UserStatus;
    };
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
    EnterpriseBack,
    PersonalBack,
    Remit,
    Draw,
    EnterpriseInOrOut,
    PersonalInOrOut
}
