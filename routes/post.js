import express from "express";

const router = express.Router();

import { createPost, getAllPost, getPostById, updatePost, deletePost } from "../controllers/post.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

router.post("/create", isLoggedIn, createPost);
router.get('/all', getAllPost);
router.get('/:id', getPostById);
router.put('/:id', isLoggedIn, updatePost);
router.delete('/:id', isLoggedIn, deletePost);



export default router;