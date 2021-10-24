import mongoose from 'mongoose';

export interface BranchInfo {
    name: string;
}

interface InstituteAttrs {
    name: string;
    branches: BranchInfo[];
}

interface InstituteDoc extends mongoose.Document {
    name: string;
    branches: BranchInfo[];
}

interface InstituteModel extends mongoose.Model<InstituteDoc> {
    build(attrs: InstituteAttrs): InstituteDoc;
}

const InstituteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    branches: {
        type: [Object],
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id
        }
    }
});

InstituteSchema.statics.build = (attrs: InstituteAttrs) => {
    return new Institute(attrs);
}

const Institute = mongoose.model<InstituteDoc, InstituteModel>('Institute', InstituteSchema);

export { Institute }
