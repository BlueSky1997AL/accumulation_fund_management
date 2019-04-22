import { Application } from 'egg';
import { Document } from 'mongoose';

import { AmountChange } from '../util/interface/amountChange';
interface AmountChangeDocument extends Document, AmountChange {}

export default (app: Application) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const AmountChangeSchema = new Schema(
        {
            owner: { type: Schema.Types.ObjectId, required: true },
            amount: { type: Number, required: true },
            type: { type: Number, required: true },
            source: { type: Number, required: true },
            payload: String
        },
        {
            timestamps: true
        }
    );

    return mongoose.model<AmountChangeDocument>('AmountChange', AmountChangeSchema);
};
