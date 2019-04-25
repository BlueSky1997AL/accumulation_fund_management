type objectID = string;

export interface File {
    filename: string;
    encoding: string;
    mime: string;
    content: Buffer;
}

export interface FileInDB extends File {
    _id: objectID;
    createdAt: Date;
    updatedAt: Date;
}

export interface FileInfo {
    id: string;
    filename: string;
    encoding: string;
    mime: string;
}
