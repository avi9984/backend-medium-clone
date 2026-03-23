import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, default: "" },
    claps: { type: Number, default: 0 },
    content: { type: String, required: true },
    author: { type: ObjectId, ref: "User", required: true },
    shares: { type: Number, default: 0 },
    postViews: { type: Number, default: 0 },
    category: { type: ObjectId, ref: 'Category', required: true },
    scheduledPublished: { type: Date, default: null },
    likes: [{ type: ObjectId, ref: 'User' }],
    dislikes: [{ type: ObjectId, ref: 'User' }],
    comments: [{ type: ObjectId, ref: 'Comment' }]
}, {
    timestamps: true, versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Post = mongoose.model("Post", postSchema);
export default Post;
