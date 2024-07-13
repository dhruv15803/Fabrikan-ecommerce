import express from 'express';
import { getLoggedInUser, loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middlewares/authenticateUser.js';
const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', authenticateUser, getLoggedInUser);
router.get('/logout', authenticateUser, logoutUser);
export default router;
