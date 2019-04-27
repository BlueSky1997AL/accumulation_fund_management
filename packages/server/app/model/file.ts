import { Application } from 'egg';
import { Document } from 'mongoose';

import { File } from '../util/interface/file';
interface FileDocument extends Document, File {}

export default (app: Application) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const FileSchema = new Schema(
        {
            filename: { required: true, type: String },
            encoding: { required: true, type: String },
            mime: { required: true, type: String },
            content: Buffer
        },
        {
            timestamps: true
        }
    );

    return mongoose.model<FileDocument>('File', FileSchema);
};
