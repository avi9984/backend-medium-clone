import Post from '../models/post.js';
import User from '../models/user.js';
import Category from '../models/category.js';



//? Create Post
const createPost = async (req, res) => {
    try {
        const { title, content, categoryId } = req.body;
        if (!(title && content && categoryId)) {
            return res.status(400).json({ staus: false, message: "Required title, content &category" })
        }

        //Check title is present
        const checkTitle = await Post.findOne({ title })
        if (checkTitle) {
            return res.status(400).json({ status: false, message: "Post already exists plz change it" });
        }
        //Create post object
        const postObje = {
            title,
            content,
            category: categoryId,
            author: req?.userAuth?._id
        }
        const post = await Post.create(postObje);

        //Update User by adding the post
        const user = await User.findByIdAndUpdate(req?.userAuth?._id, {
            $push: { posts: post._id }
        }, { new: true })

        //Update category by adding in it
        const cate = await Category.findByIdAndUpdate(categoryId, {
            $push: { post: post._id }
        }, { new: true })

        //send responce
        return res.status(201).json({
            status: true,
            message: "Post created successfully",
            post,
            user,
            cate
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

//? Get all post
const getAllPost = async (req, res) => {
    try {
        const allPost = await Post.find({});
        return res.status(200).json({
            status: true,
            message: "All post successfully",
            data: allPost
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ status: false, message: "Post not found" })
        }
        return res.status(200).json({
            status: true,
            message: "Get post by id",
            post
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Intenal Server Error" })
    }
}

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id
        await Post.findByIdAndDelete(postId);
        return res.status(200).json({
            status: true,
            message: "Post deleted successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content, categoryId } = req.body;
        const updatePost = await Post.findByIdAndUpdate(
            postId,
            { $set: { title, content, categoryId } },
            { returnDocument: 'after', runValidators: true }
        );
        return res.status(200).json({
            status: true,
            message: "Post updated successfully",
            data: updatePost
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export { createPost, getAllPost, getPostById, deletePost, updatePost }