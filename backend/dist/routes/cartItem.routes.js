import express from 'express';
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { addCartItem, decrementItemQty, incrementItemQty, removeCartItem } from '../controllers/cartItem.controller.js';
const router = express.Router();
router.post('/add', authenticateUser, addCartItem);
router.delete('/remove/:itemId', authenticateUser, removeCartItem);
router.patch('/increment/:itemId', authenticateUser, incrementItemQty);
router.patch('/decrement/:itemId', authenticateUser, decrementItemQty);
export default router;
