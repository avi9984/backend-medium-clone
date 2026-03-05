import express from "express";

const router = express.Router();
import { createCategory, getAllCategories, deletCategory, updateCategory } from "../controllers/category.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

router.post('/category', isLoggedIn, createCategory);
router.get('/all', getAllCategories);
router.delete('/:id', isLoggedIn, deletCategory);
router.put('/:id', isLoggedIn, updateCategory);



export default router;