type objectID = string;

export interface User {
    username: string;
    password: string;
    type: UserType;
    status: UserStatus;
    balance: number;
    subUser?: objectID[];
}

export enum UserType {
    Admin,
    Common,
    Enterprise
}

export enum UserStatus {
    Normal,
    Frozen,
    Lost,
    Disabled
}
