import { EnterpriseType, PersonType, UserStatus, UserType } from './user';

type objectID = string;

export interface WorkOrder {
    status: WorkOrderStatus;
    type: WorkOrderType;
    owner: objectID;
    comments?: string;
    auditer?: objectID;
    auditTimestamp?: Date;
    payload?: string;
}

export interface WorkOrderInDB extends WorkOrder {
    _id: objectID;
    createdAt: Date;
    updatedAt: Date;
}

export interface WorkOrderWithUserInfo {
    _id: objectID;
    status: WorkOrderStatus;
    type: WorkOrderType;
    owner: {
        username: string;
        name: string;
        cardNo?: string;
        employeeID?: string;
        employerID?: objectID;
        type: UserType;
        entType?: EnterpriseType;
        personType?: PersonType;
        status: UserStatus;
    };
    comments?: string;
    auditer?: objectID;
    auditTimestamp?: Date;
    payload?: string;
    createdAt: Date;
    updatedAt: Date;
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
    PersonalDeposit,
    Remit,
    Draw,
    DisableOrExport,
    Freeze,
    Unfreeze,
    RemoveSubUser,
    AddSubUser,
    SignUp
}

export enum AuditOperationType {
    Granted,
    Rejected
}
