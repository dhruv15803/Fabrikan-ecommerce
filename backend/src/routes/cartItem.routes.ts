import express from 'express'
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { addCartItem, decrementItemQty, getCartItems, incrementItemQty, removeCartItem } from '../controllers/cartItem.controller.js';

const router = express.Router();

router.post('/add',authenticateUser,addCartItem);
router.delete('/remove/:itemId',authenticateUser,removeCartItem);
router.patch('/increment',authenticateUser,incrementItemQty);
router.patch('/decrement',authenticateUser,decrementItemQty);
router.get('/cartItems',authenticateUser,getCartItems);


export default router;