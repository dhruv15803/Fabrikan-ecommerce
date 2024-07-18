import express from 'express'
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { createProduct, getAllProducts } from '../controllers/product.controller.js';

const router = express.Router()

router.post('/create',authenticateUser,createProduct);
router.get('/products',getAllProducts);

export default router;