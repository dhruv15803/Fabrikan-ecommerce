import express from 'express'
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { createProduct, deleteProduct, editProduct, getAllProducts, getProductById } from '../controllers/product.controller.js';

const router = express.Router()

router.post('/create',authenticateUser,createProduct);
router.get('/products',getAllProducts);
router.get('/:productId',getProductById);
router.delete('/:productId',authenticateUser,deleteProduct);
router.put('/edit',authenticateUser,editProduct);

export default router;