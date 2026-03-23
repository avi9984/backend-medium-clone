import express from "express";

const router = express.Router();

import {
    createPost, getAllPost, getPostById, updatePost, deletePost, likePost,
    dislikePost, clapPost,
} from "../controllers/post.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isVerifiedAccount from "../middlewares/isVerifiedAccount.js";

router.post("/create", isLoggedIn, isVerifiedAccount, createPost);
router.get('/all', getAllPost);
router.get('/:id', getPostById);
router.put('/:id', isLoggedIn, updatePost);
router.delete('/:id', isLoggedIn, deletePost);
router.put('/like/:id', isLoggedIn, likePost);
router.put('/dislikes/:id', isLoggedIn, dislikePost);
router.put('/claps/:id', isLoggedIn, clapPost);



export default router;