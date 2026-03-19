import Comment from "../models/comment.js";
import Post from "../models/post.js";


export const createComment = async (req, res) => {
    try {
        const { messages } = req.body;

        const postId = req.params.id;

        const author = req?.userAuth?._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = await Comment.create({ messages, author, postId });

        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            success: true,
            message: "Comment created successfully",
            comment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ postId }).populate('author', 'username profilePicture');
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findByIdAndDelete(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const { messages } = req.body;
        const comment = await Comment.findByIdAndUpdate(commentId, { messages }, { returnDocument: 'after', runValidators: true });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        return res.status(200).json({ message: "Comment updated successfully", comment });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}