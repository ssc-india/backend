import mongoose from 'mongoose';

interface UserAttrs {
    email: string;
    password: string;
}

interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const UserSchema = new mongoose.Schema<UserDoc>({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

UserSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);

export { User };
