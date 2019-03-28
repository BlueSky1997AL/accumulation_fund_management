import { Application } from 'egg';
import { Document } from 'mongoose';

import { User } from '../util/interface/user';
interface UserDocument extends Document, User {}

export default (app: Application) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const UserSchema = new Schema({
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        type: { type: Number, required: true },
        status: { type: Number, required: true }
    });

    return mongoose.model<UserDocument>('User', UserSchema);
};
