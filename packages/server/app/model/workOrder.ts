import { Application } from 'egg';
import { Document } from 'mongoose';

import { WorkOrder } from '../util/interface/workOrder';
interface WorkOrderDocument extends Document, WorkOrder {}

export default (app: Application) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const WorkOrderSchema = new Schema(
        {
            status: { type: Number, required: true },
            type: { type: Number, required: true },
            owner: { type: Schema.Types.ObjectId, required: true },
            comments: String,
            auditer: Schema.Types.ObjectId,
            auditTimestamp: Date,
            payload: String
        },
        {
            timestamps: true
        }
    );

    return mongoose.model<WorkOrderDocument>('WorkOrder', WorkOrderSchema);
};
