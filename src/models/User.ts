import mongoose from 'mongoose';
import { Password } from '../services/Password';

export enum UserType {
    REGULAR='REGULAR',
    MODERATOR='MODERATOR'
}

interface UserAttrs {
    name: string;
    institute: string;
    branch: string;
    email: string;
    password: string;
    type: UserType;
}

export interface UserDoc extends mongoose.Document {
    name: string;
    institute: string;
    branch: string;
    email: string;
    password: string;
    type: UserType;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const UserSchema = new mongoose.Schema<UserDoc>({
    name: {
        type: String,
        required: true
    },
    institute: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
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

UserSchema.pre('save', async function(done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }

    done();
});

UserSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);

UserSchema.index({ email: "hashed" });

export { User };
