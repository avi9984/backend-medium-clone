import express from 'express';

const router = express.Router();

import { register, loginUser, getUserProfile, blockUser, unblockUser, viewOtherUserProfile, followUser } from '../controllers/user.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

router.post('/register', register);
router.post('/login', loginUser);
router.get('/profile', isLoggedIn, getUserProfile);
router.put('/block/:id', isLoggedIn, blockUser);
router.put('/unblock/:id', isLoggedIn, unblockUser);
router.get('/other-profile/:id', isLoggedIn, viewOtherUserProfile);
router.put('/follow/:id', isLoggedIn, followUser);


export default router;