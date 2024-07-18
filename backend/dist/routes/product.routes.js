import express from 'express';
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { createProduct } from '../controllers/product.controller.js';
const router = express.Router();
router.post('/create', authenticateUser, createProduct);
export default router;
