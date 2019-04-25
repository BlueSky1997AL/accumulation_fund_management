type objectID = string;

export interface User {
    username: string;
    password: string;
    name: string;
    cardNo?: string;
    employeeID?: string;
    employerID?: objectID;
    type: UserType;
    entType?: EnterpriseType;
    personType?: PersonType;
    status: UserStatus;
    balance: number;
    subUser?: objectID[];
    workOrders?: objectID[];
    amountChanges?: objectID[];
}

export interface UserInDB extends User {
    _id: objectID;
    createdAt: Date;
    updatedAt: Date;
}

export enum UserType {
    Admin,
    Common,
    Enterprise,
    Guest
}

export enum UserStatus {
    Normal,
    Frozen,
    Lost,
    Disabled
}

export enum EnterpriseType {
    SOES, // 国有企业
    CO, // 集体所有制
    PE, // 私营企业
    CE, // 股份制企业
    LP, // 有限合伙企业
    JV, // 联营企业
    FIE, // 外商投资企业
    SP, // 个人独资企业,
    HMT, // 港、澳、台
    JSE // 股份合作企业
}

export enum PersonType {
    IndividualBusiness, // 个体工商户
    Employees // 企业雇员
}
