import express from 'express';

const router = express.Router();

import { register, loginUser, getUserProfile } from '../controllers/user.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

router.post('/register', register);
router.post('/login', loginUser);
router.get('/profile', isLoggedIn, getUserProfile);


export default router;