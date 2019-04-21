type objectID = string;

export interface AmountChange {
    owner: objectID;
    operatorID: objectID;
    amount: number;
    type: AmountChangeType;
    source: AmountChangeSource;
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
    AccountCreation
}
