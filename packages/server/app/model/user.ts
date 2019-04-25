import { Application } from 'egg';
import { Document } from 'mongoose';

import { User, UserType } from '../util/interface/user';
interface UserDocument extends Document, User {}

import idNoChecker from '../util/idNoChecker';

export default (app: Application) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const UserSchema = new Schema(
        {
            username: {
                type: String,
                required: true,
                unique: true,
                validate(val: string) {
                    const that = this as User;
                    if (that.type === UserType.Common) {
                        return idNoChecker(val);
                    } else {
                        return true;
                    }
                }
            },
            password: { type: String, required: true, minlength: 6, maxlength: 16 },
            name: {
                type: String,
                required: true,
                validate(val: string) {
                    const that = this as User;
                    if (that.type === UserType.Common) {
                        return /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(val);
                    }
                    return true;
                }
            },
            cardNo: {
                type: String,
                validate(val: string) {
                    const that = this as User;
                    if (that.type === UserType.Common || that.type === UserType.Enterprise) {
                        return /^([1-9]{1})(\d{14}|\d{18})$/.test(val);
                    }
                    return true;
                },
                default: ''
            },
            employeeID: String,
            employerID: Schema.Types.ObjectId,
            type: { type: Number, required: true },
            entType: Number,
            personType: Number,
            status: { type: Number, required: true },
            balance: { type: Number, default: 0 },
            subUser: {
                type: [ Schema.Types.ObjectId ],
                validate(doc: string[]) {
                    const that = this as User;
                    if (doc.length === 0 || that.type === UserType.Enterprise) {
                        return true;
                    }
                    return false;
                }
            },
            workOrders: [ Schema.Types.ObjectId ],
            amountChanges: [ Schema.Types.ObjectId ]
        },
        {
            timestamps: true
        }
    );

    return mongoose.model<UserDocument>('User', UserSchema);
};
