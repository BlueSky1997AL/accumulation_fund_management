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
    AdminUserCreate
}
