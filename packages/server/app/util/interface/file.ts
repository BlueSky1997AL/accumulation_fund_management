export interface File {
    filename: string;
    encoding: string;
    mime: string;
    content: Buffer;
}

export interface FileInDB extends File {
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface FileInfo {
    id: string;
    filename: string;
    encoding: string;
    mime: string;
}
