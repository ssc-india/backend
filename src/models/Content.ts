import mongoose from 'mongoose';
import { UserDoc } from './User';

interface ContentAttrs {
    author: UserDoc;
    timestamp: Date;
    content: string;
}

interface ContentDoc extends mongoose.Document {
    author: UserDoc;
    timestamp: Date;
    content: string;
}

interface ContentModel extends mongoose.Model<ContentDoc> {
    build(attrs: ContentAttrs): ContentDoc;
}

const ContentSchema = new mongoose.Schema<ContentDoc>({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timestamp: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    content: {
        type: String,
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

ContentSchema.statics.build = (attrs: ContentAttrs) => {
    return new Content(attrs);
}

const Content = mongoose.model<ContentDoc, ContentModel>('Content', ContentSchema);

export { Content }
