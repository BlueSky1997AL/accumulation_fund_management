import { Application } from 'egg';

export default (app: Application) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const UserSchema = new Schema({
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        type: { type: Number, required: true }
    });

    return mongoose.model('User', UserSchema);
};
