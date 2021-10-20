import mongoose from 'mongoose';
import { UserDoc } from './User';

export enum ContentTag {
    INFO='INFO',
    BLOG='Blog'
}

interface ContentAttrs {
    author: UserDoc;
    institute: string;
    branch: string;
    tag: ContentTag;
    timestamp: Date;
    title: string;
    content: string;
}

export interface ContentDoc extends mongoose.Document {
    author: UserDoc;
    institute: string;
    branch: string;
    tag: ContentTag;
    timestamp: Date;
    title: string;
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
    institute: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        enum: Object.values(ContentTag),
        required: true
    },
    timestamp: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    title: {
        type: String,
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

ContentSchema.index({ institute: 1, branch: 1 });

export { Content }
