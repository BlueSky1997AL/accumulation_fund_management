import { PersonType, UserStatus } from './user';

type objectID = string;

export interface AmountChange {
    owner: objectID;
    amount: number;
    type: AmountChangeType;
    source: AmountChangeSource;
    payload: string;
}

export interface AmountChangeInDB extends AmountChange {
    _id: objectID;
    createdAt: Date;
    updatedAt: Date;
}

export interface AmountChangeInDBWithOwnerInfo extends AmountChangeInDB {
    ownerInfo: {
        username: string;
        name: string;
        cardNo?: string;
        employeeID?: string;
        employerID?: objectID;
        personType?: PersonType;
        status: UserStatus;
    };
}

export enum AmountChangeType {
    Negative,
    Positive
}

export enum AmountChangeSource {
    AccountCreation,
    EnterpriseRemit,
    EnterpriseBack,
    PersonalBack,
    PersonalDeposit,
    PersonalPartialDraw,
    PersonalCancellationDraw,
    AdminUserCreate,
    Interest
}
