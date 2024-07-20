import express from 'express'
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { addToCart } from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/add',authenticateUser,addToCart);

export default router;
