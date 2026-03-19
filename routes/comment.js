import express from "express";
import { createComment, getComments, deleteComment, updateComment } from "../controllers/comment.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.post("/create/:id", isLoggedIn, createComment);
router.get("/all/:id", getComments);
router.delete('/:id', isLoggedIn, deleteComment);
router.put('/:id', isLoggedIn, updateComment);

export default router;