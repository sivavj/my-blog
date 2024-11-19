import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
    content: string;
    author: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    parentId?: mongoose.Types.ObjectId;
    replies?: mongoose.Types.ObjectId[];
}

const commentSchema = new Schema<IComment>({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: false,
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],
}, {
    timestamps: true,
});

export const Comment = mongoose.model<IComment>("Comment", commentSchema);