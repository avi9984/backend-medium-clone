import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: ObjectId, ref: 'User', required: true },
    shares: { type: Number, defalut: 0 },
    post: [{ type: ObjectId, ref: 'Post' }]
}, {
    timestamps: true, versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


const Category = mongoose.model('Category', categorySchema);
export default Category;