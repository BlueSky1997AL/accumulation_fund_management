type objectID = string;

export interface AmountChange {
    owner: objectID;
    amount: number;
    type: ChangeType;
    source: ChangeSource;
}

export interface AmountChangeInDB extends AmountChange {
    _id: objectID;
    createdAt: Date;
    updatedAt: Date;
}

export enum ChangeType {
    Negative,
    Positive
}

export enum ChangeSource {}
