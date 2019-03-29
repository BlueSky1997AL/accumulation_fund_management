export interface User {
    username: string;
    password: string;
    type: UserType;
    status: UserStatus;
    subUser?: User;
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
