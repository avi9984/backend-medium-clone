import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = new mongoose.Schema({
    messages: { type: String, required: true },
    author: { type: ObjectId, ref: 'User', required: true },
    postId: { type: ObjectId, ref: 'Post', required: true }
}, { timestamps: true, versionKey: false });


const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;