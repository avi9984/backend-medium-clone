import Post from '../models/post.js';
import User from '../models/user.js';
import Category from '../models/category.js';
import multer from "multer";
import storage from '../utils/fileUploadingService.js';


//? Create Post
export const createPost = async (req, res) => {
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
            image: req.file.path,
            category: categoryId,
            author: req?.userAuth?._id
        }
        const post = await Post.create(postObje);

        //Update User by adding the post
        await User.findByIdAndUpdate(req?.userAuth?._id, {
            $push: { posts: post._id }
        }, { returnDocument: 'after' })

        //Update category by adding in it
        await Category.findByIdAndUpdate(categoryId, {
            $push: { post: post._id }
        }, { returnDocument: 'after' })

        //send responce
        return res.status(201).json({
            status: true,
            message: "Post created successfully",
            post
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

//? Get all post
export const getAllPost = async (req, res) => {
    try {
        const currentUserId = req.userAuth._id;
        // console.log(currentUserId, "current");

        // Get all users who have blocked the current user and extract their IDs
        const usersBlokingCurrentUser = await User.find({ blockedUsers: currentUserId });
        const blokingUsersId = usersBlokingCurrentUser.map((userObj) => userObj._id);

        // Fetch posts where author is not in blocked users list
        const allPosts = await Post.find({
            author: { $nin: blokingUsersId },
            $or: [
                { scheduledPublished: { $lte: Date.now() } },
                { scheduledPublished: null }
            ],
        }).populate("author", "email username role")

        return res.status(200).json({
            status: true,
            message: "All post successfully",
            data: allPosts
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

//? Get post by Id
export const getPostById = async (req, res) => {
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

//? Delete post
export const deletePost = async (req, res) => {
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

//? Update post by id
export const updatePost = async (req, res) => {
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

//? User Likes a post

export const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const currentUserId = req.userAuth._id;

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        // Add the current userId to likes array
        await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { likes: currentUserId } },
            { returnDocument: 'after' }
        )
        // Remove the current UserId from dislikes array
        post.dislikes = post.dislikes.filter(
            (userId) => userId.toString() !== currentUserId.toString()
        );

        await post.save();
        return res.status(200).json({
            status: true,
            message: "User likes your post",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message })
    }
}

//? User dislikes a post

export const dislikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const currentUserId = req.userAuth._id;

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        // Add the current userId to likes array
        await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { dislikes: currentUserId } },
            { returnDocument: 'after' }
        )
        // Remove the current UserId from likes array
        post.likes = post.likes.filter(
            (userId) => userId.toString() !== currentUserId.toString()
        );

        await post.save();
        return res.status(200).json({
            status: true,
            message: "User dislikes your post",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message })
    }
}

//? User Clap into post

export const clapPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        //increment claps
        const updatePost = await Post.findByIdAndUpdate(postId,
            {
                $inc: { claps: 1 }
            },
            { returnDocument: 'after' }
        )
        return res.status(200).json({
            status: true,
            message: `User claps on your ${post.title}`,
            updatePost
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" + error.message })
    }
}


//? User shudule the post

export const shedulePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { scheduledPublished } = req.body;

        if (!(postId && scheduledPublished)) {
            return res.status(400).json({ status: false, message: "Post id and schedulePublieshed required" })
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ status: false, message: "Post not found" })
        }
        const currentUserId = req.userAuth._id
        //Check only own post is shedules
        if (post.author.toString() !== currentUserId.toString()) {
            return res.status(400).json({ status: false, message: "You are not sheduled other post" })
        }

        const sheduledDate = new Date(scheduledPublished);
        const currentDate = new Date();
        if (sheduledDate < currentDate) {
            return res.status(400).json({ status: false, message: "Shedule date can not be pass as pervious date" })
        }

        post.scheduledPublished = sheduledDate;

        await post.save();
        return res.status(200).json({
            status: true,
            message: "Your post shedule"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message })
    }
}