import { Application } from 'egg';
import { Document } from 'mongoose';

import { User, UserType } from '../util/interface/user';
interface UserDocument extends Document, User {}

export default (app: Application) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const UserSchema = new Schema({
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        type: { type: Number, required: true },
        status: { type: Number, required: true },
        balance: { type: Number, required: true },
        subUser: {
            type: [ Schema.Types.ObjectId ],
            validate(doc: string[]) {
                const that = this as User;
                if (doc.length === 0 || that.type === UserType.Enterprise) {
                    return true;
                }
                return false;
            }
        }
    });

    return mongoose.model<UserDocument>('User', UserSchema);
};
