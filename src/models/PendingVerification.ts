import mongoose from 'mongoose';

interface PendingVerificationAttrs {
    userId: string;
    timestamp: Date;
}

interface PendingVerificationDoc extends mongoose.Document {
    userId: string;
    timestamp: Date;
}

interface PendingVerificationModel extends mongoose.Model<PendingVerificationDoc> {
    build(attrs: PendingVerificationAttrs): PendingVerificationDoc
}

const PendingVerificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    timestamp: {
        type: mongoose.Schema.Types.Date,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

PendingVerificationSchema.statics.build = (attrs: PendingVerificationAttrs) => {
    return new PendingVerification(attrs);
}

const PendingVerification = mongoose.model<PendingVerificationDoc, PendingVerificationModel>('pending_verification', PendingVerificationSchema);

export { PendingVerification }
