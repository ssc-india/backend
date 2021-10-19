import mongoose from 'mongoose';

export enum UserType {
    REGULAR='REGULAR',
    MODERATOR='MODERATOR'
}

interface UserAttrs {
    email: string;
    password: string;
    type: UserType;
}

export interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    type: UserType;
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
    },
    type: {
        type: String,
        enum: Object.values(UserType),
        default: UserType.REGULAR,
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
